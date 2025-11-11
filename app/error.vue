<template>
  <h1>
    {{ Number(error?.statusCode) === 404 ? '未找到您要查找的页面。' : error?.statusCode }}
  </h1>
</template>
<script setup lang="ts">
// 如果在其他地方需要页面报404，就可以这样使用
// showError({ statusCode: 404, statusMessage: 'Page Not Found' })

const error = useError()
</script>

<style lang="scss" scoped></style>
