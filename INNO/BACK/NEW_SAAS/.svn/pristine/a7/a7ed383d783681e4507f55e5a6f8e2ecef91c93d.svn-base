<template>
  <div class="activity-search">
    <Form ref="formSearch" :model="formSearch" inline>
      <FormItem class="select_fixed">
        <Select v-model="formSearch.is_enabled" class="basic_select">
          <Option value="-1">全部</Option>
          <Option value="1">启用</Option>
          <Option value="0">关闭</Option>
        </Select>
      </FormItem>
      <FormItem>
        <Input
            class="brand-search_input"
            v-model="formSearch.searchq"
            placeholder="请输入分类名称"
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
export default {
  data () {
    return {
      formSearch: {
        searchq: '',
        is_enabled: '-1'
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
.activity-search{
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
