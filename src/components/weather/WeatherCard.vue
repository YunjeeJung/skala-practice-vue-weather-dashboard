<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore.js'

const configStore = useConfigStore()
const props = defineProps({
  city: {
    type: Object,
    required: true,
  },
  hotStandard: {
    type: Number,
    default: 25,
  },
})

const displayTemp = computed(() => {
  const rawTemp = props.city.temp

  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
})

const emit = defineEmits(['select-card', 'click-detail'])

const selectCard = () => {
  emit('select-card', props.city)
}

const clickDetail = () => {
  emit('click-detail', props.city)
}
</script>

<template>
  <!-- 기존 article 대신 Element Plus Card 사용 -->
  <el-card class="weather-card" shadow="hover" @click="selectCard">
    <!-- 카드 제목 영역 -->
    <template #header>
      <strong>
        {{ props.city.name }}

        <span v-if="configStore.showWeatherStatus"> ({{ props.city.status }}) </span>
      </strong>
    </template>

    <p>
      현재 기온:
      {{ displayTemp }}{{ configStore.unitSymbol }}
    </p>

    <!-- 기온에 따라 태그 색상을 변경합니다. -->
    <el-tag :type="props.city.temp >= props.hotStandard ? 'danger' : 'primary'">
      {{ props.city.temp >= props.hotStandard ? '🔥 더움' : '❄️ 선선함' }}
    </el-tag>

    <!-- Element Plus 버튼 -->
    <el-button class="detail-button" type="primary" size="small" @click.stop="clickDetail">
      상세보기
    </el-button>
  </el-card>
</template>

<style scoped>
.weather-card {
  margin-bottom: 10px;
  cursor: pointer;
}

.detail-button {
  float: right;
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
</style>
