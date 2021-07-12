<template>
    <div class="product_stock">
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
    this.$refs.batchImport.openModal(this.$api.goodsBatchGift, this.$api.goodsBatchGiftTpl);
  }
}
</script>

<style lang="less" scoped>
.product_stock{

}
</style>
