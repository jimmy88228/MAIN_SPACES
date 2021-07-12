export default {
    data() {
      return {
        dataCol: [
            {
                title: "时间",
                key: "op_date",
                minWidth: 120,
                align: "left"
            },
            {
                title: "到达浏览量",
                minWidth: 110,
                key: "total_pv",
                sortable: true,
                align: "right"
            },
            {
                title: "到达访客数",
                minWidth: 110,
                key: "total_uv",
                sortable: true,
                align: "right"
            },
            {
                title: "二级浏览量",
                minWidth: 110,
                key: "second_pv",
                sortable: true,
                align: "right"
            },
            {
                title: "二级范访客数",
                minWidth: 120,
                key: "second_uv",
                sortable: true,
                align: "right"
            },
            {
                title: "页面跳出率",
                minWidth: 110,
                key: "jump_out_rate",
                sortable: true,
                align: "right"
            },
            {
                title: "下单人数",
                minWidth: 100,
                key: "order_users",
                sortable: true,
                align: "right"
            },
            {
                title: "支付人数",
                minWidth: 100,
                key: "pay_users",
                sortable: true,
                align: "right"
            },
            {
                title: "下单转化率",
                minWidth: 110,
                key: "order_convert_rate",
                sortable: true,
                align: "right"
            },
            {
                title: "付款订单数",
                minWidth: 110,
                key: "pay_orders",
                sortable: true,
                align: "right"
            },
            {
                title: "支付转化率",
                minWidth: 110,
                key: "pay_convert_rate",
                sortable: true,
                align: "right"
            },
            {
                title: "成交金额",
                minWidth: 100,
                key: "order_amount",
                sortable: true,
                align: "right"
            },
        ]
      }
    }
  }
  