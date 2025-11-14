<template>
  <div class="star-lottery">
    <div class="star-lottery__header">
      <div v-if="selectedMovie" class="star-lottery__selected-movie">
        <el-image
          :src="staticUrl + (selectedMovie.poster_path || '')"
          fit="cover"
          class="star-lottery__selected-poster"
        />
        <div class="star-lottery__selected-info">
          <div class="star-lottery__selected-title">{{ selectedMovie.title || '未知影片' }}</div>
          <div class="star-lottery__selected-rating">
            评分: {{ voteAverage(selectedMovie.vote_average || 0) }}
          </div>
        </div>
      </div>
    </div>

    <div class="star-lottery__grid-container">
      <div
        v-for="(item, index) in gridItems"
        :key="index"
        class="star-lottery__grid-item"
        :class="{ 'star-lottery__grid-item--active': activeIndex === index }"
      >
        <!-- 格子显示影片 -->
        <template v-if="item">
          <el-image
            :src="staticUrl + (item.poster_path || '')"
            fit="cover"
            class="star-lottery__grid-poster"
          />
          <div class="star-lottery__grid-title">{{ item.title || '未知影片' }}</div>
        </template>
        <template v-else>
          <div class="star-lottery__grid-empty">暂无影片</div>
        </template>
      </div>
    </div>

    <div class="star-lottery__controls">
      <el-button
        type="primary"
        size="large"
        :disabled="isSpinning || availableIndexes.length === 0"
        @click="startLottery"
      >
        {{ isSpinning ? '抽取中...' : '开始抽取' }}
      </el-button>
      <el-button
        size="large"
        :disabled="isSpinning || (!selectedMovie && activeIndex === -1)"
        @click="resetLottery"
      >
        重置
      </el-button>
    </div>

    <div v-if="!movies.length" class="star-lottery__empty">
      <el-empty description="暂无收藏影片" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { SearchMovieResponseMergeResults } from '~/api/movie'

const runtimeConfig = useRuntimeConfig()
const staticUrl = ref(runtimeConfig.public.staticUrl)

const { movies = [] } = defineProps<{
  movies?: SearchMovieResponseMergeResults[]
}>()

const isSpinning = ref(false)
const activeIndex = ref(-1)
const selectedMovie = ref<SearchMovieResponseMergeResults | null>(null)

// 九宫格数据 - 从左到右，从上到下
const gridItems = computed(() => {
  const items: (SearchMovieResponseMergeResults | null)[] = []
  // 填充九宫格数据，每次都是随机一部影片，不可重复
  // 如果影片不够则随机可填充重复的
  // 先搞个随机数数组，9个不可重复，如果影片不够9个，随机填充重复的
  // 举例，影片只有6个，索引数组里面先包含0 1 2 3 4 5，然后还有3个随机数，可能是0 1 2 3 4 5中的任意一个，但不能是0 0 1，不能再次重复了
  const availableIndexes = Array.from({ length: movies.length }, (_, i) => i)
  const originAvailableIndexes = [...availableIndexes]
  const randomIndexes: number[] = []
  for (let i = 0; i < 9; i++) {
    const indexes = availableIndexes.length ? availableIndexes : originAvailableIndexes
    const randomIndex = Math.floor(Math.random() * indexes.length)
    const item = indexes[randomIndex]
    randomIndexes.push(item!)
    availableIndexes.length
      ? availableIndexes.splice(randomIndex, 1)
      : originAvailableIndexes.splice(randomIndex, 1)
  }
  randomIndexes.forEach((index) => {
    items.push(movies[index] || null)
  })
  return items
})

// 找出所有有影片的索引
const availableIndexes = computed(() => {
  return gridItems.value.map((item, index) => (item ? index : -1)).filter((index) => index !== -1)
})

// 格式化评分
const voteAverage = (vote?: number) => {
  if (!vote) return 0
  return vote.toFixed(1)
}

// 开始抽取
const startLottery = () => {
  if (isSpinning.value || availableIndexes.value.length === 0) return

  isSpinning.value = true
  selectedMovie.value = null

  // 随机选择一个目标索引
  const randomIndex = Math.floor(Math.random() * availableIndexes.value.length)
  const targetIndex = availableIndexes.value[randomIndex] || 0

  // 设置动画参数
  const duration = 5000 // 总时长 ms
  const quickSpinRounds = 2 // 快速旋转的圈数
  const quickSpinSteps = quickSpinRounds * 9 // 计算总步数
  const totalSteps = quickSpinSteps + targetIndex
  let currentStep = 0
  let baseDelay = (duration / totalSteps) * 0.8 // 基础延迟时间

  // 构建完整的动画路径
  // 快速旋转阶段路径 - 简单的从0到8循环
  const quickSpinPath: number[] = []
  for (let i = 0; i < totalSteps; i++) {
    quickSpinPath.push(i % 9)
  }

  // 执行动画
  const animate = () => {
    if (currentStep < totalSteps) {
      let gridIndex: number = 0
      gridIndex = quickSpinPath[currentStep] || 0
      activeIndex.value = gridIndex

      // 增加当前步数
      currentStep++

      setTimeout(animate, baseDelay)
    } else {
      // 确保最终停在目标位置
      activeIndex.value = targetIndex
      isSpinning.value = false

      // 显示选中的影片
      const targetMovie = gridItems.value[targetIndex]
      if (targetMovie) {
        selectedMovie.value = targetMovie
      }
    }
  }

  // 开始动画
  animate()
}

// 重置抽取
const resetLottery = () => {
  activeIndex.value = -1
  selectedMovie.value = null
}
</script>

<style lang="scss" scoped>
.star-lottery {
  max-width: 600px;
  margin: 0 auto;

  .star-lottery__selected-movie {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    padding: 20px;
    background: #f5f7fa;
    border-radius: 12px;
    margin: 20px 0;
  }

  .star-lottery__selected-poster {
    width: 50%;
    border-radius: 8px;
    aspect-ratio: 1 / 1.7;
    max-width: 100px;
    min-width: 50px;
  }

  .star-lottery__selected-info {
    text-align: left;

    .star-lottery__selected-title {
      margin: 0 0 10px 0;
      font-size: 20px;
      @media screen and (max-width: 500px) {
        font-size: 14px;
      }
    }

    .star-lottery__selected-info-rating {
      color: #ff9900;
      font-weight: bold;
    }
  }

  .star-lottery__grid-container {
    display: flex;
    margin-bottom: 30px;
    flex-wrap: wrap;
    gap: 5px;
    justify-content: center;
  }

  .star-lottery__grid-item {
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: all 0.2s ease;
    background: white;
    width: 30%;
    aspect-ratio: 1;
    &.star-lottery__grid-item--active {
      border-color: #ff9900;
      background: #fff7e6;
      box-shadow: 0 0 20px rgba(255, 153, 0, 0.3);
    }
  }

  .star-lottery__grid-poster {
    width: 50%;
    height: 80%;
    border-radius: 4px;
  }

  .star-lottery__grid-title {
    width: 100%;
    text-align: center;
    font-size: 12px;
    margin-top: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .star-lottery__grid-empty {
    color: #909399;
    font-size: 14px;
  }

  .star-lottery__controls {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 20px;
  }

  .star-lottery__empty {
    margin-top: 50px;
  }
}
</style>
