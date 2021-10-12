<template>
  <div class="brand-search">
    <Form ref="formSearch" :model="formSearch" inline>
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
              <Option value="related_order_sn">订单编号</Option>
              <Option value="real_name">下单会员</Option>
              <Option value="mobile_phone">手机号</Option>
            </Select>
        </Input>
      </FormItem>
      <FormItem label="状态" prop="status" :label-width="60">
        <Select v-model="formSearch.status" class="basic_select">
          <Option value="-1">全部</Option>
          <Option value="4">结算中</Option>
          <Option value="1">已完成</Option>
          <Option value="2">取消</Option>
        </Select>
      </FormItem>
      <FormItem label="创建时间" class="date_wrapper">
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
        searchq: '',
        searchq_type: 'related_order_sn',
        status: '-1',
        start_time: '',
        end_time: ''
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
        searchq_type: 1
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
