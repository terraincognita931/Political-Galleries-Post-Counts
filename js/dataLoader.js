/**
 * js/dataLoader.js
 *
 * config.js의 GALLERY_CONFIG 키를 기반으로
 * data/<key>_monthly.csv 파일들을 fetch해 파싱합니다.
 * manifest.json 불필요 — 정적 호스팅에서 바로 동작합니다.
 */

const DataLoader = (() => {

  /** CSV 텍스트 → { 'YYYY-MM': count } */
  function parseCSV(text) {
    const result = {};
    const lines = text.trim().split('\n');
    // 첫 줄 헤더 스킵
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',');
      if (parts.length < 2) continue;
      const month = parts[0].trim().replace(/"/g, '');
      const count = parseInt(parts[1].trim().replace(/"/g, ''), 10);
      if (/^\d{4}-\d{2}$/.test(month) && !isNaN(count)) {
        result[month] = count;
      }
    }
    return result;
  }

  /**
   * GALLERY_CONFIG의 모든 키에 대해 CSV를 fetch합니다.
   * 파일이 없거나 임계값 미달인 갤러리는 결과에서 제외됩니다.
   *
   * @returns {Promise<Object>} { key: { label, group, data } }
   */
  async function loadAll() {
    const keys = Object.keys(GALLERY_CONFIG);
    const galleries = {};

    const results = await Promise.allSettled(
      keys.map(async key => {
        const url = `data/${key}_monthly.csv`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const text = await res.text();
        const raw  = parseCSV(text);
        const data = applyThreshold(raw);
        if (!data) throw new Error('POST_THRESHOLD 미달');
        return { key, data };
      })
    );

    results.forEach((result, i) => {
      const key = keys[i];
      if (result.status === 'fulfilled') {
        const meta = GALLERY_CONFIG[key];
        galleries[key] = { label: meta.label, group: meta.group, data: result.value.data };
      } else {
        console.warn(`[${key}] 로드 건너뜀:`, result.reason?.message ?? result.reason);
      }
    });

    return galleries;
  }

  return { loadAll };
})();
