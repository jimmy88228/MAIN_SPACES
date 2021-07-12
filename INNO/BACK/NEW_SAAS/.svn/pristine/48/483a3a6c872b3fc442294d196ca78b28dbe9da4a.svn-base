<template>
    <div>
      <BatchImport ref="batchImport"></BatchImport>
    </div>
</template>

<script>
import BatchImport from './batch-import';

export default {
  components: {
    BatchImport
  },
  mounted () {
    // 批量修改库存
    this.$refs.batchImport.openModal(this.$api.goodsBatchSort, this.$api.goodsBatchSortTpl);
  }
}
</script>
