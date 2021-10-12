export default {
  data() {
    return {
      // 这里slot用在jsx中的渲染
      tableColums: [{
          title: "订单详情",
          key: "return_sn",
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
          key: "card_num",
          align: "left",
          minWidth: 100,
          slot: 'user'
        },
        {
          title: "退单类型",
          key: "return_type_str",
          align: "left",
          minWidth: 120,
          slot: 'returnType'
        },
        {
          title: "退货类型",
          key: "refund_type_str",
          align: "left",
          minWidth: 100,
          slot: 'refundType'
        },
        {
          title: "退单状态",
          key: "return_status_str",
          align: "left",
          minWidth: 100,
          slot: 'returnStatus'
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
