<script setup>
import { useConfigStore } from '@/stores/configStore'
const configStore = useConfigStore()
</script>

<template>
  <div
    style="
      text-align: center;
      margin-left: auto;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    "
  >
    <span
      >날씨단위: <strong>{{ configStore.unitName }}({{ configStore.unitSymbol }})</strong></span
    >
    <button @click="configStore.toggleUnit" class="toggle-btn">단위변경</button>
    <!-- 날씨 상태 표시 여부를 변경합니다. -->
    <el-button type="info" plain @click="configStore.toggleWeatherStatus">
      {{ configStore.statusButtonText }}
    </el-button>
  </div>
</template>

<style scoped>
.toggle-btn {
  padding: 6px 10px;
  background-color: #4b6584;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}
.unit-toggler button:hover {
  background-color: #2c3e50;
}
</style>
