<template>
  <div class="index-list" v-if="list.length">
    <div class="index-list__total">共 {{ total }} 条结果</div>
    <div class="index-list__item-container">
      <div class="index-list__item" v-for="(item, index) in list" :key="item.id">
        <div class="index-list__item-link">
          <div
            class="index-list__item-add"
            :title="!item.isStar ? '加入清单' : '取消清单'"
            @click="onStar(item, index)"
          >
            <el-icon :size="30" color="#ff9900">
              <Star v-if="!item.isStar" />
              <StarFilled v-else />
            </el-icon>
          </div>
          <el-image
            class="index-list__item-poster"
            :src="staticUrl + item.poster_path"
            fit="cover"
            :title="item.title"
            @click="linkDetail(item.id)"
          />
          <div class="index-list__item-content" :title="item.title" @click="linkDetail(item.id)">
            <div class="index-list__item-content-title">
              <div class="index-list__item-content-title-name">
                {{ item.title }}
              </div>
              <div class="index-list__item-content-title-vote">
                {{ voteAverage(item.vote_average) }}
              </div>
            </div>
            <div class="index-list__item-content-overview">{{ item.overview }}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="page < totalPages" class="index-list__load">
      <el-button type="primary" @click="onLoadMore">加载更多</el-button>
    </div>
  </div>
  <el-empty v-else description="暂无结果" />
</template>

<script setup lang="ts">
import type { SearchMovieResponseMergeResults } from '~/api/movie'
import { useToast } from '~/hooks/use-toast'
import { getTodoStorage, setTodoStorage } from '~/utils/storage-manager'

const staticUrl = ref(useRuntimeConfig().public.staticUrl)

const {
  list = [],
  total = 0,
  page = 0,
  totalPages = 0,
  isStarPage = false,
} = defineProps<{
  list?: SearchMovieResponseMergeResults[]
  total?: number
  page?: number
  totalPages?: number
  isStarPage?: boolean
}>()

const emit = defineEmits(['loadMore'])

const voteAverage = (vote?: number) => {
  if (!vote) {
    return 0
  }
  return vote.toFixed(1)
}

const onLoadMore = () => {
  if (page >= totalPages) {
    return
  }
  emit('loadMore')
}

const linkDetail = (id?: number) => {
  if (!id) return
  navigateTo(`/detail/${id}`)
}

const onStar = (item: SearchMovieResponseMergeResults, index: number) => {
  const todo = getTodoStorage()
  if (todo.some((i) => i.id === item.id)) {
    todo.splice(index, 1)
    if (isStarPage) {
      list.splice(index, 1)
    } else {
      if (list[index]) {
        list[index].isStar = false
      }
      item.isStar = false
    }
    setTodoStorage(todo)
    return
  }
  if (list[index]) {
    list[index].isStar = true
  }
  item.isStar = true
  todo.unshift(item)
  setTodoStorage(todo)
  useToast({
    message: '加入清单成功',
    type: 'success',
  })
}
</script>

<style lang="scss" scoped>
.index-list {
  padding: 0 0 100px;
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
      position: relative;
      color: #000;
      text-decoration: none;
      cursor: pointer;
      width: 100%;
      .index-list__item-add {
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 2;
        drop-shadow: 0 0 10px #000;
      }
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
