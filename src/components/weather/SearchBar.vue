<script setup>
const props = defineProps({
  query: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update-query'])

// el-input은 event 객체가 아니라 입력된 글자를 바로 전달합니다.
const handleInput = (value) => {
  emit('update-query', value)
}
</script>

<template>
  <div class="search-bar">
    <!-- Element Plus 검색창 -->
    <el-input
      :model-value="props.query"
      placeholder="검색할 도시 이름 입력"
      clearable
      @input="handleInput"
    />

    <p>
      검색 중인 도시:
      <strong>{{ props.query }}</strong>
    </p>
  </div>
</template>
