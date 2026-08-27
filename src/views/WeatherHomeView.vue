<script setup>
import { ref, computed, watch, watchEffect, onMounted } from 'vue'

import { useRouter } from 'vue-router'

import BaseDashboardCard from '../components/weather/BaseDashboardCard.vue'
import SearchBar from '../components/weather/SearchBar.vue'
import WeatherCard from '../components/weather/WeatherCard.vue'
import StatusBar from '../components/weather/StatusBar.vue'
import { CITY_LOCATIONS, fetchCurrentWeather } from '@/services/weatherApi.js'

const router = useRouter()

const weatherList = ref([])

//로딩과 오류 상태 추가
const isLoading = ref(false)
const errorMessage = ref('')
const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()

  if (!query) {
    return weatherList.value
  }

  return weatherList.value.filter((city) => city.name.includes(query))
})

//실제 날씨 가져오는 함수
const loadWeatherList = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const results = await Promise.all(
      CITY_LOCATIONS.map(async (location) => {
        const data = await fetchCurrentWeather(location.lat, location.lon)

        // OpenWeather 응답을
        // WeatherCard가 사용하는 형태로 변환
        return {
          id: location.id,
          name: location.name,
          temp: Math.round(data.main.temp),
          status: data.weather[0]?.description ?? '날씨 정보 없음',
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          lat: location.lat,
          lon: location.lon,
        }
      }),
    )

    weatherList.value = results
  } catch (error) {
    console.error('현재 날씨 조회 실패:', error)

    const status = error.response?.status

    if (status === 401) {
      errorMessage.value = 'API 키가 올바르지 않거나 아직 활성화되지 않았습니다.'
    } else if (status === 429) {
      errorMessage.value = 'API 요청 횟수를 초과했습니다.'
    } else {
      errorMessage.value = '날씨 정보를 가져오지 못했습니다.'
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(loadWeatherList)

const handleUpdateQuery = (newQuery) => {
  searchQuery.value = newQuery
}

const handleSelectCard = (city) => {
  selectedCityInfo.value = `${city.name}이 선택되었습니다.`
}

// 이번 과제의 핵심
const handleClickDetail = (city) => {
  router.push({
    name: 'weather-detail',
    params: {
      cityId: city.id,
    },
  })
}

watch(selectedCityInfo, (newValue) => {
  console.log('선택 상태:', newValue)
})

watchEffect(() => {
  console.log('검색어:', searchQuery.value)
})
</script>

<template>
  <div class="weather-home">
    <BaseDashboardCard>
      <SearchBar :query="searchQuery" @update-query="handleUpdateQuery" />
    </BaseDashboardCard>

    <BaseDashboardCard>
      <h3>🏙️ 지역별 날씨 현황</h3>

      <!-- 1. API 요청 중 -->
      <!-- Element Plus 로딩 화면 -->
      <el-skeleton v-if="isLoading" :rows="3" animated />

      <!-- 2. API 요청 실패 -->
      <!-- Element Plus 오류 알림과 버튼 -->
      <div v-else-if="errorMessage" class="error-box">
        <el-alert :title="errorMessage" type="error" show-icon :closable="false" />

        <el-button type="danger" plain @click="loadWeatherList"> 다시 시도 </el-button>
      </div>

      <!-- 3. API 요청 완료 -->
      <template v-else>
        <p v-if="filteredWeatherList.length === 0">검색 결과와 일치하는 도시가 없습니다.</p>

        <WeatherCard
          v-for="city in filteredWeatherList"
          :key="city.id"
          :city="city"
          @select-card="handleSelectCard"
          @click-detail="handleClickDetail"
      /></template>
    </BaseDashboardCard>

    <StatusBar :message="selectedCityInfo" />
  </div>
</template>
