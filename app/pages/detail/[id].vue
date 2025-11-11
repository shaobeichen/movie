<template>
  <div>1</div>
</template>

<script setup lang="ts">
import { searchMovie } from '~/api/movie'
import { useSafeCall } from '~/hooks/use-safecall'

const query = {
  query: 'interstellar',
}

const init = async () => {
  const data = await useSafeCall(() => searchMovie(query), {})
  console.log(`✅ - results:`, data)
}

onMounted(() => {
  init()
})
</script>
