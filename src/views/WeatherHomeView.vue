<script setup>
import { ref, computed, watch, watchEffect, onMounted } from 'vue'

import { useRouter } from 'vue-router'

import BaseDashboardCard from '../components/weather/BaseDashboardCard.vue'
import SearchBar from '../components/weather/SearchBar.vue'
import WeatherCard from '../components/weather/WeatherCard.vue'
import StatusBar from '../components/weather/StatusBar.vue'
import { CITY_LOCATIONS, fetchCurrentWeather, searchLocationByName } from '@/services/weatherApi.js'

const router = useRouter()

const weatherList = ref([])

// 사용자가 추가한 도시를 저장할 때 사용할 이름입니다.
const STORAGE_KEY = 'weather-custom-cities'

// 브라우저에 저장된 도시 목록을 가져옵니다.
const loadSavedCities = () => {
  try {
    const savedCities = localStorage.getItem(STORAGE_KEY)

    // 저장된 내용이 없으면 빈 배열을 반환합니다.
    if (!savedCities) {
      return []
    }

    const parsedCities = JSON.parse(savedCities)

    return Array.isArray(parsedCities) ? parsedCities : []
  } catch (error) {
    console.error('저장된 도시를 불러오지 못했습니다:', error)
    return []
  }
}

// 사용자가 추가한 도시 목록을 브라우저에 저장합니다.
const saveCities = (cities) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cities))
}

//로딩과 오류 상태 추가
const isLoading = ref(false)
const errorMessage = ref('')
const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')
// 새로운 지역을 검색하고 있는지 저장합니다.
const isSearching = ref(false)
// 새로운 지역 검색 오류를 저장합니다.
const searchErrorMessage = ref('')

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
    // 기본 도시와 사용자가 저장한 도시를 합칩니다.
    const savedCities = loadSavedCities()
    const allLocations = [...CITY_LOCATIONS, ...savedCities]

    const results = await Promise.all(
      allLocations.map(async (location) => {
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

// 사용자가 입력한 지역을 API로 검색해서 목록에 추가합니다.
const handleSearchCity = async () => {
  // 입력값 앞뒤의 공백을 제거합니다.
  const query = searchQuery.value.trim()

  // 입력값이 없으면 API를 호출하지 않습니다.
  if (!query) {
    searchErrorMessage.value = '검색할 지역 이름을 입력해 주세요.'
    return
  }

  isSearching.value = true
  searchErrorMessage.value = ''

  try {
    // 1. 지역 이름을 위도와 경도로 변환합니다.
    const locations = await searchLocationByName(query)

    // 검색 결과가 빈 배열이라면 해당 지역을 찾지 못한 것입니다.
    if (locations.length === 0) {
      searchErrorMessage.value = '해당 지역을 찾지 못했습니다.'
      return
    }

    // 현재는 첫 번째 검색 결과만 사용합니다.
    const location = locations[0]

    // 같은 좌표의 도시가 이미 목록에 있는지 확인합니다.
    const existingCity = weatherList.value.find((city) => {
      const sameLatitude = Math.abs(city.lat - location.lat) < 0.001
      const sameLongitude = Math.abs(city.lon - location.lon) < 0.001

      return sameLatitude && sameLongitude
    })

    // 이미 등록된 도시라면 중복으로 추가하지 않습니다.
    if (existingCity) {
      selectedCityInfo.value = `${existingCity.name}은 이미 목록에 있습니다.`
      searchQuery.value = ''
      return
    }

    // 2. 검색한 좌표로 실제 현재 날씨를 가져옵니다.
    const weatherData = await fetchCurrentWeather(location.lat, location.lon)

    // 한글 지역명이 있으면 한글을 사용합니다.
    const cityName = location.local_names?.ko ?? location.name

    // 3. WeatherCard가 사용하는 데이터 모양으로 정리합니다.
    const newCity = {
      // Date.now()를 사용해 기존 도시와 겹치지 않는 ID를 만듭니다.
      id: `search_${Date.now()}`,
      name: cityName,
      temp: Math.round(weatherData.main.temp),
      status: weatherData.weather[0]?.description ?? '날씨 정보 없음',
      humidity: weatherData.main.humidity,
      windSpeed: weatherData.wind.speed,
      lat: location.lat,
      lon: location.lon,
    }

    // 4. (핵심) 기존 날씨 목록 마지막에 새 지역을 추가합니다.
    weatherList.value.push(newCity)

    // 기본 도시를 제외하고 사용자가 검색해 추가한 도시만 저장합니다.
    const savedCities = loadSavedCities()

    savedCities.push({
      id: newCity.id,
      name: newCity.name,
      lat: newCity.lat,
      lon: newCity.lon,
    })

    saveCities(savedCities)

    // 검색창을 비워 전체 도시 목록을 보여줍니다.
    searchQuery.value = ''

    // 화면 아래 상태 문구를 변경합니다.
    selectedCityInfo.value = `${cityName} 날씨가 목록에 추가되었습니다.`
  } catch (error) {
    console.error('지역 검색 실패:', error)

    const status = error.response?.status

    if (status === 401) {
      searchErrorMessage.value = 'API 키를 확인해 주세요.'
    } else if (status === 429) {
      searchErrorMessage.value = 'API 요청 횟수를 초과했습니다.'
    } else {
      searchErrorMessage.value = '지역 날씨를 가져오지 못했습니다.'
    }
  } finally {
    // 성공하거나 실패한 뒤 검색 로딩을 종료합니다.
    isSearching.value = false
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

    // 새로 검색한 도시도 상세 화면에서 찾을 수 있도록
    // 이름과 좌표를 query로 전달합니다.
    query: {
      name: city.name,
      lat: city.lat,
      lon: city.lon,
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
      <SearchBar
        :query="searchQuery"
        :searching="isSearching"
        @update-query="handleUpdateQuery"
        @search-city="handleSearchCity"
      />

      <!-- 새로운 지역 검색에 실패했을 때만 표시합니다. -->
      <el-alert
        v-if="searchErrorMessage"
        :title="searchErrorMessage"
        type="warning"
        show-icon
        :closable="false"
      />
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
