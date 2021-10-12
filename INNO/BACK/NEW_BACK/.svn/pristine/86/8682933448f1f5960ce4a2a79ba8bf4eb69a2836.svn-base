<style lang="less">
.related-search{
    .related-search_input{
        width:320px;
        .related-search_select{
            width: 100px;
        }
    }
    .ivu-input-icon{
        right: 50px;
    }
}
</style>
<template>
    <div class="related-search">
        <Form ref="formSearch" :model="formSearch" inline>
            <FormItem>
                <Input
                    class="related-search_input"
                    v-model="formSearch.searchq"
                    placeholder="请输入关键字"
                    clearable
                    search
                    enter-button
                    @on-search="searchPage"
                    @on-clear="searchPage"
                    @keydown.native.enter.prevent="searchPage">
                    <Select v-model="formSearch.type" slot="prepend" class="related-search_select">
                        <Option :value="1">商品货号</Option>
                        <Option :value="2">条码</Option>
                        <Option :value="3">关联条码</Option>
                    </Select>
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
    clearOptions () {
      this.formSearch = {
        searchq: '',
        type: 1
      };
    },
    searchPage () {
      this.$emit('on-search', this.formSearch);
    }
  }
}
</script>
