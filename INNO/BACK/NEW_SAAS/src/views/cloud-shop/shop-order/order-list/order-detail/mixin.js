export default {
  data() {
    return {
      // 这里slot用在jsx中的渲染
      tableColums: [{
          title: "商品信息",
          key: "order_sn",
          ellipsis: true,
          minWidth: 160,
          slot: 'orderInfo'
        },
        {
          title: "单价/数量",
          key: "price",
          align: "right",
          minWidth: 100
        },
        {
          title: "实付金额",
          key: "money_paid",
          align: "center",
          minWidth: 100,
          slot: 'money'
        },
        {
          title: "会员卡号",
          key: "card",
          align: "center",
          minWidth: 140,
          slot: 'card'
        },
        {
          title: "财务状态",
          key: "pay_status_name",
          align: "center",
          minWidth: 100,
          slot: 'payStatus'
        },
        {
          title: "订单状态",
          key: "order_status_name",
          align: "center",
          minWidth: 100,
          slot: 'orderStatus'
        },
        {
          title: "送货信息",
          key: "user_info",
          align: "left",
          minWidth: 150,
          slot: 'userInfo'
        },
        {
          title: "操作",
          key: "handle",
          align: "center",
          minWidth: 80,
          slot: 'handle'
        }
      ]
    }
  }
}
