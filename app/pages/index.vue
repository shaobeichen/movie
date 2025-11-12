<template>
  <div>
    <index-search v-model="input" @search="onSearch" />

    <index-list
      :list="list"
      :total="total"
      :page="page"
      :totalPages="totalPages"
      @loadMore="onLoadMore"
    />
  </div>
</template>

<script setup lang="ts">
import { searchMovie, type SearchMovieResponseMergeResults } from '~/api/movie'
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

  const query = ref<{ query: string; [key: string]: string | number }>({
    query: input.value,
  })

  watch(input, (newVal) => {
    query.value.query = newVal
  })

  const handleStar = (item: SearchMovieResponseMergeResults) => {
    const todo = getTodoStorage()
    item.isStar = todo.some((v) => {
      return v.id === item.id
    })
    return item
  }

  const { openLoading, closeLoading } = useLoading()

  const onSearch = async () => {
    openLoading()

    const data = await useSafeCall(() => searchMovie(query.value), null)

    if (!data) {
      useToast({
        message: '请求失败，请稍后再试',
        type: 'error',
      })
      closeLoading()
      return
    }

    list.value = data?.results?.map(handleStar) || []
    total.value = data?.total_results || 0
    page.value = data?.page || 1
    totalPages.value = data?.total_pages || 1

    closeLoading()
  }

  const onLoadMore = async () => {
    if (page.value >= totalPages.value) {
      return
    }
    openLoading()
    const data = await useSafeCall(
      () =>
        searchMovie({
          ...query.value,
          page: page.value + 1,
        }),
      {},
    )
    list.value = [...list.value, ...(data?.results || [])]
    total.value = data?.total_results || 0
    page.value = data?.page || 1
    totalPages.value = data?.total_pages || 1
    closeLoading()
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
