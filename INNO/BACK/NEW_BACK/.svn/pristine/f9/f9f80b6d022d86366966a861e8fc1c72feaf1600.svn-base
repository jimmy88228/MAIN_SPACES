<template>
    <div class="product_price">
        <BatchImport ref="batchImport" :data="typeParams" :can-upload="typeUpload">
            <template v-slot:header>
              <label>上传模式</label>
              <Select v-model="uploadType" class="basic_select select_fixed" @on-change="handleTypeChange">
                <Option value="0">增量上传</Option>
                <Option value="1">全量更新</Option>
              </Select>
            </template>
        </BatchImport>
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
      uploadType:"0",
      typeParams: {
        type: 'album',
        upload_type: 0
      }
    }
  },
  computed: {
    typeUpload () {
      return this.typeParams.upload_type !== 0;
    }
  },
  methods: {
    handleTypeChange () {
      this.typeParams.upload_type = this.uploadType;
    }
  },
  mounted () {
    this.$refs.batchImport.openModal(this.$api.ShopGoodsUpdateAlbum, this.$api.ShopGoodsUpdateAlbumTpl);
  }
}
</script>
