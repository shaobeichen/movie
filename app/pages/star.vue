<template>
  <div class="star-lottery">
    <star-lottery :movies="list" />
  </div>
  <index-list
    :list="list"
    :total="total"
    :page="page"
    :total-pages="totalPages"
    isStarPage
    @filterChange="onFilterChange"
  />
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

const onFilterChange = () => {
  const starList = getTodoStorage()
  list.value = starList
}
</script>
