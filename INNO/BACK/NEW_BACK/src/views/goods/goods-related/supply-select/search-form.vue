<template>
  <div class="supplier-search">
    <Form ref="formSearch" :model="formSearch" inline>
      <FormItem>
        <Input
          class="supplier-search_input"
          v-model="formSearch.searchq"
          placeholder=""
          clearable
          search
          enter-button
          @on-search="searchPage"
          @on-clear="searchPage"
          @keydown.native.enter.prevent="searchPage">
          <Select v-model="formSearch.type" slot="prepend" class="supplier-search_select">
            <Option :value="1">供应商名称</Option>
            <Option :value="2">供应商代码</Option>
          </Select>
        </Input>
      </FormItem>
      <FormItem>
        <Select v-model="formSearch.selectRange" class="basic_select" @on-change="searchPage">
          <Option :value="1">已选供应商</Option>
          <Option :value="2">全部供应商</Option>
        </Select>
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
        type: 1,
        selectRange: 1
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
.supplier-search{
  .supplier-search_input{
    width:340px;
    .supplier-search_select{
        width: 120px;
    }
  }
  .ivu-input-icon{
    right: 50px;
  }
  .basic_select{
    width: 120px;
  }
}
</style>
