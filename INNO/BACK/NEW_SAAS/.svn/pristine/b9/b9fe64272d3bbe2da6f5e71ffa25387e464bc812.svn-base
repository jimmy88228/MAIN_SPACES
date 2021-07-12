<template>
  <div class="goods-package-search">
    <Form ref="formSearch" :model="formSearch" inline>
      <FormItem :label-width="80" label="商品类型">
        <Select v-model="formSearch.type">
          <Option :value="0">全部</Option>
          <Option :value="1">主商品</Option>
          <Option :value="2">子商品</Option>
        </Select>
      </FormItem>
      <FormItem>
        <Input
            class="brand-search_input"
            v-model="formSearch.searchq"
            placeholder="请输入商品名称/商品款号"
            clearable
            search
            enter-button
            @on-search="searchPage"
            @on-clear="searchPage"
            @keydown.native.enter.prevent="searchPage">
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
        type: 0
      }
    }
  },
  methods: {
    searchPage () {
      this.$emit('on-search', this.formSearch);
    }
  }
}
</script>

<style lang="less">
.goods-package-search{
    .brand-search_input{
        width:240px;
    }
    .ivu-input-icon{
        right: 50px;
    }
}
</style>
