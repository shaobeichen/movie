<template>
  <div class="layout-default">
    <div class="title">
      <NuxtLink to="/" class="title-link">TMDB</NuxtLink>
    </div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.layout-default {
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
  .title {
    font-size: 50px;
    font-weight: bold;
    text-align: center;
    margin: 0 auto;
    padding: 30px 0;
    .title-link {
      color: #000;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.3s ease-in-out;
      &:hover {
        color: #ff9900;
        transition: all 0.3s ease-in-out;
      }
    }
  }
}
</style>
