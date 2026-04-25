/**
 * js/palette.js
 *
 * 갤러리 key 순서대로 32색 팔레트에서 색상을 배정합니다.
 * 계열(그룹)과 무관하게 인접 색이 최대한 구별되도록 구성했습니다.
 */

const Palette = (() => {
  const COLORS = [
    '#E6194B', // 빨강
    '#3CB44B', // 초록
    '#4363D8', // 파랑
    '#F58231', // 주황
    '#911EB4', // 보라
    '#42D4F4', // 하늘
    '#F032E6', // 마젠타
    '#BFEF45', // 연두
    '#469990', // 청록
    '#9A6324', // 갈색
    '#800000', // 진빨강
    '#AAFFC3', // 민트
    '#808000', // 올리브
    '#000075', // 네이비
    '#FF6B6B', // 산호
    '#6BCB77', // 풀색
    '#4D96FF', // 코발트
    '#FFD93D', // 노랑
    '#C77DFF', // 라벤더
    '#06BCC1', // 에메랄드
    '#FF9A3C', // 황금주황
    '#A8071A', // 크림슨
    '#2DC653', // 밝은초록
    '#7B2FBE', // 진보라
    '#FF4D6D', // 핫핑크
    '#0096C7', // 오션블루
    '#8B8000', // 다크올리브
    '#6D6875', // 모브
    '#E9C46A', // 샌드
    '#264653', // 딥그린
    '#E76F51', // 테라코타
    '#A8DADC', // 아이스블루
  ];

  const assigned = new Map();
  let index = 0;

  /** key 배열을 받아 아직 색상이 없는 항목에 순서대로 배정 */
  function assignColors(keys) {
    keys.forEach(key => {
      if (!assigned.has(key)) {
        assigned.set(key, COLORS[index % COLORS.length]);
        index++;
      }
    });
  }

  function getColor(key) {
    return assigned.get(key) ?? '#888888';
  }

  return { assignColors, getColor };
})();
