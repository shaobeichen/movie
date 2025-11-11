<template>
  <div class="index-list" v-if="list.length">
    <div class="index-list__total">共 {{ total }} 条结果</div>
    <div class="index-list__item-container">
      <div class="index-list__item" v-for="item in list" :key="item.id">
        <NuxtLink class="index-list__item-link" v-if="item.id" :to="`/detail/${item.id}`">
          <el-image
            class="index-list__item-poster"
            :src="staticUrl + item.poster_path"
            fit="cover"
          />
          <div class="index-list__item-content">
            <div class="index-list__item-content-title">
              <div class="index-list__item-content-title-name">{{ item.title }}</div>
              <div class="index-list__item-content-title-vote">
                {{ voteAverage(item.vote_average) }}
              </div>
            </div>
            <div class="index-list__item-content-overview">{{ item.overview }}</div>
          </div>
        </NuxtLink>
      </div>
    </div>
    <div v-if="page < totalPages" class="index-list__load">
      <el-button type="primary" @click="onLoadMore">加载更多</el-button>
    </div>
  </div>
  <el-empty v-else description="暂无结果" />
</template>

<script setup lang="ts">
import type { SearchMovieResponseResults } from '~/api/movie'

const staticUrl = ref(useRuntimeConfig().public.staticUrl)

const {
  list = [],
  total = 0,
  page = 0,
  totalPages = 0,
} = defineProps<{
  list?: SearchMovieResponseResults[]
  total?: number
  page?: number
  totalPages?: number
}>()

const emit = defineEmits(['loadMore'])

const voteAverage = (vote?: number) => {
  if (!vote) {
    return 'N/A'
  }
  return vote.toFixed(1)
}

const onLoadMore = () => {
  if (page >= totalPages) {
    return
  }
  emit('loadMore')
}
</script>

<style lang="scss" scoped>
.index-list {
  .index-list__total {
    font-size: 20px;
    font-weight: bold;
    padding: 20px 0;
  }
  .index-list__item-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 20px;
  }
  .index-list__item {
    width: 186px;
    .index-list__item-link {
      color: #000;
      text-decoration: none;
      cursor: pointer;
      width: 100%;
      .index-list__item-poster {
        width: 100%;
        height: auto;
        object-fit: cover;
        aspect-ratio: 9 / 12;
        display: block;
      }
      .index-list__item-content {
        .index-list__item-content-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 10px;
          .index-list__item-content-title-name {
            font-size: 20px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            word-break: break-all;
          }
          .index-list__item-content-title-vote {
            font-size: 16px;
            font-weight: bold;
            background: linear-gradient(90deg, #ffbaba, #ff9900);
            color: #fff;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }
        }
        .index-list__item-content-overview {
          width: 100%;
          font-size: 12px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          word-break: break-all;
          overflow: hidden;
          color: #666;
        }
      }
    }
  }
  .index-list__load {
    width: 100%;
    text-align: center;
    padding: 50px 0 200px;
  }
}
</style>
