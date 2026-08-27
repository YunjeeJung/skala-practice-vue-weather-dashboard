<script setup>
import { ref, computed, watch, watchEffect } from 'vue'

// [1차 실습 데이터] 가상의 백엔드 데이터 배열
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  //나만의 데이터
  { id: 'city_04', name: '대전', temp: 25, status: '흐림' },
])

//[1차 실습 데이터] 검색어 및 알림창 제어용 데이터 (v-model 한글 처리 및 이벤트 실습)
const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요')

//[2차 추가] computed를 활용한 실시간 검색 필터링 연산기
const filteredWeatherList = computed(() => {
  //사용자가 입력한 내용의 앞,뒤 공백 제거
  const query = searchQuery.value.trim()
  //검색어가 비었다면 원본 날씨 목록 weatherList를 반환
  if (!query) {
    return weatherList.value
  }
  //검색어가 포함된 도시만 필터링해서 반환
  return weatherList.value.filter((item) => item.name.includes(query))
})

//[2차 추가] watch를 활용해 선택한 도시 추적하는 센서
//selectedCityInfo 문구 변화를 감시해서 후속 로그를 처리함
watch(selectedCityInfo, (newInfo, oldInfo) => {
  console.log(`[watch]이전 상태: ${oldInfo}`)
  console.log(`[watch]새로운 상태: ${newInfo}`)
})

//[2차 추가] watchEffect를 활용한 검색어 감시
watchEffect(() => {
  console.log(`[watchEffect]현재 검색어: ${searchQuery.value}`)
})

//[2차 추가] 나만의 composition api 기능 추가 - 더운 날씨 기준 온도 사용자가 변경 가능
//반응형의 기준 온도
const hotStandard = ref(25)
//기준 이상의 도시 개수 확인
const hotCityCount = computed(() => {
  return weatherList.value.filter((city) => {
    return city.temp >= hotStandard.value
  }).length
})
//기준 온도 변경을 감시
watch(hotStandard, (newValue, oldValue) => {
  console.log(`더움 기준이 ${oldValue}℃에서 ${newValue}℃로 변경되었습니다.`)
})

//알림 대행 함수
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status} 상태입니다.]`)
}
</script>

<template>
  <div class="dashboard-wrapper">
    <h2>🌤️ 날씨 Mockup</h2>

    <section class="search-box">
      <h3>🔍 도시 검색</h3>
      <!-- input type="text" v-model="searchQuery" placeholder="검색할 도시 이름 입력" / -->
      <input
        type="text"
        v-model="searchQuery"
        @input="searchQuery = $event.target.value"
        placeholder="검색할 도시 이름 입력"
      />
      <p>
        검색 중인 도시: <strong>{{ searchQuery }}</strong>
      </p>
    </section>

    <label>
      더움 기준 온도:
      <input type="number" v-model.number="hotStandard" />
    </label>

    <p>{{ hotStandard }}℃ 이상인 도시는 {{ hotCityCount }}개입니다.</p>

    <span v-if="item.temp >= hotStandard" class="badge hot">🔥 더움 (25도 이상)</span>

    <section class="list-box">
      <h3>🏙️ 지역별 날씨 현황</h3>

      <!---div말고 article 사용 가능하다-->
      <div
        v-for="item in filteredWeatherList"
        :key="item.id"
        class="weather-card"
        @click="selectedCityInfo = `${item.name}이 선택되었습니다.`"
      >
        <h4>{{ item.name }} ({{ item.status }})</h4>
        <p>현재 기온: {{ item.temp }}°C</p>
        <p v-if="filteredWeatherList.length === 0" class="no-result">
          😭 검색 결과와 일치하는 도시가 없습니다.
        </p>

        <span v-if="item.temp >= 25" class="badge hot">🔥 더움 (25도 이상)</span>
        <span v-else class="badge cool">❄️ 선선함 (25도 미만)</span>

        <button class="detail-button" @click.stop="showDetail(item.name, item.status)">
          상세보기
        </button>
      </div>
    </section>

    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>
  </div>
</template>

<style scoped>
.dashboard-wrapper {
  max-width: 700px;
  padding: 20px;
  margin: 0 auto;
}

.search-box,
.list-box {
  padding: 16px;
  margin-bottom: 20px;
  border: 1px solid #dfe6e9;
  border-radius: 8px;
}

.search-box input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

.weather-card {
  position: relative;
  padding: 14px;
  margin-bottom: 10px;
  border: 1px solid #dfe6e9;
  border-radius: 6px;
  cursor: pointer;
}

.weather-card:hover {
  background-color: #f8f9fa;
}

.badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  color: white;
}

.hot {
  background-color: #ff7675;
}

.cool {
  background-color: #74b9ff;
}

.detail-button {
  float: right;
}

.status-bar {
  padding: 12px;
  text-align: center;
  background-color: #e8f5e9;
  border-radius: 6px;
}

.no-result {
  padding: 15px;
  text-align: center;
  color: #e74c3c;
}
</style>
