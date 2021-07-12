<template>
  <div class="product_upload">
    <titleBar>标准分类批量上传</titleBar>
    <BatchImport ref="batchImport2" >
    </BatchImport>
    <titleBar>自定义分类批量上传</titleBar>
    <BatchImport ref="batchImport3" >
    </BatchImport>

  </div>
</template>

<script>
import BatchImport from './batch-import';
import titleBar from '@/views/my-components/title-bar/title-bar';


export default {
  components: {
    BatchImport,
    titleBar,
  },
  data () {
    return {
      attrList: [],
      attrValue: 0,
      productParams: 0,
      params: {
        cat_id: 0
      },
      proParams: {
        cat_id: 0
      }
    }
  },
  computed: {
    // attrUpload () {
    //   return this.params.cat_id !== 0;
    // },
    // paramsUpload () {
    //   return this.proParams.cat_id !== 0;
    // }
  },
  methods: {
    loadData () {
      // return this.$ajax.post(this.$api.goodsAttrGroupList, {
      //   isInit: 1,
      //   searchq: '',
      //   page: 1,
      //   pageSize: 100
      // })
      // .then(response => {
      //   const res = response.data;
      //   if (res.code) {
      //     this.attrList = res.data && res.data.items;
      //   }
      // });
    }
  },
  mounted () {
    this.loadData();
    // 商品批量上传
    // this.$refs.batchImport.openModal(this.$api.goodsBatchImport, this.$api.goodsBatchImportTpl);
    // 标准分类批量上传
    this.$refs.batchImport2.openModal(this.$api.goodsBatchCategory, this.$api.goodsBatchCategoryTpl);
    // 自定义分类参数
    this.$refs.batchImport3.openModal(this.$api.goodsBatchVirtualCategory, this.$api.goodsBatchVirtualCategoryTpl);
  }
}
</script>

<style lang="less" scoped>
.product_upload{
  .sign{
    color: red;
  }
}
</style>
