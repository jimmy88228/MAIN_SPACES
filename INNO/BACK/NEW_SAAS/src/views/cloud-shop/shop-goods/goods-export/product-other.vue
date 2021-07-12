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
    // 批量修改-其他
    this.$refs.batchImport.openModal(this.$api.ShopGoodsUpdateOther, this.$api.ShopGoodsUpdateOtherTpl);
  }
}
</script>
