<template>
  <div>1</div>
</template>

<script setup>
import { searchMovie } from '~/api/movie'

const query = {
  query: 'interstellar',
}

const data = await searchMovie(query)
console.log(`✅ - results:`, data)
</script>
