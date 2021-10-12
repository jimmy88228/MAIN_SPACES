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
    </Form>
  </div>
</template>
<script>
export default {
  data () {
    return {
      formSearch: {
        searchq: '',
        type: 1
      }
    }
  },
  methods: {
    searchPage () {
      this.$emit('on-search', this.formSearch);
    },
    clearOptions () {
      this.formSearch = {
        searchq: '',
        type: 1
      };
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
