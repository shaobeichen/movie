<template>
  <el-input v-model="input" placeholder="请输入电影名称" @keyup.enter="onSearch">
    <template #append>
      <el-button :icon="Search" @click="onSearch" />
    </template>
  </el-input>
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
</script>
