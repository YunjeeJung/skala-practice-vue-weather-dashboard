<script setup>
// Vue에서 사용할 기능을 가져옵니다.
import { ref, computed, onMounted } from 'vue'

// 주소 정보와 화면 이동 기능을 가져옵니다.
import { useRoute, useRouter } from 'vue-router'

// 온도 단위 설정을 관리하는 Pinia store를 가져옵니다.
import { useConfigStore } from '@/stores/configStore.js'

// 우리가 weatherApi.js에서 만든 API 함수들을 가져옵니다.
import {
  CITY_LOCATIONS,
  fetchCurrentWeather,
  fetchAirPollution,
  fetchThreeDayForecast,
} from '@/services/weatherApi.js'

// 현재 주소에 들어 있는 cityId를 확인할 때 사용합니다.
const route = useRoute()

// 다른 화면으로 이동할 때 사용합니다.
const router = useRouter()

// 섭씨/화씨 설정을 사용할 수 있게 합니다.
const configStore = useConfigStore()

// 현재 날씨 정보를 저장합니다.
const selectedCity = ref(null)

// 대기질 지수를 저장합니다.
// 1: 좋음, 2: 보통, 3: 나쁨, 4: 매우 나쁨, 5: 최악
const airQuality = ref(null)

// 3일간의 예보를 배열로 저장합니다.
const forecastList = ref([])

// API 요청 중인지를 저장합니다.
const isLoading = ref(false)

// 오류 메시지를 저장합니다.
const errorMessage = ref('')

// 현재 기온을 섭씨 또는 화씨로 보여주는 계산된 값입니다.
const displayTemp = computed(() => {
  // 아직 날씨 정보가 없다면 아무것도 표시하지 않습니다.
  if (!selectedCity.value) {
    return ''
  }

  // API에서 받은 원래 온도는 섭씨입니다.
  const celsius = selectedCity.value.temp

  // 사용자가 화씨를 선택했다면 화씨로 변환합니다.
  if (configStore.unit === 'fahrenheit') {
    return Math.round((celsius * 9) / 5 + 32)
  }

  // 섭씨를 선택했다면 그대로 반환합니다.
  return celsius
})

// API가 보내준 AQI 숫자를 사용자가 이해하기 쉬운 문장으로 바꿉니다.
const airQualityLabel = computed(() => {
  // airQuality가 아직 null일 수 있으므로 ?.을 사용합니다.
  const aqi = airQuality.value?.main?.aqi

  // AQI 숫자와 화면에 보여줄 문장을 연결합니다.
  const labels = {
    1: '좋음 😊',
    2: '양호 🙂',
    3: '보통 😐',
    4: '나쁨 😷',
    5: '매우 나쁨 ⚠️',
  }

  // 해당 숫자가 없으면 '정보 없음'을 반환합니다.
  return labels[aqi] ?? '정보 없음'
})

// 상세 화면에 필요한 정보를 API에서 가져오는 함수입니다.
const loadWeatherDetail = async () => {
  // 주소가 /weather/city_01이라면 cityId에는 city_01이 들어갑니다.
  const cityId = route.params.cityId

  // 먼저 기본으로 등록된 도시에서 찾습니다.
  const registeredLocation = CITY_LOCATIONS.find((city) => city.id === cityId)

  // 주소 query로 받은 좌표를 숫자로 변환합니다.
  const queryLat = Number(route.query.lat)
  const queryLon = Number(route.query.lon)

  // 유효한 좌표인지 확인합니다.
  const hasQueryLocation = Number.isFinite(queryLat) && Number.isFinite(queryLon)

  // 기본 목록에 없는 도시라면 query의 좌표를 사용합니다.
  const location =
    registeredLocation ??
    (hasQueryLocation
      ? {
          id: cityId,
          name: String(route.query.name ?? '검색 지역'),
          lat: queryLat,
          lon: queryLon,
        }
      : null)

  // 해당 도시를 찾지 못했다면 API를 호출하지 않습니다.
  if (!location) {
    errorMessage.value = '해당 도시 정보를 찾을 수 없습니다.'
    return
  }

  // API 요청을 시작했으므로 로딩 상태를 true로 변경합니다.
  isLoading.value = true

  // 이전 오류 메시지를 지웁니다.
  errorMessage.value = ''

  try {
    /*
     * 세 가지 API를 동시에 실행합니다.
     *
     * currentWeather: OpenWeather 현재 날씨
     * airPollution: OpenWeather 대기질
     * forecast: Open-Meteo 3일 예보
     */
    const [currentWeather, airPollution, forecast] = await Promise.all([
      fetchCurrentWeather(location.lat, location.lon),
      fetchAirPollution(location.lat, location.lon),
      fetchThreeDayForecast(location.lat, location.lon),
    ])

    // 현재 날씨 API 결과를 화면에서 사용하기 편한 모양으로 정리합니다.
    selectedCity.value = {
      id: location.id,
      name: location.name,
      temp: Math.round(currentWeather.main.temp),
      status: currentWeather.weather[0]?.description ?? '날씨 정보 없음',
      humidity: currentWeather.main.humidity,
      windSpeed: currentWeather.wind.speed,
    }

    // 대기질 등급과 미세먼지 수치를 모두 사용하기 위해
    // list 배열의 첫 번째 객체 전체를 저장합니다.
    airQuality.value = airPollution.list?.[0] ?? null

    /*
     * Open-Meteo는 날짜, 최고기온, 최저기온을
     * 각각 별도의 배열로 보내줍니다.
     *
     * 같은 순서의 값들을 하나의 객체로 합칩니다.
     */
    forecastList.value = forecast.daily.time.map((date, index) => ({
      date,
      maxTemp: Math.round(forecast.daily.temperature_2m_max[index]),
      minTemp: Math.round(forecast.daily.temperature_2m_min[index]),
      rainProbability: forecast.daily.precipitation_probability_max[index],
    }))
  } catch (error) {
    // 개발자가 브라우저 콘솔에서 자세한 오류를 확인할 수 있게 합니다.
    console.error('상세 날씨 조회 실패:', error)

    // 사용자 화면에 보여줄 오류 메시지입니다.
    const status = error.response?.status

    if (status === 401) {
      errorMessage.value = 'API 키가 올바르지 않거나 아직 활성화되지 않았습니다.'
    } else if (status === 429) {
      errorMessage.value = 'API 요청 횟수를 초과했습니다.'
    } else {
      errorMessage.value = '상세 날씨 정보를 가져오지 못했습니다.'
    }
  } finally {
    // 성공하든 실패하든 API 요청이 끝났으므로 로딩을 종료합니다.
    isLoading.value = false
  }
}

