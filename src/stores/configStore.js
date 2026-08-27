import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', () => {
  //State : 현재 온도 단위 (단위를 저장하는 변수, 초기값은 'celsius')
  const unit = ref('celsius')

  //Getter : 현재 단위의 기호
  const unitSymbol = computed(() => {
    return unit.value === 'celsius' ? '℃' : '℉'
  })

  //Getter : 사용자 보여줄 한글 단위
  const unitName = computed(() => {
    return unit.value === 'celsius' ? '섭씨' : '화씨'
  })

  //Action : 섭씨와 화씨 서로 전환(스위칭)
  const toggleUnit = () => {
    unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
  }

  //나만의 추가 State : 날씨 상태 표시/숨김
  const showWeatherStatus = ref(true)

  //나만의 추가 Getter : 날씨 상태 표시/숨김
  const statusButtonText = computed(() => {
    return showWeatherStatus.value ? '날씨 상태 숨기기' : '날씨 상태 보기'
  })

  //나만의 추가 Action : 날씨 상태 표시/숨김
  const toggleWeatherStatus = () => {
    showWeatherStatus.value = !showWeatherStatus.value
  }

  return {
    unit,
    unitSymbol,
    unitName,
    toggleUnit,

    showWeatherStatus,
    statusButtonText,
    toggleWeatherStatus,
  }
})
