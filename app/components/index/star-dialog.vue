<template>
  <el-button v-if="list.length > 0" @click="dialogVisible = true">抽取随机影片</el-button>
  <el-dialog v-if="dialogVisible" v-model="dialogVisible" title="随机影片" width="70%">
    <star-lottery :movies="list" />
  </el-dialog>
</template>

<script setup lang="ts">
import type { SearchMovieResponseMergeResults } from '~/api/movie'

const dialogVisible = ref(false)

const { list } = defineProps<{
  list: SearchMovieResponseMergeResults[]
}>()
</script>

<style lang="scss" scoped></style>
