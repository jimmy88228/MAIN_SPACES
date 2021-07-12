<template>
	<div class="order-search-form">
		<Form ref="formSearch" :model="formSearch" inline :label-width="90">
      <FormItem :label-width="0" class="search_wrapper">
        <Input
          v-model="formSearch.searchq"
          style="width:400px;"
          placeholder="关键词搜索"
          clearable
          search
          enter-button
          @on-search="searchPage"
          @on-clear="searchPage"
          @keydown.native.enter.prevent="searchPage">
          <Select v-model="formSearch.searchq_type" slot="prepend" style="width:120px;">
            <Option value="dstb_staff_name">店员名称</Option>
            <Option value="dstb_staff_code">代码</Option>
            <Option value="dstb_staff_phone">电话</Option>
          </Select>
        </Input>
        <a @click="showExtra" class="search_btn">{{isShowExtra ? '普通搜索' : '高级搜索'}}</a>
      </FormItem>
      <transition name="fade">
        <div v-show="isShowExtra">
          <FormItem label="创建时间" class="date_wrapper">
            <date-select ref="dateSelect" @sT="handleStart" @eT="handleEnd" extra/>
          </FormItem>
          <Row>
            <Col span="8">
              <FormItem label="等级" prop="is_level">
                <Select v-model="formSearch.is_level" class="basic_select">
                  <Option value="0">全部</Option>
                  <Option value="1">等级1</Option>
                  <Option value="2">等级2</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="是否绑定" prop="is_bind">
                <Select v-model="formSearch.is_bind" class="basic_select">
                  <Option value="0">全部</Option>
                  <Option value="1">是</Option>
                  <Option value="2">否</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="是否启用" prop="is_enabled">
                <Select v-model="formSearch.is_enabled" class="basic_select">
                  <Option value="0">全部</Option>
                  <Option value="1">是</Option>
                  <Option value="2">否</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="8">
              <FormItem label="分销员状态" prop="status">
                <Select v-model="formSearch.status" class="basic_select">
                  <Option value="-1">全部</Option>
                  <Option value="1">在职</Option>
                  <Option value="0">离职</Option>
                  <Option value="2">兼职</Option>
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
  name: 'searchForm',
  props: ['orderStatusList', 'storeList', 'orderFrom', 'orderTypeList', 'saleKind', 'payMethod', 'shippingWays', 'checkOrder', 'searchTypeList', 'orderStatusSelect'],
  components: {
    StoreSelect,
    DateSelect
  },
  data () {
    return {
      // 搜索表单
      formSearch: {
        store_id: 0,
        is_level: '0', //等级 0全部 1 等级一 2 等级二
        is_bind: '0', //是否绑定 0全部 1 是 2 否
        is_enabled: '0',  //是否启用 0全部 1 是 2 否
        status: '-1', //分销员状态 -1全部 0 离职 1 在职 2 兼职
        start_time: '', //开始时间
        end_time: '', //结束时间
        searchq: '',  //搜索值
        searchq_type: 'dstb_staff_name',  //搜索类型
        sortType: 'DESC'    // DESC或者ASC
      },
      isShowExtra: false,
      storeData: []
    }
  },
  methods: {
    showExtra () {
      this.isShowExtra = !this.isShowExtra;
    },
    // 搜索按钮触发
    searchPage () {
    	this.$emit('on-search', this.formSearch);
    },
    clearCondition () {
      this.formSearch = {
        store_id: 0,
        is_level: '0', //等级 0全部 1 等级一 2 等级二
        is_bind: '0', //是否绑定 0全部 1 是 2 否
        is_enabled: '0',  //是否启用 0全部 1 是 2 否
        status: '-1', //分销员状态 -1全部 0 离职 1 在职 2 兼职
        start_time: '', //开始时间
        end_time: '', //结束时间
        searchq: '',  //搜索值
        searchq_type: '',  //搜索类型
        sortType: 'DESC'
      };
      this.$refs.dateSelect.reset();
      this.storeData = [];
      this.formSearch.store_id = 0;
    },
    handleStart (date) {
      this.formSearch.start_time = date;
    },
    handleEnd (date) {
      this.formSearch.end_time = date;
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
  },
  watch: {
    orderStatusSelect(nV) {
      this.formSearch.orderStatus = nV;
    }
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
