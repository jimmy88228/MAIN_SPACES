export default {
    data() {
      const _this = this;
      return {
        columns: [
            {
                type: 'index',
                width: 60,
                align: 'center'
            },
            {
                title: "日期",
                key: "op_date",
                minWidth: 120,
                align: "left"
            },
            {
                title: "新增会员数",
                key: "reg_user",
                minWidth: 130,
                sortable: true,
                align: "right"
            },
            {
                title: "交互人数",
                minWidth: 120,
                key: "active_user",
                sortable: true,
                align: "right"
            },
            {
                title: "收藏人数",
                minWidth: 120,
                key: "fav_user",
                sortable: true,
                align: "right"
            },
            {
                title: "加购物车人数",
                minWidth: 150,
                key: "addcart_user",
                sortable: true,
                align: "right"
            },
            {
                title: "加购物车转化率",
                minWidth: 160,
                key: "addcart_rate",
                sortable: true,
                align: "right"
            },
            {
                title: "下单人数",
                minWidth: 120,
                key: "order_user",
                sortable: true,
                align: "right"
            },
            {
                title: "下单转化率",
                minWidth: 130,
                key: "order_rate",
                sortable: true,
                align: "right"
            },
            {
                title: "支付人数",
                minWidth: 120,
                key: "pay_user",
                sortable: true,
                align: "right"
            },
            {
                title: "支付转化率",
                minWidth: 130,
                key: "pay_rate",
                sortable: true,
                align: "right"
            }
        ]
      }
    }
  }
  