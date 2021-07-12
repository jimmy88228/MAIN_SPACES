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
        </Input>
      </FormItem>
      <FormItem label="下单时间" class="date_wrapper">
        <date-select ref="dateSelect" @sT="handleStart" @eT="handleEnd"/>
      </FormItem>
      <FormItem label="提现时间" class="date_wrapper">
        <date-select ref="dateSelect2" @sT="handleStart2" @eT="handleEnd2"/>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import DateSelect from '@/views/my-components/date-select/index.vue';
import StoreSelect from '@/views/my-components/list-component/index-edit';

export default {
  components: {
    DateSelect,
    StoreSelect
  },
  data () {
    return {
      formSearch: {
        start_lower_time: '',  //下单开始时间   
        end_lower_time: '',  //下单结束时间
        start_lower_time: '',  //提现开始时间   
        end_lower_time: '',  //提现结束时间
        searchq: '',   //搜索值
      }
    }
  },
  methods: {
    handleStart (date) {
      this.formSearch.start_lower_time = date;
    },
    handleEnd (date) {
      this.formSearch.end_lower_time = date;
    },
    handleStart2 (date) {
      this.formSearch.start_lower_time = date;
    },
    handleEnd2 (date) {
      this.formSearch.end_lower_time = date;
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
    .edit-select{
      width: 300px;
    }
    .date_wrapper{
      width: 100%;
    }
}
</style>
