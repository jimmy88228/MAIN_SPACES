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
      <FormItem label="状态" :label-width="60">
        <Select v-model="formSearch.enabled">
          <Option :value="-1">全部</Option>
          <Option :value="0">关闭</Option>
          <Option :value="1">启用</Option>
          <Option :value="2">过期</Option>
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
        enabled: -1
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
.brand-search{
    .brand-search_input{
        width:220px;
    }
    .ivu-input-icon{
        right: 50px;
    }
}
</style>
