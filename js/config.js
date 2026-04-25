/**
 * js/config.js
 *
 * 갤러리 메타데이터 정의.
 * 새 갤러리를 추가할 때는:
 *   1. data/ 폴더에 CSV 파일 추가 (파일명: <key>_monthly.csv)
 *   2. 아래 GALLERY_CONFIG에 항목 추가
 */

const GALLERY_CONFIG = {
  // key: CSV 파일명에서 _monthly.csv를 뺀 부분
  alliescon:            { label: '국민의힘',            group: '친윤' },
  fence_sitter:         { label: '회색분자',            group: '친윤' },
  gukbase:              { label: '국민의힘 바로 세우기', group: '친윤' },
  pppkms:               { label: '김문수',              group: '친윤' },
  yoonsy:               { label: '윤석열',              group: '친윤' },

  newconservativeparty: { label: '새로운보수당',         group: '비윤' },
  centristconservatis:  { label: '중도보수',             group: '비윤' },
  kids:                 { label: '이준석',               group: '비윤' },
  ahncheolsoo:          { label: '안철수의 힘',          group: '비윤' },
  reformparty:          { label: '개혁신당',             group: '비윤' },
  rightpolitics:        { label: '국민의힘 비대위',      group: '비윤' },
  rightwing:            { label: '국내보수',             group: '비윤' },
  sts:                  { label: '자유와혁신',           group: '비윤' },
  ppphan:               { label: '한동훈',               group: '비윤' },
  ohsehoon:             { label: '오세훈',               group: '비윤' },
  youth_go:             { label: '유승민',               group: '비윤' },

  minjudang:            { label: '더불어민주당',         group: '민주당' },
  leejaemyung:          { label: '이재명',               group: '민주당' },
  leejaemyungdo:        { label: '이재명은 합니다',      group: '민주당' },
  centristpolitics:     { label: '중도정치',             group: '민주당' },
  democraticpolitics:   { label: '더불어민주당 비대위',  group: '민주당' },
  itssaexodus:          { label: '잇싸',                 group: '민주당' },
  presidentalelection:  { label: '22대 대선',            group: '민주당' },

  jinbo:                { label: '진보정치',             group: '진보·좌파' },
  kpd:                  { label: '로자 룩셈부르크',      group: '진보·좌파' },

  thirdposition:        { label: '제3의 위치',           group: '해외정치' },
  uspolitics:           { label: '미국정치',             group: '해외정치' },
  whitehouse:           { label: '백악관',               group: '해외정치' },

  bosoo:                { label: '보수우파',             group: '기타' },
  jinbowabosu:          { label: '진보보수정치',         group: '기타' },
  joongdo1:             { label: '중도',                 group: '기타' },
  nazi:                 { label: '나치',                 group: '기타' },
};

/** 성향 그룹 표시 순서 */
const GROUP_ORDER = ['친윤', '비윤', '민주당', '진보·좌파', '해외정치', '기타'];

/** 이 값 미만인 구간(첫 초과 이전)은 차트에서 제거 */
const POST_THRESHOLD = 1000;
