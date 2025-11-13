<template>
  <index-list :list="list" :total="total" :page="page" :total-pages="totalPages" isStarPage />
</template>

<script setup lang="ts">
import type { SearchMovieResponseMergeResults } from '~/api/movie'
import { getTodoStorage } from '~/utils/storage-manager'

const list = ref<SearchMovieResponseMergeResults[]>([])
const total = ref(0)
const page = ref(1)
const totalPages = ref(1)

onMounted(() => {
  const starList = getTodoStorage()
  list.value = starList
  total.value = starList.length
})
</script>
