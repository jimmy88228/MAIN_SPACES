<template>
  <div class="guide-group-search">
    <Form ref="formSearch" :model="formSearch" inline>
      <FormItem>
        <Input
          class="guide-group-search_input"
          v-model="formSearch.searchq"
          placeholder="请输入线路ID"
          clearable
          search
          enter-button
          @on-search="searchPage"
          @on-clear="searchPage"
          @keydown.native.enter.prevent="searchPage"/>
      </FormItem>
    </Form>
  </div>
</template>
<script>
export default {
  data () {
    return {
      formSearch: {
        searchq: ''
      }
    }
  },
  methods: {
    searchPage () {
      this.$emit('on-search', this.formSearch);
    },
    clearOptions () {
      this.formSearch = {
        searchq: ''
      };
    }
  }
}
</script>

<style lang="less">
.guide-group-search{
    .guide-group-search_input{
      width:260px;
    }
    .ivu-input-icon{
      right: 50px;
    }
}
</style>
