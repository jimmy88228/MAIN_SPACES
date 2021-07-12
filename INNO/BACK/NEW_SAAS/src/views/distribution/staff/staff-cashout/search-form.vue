<template>
  <div class="brand-search">
    <Form ref="formSearch" :model="formSearch" inline>
      <Select v-model="formSearch.dateType" class="basic_select">
        <Option value="1">申请时间</Option>
        <Option value="2">审核时间</Option>
        <Option value="3">转款时间</Option>
      </Select>
      <date-select ref="dateSelect" @sT="handleStart" @eT="handleEnd" style="display: inline-flex;"/>
      <FormItem label="审核状态" prop="status" :label-width="100">
        <Select v-model="formSearch.status" class="basic_select">
          <Option value="-1">全部</Option>
          <Option value="0">申请中</Option>
          <Option value="1">审核通过</Option>
          <Option value="2">审核失败</Option>
          <Option value="4">已转账</Option>
          <Option value="6">转账失败</Option>
        </Select>
      </FormItem>
      <FormItem>
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
            <Select v-model="formSearch.searchq_type" slot="prepend" class="brand-search_select">
              <Option value="dstb_staff_name">分销员名称</Option>
              <Option value="real_name">昵称</Option>
              <Option value="dstb_staff_phone">电话</Option>
            </Select>
        </Input>
      </FormItem>
    </Form>
    <p class="strong_tips">注意：如需开通自助转账功能，必须先到微信商户号后台开通‘企业付款到零钱’功能, <Button to="/static/images/enterprise_payment.png" target="_blank" type="text">点击这里</Button> 查看设置操作</p>
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
        start_time: '',  //开始时间
        end_time: '',//结束时间
        searchq: '',  //搜索值
        dateType: '1', //时间 1 申请时间 2 审核时间 3  转款时间
        status: '-1',  //审核状态 -1 全部 0 申请中 1 审核通过 2 审核失败 4 已转账 6 转账失败
        searchq_type: 'dstb_staff_name'   //搜索类型dstb_staff_name分销员名称 real_name 昵称 dstb_staff_phone 电话
      }
    }
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
.brand-search{
    .brand-search_input{
        width:320px;
        .brand-search_select{
            width: 120px;
        }
    }
    .ivu-input-icon{
        right: 50px;
    }
  .strong_tips{
    color: red;
  }
}
</style>

