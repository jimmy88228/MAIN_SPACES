<template>
  <div class="brand-search">
    <Form ref="formSearch" :model="formSearch" inline :label-width="90">
      <FormItem label="下单时间" class="date_wrapper">
        <date-select ref="dateSelect" @sT="handleStart" @eT="handleEnd" extra/>
      </FormItem>
      <Row>
        <Col span="6">
          <FormItem label="订单状态" prop="status">
            <Select v-model="formSearch.status">
              <Option value="-1">全部</Option>
              <Option value="0">待支付</Option>
              <Option value="1">已完成</Option>
              <Option value="2">取消</Option>
              <Option value="3">退货中</Option>
              <Option value="4">结算中</Option>
              <Option value="5">已退货</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="6">
          <FormItem label="分销员状态" prop="staffStatus">
            <Select v-model="formSearch.staffStatus">
              <Option value="-1">全部</Option>
              <Option value="1">在职</Option>
              <Option value="0">离职</Option>
              <Option value="2">兼职</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="6">
          <FormItem label="分销员来源" prop="dstbStaffType">
            <Select v-model="formSearch.dstbStaffType">
              <Option value="-1">全部</Option>
              <Option value="0">手动录入</Option>
              <Option value="1">用户申请</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="6">
          <FormItem label="搜索类型" prop="searchqType">
            <Select v-model="formSearch.searchqType">
              <Option value="staff">员工信息</Option>
              <Option value="order">订单号</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <FormItem :label-width="0">
        <Input
            class="brand-search_input"
            v-model="formSearch.searchq"
            placeholder="请输入关键字"
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
import DateSelect from '@/views/my-components/date-select/index.vue';
import StoreSelect from '@/views/my-components/list-component/index-edit';

const defaultItem = {
  value: 0,
  label: '请选择',
  children: []
};
export default {
  components: {
    DateSelect,
    StoreSelect
  },
  data () {
    return {
      formSearch: {
        start_time: '',  //开始时间
        end_time: '',   //结束时间
        searchq: '',  //模糊搜索
        status: '-1',   //订单状态 -1 全部 0 待支付 1 已完成 2  取消 3 退货中 4 结算中 5 已退货
        staffStatus: '-1',  //分销员状态 -1 全部 0 离职 1 在职 2 兼职 
        dstbStaffType: '-1', //分销员来源 -1 全部 0 手动录入 1 用户申请 
        searchqType: 'staff',  //搜索类型 staff员工信息 order 订单号
      }
    }
  },
  methods: {
    handleStart (date) {
      this.formSearch.start_time = date;
    },
    handleEnd (date) {
      this.formSearch.end_time    = date;
    },
    searchPage () {
      this.$emit('on-search', this.formSearch);
    },
    handleSelect () {
      this.$selectContent({
        mode: 'store',
        type: 'radio',
        data: this.formSearch.storeData,
        getList: (data) => {
          this.formSearch.storeData = data;
        }
      })
    },
    handleTag (data) {
      this.formSearch.storeData = data;
    },
  }
}
</script>

<style lang="less">
.brand-search{
    .brand-search_input{
        width:320px;
        .brand-search_select{
            width: 100px;
        }
    }
    .ivu-input-icon{
        right: 50px;
    }
    .edit-select{
      width: 300px;
    }
    .ivu-form-item{
      width: 100%;
      margin-bottom: 10px;
      padding-right: 10px;
    }
}
</style>
