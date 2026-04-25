/**
 * js/chartManager.js
 *
 * Chart.js 인스턴스 생성·업데이트를 담당합니다.
 */

const ChartManager = (() => {
  let chart = null;

  const GRID_COLOR  = 'rgba(0,0,0,0.06)';
  const LABEL_COLOR = '#666';

  function buildDatasets(allMonths, galleries) {
    return Object.entries(galleries).map(([key, g]) => {
      const color = Palette.getColor(key);
      return {
        label:            g.label,
        data:             allMonths.map(m => g.data[m] ?? null),
        borderColor:      color,
        backgroundColor:  color + '18',
        borderWidth:      1.8,
        pointRadius:      1.5,
        pointHoverRadius: 5,
        tension:          0.3,
        spanGaps:         false,
        // Chart.js가 무시하는 커스텀 식별자
        _key:   key,
        _group: g.group,
      };
    });
  }

  /**
   * 차트를 초기화합니다.
   * @param {HTMLCanvasElement} canvas
   * @param {string[]} allMonths  정렬된 'YYYY-MM' 배열
   * @param {Object}   galleries
   */
  function init(canvas, allMonths, galleries) {
    if (chart) chart.destroy();

    const labels   = allMonths.map(m => {
      const [y, mo] = m.split('-');
      return y.slice(2) + '.' + mo;
    });
    const datasets = buildDatasets(allMonths, galleries);

    chart = new Chart(canvas, {
      type: 'line',
      data: { labels, datasets },
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
   * 특정 그룹 전체를 표시하거나 숨깁니다.
   * @param {string}  group
   * @param {boolean} visible
   */
  function setGroupVisibility(group, visible) {
    if (!chart) return;
    chart.data.datasets.forEach((ds, i) => {
      if (ds._group === group) {
        chart.getDatasetMeta(i).hidden = !visible;
      }
    });
    chart.update();
  }

  /**
   * 개별 dataset을 토글합니다.
   * @returns {boolean} 토글 후 visible 여부
   */
  function toggleDataset(key) {
    if (!chart) return true;
    const idx = chart.data.datasets.findIndex(ds => ds._key === key);
    if (idx === -1) return true;
    const meta = chart.getDatasetMeta(idx);
    meta.hidden = !meta.hidden;
    chart.update();
    return !meta.hidden;
  }

  return { init, setGroupVisibility, toggleDataset };
})();
