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
              <div class="flex">
                    <Select 
                      v-model="formSearch.type" slot="prepend"
                      class="autosyn-search_select"
                      style="width:150px" 
                      >
                        <Option value="0">请选择分类</Option>
					              <Option v-for="(value, name) in stockType" :value="name" :key="name">{{value}}</Option>
                    </Select>
                    <Button type="primary" @click="searchPage"><Icon type="ios-search" /></Button>
              </div>
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
        type:"0"
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
