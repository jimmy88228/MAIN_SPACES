<template>
  <Form ref="formSearch" :model="formSearch" :label-width="90" inline class="goods_search">
    <FormItem :label-width="0">
      <Input
        class="goods-search_input"
        v-model="formSearch.search"
        placeholder="请输入关键字"
        clearable
        search
        enter-button
        @on-search="searchPage"
        @on-clear="searchPage"
        @keydown.native.enter.prevent>
        <Select v-model="formSearch.type" slot="prepend" class="goods-search_select">
          <Option :value="1">商品名字</Option>
          <Option :value="2">商品货号</Option>
        </Select>
      </Input>
    </FormItem>
  </Form>
</template>

<script>
export default {
  data () {
    return {
      formSearch: {
        isInit: 2,
        search: '',
        type: 1
      },
    }
  },
  methods: {
    searchPage () {
      this.$emit('on-search', JSON.parse(JSON.stringify(this.formSearch)));
    }
  }
}
</script>

<style>

</style>
