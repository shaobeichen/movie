<template>
  <div class="index-search">
    <el-input v-model="input" size="large" placeholder="请输入电影名称" @keyup.enter="onSearch">
      <template #append>
        <el-button :icon="Search" @click="onSearch" />
      </template>
    </el-input>
    <el-icon
      :size="30"
      color="#ff9900"
      title="待看清单"
      class="index-search__icon"
      @click="linkStar"
    >
      <CollectionTag />
    </el-icon>
  </div>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { useToast } from '~/hooks/use-toast'

const input = defineModel({ type: String })

const emit = defineEmits(['search'])

const onSearch = () => {
  if (!input.value) {
    useToast({
      message: '请输入电影名称',
      type: 'warning',
    })
    return
  }
  emit('search', input.value)
}

const linkStar = () => {
  navigateTo('/star')
}
</script>

<style lang="scss" scoped>
.index-search {
  display: flex;
  align-items: center;
  .index-search__icon {
    margin-left: 20px;
    cursor: pointer;
  }
}
</style>
