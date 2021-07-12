<style lang="less">
.autosyn-search{
    .autosyn-search_input{
        width:320px;
        .autosyn-search_select{
            width: 100px;
        }
    }
    .ivu-input-icon{
        right: 50px;
    }
}
</style>
<template>
    <div class="autosyn-search">
        <Form ref="formSearch" :model="formSearch" inline>
            <FormItem>
                <Input
                    class="autosyn-search_input"
                    v-model="formSearch.search"
                    placeholder="请输入关键字"
                    clearable
                    search
                    enter-button
                    @on-search="searchPage"
                    @on-clear="searchPage"
                    @keydown.native.enter.prevent="searchPage">
                    <Select v-model="formSearch.type" slot="prepend" class="autosyn-search_select">
                        <Option value="0">请选择</Option>
					    <Option v-for="(value, name) in stockType" :value="name" :key="name">{{value}}</Option>
                    </Select>
                </Input>
            </FormItem>
        </Form>
    </div>
</template>
<script>
export default {
  props: {
    stockType: {
      type: Object,
      default () {
        return {};
      }
    }
  },
  data () {
    return {
      formSearch: {
        search: '',
        type: 1
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
