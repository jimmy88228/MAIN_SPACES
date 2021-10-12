<template>
  <div class="goods_details">
    <Table :columns="columns" :data="tableData" ref="myTable"></Table>
    <div class="amount">
      <h4 class="amount_title">费用信息</h4>
      <Divider class="common_divider"/>
      <p class="amount_info">商品总金额 : ￥<a>{{orderMoney.goods_total}}</a> + 配送费用 : ￥<a>{{orderMoney.goods_distribution}}</a> = 订单总金额 : ￥<a>{{orderMoney.order_total}}</a></p>
      <p class="amount_info">订单总金额： ￥<a>{{orderMoney.order_total}}</a> - 积分抵扣 : ￥<a>{{orderMoney.point_money}}</a> - 优惠券 : ￥<a>{{orderMoney.bonus_money}}</a> - 现金券 : ￥<a>{{orderMoney.coupon_money}}</a> - 促销优惠金额 : ￥<a>{{orderMoney.amount_of_promotional_offer}}</a> - 充值卡抵扣 : ￥<a>{{orderMoney.recharge_card_deduction}}</a> = 应付金额 : ￥<a>{{orderMoney.amount_payable}}</a></p>
      <p class="amount_info">已付金额 :  ￥<a>{{orderMoney.amount_paid}}</a></p>
      <p class="amount_info">[ 已使用 : <a>{{orderMoney.points_used}}</a>积分    抵扣积分 : <a>{{orderMoney.deduction_integral}}</a> ]</p>
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
    goodsColumns: {
      type: Array,
      required: true
    },
    orderMoney: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      columns: [],
      tableData: []
    }
  },
  watch: {
    orderGoods(newVal) {
      this.tableData = newVal;
    },
    goodsColumns(newVal) {
      const that = this;
      this.columns = newVal;
      this.columns.forEach(item => {
        if (item.key === 'goods_thumb') {
          item.width = 300;
          item.render = (h, params) => {
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
                  src: params.row.goods_thumb
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
                    class: 'clamp2'
                  }
                }, '款号:' + params.row.sku),
                h('p', {
                  attrs: {
                    class: 'clamp2'
                  }
                }, params.row.specs_name)
              ])
            ]);
          }
        }
      })
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
