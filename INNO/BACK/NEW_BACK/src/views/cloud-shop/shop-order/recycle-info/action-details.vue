<template>
  <div class="action_details">
    <titleBar>操作信息</titleBar>
    <Table :columns="columns" :data="tableData" ref="myTable"></Table>
  </div>
</template>

<script>
import titleBar from '@/views/my-components/title-bar/title-bar';
import Mixin from './action-mixin';

export default {
  props: {
    actionList: {
      type: Array,
      required: true
    }
  },
  mixins: [Mixin],
  components: {
    titleBar
  },
  watch: {
    actionList: {
      handler(newVal) {
        this.tableData = newVal;
      }
    }
  }
}
</script>

<style lang="less" scoped>
.action_details{
  border: 1px solid #ddd;
  padding: 5px;
  border-radius: 5px;
  .note{
    margin: 10px;
    label{
      display: inline-block;
      margin-right: 10px;
    }
  }
}
</style>
<style lang="less">
.action_details{
  .ivu-divider-default{
    margin: 10px 0;
  }
}
</style>
