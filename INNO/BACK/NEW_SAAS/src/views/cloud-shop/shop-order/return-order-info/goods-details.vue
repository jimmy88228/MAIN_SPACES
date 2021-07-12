<template>
  <div class="goods_details">
    <Table :columns="columns" :data="tableData" ref="myTable"></Table>
    <div class="sum">
      <strong>合计： ￥{{orderGoodsTotal.return_totalamount}}+ {{orderGoodsTotal.return_integral}} 积分</strong>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    orderGoods: {
      type: Array,
      required: true
    },
    orderGoodsTotal: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      tableData: [],
      columns: [
        {
          title: '商品详情',
          key: 'goods_img',
          align: 'left',
          width: 300,
          render (h, params) {
            return h('div', {
              style: {
                display: 'flex'
              }
            }, [
              h('img', {
                style: {
                  width: '60px',
                  height: '60px',
                  display: 'block',
                  margin: '10px 10px 10px 0',
                  objectFit: 'contain',
                  flexShrink: 0
                },
                attrs: {
                  src: params.row.goods_img
                }
              }),
              h('div', {
                style: {
                  marginTop: '10px'
                },
              }, [
                h('p', {
                  attrs: {
                    class: 'clamp2'
                  }
                }, params.row.goods_name),
                h('p', {
                  attrs: {
                    // class: 'clamp2'
                  }
                }, '货号:' + params.row.goods_sn),
                h('p', {
                  attrs: {
                    // class: 'clamp2'
                  }
                }, params.row.goods_attr)
              ])
            ]);
          }
        },
        {
          title: '产品SKU码',
          key: 'product_sn',
          align: 'left'
        },
        {
          title: '商品价格',
          key: 'market_price',
          align: 'left'
        },
        {
          title: '应退现金',
          key: 'real_price',
          align: 'left'
        },
        {
          title: '应退储值',
          key: 'real_stored_value',
          align: 'left'
        },
        {
          title: '退货量',
          key: 'return_number',
          align: 'left'
        },
        {
          title: '应退积分',
          key: 'real_integral',
          align: 'left'
        }
      ]
    }
  },
  watch: {
    orderGoods(newVal) {
      this.tableData = newVal;
    }
  }
}
</script>

<style lang="less" scoped>
.goods_details{
  border: 1px solid #ddd;
  padding: 5px;
  border-radius: 5px;
  .sum{
    text-align: right;
  }
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
