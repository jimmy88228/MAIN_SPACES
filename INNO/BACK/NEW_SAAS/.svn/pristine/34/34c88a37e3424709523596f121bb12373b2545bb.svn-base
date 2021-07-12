<template>
  <div class="goods-coupons-activity-search">
    <Form ref="formSearch" :model="formSearch" inline>
      <!--<FormItem label="状态" :label-width="40">
        <Select v-model="formSearch.status">
          <Option :value="-1">全部</Option>
          <Option :value="1">上架</Option>
          <Option :value="0">下架</Option>
        </Select>
      </FormItem>-->
      <FormItem>
        <Input
            class="brand-search_input"
            v-model="formSearch.searchq"
            placeholder="请输入商品名称,货号"
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
        status: -1
      }
    }
  },
  methods: {
    searchPage () {
      this.$emit('on-search', this.formSearch);
    },
    clearOptions () {
      this.formSearch = {
        searchq: ''
      };
    }
  }
}
</script>

<style lang="less">
.goods-coupons-activity-search{
    .brand-search_input{
        width:220px;
    }
    .ivu-input-icon{
        right: 50px;
    }
}
</style>
