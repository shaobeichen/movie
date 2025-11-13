<template>
  <div class="index-list" v-if="list.length">
    <div class="index-list__header">
      <div class="index-list__total">共 {{ total }} 条结果</div>
      <el-select
        v-model="value"
        placeholder="选择排序"
        style="width: 188px"
        @change="onFilterChange"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>

    <div class="index-list__item-container">
      <el-row :gutter="20" style="width: 100%; margin: 0 auto">
        <el-col
          :xs="12"
          :sm="8"
          :md="8"
          :lg="8"
          :xl="8"
          v-for="(item, index) in list"
          :key="item.id"
        >
          <div class="index-list__item">
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
              <div
                class="index-list__item-content"
                :title="item.title"
                @click="linkDetail(item.id)"
              >
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
        </el-col>
      </el-row>
    </div>
  </div>
  <el-empty v-else description="暂无结果" />
  <div ref="loadMoreRef" class="index-list__load"></div>
</template>

<script setup lang="ts">
import type { SearchMovieResponseMergeResults } from '~/api/movie'
import { useIntersectionObserver } from '~/hooks/use-intersecion-observer'
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

const emit = defineEmits(['loadMore', 'filterChange'])

const loadMoreRef = ref<HTMLDivElement>()
const value = ref('timeDesc')
const options = [
  {
    value: 'timeDesc',
    label: '按添加时间降序',
  },
  {
    value: 'timeAsc',
    label: '按添加时间升序',
  },
]

useIntersectionObserver({
  element: loadMoreRef,
  callback: () => onLoadMore(),
})

const onFilterChange = (val: string) => {
  const list = getTodoStorage()
  let _list = []
  if (val === 'timeDesc') {
    _list = list.sort((a, b) => (b?.id || 0) - (a?.id || 0))
  } else {
    _list = list.sort((a, b) => (a?.id || 0) - (b?.id || 0))
  }
  setTodoStorage(_list)
  emit('filterChange')
}

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
  .index-list__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .index-list__item-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: flex-start;
  }
  .index-list__item {
    width: 100%;
    margin-bottom: 20px;
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
}
.index-list__load {
  width: 100%;
  text-align: center;
  padding: 10px 0;
}
</style>
