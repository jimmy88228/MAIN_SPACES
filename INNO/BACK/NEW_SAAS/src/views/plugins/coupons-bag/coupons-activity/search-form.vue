<template>
  <div class="brand-search">
    <Form ref="formSearch" :model="formSearch" inline>
      <FormItem label="活动状态">
        <Select v-model="formSearch.seart_type">
          <Option :value="-1">全部</Option>
          <Option :value="0">未启用</Option>
          <Option :value="1">启用</Option>
          <Option :value="2">过期</Option>
        </Select>
      </FormItem>
      <FormItem label="活动时间" class="date_wrapper">
        <date-select ref="dateSelect" @sT="handleStart" @eT="handleEnd"/>
      </FormItem>
      <FormItem>
        <Input
            class="brand-search_input"
            v-model="formSearch.searchq"
            placeholder="请输入活动名称"
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
        seart_type: -1,
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
.brand-search{
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
