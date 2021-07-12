<template>
  <div class="pk-search">
    <Form ref="formSearch" :model="formSearch" inline :label-width="70">
      <FormItem label="搜索类型" class="type_wrapper">
        <Select v-model="formSearch.searchType" class="basic_select">
          <Option :value="2">所有</Option>
          <Option :value="0">门店</Option>
          <Option :value="1">组别</Option>
        </Select>
      </FormItem>
      <FormItem label="时间" class="date_wrapper">
        <DatePicker type="date" v-model="formSearch.day" placeholder="请选择时间"></DatePicker>
      </FormItem>
      <Button type="primary" @click="searchPage">搜索</Button>
    </Form>
  </div>
</template>
<script>

export default {
  data () {
    return {
      formSearch: {
        searchType: 2,
        day: ''
      }
    }
  },
  methods: {
    searchPage () {
      this.$emit('on-search', this.formSearch);
    }
  }
}
</script>

<style lang="less">
.pk-search{
  .search_wrapper{
    .ivu-form-item-content{
      display: flex;
      align-items: center;
    }
    .search_btn{
      display: inline-block;
      margin-left: 10px;
    }
  }
  .ivu-input-icon{
    right: 50px;
  }
  .type_wrapper{
    width: 260px;
  }
}
</style>
