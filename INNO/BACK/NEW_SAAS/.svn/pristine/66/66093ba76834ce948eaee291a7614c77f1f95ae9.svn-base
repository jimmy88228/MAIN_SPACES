<template>
    <div>
        <BatchImport ref="batchImport" :data="typeParams"></BatchImport>
    </div>
</template>

<script>
import BatchImport from './batch-import';

export default {
  components: {
    BatchImport
  },
  data () {
    return {
      typeParams: {
        type: 'thumbnail'
      }
    }
  },
  mounted () {
    this.$refs.batchImport.openModal(this.$api.ShopGoodsUpdateThumbnail, this.$api.ShopGoodsUpdateThumbnailTpl);
  }
}
</script>
