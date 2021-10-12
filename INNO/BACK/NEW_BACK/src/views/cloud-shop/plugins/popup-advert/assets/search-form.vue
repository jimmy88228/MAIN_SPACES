<template>
  <div class="assets-search">
    <Form ref="formSearch" :model="formSearch" inline>
      <FormItem label="活动时间" class="date_wrapper">
        <date-select ref="dateSelect" @sT="handleStart" @eT="handleEnd"/>
      </FormItem>
      <FormItem class="select_fixed">
        <Select v-model="formSearch.status" class="basic_select">
          <Option value="0">请选择活动状态</Option>
          <Option value="4">执行中</Option>
          <Option value="3">待执行</Option>
          <Option value="2">未开启</Option>
          <Option value="1">已停止</Option>
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
        searchq: '',
        status: '0',
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
.assets-search{
    .brand-search_input{
        width:220px;
    }
    .ivu-input-icon{
        right: 50px;
    }
    .date_wrapper{
      width: 460px;
    }
    .select_fixed{
      width: 120px;
    }
}
</style>
