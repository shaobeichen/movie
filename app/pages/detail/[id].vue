<template>
  <div class="detail">
    <h1 class="detail-title">{{ movieDetail.title }}</h1>
    <div class="detail-top">
      <img
        class="detail-poster"
        :src="staticUrl + movieDetail.poster_path"
        :alt="movieDetail.title"
        :title="movieDetail.title"
      />
      <div class="detail-top-info">
        <div class="detail-top-info__item">
          <div class="detail-top-info__item-label">类型：</div>
          <div class="detail-top-info__item-value">
            {{ movieDetail.genres?.map((v) => v.name).join('/') || '暂无类型' }}
          </div>
        </div>
        <div class="detail-top-info__item">
          <div class="detail-top-info__item-label">国家：</div>
          <div class="detail-top-info__item-value">
            {{ movieDetail.production_countries?.map((v) => v.name).join('/') || '暂无国家' }}
          </div>
        </div>
        <div class="detail-top-info__item">
          <div class="detail-top-info__item-label">语言：</div>
          <div class="detail-top-info__item-value">
            {{ movieDetail.spoken_languages?.map((v) => v.name).join('/') || '暂无语言' }}
          </div>
        </div>
        <div class="detail-top-info__item">
          <div class="detail-top-info__item-label">上映时间：</div>
          <div class="detail-top-info__item-value">
            {{ movieDetail.release_date || '暂无上映时间' }}
          </div>
        </div>
        <div class="detail-top-info__item">
          <div class="detail-top-info__item-label">票房：</div>
          <div class="detail-top-info__item-value">{{ movieDetail.revenue || '暂无票房' }}</div>
        </div>
        <div class="detail-top-info__item">
          <div class="detail-top-info__item-label">片长：</div>
          <div class="detail-top-info__item-value">{{ movieDetail.runtime }}分钟</div>
        </div>
        <div class="detail-top-info__item">
          <div class="detail-top-info__item-label">IMDb：</div>
          <div class="detail-top-info__item-value">{{ movieDetail.imdb_id || '暂无IMDb' }}</div>
        </div>
        <div class="detail-top-info__item" v-if="movieDetail.homepage">
          <div class="detail-top-info__item-label">主页：</div>
          <NuxtLink
            class="detail-top-info__item-value detail-top-info__item-value--link"
            :to="movieDetail.homepage"
            target="_blank"
            >{{ movieDetail.homepage }}</NuxtLink
          >
        </div>
      </div>
      <div class="detail-top-rating">
        <div class="detail-top-rating__title">评分</div>
        <div class="detail-top-rating__score">{{ movieDetail.vote_average || 0 }}</div>
        <div class="detail-top-rating__count">{{ movieDetail.vote_count || 0 }}人评价</div>
      </div>
    </div>
    <div class="detail-overview" v-if="movieDetail.overview">
      <div class="detail-overview__title">剧情简介 · · · · · ·</div>
      <div class="detail-overview__content" v-html="movieDetail.overview"></div>
    </div>
    <div class="detail-reviews" v-if="movieReviews?.results?.length">
      <div class="detail-reviews__title">用户评论 · · · · · ·</div>
      <div class="detail-reviews__list">
        <div
          v-for="item in movieReviews?.results || []"
          :key="item.id"
          class="detail-reviews__item"
        >
          <div class="detail-reviews__info">
            <div class="detail-reviews__author">{{ item.author }}</div>
            <div class="detail-reviews__time">{{ formatTime(item.created_at) }}</div>
          </div>
          <div class="detail-reviews__content" v-html="item.content"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  getMovieDetail,
  getMovieReviews,
  type GetMovieDetailResponse,
  type GetMovieReviewsResponse,
} from '~/api/movie'
import { useLoading } from '~/hooks/use-loading'
import { useSafeCall } from '~/hooks/use-safecall'
import { useToast } from '~/hooks/use-toast'
import { formatTime } from '~/utils/format-time'

const route = useRoute()
const movieId = route.params.id
const movieDetail = ref<GetMovieDetailResponse>({})
const movieReviews = ref<GetMovieReviewsResponse>({})
const staticUrl = useRuntimeConfig().public.staticUrl

const { openLoading, closeLoading } = useLoading()

const init = async () => {
  openLoading()
  const data = await useSafeCall(() => getMovieDetail(Number(movieId)), {})
  if (!data) {
    useToast({
      message: '请求失败，请稍后再试',
      type: 'error',
    })
    closeLoading()
  } else {
    movieDetail.value = data
  }
  closeLoading()
}

const getReviews = async () => {
  const data = await useSafeCall(() => getMovieReviews(Number(movieId)), {})
  if (!data) {
    useToast({
      message: '请求失败，请稍后再试',
      type: 'error',
    })
    closeLoading()
  } else {
    movieReviews.value = data
  }
  closeLoading()
}

init()

onMounted(() => {
  getReviews()
})
</script>

<style lang="scss" scoped>
.detail {
  padding: 0 0 100px;
  .detail-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
    min-height: 34px;
  }
  .detail-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    .detail-poster {
      width: 200px;
      height: 300px;
      object-fit: cover;
      margin-right: 20px;
      background-color: #ececec;
    }
    .detail-top-info {
      flex: 1;
      .detail-top-info__item {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        padding-bottom: 5px;
        .detail-top-info__item-label {
          font-size: 14px;
          margin-right: 5px;
          color: #7d7d7d;
          flex-shrink: 0;
        }
        .detail-top-info__item-value {
          font-size: 14px;
          color: #000;
        }
        .detail-top-info__item-value--link {
          color: #2665c4;
          text-decoration: none;
        }
      }
    }
    .detail-top-rating {
      flex-shrink: 0;
      .detail-top-rating__title {
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 5px;
        color: #7d7d7d;
      }
      .detail-top-rating__score {
        font-size: 30px;
        font-weight: bold;
        margin-bottom: 5px;
        color: #ff8800;
      }
      .detail-top-rating__count {
        font-size: 14px;
        color: #7d7d7d;
      }
    }
  }
  .detail-overview {
    padding-top: 50px;
    .detail-overview__title {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .detail-overview__content {
      font-size: 14px;
      line-height: 24px;
    }
  }
  .detail-reviews {
    padding-top: 50px;
    .detail-reviews__title {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .detail-reviews__list {
      .detail-reviews__item {
        margin-bottom: 20px;
        .detail-reviews__info {
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .detail-reviews__author {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 5px;
          color: #ff8800;
        }
        .detail-reviews__time {
          font-size: 14px;
          color: #7d7d7d;
          margin-bottom: 5px;
        }
        .detail-reviews__content {
          font-size: 14px;
          line-height: 24px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
    }
  }
}
</style>
