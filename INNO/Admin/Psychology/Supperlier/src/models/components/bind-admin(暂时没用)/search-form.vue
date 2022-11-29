<template>
  <rewrite-area>
    <Form ref="searchForm" :model="searchForm" :label-width="90" inline class="no-tip flex-b-c">
      <div>
        <FormItem :label-width="0">
          <custom-input v-model="searchForm.searchq" placeholder="请输入关键字" clearable search enter-button
              @on-search="search()" @on-clear="search" @keydown.native.enter.prevent>
          </custom-input>
        </FormItem>
        <FormItem label="用户状态">
          <Select v-model="searchForm.state" class="base-select" @on-change="search">
            <Option :value="-1">全部</Option>
            <Option :value="0">关闭</Option>
            <Option :value="1">正常</Option>
          </Select>
        </FormItem>
      </div>
      <div class="flex">
        <Button @click="addAdmin">添加人员</Button>
        <Button @click="addAdmin">批量新增</Button>
      </div>
    </Form>
  </rewrite-area>
</template>

<script>
export default {
  props: {
    searchForm: {
      type: Object,
      default:()=>{}
    }
  },
  data(){
    return {}
  },
  methods:{
    search(){
      this.$emit("search");
    },
    addAdmin(){
      this.$emit("addAdmin");
    }
  }
}
</script>

<style>

</style>