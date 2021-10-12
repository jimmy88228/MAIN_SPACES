<template>
	<div class="delivery-search-form">
		<Form ref="formSearch" :model="formSearch" inline :label-width="90">
      <FormItem :label-width="0" class="search_wrapper">
        <Input v-model="formSearch.keywords" style="width:400px;" placeholder="关键词搜索" clearable search enter-button
          @on-search="searchPage"
          @on-clear="searchPage"
          @keydown.native.enter.prevent ="searchPage">
          <Select v-model="formSearch.search_type" slot="prepend" style="width:100px">
            <Option value="order_sn">订单号</Option>
            <Option value="delivery_sn">发货单号</Option>
            <Option value="consignee">收货人</Option>
          </Select>
        </Input>
        <a @click="showExtra" class="search_btn">{{isShowExtra ? '普通搜索' : '高级搜索'}}</a>
      </FormItem>
      <transition name="fade">
        <div v-show="isShowExtra">
          <FormItem label="下单时间">
            <date-select ref="dateSelect" @sT="handleStart" @eT="handleEnd"/>
          </FormItem>
          <Row>
            <Col span="8">
              <FormItem label="发货单状态">
                <Select v-model="formSearch.status" class="basic_select">
                  <Option :value="0">请选择</Option>
                  <Option v-for="(item, key) in statusList" :value="key" :key="key">{{ item }}</Option>
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
            <Col span="8">
              <FormItem label="发货门店">
                <store-select :data="storeDeliveryData" type="radio" @del-tag="handleDeliveryTag">
                  <Button type="dashed" @click="handleDeliverySelect" class="basic_select">选择发货门店</Button>
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
  props: ['statusList', 'keywords'],
  data () {
    return {
      formSearch: {
        search_type: 'order_sn',
        keywords: '',
        startTime: '',
        endTime: '',
        status: 0,
        store_id: 0,
        delivery_store_id: 0
      },
      isShowExtra: false,
      storeData: [],
      storeDeliveryData: []
    }
  },
  components: {
    StoreSelect,
    DateSelect
  },
  watch: {
    'keywords': {
    　　handler(nV) {
      　　if(nV){
            this.formSearch.keywords = nV || "";
          }
    　　},
    　　immediate: true
    }
  },
  methods: {
    clearCondition () {
      this.formSearch = {
        search_type: 'order_sn',
        keywords: '',
        startTime: '',
        endTime: '',
        status: 0,
        store_id: 0,
        delivery_store_id: 0
      };
      this.$refs.dateSelect.reset();
      this.storeData = [];
      this.storeDeliveryData = [];
    },
    handleStart (date) {
      this.formSearch.startTime = date;
    },
    handleEnd (date) {
      this.formSearch.endTime = date;
    },
    showExtra () {
      this.isShowExtra = !this.isShowExtra;
    },
    searchPage () {
    	this.$emit('on-search', this.formSearch);
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
      });
    },
    handleTag (data) {
      this.storeData = data;
      this.formSearch.store_id = 0;
    },
    handleDeliverySelect () {
      this.$selectContent({
        mode: 'store',
        type: 'radio',
        data: this.storeDeliveryData,
        getList: (data) => {
          this.storeDeliveryData = data;
          this.formSearch.delivery_store_id = data[0].id;
        }
      });
    },
    handleDeliveryTag (data) {
      this.storeDeliveryData = data;
      this.formSearch.delivery_store_id = 0;
    }
  }
}
</script>

<style lang="less">
.delivery-search-form{
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
