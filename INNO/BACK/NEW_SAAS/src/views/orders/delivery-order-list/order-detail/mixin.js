export default {
  data() {
    return {
      // 这里slot用在jsx中的渲染
      tableColums: [{
          title: "订单详情",
          key: "order_sn",
          ellipsis: true,
          minWidth: 320,
          slot: 'orderInfo'
        },
        {
          title: "下单时间",
          key: "add_time",
          align: "left",
          minWidth: 120,
          slot: 'createTime'
        },
        {
          title: "收货人",
          key: "consignee",
          align: "left",
          minWidth: 100,
          slot: 'user'
        },
        {
          title: "最后更新时间",
          key: "update_time",
          align: "left",
          minWidth: 120,
          slot: 'updateTime'
        },
        {
          title: "发货单状态",
          key: "status",
          align: "left",
          minWidth: 100,
          slot: 'status'
        },
        {
          title: "操作人",
          key: "action_user",
          align: "left",
          minWidth: 100,
          slot: 'actionUser'
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
