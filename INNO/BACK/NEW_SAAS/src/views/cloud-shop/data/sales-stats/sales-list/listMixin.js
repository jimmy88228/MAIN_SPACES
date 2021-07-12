export default {
    data() {
      const _this = this;
      return {
        columns: [
            {
                title: '品牌',
                minWidth:120,
                key: "brand_name",
                align: 'left'
            },
            {
                title: "成交额",
                minWidth:100,
                key: "order_amount",
                align: "right"
            },
            {
                title: "订单数",
                minWidth:100,
                key: "orders",
                align: "right"
            },
            {
                title: "成交件数",
                minWidth:100,
                key: "goods_number",
                align: "right"
            },
            {
                title: "客单价",
                minWidth:100,
                key: "average_price",
                align: "right"
            },
            {
                title: "成交用户数",
                minWidth:110,
                key: "order_users",
                align: "right"
            },
            {
                title: "总额",
                minWidth:100,
                key: "goods_amount",
                align: "right"
            },
            {
                title: "促销优惠金额",
                minWidth:120,
                key: "discount_manual",
                align: "right"
            },
            {
                title: "积分抵扣",
                minWidth:100,
                key: "integral_money",
                align: "right"
            },
            {
                title: "优惠券抵扣",
                minWidth:110,
                key: "bonus",
                align: "right"
            },
            {
                title: "储值抵扣",
                minWidth:100,
                key: "prepaidcard_value",
                align: "right"
            },
            {
                title: "余额抵扣",
                minWidth:100,
                key: "surplus",
                align: "right"
            },
            {
                title: "红包抵扣",
                minWidth:100,
                key: "redpack_discount",
                align: "right"
            },
            {
                title: "运费",
                minWidth:100,
                key: "shipping_fee",
                align: "right"
            },
            {
                title: "拆单误差",
                minWidth:100,
                key: "change_amount_disctount",
                align: "right"
            },
            {
                title: "商品销售额",
                minWidth:110,
                key: "goods_real_price",
                align: "right"
            },
            {
                title: "差异数",
                minWidth:100,
                key: "error_price",
                align: "right"
            },
            {
                title: "操作",
                minWidth:100,
                slot: "action",
                fixed: "right",
                align: "center"
            }
        ]
      }
    }
  }
  