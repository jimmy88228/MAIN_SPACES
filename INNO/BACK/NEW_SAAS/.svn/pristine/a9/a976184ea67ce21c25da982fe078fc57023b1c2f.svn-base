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
    this.$refs.batchImport.openModal(this.$api.goodsBatchImage, this.$api.goodsBatchImageTpl);
  }
}
</script>
