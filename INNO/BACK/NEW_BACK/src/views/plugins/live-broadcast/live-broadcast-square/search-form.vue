<template>
  <div class="brand-search">
    <Form ref="formSearch" :model="formSearch" inline>
      <FormItem label="直播状态筛选" :label-width="120">
        <Select v-model="formSearch.selectType" class="basic_select">
          <Option :value="0">全部</Option>
          <Option :value="101">直播中</Option>
          <Option :value="102">未开始</Option>
          <Option :value="103">已结束</Option>
          <Option :value="104">禁播</Option>
          <Option :value="105">暂停中</Option>
          <Option :value="106">异常</Option>
          <Option :value="107">已过期</Option>
        </Select>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="searchPage">搜索</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
export default {
  data () {
    return {
      formSearch: {
        selectType: 0
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
