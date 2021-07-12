<template>
  <div class="brand-search">
    <Form ref="formSearch" :model="formSearch" inline :label-width="80">
      <FormItem :label-width="0">
        <Input
            class="brand-search_input"
            v-model="formSearch.searchq"
            placeholder="请输入标签名称"
            clearable
            search
            enter-button
            @on-search="searchPage"
            @on-clear="searchPage"
            @keydown.native.enter.prevent="searchPage">
        </Input>
      </FormItem>
      <FormItem label="状态">
        <Select v-model="formSearch.enable">
          <Option value="-1">全部</Option>
          <Option value="1">开启</Option>
          <Option value="0">关闭</Option>
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
        enable: '-1',
        searchq: ''
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
        width:320px;
        .brand-search_select{
            width: 100px;
        }
    }
    .ivu-input-icon{
        right: 50px;
    }
}
</style>

