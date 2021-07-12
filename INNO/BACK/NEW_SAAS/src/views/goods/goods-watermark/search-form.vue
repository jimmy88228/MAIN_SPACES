<template>
  <div class="watermark-search">
    <Form ref="formSearch" :model="formSearch" :label-width="80" inline>
      <FormItem label="商品状态">
        <Select v-model="formSearch.goods_type">
          <Option :value="1">上架</Option>
          <Option :value="2">下架</Option>
        </Select>
      </FormItem>
      <FormItem label="水印状态">
        <Select v-model="formSearch.water_type">
          <Option :value="0">全部</Option>
          <Option :value="1">有水印</Option>
          <Option :value="2">无水印</Option>
        </Select>
      </FormItem>
      <FormItem class="watermark-search_inner">
        <Input
          class="watermark-search_input"
          v-model="formSearch.searchq"
          placeholder="关键词搜索"
          clearable
          search
          enter-button
          @on-search="searchPage"
          @on-clear="searchPage"
          @keydown.native.enter.prevent="searchPage">
          <Select v-model="formSearch.type" slot="prepend" class="watermark-search_select">
            <Option :value="1">商品名称</Option>
            <Option :value="2">商品货号</Option>
          </Select>
        </Input>
      </FormItem>
    </Form>
  </div>
</template>
<script>
export default {
  data () {
    return {
      formSearch: {
        searchq: '',
        type: 1,
        goods_type: 1,
        water_type: 0
      }
    }
  },
  methods: {
    clearOptions () {
      this.formSearch = {
        searchq: '',
        type: 1,
        goods_type: 1,
        water_type: 0
      };
    },
    searchPage () {
      this.$emit('on-search', this.formSearch);
    }
  }
}
</script>
<style lang="less">
.watermark-search{
  .watermark-search_inner{
    margin-left: -60px;
    .watermark-search_input{
      width:320px;
      .watermark-search_select{
          width: 100px;
      }
    }
  }
  .ivu-input-icon{
    right: 50px;
  }
}
</style>
