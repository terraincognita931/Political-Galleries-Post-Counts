/**
 * js/app.js
 *
 * 데이터 로드 → 차트 초기화 → UI 이벤트 연결을 총괄합니다.
 */

document.addEventListener('DOMContentLoaded', async () => {
  const statusEl  = document.getElementById('status-msg');
  const legendEl  = document.getElementById('legend-container');
  const togglesEl = document.getElementById('group-toggles');
  const canvas    = document.getElementById('main-chart');

  // ── 1. CSV 로드 ──────────────────────────────────────────
  statusEl.textContent = 'CSV 파일 로딩 중…';
  let galleries;
  try {
    galleries = await DataLoader.loadAll();
  } catch (e) {
    statusEl.textContent = `오류: ${e.message}`;
    console.error(e);
    return;
  }

  const keys = Object.keys(galleries);
  if (!keys.length) {
    statusEl.textContent = 'data/ 폴더에서 유효한 CSV를 찾지 못했습니다.';
    return;
  }

  // ── 2. 색상 배정 ─────────────────────────────────────────
  Palette.assignColors(keys);

  // ── 3. 전체 X축 월 목록 산출 ─────────────────────────────
  const monthSet = new Set();
  keys.forEach(k => Object.keys(galleries[k].data).forEach(m => monthSet.add(m)));
  const allMonths = [...monthSet].sort();

  // ── 4. 차트 초기화 ───────────────────────────────────────
  statusEl.textContent = '차트 렌더링 중…';
  ChartManager.init(canvas, allMonths, galleries);

  // ── 5. 성향 토글 버튼 생성 ───────────────────────────────
  // 실제 데이터가 있는 그룹만 버튼 생성
  const activeGroups = GROUP_ORDER.filter(g =>
    keys.some(k => galleries[k].group === g)
  );

  /** group → 현재 표시 여부 */
  const groupVisible = Object.fromEntries(activeGroups.map(g => [g, true]));

  activeGroups.forEach(group => {
    const btn = document.createElement('button');
    btn.className    = 'group-btn active';
    btn.textContent  = group;
    btn.dataset.group = group;

    btn.addEventListener('click', () => {
      groupVisible[group] = !groupVisible[group];
      const on = groupVisible[group];
      btn.classList.toggle('active', on);

      // 차트 그룹 가시성 변경
      ChartManager.setGroupVisibility(group, on);

      // 범례 아이템 동기화
      legendEl.querySelectorAll('.legend-item').forEach(item => {
        if (galleries[item.dataset.key]?.group === group) {
          item.classList.toggle('hidden', !on);
        }
      });
    });

    togglesEl.appendChild(btn);
  });

  // ── 6. 범례 생성 ─────────────────────────────────────────
  keys.forEach(key => {
    const { label } = galleries[key];
    const color     = Palette.getColor(key);

    const item    = document.createElement('div');
    item.className    = 'legend-item';
    item.dataset.key  = key;

    const swatch = document.createElement('span');
    swatch.className        = 'legend-swatch';
    swatch.style.background = color;

    const text = document.createElement('span');
    text.textContent = label;

    item.append(swatch, text);

    // 클릭 → 개별 선 토글
    item.addEventListener('click', () => {
      const visible = ChartManager.toggleDataset(key);
      item.classList.toggle('hidden', !visible);
    });

    legendEl.appendChild(item);
  });

  // ── 7. 완료 ──────────────────────────────────────────────
  const span = allMonths[allMonths.length - 1];
  statusEl.textContent =
    `${keys.length}개 갤러리 · ${allMonths[0]} – ${span}`;
});
