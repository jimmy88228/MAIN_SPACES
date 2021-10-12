<template>
	<div class="refund-search-form">
		<Form ref="formSearch" :model="formSearch" inline :label-width="90">
      <FormItem :label-width="0" class="search_wrapper">
        <Input v-model="formSearch.keywords" style="width:400px;" placeholder="关键词搜索" clearable search enter-button
          @on-search="searchPage"
          @on-clear="searchPage"
          @keydown.native.enter.prevent ="searchPage">
          <Select v-model="formSearch.search_type" slot="prepend" style="width:140px">
            <Option value="related_order_sn">关联订单号</Option>
            <Option value="return_sn">退货单号</Option>
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
        search_type: 'related_order_sn',
        keywords: ''
      }
    }
  },
  methods: {
    clearCondition () {
      this.formSearch = {
        search_type: 'related_order_sn',
        keywords: ''
      };
    },
    searchPage () {
    	this.$emit('on-search', this.formSearch);
    }
  }
}
</script>

<style lang="less">
.refund-search-form{
  .ivu-input-icon-clear{
    right:50px;
  }
  .ivu-form-item{
    width: 100%;
    margin-bottom: 10px;
    padding-right: 10px;
  }
  .search_wrapper{
    .ivu-form-item-content{
      display: flex;
      align-items: center;
    }
    .search_btn{
      display: inline-block;
      margin-left: 10px;
    }
  }
}
</style>
