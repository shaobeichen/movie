<template>
  <div>
    <index-search v-model="input" @search="onSearch" />

    <index-list
      :list="list"
      :total="total"
      :page="page"
      :total-pages="totalPages"
      @load-more="onLoadMore"
    />
  </div>
</template>

<script setup lang="ts">
import { searchMovie, type SearchMovieResponseMergeResults } from '~/api/movie'
import { searchMovieModelMapper } from '~/domain/search-movie-mapper'
import { useLoading } from '~/hooks/use-loading'
import { useSafeCall } from '~/hooks/use-safecall'
import { useToast } from '~/hooks/use-toast'
import { getTodoStorage } from '~/utils/storage-manager'

const useSearch = () => {
  const input = ref('')
  const list = ref<SearchMovieResponseMergeResults[]>([])
  const total = ref(0)
  const page = ref(1)
  const totalPages = ref(1)

  const params = computed<{ query: string; page: number; [key: string]: string | number }>(() => ({
    query: input.value,
    page: page.value,
  }))

  const handleStar = (item: SearchMovieResponseMergeResults) => {
    const todo = getTodoStorage()
    item.isStar = todo.some((v) => {
      return v.id === item.id
    })
    return item
  }

  const { openLoading, closeLoading } = useLoading()

  const getData = async (isUpdate = false) => {
    openLoading()

    if (isUpdate) {
      page.value = page.value + 1
    } else {
      page.value = 1
    }
    const data = await useSafeCall(() => searchMovie(params.value), null)
    if (!data) {
      useToast({
        message: '请求失败，请稍后再试',
        type: 'error',
      })
      closeLoading()
      return
    }

    let _result = data?.results?.map(handleStar) || []
    _result = _result.map(searchMovieModelMapper)
    if (isUpdate) {
      list.value = [...list.value, ..._result]
    } else {
      list.value = [..._result]
    }
    total.value = data?.total_results || 0
    page.value = data?.page || 1
    totalPages.value = data?.total_pages || 1

    closeLoading()
  }

  const onSearch = () => getData()

  const onLoadMore = () => {
    if (page.value >= totalPages.value) {
      return
    }
    getData(true)
  }

  return {
    input,
    list,
    total,
    page,
    totalPages,
    onSearch,
    onLoadMore,
  }
}

const { input, list, total, page, totalPages, onSearch, onLoadMore } = useSearch()
</script>
