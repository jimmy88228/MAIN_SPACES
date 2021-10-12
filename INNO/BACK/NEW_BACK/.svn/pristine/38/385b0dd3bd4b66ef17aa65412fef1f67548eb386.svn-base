<template>
  <div class="goods_details">
    <Table :columns="columns" :data="tableData" ref="myTable"></Table>
  </div>
</template>

<script>
import mixin from './goods-mixin';

export default {
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  mixins: [mixin],
  data() {
    return {
      tableData: []
    }
  },
  watch: {
    data ({commodity_information}) {
      this.tableData = [commodity_information];
    }
  }
}
</script>

<style lang="less" scoped>
.goods_details{
  border: 1px solid #ddd;
  padding: 5px;
  border-radius: 5px;
  .amount{
    .amount_title{
      text-align: center;
      margin: 10px 0;
    }
    .amount_info{
      text-align: right;
      margin-bottom: 10px;
    }
    .common_divider{
      margin: 10px;
    }
  }
}
</style>
