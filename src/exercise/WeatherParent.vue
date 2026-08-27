<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
//컴포넌트 파일명 표기법 매칭
import BaseDashboardCard from '../components/weather/BaseDashboardCard.vue'
import SearchBar from '../components/weather/SearchBar.vue'
import WeatherCard from '../components/weather/WeatherCard.vue'
import StatusBar from '../components/weather/StatusBar.vue/index.js'

//현재 WeatherComposition.vue 반응형 데이터
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '대전', temp: 25, status: '흐림' },
])

const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')
const hotStandard = ref(25)

//기존 핵심 비즈니스 로직의 소유권은 안전하게 부모 콘텍스트가 격리 유지
const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  if (!query) return weatherList.value
  return weatherList.value.filter((item) => item.name.includes(query))
})
const hotCityCount = computed(() => {
  return weatherList.value.filter((city) => city.temp >= hotStandard.value).length
})

watch(selectedCityInfo, (newValue, oldValue) => {
  console.log('이전 상태: ', oldValue)
  console.log('새로운 상태: ', newValue)
})

watchEffect(() => {
  console.log('현재 검색어: ', searchQuery.value)
})

const handleUpdateQuery = (newQuery) => {
  searchQuery.value = newQuery
}

// WeatherCard가 보낸 도시 객체를 받는 함수
const handleSelectCard = (city) => {
  selectedCityInfo.value = `${city.name}이 선택되었습니다.`
}

// WeatherCard가 보낸 도시 객체로 상세 정보 표시
const handleClickDetail = (city) => {
  window.alert(`${city.name}의 현재 날씨는 [${city.status} 상태입니다.]`)
}
</script>

<template>
  <div class="dashboard-wrapper">
    <h2>🌤️ 날씨 컴포넌트</h2>

    <BaseDashboardCard>
      <h3>🔍 도시 검색</h3>

      <SearchBar :query="searchQuery" @update-query="handleUpdateQuery" />
    </BaseDashboardCard>

    <label>
      더움 기준 온도:
      <input v-model.number="hotStandard" type="number" />
    </label>

    <p>{{ hotStandard }}℃ 이상인 도시는 {{ hotCityCount }}개입니다.</p>

    <BaseDashboardCard>
      <h3>🏙️ 지역별 날씨 현황</h3>

      <p v-if="filteredWeatherList.length === 0" class="no-result">
        😭 검색 결과와 일치하는 도시가 없습니다.
      </p>

      <WeatherCard
        v-for="city in filteredWeatherList"
        :key="city.id"
        :city="city"
        :hot-standard="hotStandard"
        @select-card="handleSelectCard"
        @click-detail="handleClickDetail"
      />
    </BaseDashboardCard>

    <StatusBar :message="selectedCityInfo" />
  </div>
</template>

<style scoped>
.dashboard-wrapper {
  max-width: 700px;
  padding: 20px;
  margin: 0 auto;
}

.no-result {
  padding: 15px;
  text-align: center;
  color: #e74c3c;
}
</style>
