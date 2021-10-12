<template>
  <div class="presale-order-search">
    <Form ref="formSearch" :model="formSearch" inline>
      <FormItem>
        <Input
            class="search_input"
            v-model="formSearch.searchq"
            placeholder="请输入关键字"
            clearable
            search
            enter-button
            @on-search="searchPage"
            @on-clear="searchPage"
            @keydown.native.enter.prevent="searchPage">
            <Select v-model="formSearch.searchq_type" slot="prepend" class="search_select">
              <Option value="presale_order_sn">订单号</Option>
              <Option value="consignee_mobile">手机号</Option>
              <Option value="consignee">买家名称</Option>
              <Option value="activity_name">活动名称</Option>
            </Select>
        </Input>
      </FormItem>
      <div>
        <FormItem label="下单时间" :label-width="70" class="date-form-item">
          <date-select ref="dateSelect" @sT="handleStart" @eT="handleEnd"/>
        </FormItem>
      </div>
    </Form>
  </div>
</template>
<script>
import DateSelect from '@/views/my-components/date-select/index.vue';

export default {
  data () {
    return {
      formSearch: {
        searchq_type: 'presale_order_sn',
        searchq: '',
        start_time: '',
        end_time: ''
      }
    }
  },
  components: {
    DateSelect
  },
  methods: {
    searchPage () {
      this.$emit('on-search', this.formSearch);
    },
    handleStart (date) {
      this.formSearch.start_time = date;
    },
    handleEnd (date) {
      this.formSearch.end_time = date;
    },
  }
}
</script>

<style lang="less">
.presale-order-search{
  .search_input{
    width:320px;
    .search_select{
        width: 100px;
    }
  }
  .ivu-input-icon{
    right: 50px;
  }
  .date-form-item{
    .ivu-form-item-content{
      width: 100%;
    }
  }
}
</style>
