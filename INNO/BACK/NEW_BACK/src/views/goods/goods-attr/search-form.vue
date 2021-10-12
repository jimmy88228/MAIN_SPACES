<style lang="less">
.group-search{
    .group-search_input{
        width: 220px;
    }
    .ivu-input-icon{
        right: 50px;
    }
}
</style>
<template>
    <div class="group-search">
        <Form ref="formSearch" :model="formSearch" inline>
            <FormItem>
                <Input
                    class="group-search_input"
                    v-model="formSearch.searchq"
                    placeholder="请输入类型名称"
                    clearable
                    search
                    enter-button
                    @on-search="searchPage"
                    @on-clear="searchPage"
                    @keydown.native.enter.prevent="searchPage"></Input>
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
    clearOptions () {
      this.formSearch.searchq = '';
    },
    searchPage () {
      this.$emit('on-search', this.formSearch);
    }
  }
}
</script>
