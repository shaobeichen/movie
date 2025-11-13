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
            {{ movieDetail.genres?.map((v) => v.name).join('/') }}
          </div>
        </div>
        <div class="detail-top-info__item">
          <div class="detail-top-info__item-label">国家：</div>
          <div class="detail-top-info__item-value">
            {{ movieDetail.production_countries?.map((v) => v.name).join('/') }}
          </div>
        </div>
        <div class="detail-top-info__item">
          <div class="detail-top-info__item-label">语言：</div>
          <div class="detail-top-info__item-value">
            {{ movieDetail.spoken_languages?.map((v) => v.name).join('/') }}
          </div>
        </div>
        <div class="detail-top-info__item">
          <div class="detail-top-info__item-label">上映时间：</div>
          <div class="detail-top-info__item-value">{{ movieDetail.release_date }}</div>
        </div>
        <div class="detail-top-info__item">
          <div class="detail-top-info__item-label">票房：</div>
          <div class="detail-top-info__item-value">{{ movieDetail.revenue }}</div>
        </div>
        <div class="detail-top-info__item">
          <div class="detail-top-info__item-label">片长：</div>
          <div class="detail-top-info__item-value">{{ movieDetail.runtime }}分钟</div>
        </div>
        <div class="detail-top-info__item">
          <div class="detail-top-info__item-label">IMDb：</div>
          <div class="detail-top-info__item-value">{{ movieDetail.imdb_id }}</div>
        </div>
        <div class="detail-top-info__item">
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
        <div class="detail-top-rating__score">{{ movieDetail.vote_average }}</div>
        <div class="detail-top-rating__count">{{ movieDetail.vote_count }}人评价</div>
      </div>
    </div>
    <div class="detail-overview">
      <div class="detail-overview__title">剧情简介 · · · · · ·</div>
      <div class="detail-overview__content" v-html="movieDetail.overview"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getMovieDetail, type GetMovieDetailResponse } from '~/api/movie'
import { useLoading } from '~/hooks/use-loading'
import { useSafeCall } from '~/hooks/use-safecall'
import { useToast } from '~/hooks/use-toast'

const route = useRoute()
const movieId = route.params.id
const movieDetail = ref<GetMovieDetailResponse>({})
const staticUrl = useRuntimeConfig().public.staticUrl

const { openLoading, closeLoading } = useLoading()
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
</script>

<style lang="scss" scoped>
.detail {
  padding: 0 0 100px;
  .detail-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
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
}
</style>
