<template>
  <div class="star-lottery">
    <div class="star-lottery__header">
      <h2>影片九宫格抽奖</h2>
      <div v-if="selectedMovie" class="star-lottery__selected-movie">
        <el-image
          :src="staticUrl + (selectedMovie.poster_path || '')"
          fit="cover"
          class="star-lottery__selected-poster"
        />
        <div class="star-lottery__selected-info">
          <h3>{{ selectedMovie.title || '未知影片' }}</h3>
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
        {{ isSpinning ? '抽奖中...' : '开始抽奖' }}
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

// 修复useRuntimeConfig的使用方式
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
  // 填充九宫格数据，如果影片不够则循环使用
  for (let i = 0; i < 9; i++) {
    const movieIndex = i % movies.length
    const movie = movies[movieIndex]
    items.push(movie || null)
  }
  return items
})

// 找出所有有影片的索引
const availableIndexes = computed(() => {
  return gridItems.value
    .map((item, index) => (item ? index : -1))
    .filter((index): index is number => index !== -1)
})

// 格式化评分
const voteAverage = (vote?: number) => {
  if (!vote) return 0
  return vote.toFixed(1)
}

// 开始抽奖
const startLottery = () => {
  if (isSpinning.value || availableIndexes.value.length === 0) return

  isSpinning.value = true
  selectedMovie.value = null

  // 随机选择一个目标索引
  const randomIndex = Math.floor(Math.random() * availableIndexes.value.length)
  const targetIndex = availableIndexes.value[randomIndex] || 0

  // 设置动画参数
  const duration = 3000 // 总时长 ms
  const quickSpinRounds = 3 // 快速旋转的圈数
  const slowDownSteps = 18 // 减速到停止的步数

  // 计算总步数
  const quickSpinSteps = quickSpinRounds * 9
  const totalSteps = quickSpinSteps + slowDownSteps
  let currentStep = 0
  let baseDelay = (duration / totalSteps) * 0.8 // 基础延迟时间

  // 计算快速旋转结束时的位置
  const quickSpinEndIndex = quickSpinSteps % 9

  // 构建完整的动画路径
  // 快速旋转阶段路径 - 简单的从0到8循环
  const quickSpinPath: number[] = []
  for (let i = 0; i < quickSpinSteps; i++) {
    quickSpinPath.push(i % 9)
  }

  // 减速阶段路径 - 确保按顺序自然旋转到目标位置
  const slowDownPath: number[] = []

  // 计算从快速旋转结束位置到目标位置需要经过的完整路径
  // 确保路径足够长，并且最后一个位置是目标位置
  let currentPos = quickSpinEndIndex
  let positionsAdded = 0

  // 构建减速路径，确保每个位置都按顺序经过
  while (positionsAdded < slowDownSteps) {
    // 移动到下一个位置（顺时针）
    currentPos = (currentPos + 1) % 9
    slowDownPath.push(currentPos)
    positionsAdded++

    // 如果已经到达目标位置但还没填满减速步数，继续旋转一圈
    if (currentPos === targetIndex && positionsAdded < slowDownSteps) {
      // 再转一圈，然后在最后一个位置再设为目标位置
      const remainingSteps = slowDownSteps - positionsAdded
      for (let i = 0; i < remainingSteps - 1; i++) {
        currentPos = (currentPos + 1) % 9
        slowDownPath.push(currentPos)
        positionsAdded++
      }
      // 最后一步设为目标位置
      slowDownPath.push(targetIndex)
      positionsAdded++
    }
  }

  // 确保最后一步确实是目标位置
  if (slowDownPath.length > 0) {
    slowDownPath[slowDownPath.length - 1] = targetIndex
  }

  // 执行动画
  const animate = () => {
    if (currentStep < totalSteps) {
      let gridIndex: number = 0

      // 快速旋转阶段 - 使用快速旋转路径
      if (currentStep < quickSpinSteps) {
        gridIndex = quickSpinPath[currentStep] || 0
      } else {
        // 减速阶段 - 使用减速路径
        const slowStepIndex = currentStep - quickSpinSteps
        gridIndex = slowDownPath[slowStepIndex] || 0
      }

      activeIndex.value = gridIndex

      // 增加当前步数
      currentStep++

      // 计算下一步的延迟时间（逐渐减慢）
      let nextDelay = baseDelay

      // 减速阶段开始减慢速度
      if (currentStep > quickSpinSteps) {
        const slowProgress = (currentStep - quickSpinSteps) / slowDownSteps
        // 逐渐增加延迟，最后一步延迟最大
        nextDelay = baseDelay * (1 + slowProgress * 4)
      }

      // 设置下一步动画
      setTimeout(animate, nextDelay)
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

// 重置抽奖
const resetLottery = () => {
  activeIndex.value = -1
  selectedMovie.value = null
}
</script>

<style lang="scss" scoped>
.star-lottery {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;

  &__header {
    text-align: center;
    margin-bottom: 30px;

    h2 {
      font-size: 28px;
      margin-bottom: 20px;
    }
  }

  &__selected-movie {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    padding: 20px;
    background: #f5f7fa;
    border-radius: 12px;
    margin-top: 20px;
  }

  &__selected-poster {
    width: 80px;
    height: 120px;
    border-radius: 8px;
  }

  &__selected-info {
    text-align: left;

    h3 {
      margin: 0 0 10px 0;
      font-size: 20px;
    }

    &-rating {
      color: #ff9900;
      font-weight: bold;
    }
  }

  &__grid-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 30px;
  }

  &__grid-item {
    aspect-ratio: 1;
    border: 2px solid #e4e7ed;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px;
    position: relative;
    transition: all 0.2s ease;
    background: white;

    &--active {
      border-color: #ff9900;
      background: #fff7e6;
      box-shadow: 0 0 20px rgba(255, 153, 0, 0.3);
      transform: scale(1.05);
    }
  }

  &__grid-poster {
    width: 80%;
    height: 70%;
    border-radius: 4px;
  }

  &__grid-title {
    width: 100%;
    text-align: center;
    font-size: 12px;
    margin-top: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__grid-empty {
    color: #909399;
    font-size: 14px;
  }

  &__controls {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 20px;
  }

  &__empty {
    margin-top: 50px;
  }
}
</style>
