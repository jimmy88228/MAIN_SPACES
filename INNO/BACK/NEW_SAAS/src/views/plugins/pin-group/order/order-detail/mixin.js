export default {
  data() {
    return {
      // 这里slot用在jsx中的渲染
      tableColums: [{
          title: "拼团信息",
          key: "order_sn",
          ellipsis: true,
          minWidth: 220,
          slot: 'orderInfo'
        },
        {
          title: "会员信息",
          key: "user",
          align: "left",
          minWidth: 100,
          slot: 'userInfo'
        },
        {
          title: "下单时间",
          key: "order_time",
          align: "left",
          width: 260,
          slot: 'orderTime'
        },
        {
          title: "订单信息",
          key: "order",
          align: "left",
          width: 320,
          slot: 'order'
        },
        {
          title: "拼团状态",
          key: "pay_status_name",
          align: "left",
          minWidth: 100,
          slot: 'payStatus'
        },
        {
          title: "操作",
          key: "handle",
          align: "left",
          width: 240,
          slot: 'handle'
        }
      ]
    }
  }
}
