<template>
	<div class="kan-search-form">
		<Form ref="formSearch" :model="formSearch" inline :label-width="90">
      <FormItem :label-width="0" class="search_wrapper">
        <Input v-model="formSearch.searchq" style="width:400px;" placeholder="关键词搜索" clearable search enter-button
          @on-search="searchPage"
          @on-clear="searchPage"
          @keydown.native.enter.prevent ="searchPage">
          <Select v-model="formSearch.searchq_type" slot="prepend" style="width:120px">
            <Option value="name">活动名称</Option>
            <Option value="order_sn">订单号</Option>
            <Option value="phone">手机号</Option>
            <Option value="consignee">买家名称</Option>
          </Select>
        </Input>
      </FormItem>
      <FormItem label="下单时间">
        <date-select ref="dateSelect" @sT="handleStart" @eT="handleEnd" extra/>
      </FormItem>
    </Form>
	</div>
</template>

<script>
import DateSelect from '@/views/my-components/date-select/index.vue';

export default {
  props: ['statusList'],
  data () {
    return {
      formSearch: {
        searchq_type: 'name',
        searchq: '',
        start_time: '',
        end_time: ''
      }
    }
  },
  components: {
    DateSelect
  },
  methods: {
    handleStart (date) {
      this.formSearch.start_time = date;
    },
    handleEnd (date) {
      this.formSearch.end_time = date;
    },
    searchPage () {
    	this.$emit('on-search', this.formSearch);
    }
  }
}
</script>

<style lang="less">
.kan-search-form{
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
