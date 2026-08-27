# 실시간 지역 날씨 대시보드

## 1. 프로젝트 개요

Vue.js 수업에서 배운 내용을 복습하고 직접 적용해 보기 위해 만든 날씨 대시보드입니다.

처음에는 정해진 날씨 데이터를 화면에 보여주는 것부터 시작했습니다.
이후에 컴포넌트, Props와 Emits, Vue Router, Pinia, Axios를 배우면서 실제 날씨 API를 연결하고 상세 화면과 상태 관리 기능을 추가했습니다.

해당 날씨 대시보드를 통해 서울, 수원, 부산, 대전의 현재 날씨를 확인할 수 있고 도시 이름으로 검색할 수 있도록 구현했습니다.

## 2. 시스템 구조

사용자가 화면에서 도시를 검색하거나 상세보기 버튼을 누르면 Vue 컴포넌트가 이벤트를 처리합니다.

현재 날씨와 대기질 정보는 OpenWeather API에서 가져오고, 3일 예보는 Open-Meteo API에서 가져옵니다.

온도 단위와 날씨 상태 표시 여부는 Pinia Store에서 관리합니다.

```text
사용자
→ Vue 컴포넌트
→ Axios
→ 날씨 API
→ 데이터를 ref에 저장
→ 화면 자동 변경
```

## 3. 주요 기능

- 서울, 수원, 부산, 대전의 현재 날씨 조회
- 도시 이름 검색
- 도시별 상세 날씨 화면 이동 (상세보기)
- 현재 기온, 습도, 풍속 표시 (상세보기)
- 대기질 등급과 PM2.5, PM10 표시 (상세보기)
- 3일간 최고·최저기온과 강수 확률 표시 (상세보기)
- 섭씨와 화씨 단위 변경 (메뉴바)
- 날씨 상태 표시 또는 숨김 (상단바)
- API 요청 중 로딩 화면 표시
- API 요청 실패 시 오류 메시지와 다시 시도 버튼 표시
- Element Plus를 사용한 검색창, 카드, 버튼 UI

## 4. 프로젝트 구조

```text
src
├── assets
│   ├── base.css
│   └── main.css
├── components
│   └── practices
│       └── AxiosWeather.vue
│   └── weather
│       ├── BaseDashboardCard.vue
│       ├── SearchBar.vue
│       ├── StatusBar.vue
│       ├── UnitToggler.vue
│       └── WeatherCard.vue
├── exercise (참고)
│   ├── WeatherComposition.vue
│   ├── WeatherMockup.vue
│   ├── WeatherParent.vue
├── router
│   └── index.js
├── services
│   └── weatherApi.js
├── stores
│   └── configStore.js
├── views
│   ├── NotFoundView.vue
│   ├── WeatherHomeView.vue
│   ├── WeatherDetailView.vue
│   ├── WeatherAboutView.vue
│   └── WeatherTipsView.vue
├── App.vue
└── main.js
```

## 5. 실행 준비

Node.js 버전은 `.nvmrc`를 기준으로 맞춥니다.

```bash
nvm install
nvm use
```

패키지를 설치합니다.

```bash
npm install
```

프로젝트 최상위에 `.env.local` 파일을 만들고 OpenWeather API 키를 입력합니다.

```env
VITE_OPENWEATHER_API_KEY=본인의_API_KEY
```

실제 API 키가 들어 있는 `.env.local` 파일은 GitHub에 올리지 않고 환경 변수로 설정합니다.

## 6. 실행 방법

개발 서버를 실행합니다.

```bash
npm run dev
```

터미널에 표시되는 주소로 접속합니다.

```text
http://localhost:5173/
```

## 7. 실행 흐름

메인 화면이 열리면 `onMounted()`가 날씨 조회 함수를 실행합니다.

각 도시의 위도와 경도를 이용해 OpenWeather API를 호출하고 응답 데이터를 `weatherList`에 저장합니다.

사용자가 상세보기 버튼을 누르면 Vue Router가 도시 ID를 주소에 담아 상세 화면으로 이동합니다.

상세 화면에서는 현재 날씨, 대기질, 3일 예보 API를 동시에 호출합니다.

## 8. 동작 확인

확인한 기능은 다음과 같습니다.

- 메인 화면에서 네 개 도시가 표시되는지
- 검색어를 입력하면 도시 목록이 필터링되는지
- 상세보기 버튼으로 화면이 이동하는지
- 대기질과 3일 예보가 표시되는지
- 온도 단위 변경이 작동하는지
- 잘못된 주소로 접속하면 Not Found 화면이 나오는지

여기에 실행 화면 스크린샷을 추가할 예정입니다.

## 9. 프로젝트 적용 항목 및 학습 내용

이번 프로젝트에서 `ref`는 변경되는 데이터를 저장할 때 사용했습니다(반응형변수 설정).

`computed`는 검색 결과와 온도 표시값처럼 기존 데이터를 이용해 새로운 값을 계산할 때 사용했습니다.

Props와 Emits는 부모 컴포넌트와 자식 컴포넌트가 데이터를 주고받을 때 사용했습니다.

Vue Router는 메인 화면과 상세 화면을 구분하고 주소를 이용해 도시 정보를 전달할 때 사용했습니다.

Pinia는 여러 컴포넌트에서 함께 사용하는 온도 단위를 관리할 때 사용했습니다.

Axios는 OpenWeather와 Open-Meteo API에 비동기로 요청을 보내기 위해 사용했습니다.

## 10. 트러블 슈팅 및 보완점

처음에는 Element Plus를 설치하지 않은 상태에서 `main.js`에 불러오는 코드가 있어서 화면이 정상적으로 나오지 않았습니다.

Element Plus 설치 여부를 확인하고, `app.use(ElementPlus)`를 `app.mount('#app')`보다 먼저 실행하도록 수정했습니다.

API 키를 코드에 직접 작성하면 GitHub에 노출될 수 있다는 점을 알게 되어 `.env.local` 파일로 분리했습니다.

또한 기본 Vue CSS에서 `#app`이 두 개의 열로 나뉘면서 화면이 작게 나오는 문제가 있었습니다. 해당 Grid 설정을 제거하고 전체 너비와 최대 너비를 다시 지정했습니다.

아직 보완하고 싶은 부분은 사용자가 직접 도시를 추가하는 기능과 관심 도시 메모 CRUD 기능 및 날씨에 따른 행사(체육대회, 여행 등) 추첨 기능 입니다.

vercel 로 배포를 하면서 환경변수를 설정하지 않아 오류가 발생하였고 이를 재지정 하여 해결했습니다.

기존 리스트에 지정되지 않은 지역 외 사용자가 희망하는 지역을 검색하면 해당 도시의 날씨 정보가 추가될 수 있도록 기능을 더했습니다.(동적 지역 상세보기 처리)

SearchBar에서 지역 추가 버튼 클릭
→ search-city 이벤트 발생
→ WeatherHomeView의 handleSearchCity 실행
→ API 요청
→ weatherList에 새 도시 추가
