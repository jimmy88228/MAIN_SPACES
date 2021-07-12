<template>
	<div class="refund-search-form">
		<Form ref="formSearch" :model="formSearch" inline :label-width="90">
			<FormItem :label-width="0" class="search_wrapper">
				<Input v-model="formSearch.keywords" style="width:400px;" placeholder="关键词搜索" clearable search enter-button
				 @on-search="searchPage" @on-clear="searchPage" @keydown.native.enter.prevent="searchPage">
				<Select v-model="formSearch.search_type" slot="prepend" style="width:120px">
					<Option value="refund_sn">退款号</Option>
					<Option value="related_order_sn">关联订单号</Option>
				</Select>
				</Input>
				<a @click="showExtra" class="search_btn">{{isShowExtra ? '普通搜索' : '高级搜索'}}</a>
			</FormItem>
			<transition name="fade">
				<div v-show="isShowExtra">
					<FormItem label="下单时间">
						<date-select ref="dateSelect" @sT="handleStart" @eT="handleEnd" extra />
					</FormItem>
					<FormItem label="所属店铺">
						<store-select :data="storeData" type="radio" @del-tag="handleTag">
							<Button type="dashed" @click="handleSelect" class="basic_select">选择所属店铺</Button>
						</store-select>
					</FormItem>
				
					<Row>
						<Col span="20">
						<div style="margin-bottom: 10px;text-align: center;">
							<Button @click="clearCondition">重置</Button>
							<Button type="primary" @click="searchPage">搜索</Button>
							<a @click="showExtra" class="search_btn" style="margin-left:10px">
								<Icon type="ios-arrow-up" /> 收起选项</a>
						</div>
						</Col>
					</Row>
				</div>
			</transition>
		</Form>
	</div>
</template>

<script>
import StoreSelect from '@/views/my-components/list-component/index-edit';
import DateSelect from '@/views/my-components/date-select/index.vue';

export default {
  props: ['statusList'],
  data () {
    return {
      formSearch: {
        search_type: 'refund_sn',
        keywords: '',
        startTime: '',
        endTime: '',
        add_time: [],
        store_id: 0,
        confirm_status: 0
      },
	isShowExtra: false,
      storeData: []
    }
  },
  components: {
    StoreSelect,
    DateSelect
  },
  methods: {
    clearCondition () {
      this.formSearch = {
        search_type: 'refund_sn',
        keywords: '',
        startTime: '',
        endTime: '',
        add_time: [],
        store_id: 0,
        confirm_status: 0
      };
      this.$refs.dateSelect.reset();
      this.storeData = [];
    },
    handleStart (date) {
      this.formSearch.startTime = date;
      this.formSearch.add_time[0] = date;
    },
    handleEnd (date) {
      this.formSearch.endTime = date;
      this.formSearch.add_time[1] = date;
    },
    handleSelect () {
      this.$selectContent({
        mode: 'store',
        type: 'radio',
        data: this.storeData,
        getList: (data) => {
          this.storeData = data;
          this.formSearch.store_id = data[0].id;
        }
      })
    },
    handleTag (data) {
      this.storeData = data;
      this.formSearch.store_id = 0;
    },
    searchPage () {
    	this.$emit('on-search', this.formSearch);
    },
			showExtra() {
				this.isShowExtra = !this.isShowExtra;
			},
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
