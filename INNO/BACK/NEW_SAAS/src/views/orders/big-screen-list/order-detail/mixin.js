export default {
  data() {
    return {
      // 这里slot用在jsx中的渲染
      tableColums: [{
          title: "订单详情",
          key: "order_sn",
          ellipsis: true,
          minWidth: 160,
          slot: 'orderInfo'
        },
        {
          title: "买家",
          key: "user_name",
          align: "left",
          minWidth: 100,
          slot: 'user'
        },
        {
          title: "实付金额",
          key: "money_paid",
          align: "left",
          minWidth: 120,
          slot: 'money'
        },
        {
          title: "下单时间",
          key: "create_time_format",
          align: "left",
          minWidth: 100,
          slot: 'createTime'
        },
        {
          title: "财务状态",
          key: "pay_status_name",
          align: "left",
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
          title: "操作",
          key: "handle",
          align: "left",
          minWidth: 80,
          slot: 'handle'
        }
      ]
    }
  }
}
