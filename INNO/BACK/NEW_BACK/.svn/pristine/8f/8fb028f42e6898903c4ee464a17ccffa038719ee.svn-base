<template>
  <div class="integral-goods-search">
    <Form ref="formSearch" :model="formSearch" inline :label-width="80">
			<div class="flex">
				<div>
					<FormItem label="活动类型">
						<Select v-model="formSearch.type" class="basic_select" style="width:120px;">
							<Option :value="0">全部</Option>
							<Option :value="item.lottery_type_code" v-for="(item, index) in lotteryTypeList" :key="index">{{item.lottery_type_name}}</Option>
						</Select>
					</FormItem>
				</div>
				<div>
					<FormItem :label-width="0">
						<Input
								class="search_input"
								v-model="formSearch.searchq"
								placeholder="请输入活动名称"
								clearable
								search
								enter-button
								@on-search="searchPage"
								@on-clear="searchPage"
								@keydown.native.enter.prevent/>
					</FormItem>
				</div>
			</div>
      <!-- <Row>
        <Col :span="12">
          <FormItem label="活动类型">
            <Select v-model="formSearch.type" class="basic_select">
							<Option :value="0">全部</Option>
							<Option :value="item.lottery_type_code" v-for="(item, index) in lotteryTypeList" :key="index">{{item.lottery_type_name}}</Option>
            </Select>
          </FormItem> 
        </Col>-->
      <!--  <Col :span="12">
          <FormItem label="中奖时间" class="date_wrapper">
            <date-select ref="dateSelect" @sT="handleStart" @eT="handleEnd"/>
          </FormItem>
        </Col>-->
      </Row>
    </Form>
  </div>
</template>
<script>
import DateSelect from '@/views/my-components/date-select/index.vue';

export default {
  components: {
    DateSelect
  },
  data () {
    return {
      formSearch: {
        searchq: '',
        type: "0",
        // start_time: '',
        // end_time: ''
      },
			lotteryTypeList: []
    }
  },
  methods: {
    searchPage () {
      this.$emit('on-search', this.formSearch);
    },
		getLotteryType(){
			return this.$ajax.post(this.$api.MatrixLotteryType).then(response => {
				const res = response.data;
				if (res.code) {
					let data = res.data || [];
					this.lotteryTypeList = data;
				} else {
					this.$Message.error(res.message);
				}
			})
		}
    // handleStart (date) {
    //   this.formSearch.start_time = date;
    // },
    // handleEnd (date) {
    //   this.formSearch.end_time = date;
    // },
  },
	mounted(){
		this.getLotteryType();
	}
}
</script>

<style lang="less">
.integral-goods-search{
  .search_input{
    width:260px;
  }
  .ivu-input-icon{
    right: 50px;
  }
  .date-form-item{
    .ivu-form-item-content{
      width: 100%;
    }
  }
  .ivu-form-item{
    width: 100%;
  }
}
</style>
