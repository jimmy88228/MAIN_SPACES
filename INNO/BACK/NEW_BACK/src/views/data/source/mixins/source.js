export default {
    data() {
      return {
        sourceCol: [
            {
                title: "流量来源",
                minWidth: 150,
                // key: "channel_type",
                slot: "channel_type",
                align: "left"
            },
            {
                title: "到达访客数",
                minWidth: 130,
                key: "total_uv",
                sortable: true,
                align: "right"
            },
            {
                title: "到达浏览量",
                minWidth: 130,
                key: "total_pv",
                sortable: true,
                align: "right"
            },
            {
                title: "订单数",
                minWidth: 100,
                key: "orders",
                sortable: true,
                align: "right"
            },
            {
                title: "订单人数",
                minWidth: 120,
                key: "order_users",
                sortable: true,
                align: "right"
            },
            {
                title: "付款单数",
                minWidth: 120,
                key: "pay_orders",
                sortable: true,
                align: "right"
            },
            {
                title: "付款人数",
                minWidth: 120,
                key: "pay_users",
                sortable: true,
                align: "right"
            },
            {
                title: "成交金额",
                minWidth: 120,
                key: "order_amount",
                sortable: true,
                align: "right"
            },
            {
                title: "下单转化率（下单用户数/访客数）",
                minWidth: 200,
                slot: "order_convert_rate",
                sortable: true,
                align: "right"
            },
            {
                title: "付款转化率（付款订单数/总订单数）",
                minWidth: 200,
                slot: "pay_convert_rate",
                sortable: true,
                align: "right"
            },
            {
                title: "操作",
                fixed:"right",
                minWidth: 100,
                slot: "action",
                align: "center"
            },
        ]
      }
    }
  }
  