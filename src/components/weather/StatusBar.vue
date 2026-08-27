<script setup>
defineProps({
  message: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="status-bar">
    {{ message }}
  </div>
</template>

<style scoped>
.status-bar {
  padding: 12px;
  text-align: center;
  background-color: #e8f5e9;
  border-radius: 6px;
}
</style>
