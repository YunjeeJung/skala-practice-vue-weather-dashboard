import axios from 'axios'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

const openWeatherApi = axios.create({
  baseURL: 'https://api.openweathermap.org',
  timeout: 10000,
})

export const CITY_LOCATIONS = [
  {
    id: 'city_01',
    name: '서울',
    lat: 37.5665,
    lon: 126.978,
  },
  {
    id: 'city_02',
    name: '수원',
    lat: 37.2636,
    lon: 127.0286,
  },
  {
    id: 'city_03',
    name: '부산',
    lat: 35.1796,
    lon: 129.0756,
  },
  {
    id: 'city_04',
    name: '대전',
    lat: 36.3504,
    lon: 127.3845,
  },
]

const checkApiKey = () => {
  if (!API_KEY) {
    throw new Error('OpenWeather API 키가 설정되지 않았습니다.')
  }
}

// 실제 현재 날씨
export const fetchCurrentWeather = async (lat, lon) => {
  checkApiKey()

  const response = await openWeatherApi.get('/data/2.5/weather', {
    params: {
      lat,
      lon,
      appid: API_KEY,
      units: 'metric',
      lang: 'kr',
    },
  })

  return response.data
}

// 추가 OpenWeather API: 대기질
export const fetchAirPollution = async (lat, lon) => {
  checkApiKey()

  const response = await openWeatherApi.get('/data/2.5/air_pollution', {
    params: { lat, lon, appid: API_KEY },
  })

  return response.data
}

// 다른 외부 API: Open-Meteo 3일 예보
export const fetchThreeDayForecast = async (lat, lon) => {
  const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
    params: {
      latitude: lat,
      longitude: lon,
      daily: [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'precipitation_probability_max',
      ].join(','),
      timezone: 'Asia/Seoul',
      forecast_days: 3,
    },
  })

  return response.data
}
