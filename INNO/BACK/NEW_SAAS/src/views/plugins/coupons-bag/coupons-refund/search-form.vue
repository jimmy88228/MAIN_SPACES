<template>
  <div class="coupon-refund-search">
    <Form ref="formSearch" :model="formSearch" inline>
      <FormItem label="支付时间" class="date_wrapper">
        <date-select ref="dateSelect" @sT="handleStart" @eT="handleEnd"/>
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
        </Input>
      </FormItem>
    </Form>
    <p class="strong_tips">场景：当礼包只剩一个，而有两个人同时支付时，系统会自动退款给买不到的人，此时该页面会显示退款记录，礼包本身不具备退款操作！</p>
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
.coupon-refund-search{
    .brand-search_input{
      width:220px;
    }
    .ivu-input-icon{
      right: 50px;
    }
    .ivu-form-item{
      display: inline-flex;
      .edit-select{
        width: 200px;
      }
    }
}
</style>
