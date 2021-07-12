<template>
	<div class="return-order-search-form">
		<Form ref="formSearch" :model="formSearch" inline :label-width="90">
      <FormItem :label-width="0" class="search_wrapper">
        <Input v-model="formSearch.keywords" style="width:400px;" placeholder="关键词搜索" clearable search enter-button
          @on-search="searchPage"
          @on-clear="searchPage"
          @keydown.native.enter.prevent ="searchPage">
          <Select v-model="formSearch.search_type" slot="prepend" style="width:140px">
            <Option value="related_order_sn">关联订单号</Option>
            <Option value="return_sn">退单号</Option>
            <Option value="return_user">退货人</Option>
            <Option value="ex_return_no">物流单号</Option>
          </Select>
        </Input>
        <a @click="showExtra" class="search_btn">{{isShowExtra ? '普通搜索' : '高级搜索'}}</a>
      </FormItem>
      <transition name="fade">
        <div v-show="isShowExtra">
          <FormItem label="下单时间">
            <date-select ref="dateSelect" @sT="handleStart" @eT="handleEnd" extra/>
          </FormItem>
          <FormItem label="退单时间">
            <date-select ref="dateReturnSelect" @sT="handleReturnStart" @eT="handleReturnEnd" extra/>
          </FormItem>
          <Row>
            <Col span="8">
              <FormItem label="退货类型">
                <Select v-model="formSearch.refund_type" class="basic_select">
                  <Option :value="0">全部</Option>
                  <Option :value="1">退货退款</Option>
                  <Option :value="2">仅退款不退货</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="所属店铺">
                <store-select :data="storeData" type="radio" @del-tag="handleTag">
                  <Button type="dashed" @click="handleSelect" class="basic_select">选择所属店铺</Button>
                </store-select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <div style="margin-bottom: 10px;">
              <Button type="primary" @click="searchPage">搜索</Button>
              <Button type="primary" @click="clearCondition">重置</Button>
            </div>
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
        search_type: 'related_order_sn',
        keywords: '',
        refund_type: 0,
        store_id: 0,
        startTime: '',
        endTime: '',
        startReturnTime: '',
        endReturnTime: '',
        add_time: [],
        return_time: []
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
        search_type: 'related_order_sn',
        keywords: '',
        refund_type: 0,
        store_id: 0,
        startTime: '',
        endTime: '',
        startReturnTime: '',
        endReturnTime: '',
        add_time: [],
        return_time: []
      };
      this.$refs.dateSelect.reset();
      this.$refs.dateReturnSelect.reset();
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
    handleReturnStart (date) {
      this.formSearch.startReturnTime = date;
      this.formSearch.return_time[0] = date;
    },
    handleReturnEnd (date) {
      this.formSearch.endReturnTime = date;
      this.formSearch.return_time[1] = date;
    },
    showExtra () {
      this.isShowExtra = !this.isShowExtra;
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
    }
  }
}
</script>

<style lang="less">
.return-order-search-form{
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
