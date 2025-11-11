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
import { searchMovie, type SearchMovieResponseResults } from '~/api/movie'
import { useLoading } from '~/hooks/use-loading'
import { useSafeCall } from '~/hooks/use-safecall'

const useSearch = () => {
  const input = ref('')
  const list = ref<SearchMovieResponseResults[]>([])
  const total = ref(0)
  const page = ref(1)
  const totalPages = ref(1)

  const query = computed(() => ({
    query: input.value,
  }))

  const { openLoading, closeLoading } = useLoading()

  const onSearch = async () => {
    openLoading()
    const data = await useSafeCall(() => searchMovie(query.value), {})
    list.value = data?.results || []
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
