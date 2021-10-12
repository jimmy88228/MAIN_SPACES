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
    // 批量导入-关联关系
    this.$refs.batchImport.openModal(this.$api.ShopGoodsUpdateRelate, this.$api.ShopGoodsUpdateRelateTpl);
  }
}
</script>
