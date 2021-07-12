<template>
    <div class="product_sale">
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
    // 商品批量上架
    this.$refs.batchImport.openModal(this.$api.goodsUpperShelf, this.$api.goodsUpperShelfTpl);
  }
}
</script>

<style lang="less" scoped>
.product_sale{

}
</style>
