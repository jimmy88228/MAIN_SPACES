<template>
  <div class="package-manager-search">
    <Form ref="formSearch" :model="formSearch" inline>
      <FormItem :label-width="80" label="套餐状态">
        <Select v-model="formSearch.status">
          <Option :value="-1">全部</Option>
          <Option :value="1">开启</Option>
          <Option :value="0">关闭</Option>
          <Option :value="2">过期</Option>
        </Select>
      </FormItem>
      <FormItem>
        <Input
            class="brand-search_input"
            v-model="formSearch.searchq"
            placeholder="请输入套餐名称"
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
        status : -1
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
.package-manager-search{
    .brand-search_input{
        width:220px;
    }
    .ivu-input-icon{
        right: 50px;
    }
}
</style>
