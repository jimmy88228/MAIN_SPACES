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
                key: "statist_date",
                minWidth: 120,
                align: "left"
            },
            {
                title: "新增会员数",
                key: "new_users",
                minWidth: 130,
                sortable: true,
                align: "right"
            },
            {
                title: "交互人数",
                minWidth: 120,
                key: "active_users",
                sortable: true,
                align: "right"
            },
            {
                title: "收藏人数",
                minWidth: 120,
                key: "collection_users",
                sortable: true,
                align: "right"
            },
            {
                title: "加购物车人数",
                minWidth: 140,
                key: "add_carts",
                sortable: true,
                align: "right"
            },
            {
                title: "加购物车转化率",
                minWidth: 160,
                key: "add_cart_rate",
                sortable: true,
                align: "right"
            },
            {
                title: "下单人数",
                minWidth: 120,
                key: "orders",
                sortable: true,
                align: "right"
            },
            {
                title: "下单转化率",
                minWidth: 130,
                key: "orders_rate",
                sortable: true,
                align: "right"
            },
            {
                title: "支付人数",
                minWidth: 120,
                key: "pays",
                sortable: true,
                align: "right"
            },
            {
                title: "支付转化率",
                minWidth: 130,
                key: "pays_rate",
                sortable: true,
                align: "right"
            }
        ]
      }
    }
  }
  