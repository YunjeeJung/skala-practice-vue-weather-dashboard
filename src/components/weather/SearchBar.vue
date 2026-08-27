<script setup>
const props = defineProps({
  query: {
    type: String,
    required: true,
  },
  // 지역 검색 API를 호출하고 있는지 전달받습니다.
  searching: {
    type: Boolean,
    default: false,
  },
})
// 입력값 변경 이벤트와 지역 검색 이벤트를 정의합니다.
const emit = defineEmits(['update-query', 'search-city'])

// 입력할 때마다 부모의 searchQuery를 변경합니다.
const handleInput = (value) => {
  emit('update-query', value)
}

// Enter 또는 버튼을 누르면 부모에게 지역 검색을 요청합니다.
const handleSearch = () => {
  emit('search-city')
}
</script>

<template>
  <div class="search-bar">
    <el-input
      :model-value="props.query"
      placeholder="검색할 지역 이름 입력"
      clearable
      @input="handleInput"
      @keyup.enter="handleSearch"
    >
      <!-- 입력창 오른쪽에 검색 버튼을 붙입니다. -->
      <template #append>
        <el-button :loading="props.searching" @click="handleSearch"> 지역 추가 </el-button>
      </template>
    </el-input>

    <p>
      검색 중인 지역:
      <strong>{{ props.query }}</strong>
    </p>
  </div>
</template>
