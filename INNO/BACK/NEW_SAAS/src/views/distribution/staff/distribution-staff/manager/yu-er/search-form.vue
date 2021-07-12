<template>
  <div class="brand-search">
    <Form ref="formSearch" :model="formSearch" inline>
      <FormItem>
        <Input
            class="brand-search_input"
            v-model="formSearch.searchq"
            placeholder="请输入变动"
            clearable
            search
            enter-button
            @on-search="searchPage"
            @on-clear="searchPage"
            @keydown.native.enter.prevent="searchPage">
        </Input>
      </FormItem>
      <FormItem label="变动类型" prop="status" :label-width="100">
        <Select v-model="formSearch.status" cass="basic_select">
          <Option value="-1">全部</Option>
          <Option value="1">订单提成</Option>
          <Option value="2">消费</Option>
          <Option value="3">手动提现</Option>
          <Option value="4">管理员调整</Option>
          <Option value="5">分销管理奖励</Option>
          <Option value="6">后台扣减</Option>
          <Option value="7">自动提现</Option>
          <Option value="8">后台增加</Option>
        </Select>
      </FormItem>
      <FormItem label="变动日期" class="date_wrapper">
        <date-select ref="dateSelect" @sT="handleStart" @eT="handleEnd" extra/>
      </FormItem>
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
        status: '-1', //状态 -1全部 1 订单提成 2 消费 3 手动提现 4 管理员调整 5 分销管理奖励 6 后台扣减 7 自动提现 8 后台增加
        start_time: '',  //开始时间
        end_time: '',//结束时间
        searchq: ''  //搜索值
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
    },
    clearOptions () {
      this.formSearch = {
        searchq: '',
        type: 1
      };
    }
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
}
</style>
