<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  total: {
    required: true,
    type: Number
  },
  page: {
    type: Number,
    default: 1
  },
  limit: {
    type: Number,
    default: 10
  },
  pageSizes: {
    type: Array,
    default() {
      return ['10', '20', '30', '50']
    }
  }
})

const emit = defineEmits(['pagination', 'update:page', 'update:limit'])

const currentPage = computed({
  get() {
    return props.page
  },
  set(val) {
    emit('update:page', val)
  }
})
const pageSize = computed({
  get() {
    return props.limit
  },
  set(val) {
    emit('update:limit', val)
  }
})
const handleSizeChange = (current: any, pageSize: any) => {
  if (currentPage.value * pageSize > props.total) {
    currentPage.value = 1
  }
  emit('pagination', {page: current, limit: pageSize})
}
</script>

<template>
  <div class="pagination_page">
    <a-pagination
      v-show="total > 0"
      v-model:current="currentPage"
      v-model:pageSize="pageSize"
      :total="total"
      show-size-changer
      :page-size-options="pageSizes"
      @change="handleSizeChange"
    />
  </div>
</template>

<style lang="scss" scoped>
.pagination_page {
  margin-top: 10px;
  float: right;
}
</style>
