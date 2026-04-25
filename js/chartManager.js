/**
 * js/chartManager.js
 *
 * Chart.js 인스턴스 생성·업데이트를 담당합니다.
 * 표시 중인 갤러리가 바뀔 때마다 X축 범위를 자동으로 재계산합니다.
 */

const ChartManager = (() => {
  let chart      = null;
  let _galleries = null;       // 전체 갤러리 원본 데이터
  let _visible   = new Set();  // 현재 표시 중인 key 집합

  const GRID_COLOR  = 'rgba(0,0,0,0.06)';
  const LABEL_COLOR = '#666';

  /** 현재 _visible 집합 기준으로 X축 월 목록을 재계산 */
  function computeVisibleMonths() {
    const s = new Set();
    _visible.forEach(key => {
      const g = _galleries[key];
      if (g) Object.keys(g.data).forEach(m => s.add(m));
    });
    return [...s].sort();
  }

  /** 'YYYY-MM' 배열 → 'YY.MM' 레이블 배열 */
  function toLabels(months) {
    return months.map(m => {
      const [y, mo] = m.split('-');
      return y.slice(2) + '.' + mo;
    });
  }

  /** 현재 _visible 기준으로 dataset 배열 생성 */
  function buildDatasets(months) {
    return [..._visible].map(key => {
      const g     = _galleries[key];
      const color = Palette.getColor(key);
      return {
        label:            g.label,
        data:             months.map(m => g.data[m] ?? null),
        borderColor:      color,
        backgroundColor:  color + '18',
        borderWidth:      1.8,
        pointRadius:      1.5,
        pointHoverRadius: 5,
        tension:          0.3,
        spanGaps:         false,
        _key:   key,
        _group: g.group,
      };
    });
  }

  /** 가시 상태 변경 후 차트를 X축 포함 전체 갱신 */
  function _refresh() {
    const months = computeVisibleMonths();
    chart.data.labels   = toLabels(months);
    chart.data.datasets = buildDatasets(months);
    chart.update('none');
  }

  /**
   * 최초 차트 초기화.
   * @param {HTMLCanvasElement} canvas
   * @param {Object} galleries  { key: { label, group, data } }
   */
  function init(canvas, galleries) {
    if (chart) chart.destroy();

    _galleries = galleries;
    _visible   = new Set(Object.keys(galleries));

    const months = computeVisibleMonths();

    chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels:   toLabels(months),
        datasets: buildDatasets(months),
      },
      options: {
        responsive:          true,
        maintainAspectRatio: false,
        animation:           false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            filter: item => item.parsed.y !== null,
            callbacks: {
              label: ctx =>
                `${ctx.dataset.label}: ${Math.round(ctx.parsed.y).toLocaleString()}`,
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color:         LABEL_COLOR,
              font:          { size: 10 },
              autoSkip:      true,
              maxTicksLimit: 20,
              maxRotation:   45,
            },
            grid: { color: GRID_COLOR },
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: LABEL_COLOR,
              font:  { size: 11 },
              callback: v =>
                v >= 10000
                  ? (v / 10000).toFixed(0) + '만'
                  : v.toLocaleString(),
            },
            grid: { color: GRID_COLOR },
          },
        },
      },
    });
  }

  /**
   * 그룹 단위 가시성 변경.
   * @param {string}  group
   * @param {boolean} visible
   */
  function setGroupVisibility(group, visible) {
    if (!chart) return;
    Object.entries(_galleries).forEach(([key, g]) => {
      if (g.group !== group) return;
      if (visible) _visible.add(key);
      else         _visible.delete(key);
    });
    _refresh();
  }

  /**
   * 개별 갤러리 토글.
   * @returns {boolean} 토글 후 visible 여부
   */
  function toggleDataset(key) {
    if (!chart) return true;
    const nowVisible = !_visible.has(key);
    if (nowVisible) _visible.add(key);
    else            _visible.delete(key);
    _refresh();
    return nowVisible;
  }

  function isVisible(key) {
    return _visible.has(key);
  }

  return { init, setGroupVisibility, toggleDataset, isVisible };
})();
