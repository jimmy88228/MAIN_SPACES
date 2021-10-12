<template>
  <div class="integral-goods-search">
    <Form ref="formSearch" :model="formSearch" inline :label-width="80">
      <FormItem :label-width="0">
        <Input
            class="search_input"
            v-model="formSearch.searchq"
            :placeholder="type === 'coupon' ? '请输入关键字' : '请输入关键字'"
            clearable
            search
            enter-button
            @on-search="searchPage"
            @on-clear="searchPage"
            @keydown.native.enter.prevent>
            <Select v-model="formSearch.searchq_type" slot="prepend" class="select" v-if="type === 'coupon'">
              <Option value="name">活动名称</Option>
              <Option value="card_num">会员卡号</Option>
              <Option value="mobile_phone">手机号</Option>
            </Select>

            <Select v-model="formSearch.searchq_type" slot="prepend" class="select" v-else>
              <Option value="card_num">会员卡号</Option>
              <Option value="mobile_phone">手机号</Option>
              <Option value="order_sn">订单号</Option>
            </Select>
        </Input>
      </FormItem>
      <Row>
        <Col :span="16">
          <FormItem label="活动时间" :label-width="78" class="date-form-item">
            <date-select ref="dateSelect" @sT="handleStart" @eT="handleEnd"/>
          </FormItem>
        </Col>
      </Row>
    </Form>
  </div>
</template>
<script>
import DateSelect from '@/views/my-components/date-select/index.vue';

export default {
  props: ['type'],
  components: {
    DateSelect
  },
  data () {
    return {
      formSearch: {
        searchq: '',
        searchq_type: 'card_num',
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
    }
  }
}
</script>

<style lang="less">
.integral-goods-search{
  .search_input{
    width:320px;
    .select{
      width: 120px;
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
  .ivu-form-item{
    width: 100%;
  }
}
</style>
