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
}
</style>
<template>
    <div class="supplier-search">
        <Form ref="formSearch" :model="formSearch" inline>
            <FormItem>
                <Input
                    class="supplier-search_input"
                    v-model="formSearch.searchq"
                    placeholder="请输入关键字"
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