// 이 화면이 처음 나타났을 때 상세 날씨를 가져옵니다.
onMounted(loadWeatherDetail)

// 메인 화면으로 돌아가는 함수입니다.
const goHome = () => {
  router.push('/')
}
</script>

<template>
  <section class="weather-detail">
    <h2>📊 지역별 상세 기상 관측 정보</h2>

    <!-- 1. API 요청 중일 때 -->
    <p v-if="isLoading">상세 날씨 정보를 불러오는 중입니다...</p>

    <!-- 2. API 요청에 실패했을 때 -->
    <div v-else-if="errorMessage" class="error-box">
      <p>{{ errorMessage }}</p>

      <!-- 버튼을 누르면 API를 다시 호출합니다. -->
      <button @click="loadWeatherDetail">다시 시도</button>
    </div>

    <!-- 3. API 요청에 성공했을 때 -->
    <div v-else-if="selectedCity">
      <p>📍 지정 지역: {{ selectedCity.name }}</p>

      <p>
        🌡️ 실시간 기온:
        {{ displayTemp }}{{ configStore.unitSymbol }}
      </p>

      <!-- store에서 날씨 상태 표시를 켰을 때만 보여줍니다. -->
      <p v-if="configStore.showWeatherStatus">☀️ 기상 현황: {{ selectedCity.status }}</p>

      <p>💧 대기 습도: {{ selectedCity.humidity }}%</p>

      <p>💨 현재 풍속: {{ selectedCity.windSpeed }}m/s</p>

      <!-- airQuality가 있을 때만 대기질 영역을 보여줍니다. -->
      <section v-if="airQuality">
        <h3>🌫️ 대기질 정보</h3>

        <p>
          대기질:
          <strong>{{ airQualityLabel }}</strong>
        </p>

        <p>
          초미세먼지 PM2.5:
          {{ airQuality.components.pm2_5 }}
          ㎍/㎥
        </p>

        <p>
          미세먼지 PM10:
          {{ airQuality.components.pm10 }}
          ㎍/㎥
        </p>
      </section>

      <!-- 예보가 한 개 이상 있을 때만 예보 영역을 보여줍니다. -->
      <section v-if="forecastList.length > 0">
        <h3>📅 앞으로 3일 예보</h3>

        <!-- forecastList에 들어 있는 날짜 수만큼 article을 반복합니다. -->
        <article v-for="forecast in forecastList" :key="forecast.date" class="forecast-card">
          <strong>{{ forecast.date }}</strong>

          <p>최저 {{ forecast.minTemp }}℃ / 최고 {{ forecast.maxTemp }}℃</p>

          <p>
            최대 강수 확률:
            {{ forecast.rainProbability ?? 0 }}%
          </p>
        </article>
      </section>
    </div>

    <!-- 도시가 없고 오류도 없는 예외적인 경우 -->
    <p v-else>해당 도시 정보를 찾을 수 없습니다.</p>

    <button class="home-button" @click="goHome">← 메인 대시보드로 돌아가기</button>
  </section>
</template>

<style scoped>
.weather-detail {
  max-width: 700px;
  padding: 24px;
  margin: 0 auto;
}

/* 3일 예보 각각을 카드 모양으로 만듭니다. */
.forecast-card {
  padding: 12px;
  margin-bottom: 10px;
  background-color: #f8fafc;
  border: 1px solid #dfe6e9;
  border-radius: 6px;
}

.error-box {
  padding: 15px;
  color: #c0392b;
  background-color: #fff5f5;
  border: 1px solid #ffc9c9;
  border-radius: 6px;
}

li {
  padding: 8px 0;
}

button {
  padding: 8px 12px;
  cursor: pointer;
}

.home-button {
  margin-top: 20px;
}
</style>
