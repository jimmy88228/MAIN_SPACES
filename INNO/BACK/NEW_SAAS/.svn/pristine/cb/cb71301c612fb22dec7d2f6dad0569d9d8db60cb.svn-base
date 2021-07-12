<template>
  <div class="product_upload">
    <titleBar>商品批量上传</titleBar>
    <BatchImport ref="batchImport">
      <template v-slot:footer>
        <span class="sign">备注： 建议上传数量不超过1000条数据</span>
      </template>
    </BatchImport>
    <titleBar>商品属性批量上传</titleBar>
    <BatchImport ref="batchImport2" :data="params" :can-upload="attrUpload">
      <template v-slot:header>
        <label>属性分类</label>
        <Select v-model="attrValue" class="basic_select select_fixed" @on-change="handleAttrChange">
          <Option v-for="item in attrList" :value="item.cat_id" :key="item.cat_id">{{ item.cat_name }}</Option>
        </Select>
      </template>
    </BatchImport>
    <titleBar>商品参数批量上传</titleBar>
    <BatchImport ref="batchImport3" :data="proParams" :can-upload="paramsUpload">
      <template v-slot:header>
        <label>商品参数</label>
        <Select v-model="productParams" class="basic_select select_fixed" @on-change="handleParamsChange">
          <Option v-for="item in attrList" :value="item.cat_id" :key="item.cat_id">{{ item.cat_name }}</Option>
        </Select>
      </template>
    </BatchImport>
  </div>
</template>

<script>
import BatchImport from './batch-import';
import titleBar from '@/views/my-components/title-bar/title-bar';

export default {
  components: {
    BatchImport,
    titleBar
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
    attrUpload () {
      return this.params.cat_id !== 0;
    },
    paramsUpload () {
      return this.proParams.cat_id !== 0;
    }
  },
  methods: {
    loadData () {
      return this.$ajax.post(this.$api.ShopGoodsAttrGroupList, {
        isInit: 1,
        searchq: '',
        page: 1,
        pageSize: 100
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.attrList = res.data && res.data.items;
          this.attrValue= this.attrList[0].cat_id;
          this.params.cat_id = this.attrValue;
          this.productParams= this.attrList[0].cat_id;
          this.proParams.cat_id = this.productParams;
        }
      });
    },
    handleAttrChange () {
      this.params.cat_id = this.attrValue;
    },
    handleParamsChange () {
      this.proParams.cat_id = this.productParams;
    }
  },
  mounted () {
    this.loadData();
    // 商品批量上传
    this.$refs.batchImport.openModal(this.$api.ShopGoodsBatchImport, this.$api.ShopGoodsBatchImportTpl);
    // 商品属性批量上传
    this.$refs.batchImport2.openModal(this.$api.ShopGoodsAttribute, this.$api.ShopGoodsAttributeTpl);
    // 商品参数
    this.$refs.batchImport3.openModal(this.$api.ShopGoodsParamAttr, this.$api.ShopGoodsParamAttrTpl);
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
