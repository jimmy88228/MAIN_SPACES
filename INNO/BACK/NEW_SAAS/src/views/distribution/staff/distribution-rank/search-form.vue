<template>
  <div class="brand-search">
    <Form ref="formSearch" :model="formSearch" inline>
      <label>变动时间</label>
      <date-select ref="dateSelect" @sT="handleStart" @eT="handleEnd" style="margin-bottom: 24px;"/>
      <label>变动类型</label>
      <Select v-model="formSearch.changeType" class="basic_select">
        <Option value="0">全部</Option>
        <Option value="1">订单提成</Option>
        <Option value="2">消费</Option>
        <Option value="3">手动体现</Option>
        <Option value="4">管理员调整</Option>
        <Option value="5">分享管理奖励</Option>
        <Option value="6">后台扣减</Option>
        <Option value="7">自动提现</Option>
        <Option value="8">后台增加</Option>
      </Select>
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
            <Select v-model="formSearch.type" slot="prepend" class="brand-search_select">
              <Option :value="1">手机号</Option>
              <Option :value="2">分销员代码</Option>
              <Option :value="3">变动原因</Option>
            </Select>
        </Input>
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
        from_time: '',
        to_time: '',
        changeType: -1,
        searchq: '',
        type: 1
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
            width: 100px;
        }
    }
    .ivu-input-icon{
        right: 50px;
    }
}
</style>
