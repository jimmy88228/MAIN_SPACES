export default {
  data() {
    return {
      // 这里slot用在jsx中的渲染
      tableColums: [
				{
					title: " ",
					key: "--",
					width: 60
				},
				{
          title: "订单详情",
          key: "order_sn",
          ellipsis: true,
          minWidth: 420,
          slot: 'orderInfo'
        },
        {
          title: "退单时间",
          key: "add_time",
          align: "left",
          minWidth: 120,
          slot: 'createTime'
        },
        {
          title: "下单人",
          key: "nick_name",
          align: "left",
          minWidth: 100,
          slot: 'user'
        },
        {
          title: "类型",
          key: "refund_type_str",
          align: "left",
          minWidth: 120,
          slot: 'state'
        },
        {
          title: "退单状态",
          key: "confirm_status_str",
          align: "left",
          minWidth: 100,
          slot: 'status'
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
