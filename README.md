# 디시인사이드 정치 갤러리 추이 뷰어

## 파일 구조

```
dci_gallery/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── config.js        ← 갤러리 이름·성향 정의 (편집 대상)
│   ├── palette.js       ← 색상 팔레트
│   ├── dataLoader.js    ← CSV fetch·파싱
│   ├── chartManager.js  ← Chart.js 래퍼
│   └── app.js           ← 메인 컨트롤러
└── data/
    ├── alliescon_monthly.csv
    ├── ...              ← CSV 파일들
    └── (기타 갤러리 CSV)
```

## 배포 방법 (GitHub Pages 등 정적 호스팅)

1. 이 폴더 전체를 저장소에 push합니다.
2. GitHub Pages / Netlify / Vercel 등에서 루트(`/`)를 서빙하도록 설정합니다.
3. `https://<your-domain>/` 접속.

## 새 갤러리 추가

1. `data/<key>_monthly.csv` 파일 추가.
   CSV 포맷 (헤더 포함):
   ```
   연월,게시글 수
   2024-01,1234
   2024-02,5678
   ```

2. `js/config.js`에 항목 추가:
   ```js
   키이름: { label: '표시 이름', group: '성향그룹' },
   ```

3. 커밋·푸시. 끝.

## UI 조작

| 조작 | 동작 |
|------|------|
| 성향 필터 버튼 클릭 | 해당 성향 갤러리 전체를 켜고 끔 |
| 범례 항목 클릭 | 개별 갤러리 선 숨기기·표시 |
| 그래프 위 호버 | 해당 월 전체 갤러리 수치 툴팁 표시 |
