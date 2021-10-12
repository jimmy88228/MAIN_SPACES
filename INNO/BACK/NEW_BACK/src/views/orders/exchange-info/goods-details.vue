<template>
  <div class="goods_details">
    <titleBar>原换货商品</titleBar>
    <Table :columns="columns" :data="orderGoods"></Table>
    <titleBar>换货商品</titleBar>
    <Table :columns="columns" :data="newOrderGoods"></Table>
  </div>
</template>

<script>
import titleBar from '@/views/my-components/title-bar/title-bar';
import Mixin from './goods-mixin';

export default {
  mixins: [Mixin],
  components: {
    titleBar
  },
  props: {
    orderGoods: {
      type: Array,
      required: true
    },
    newOrderGoods: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      tableData: []
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
