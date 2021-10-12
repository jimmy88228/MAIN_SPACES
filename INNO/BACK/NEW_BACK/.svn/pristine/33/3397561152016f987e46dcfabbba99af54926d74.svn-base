<template>
	<div class="order-search-form">
		<Form ref="formSearch" :model="formSearch" inline :label-width="90">
      <FormItem :label-width="0" class="search_wrapper">
				<div class="flex f-just-between" style="width:100%;">
					<Input
						v-model="formSearch.searchq"
						style="width:400px;"
						placeholder="关键词搜索"
						clearable
						search
						enter-button
						@on-search="searchPage"
						@on-clear="searchPage"
						@keydown.native.enter.prevent>
						<Select v-model="formSearch.searchq_type" slot="prepend" style="width:120px;">
							<Option value="mobile_phone">手机号</Option>
							<Option value="consignee">买家名称</Option>
							<Option value="activity_name">活动名称</Option>
							<Option value="log_sn">订单号</Option>
						</Select>
					</Input>
					<div>
						<Button type="primary" @click="handleExport">导出</Button>
					</div>
				</div>
      </FormItem>
      <FormItem label="下单时间" class="date_wrapper">
        <date-select ref="dateSelect" @sT="handleStart" @eT="handleEnd" extra/>
      </FormItem>
    </Form>
	</div>
</template>

<script>
import DateSelect from '@/views/my-components/date-select/index.vue';

export default {
  name: 'searchForm',
  components: {
    DateSelect
  },
  data () {
    return {
      formSearch: {
        searchq_type: 'mobile_phone',
        searchq: '',
        start_time: '',
        end_time: ''
      }
    }
  },
  methods: {
    searchPage () {
    	this.$emit('on-search', this.formSearch);
    },
		handleExport(){
			this.$emit('on-export', this.formSearch);
		},
    handleStart (date) {
      this.formSearch.start_time = date;
    },
    handleEnd (date) {
      this.formSearch.end_time = date;
    },
  }
}
</script>

<style lang="less" scoped>
.order-search-form{
	.ivu-input-icon-clear{
		right:50px;
	}
  .date_wrapper{
    width: 100%;
  }
}
</style>

<style lang="less">
.order-search-form{
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
  .ivu-input-icon{
    right: 50px;
  }
  .ivu-form-item{
    width: 100%;
    margin-bottom: 10px;
    padding-right: 10px;
  }
  .ivu-form-item-label{
    text-align: left;
  }
}
</style>
