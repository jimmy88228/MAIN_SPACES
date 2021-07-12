export default {
    data() {
      const _this = this;
      return {
        totalData: [
            {
                name: "总下单件数",
								key: "all_goods_num",
                data: 0
            },
            {
                name: "总退单件数",
								key: "all_return_num",
                data: 0
            },
            {
                name: "总退货比例",
								key: "all_return_rate",
                data: 0
            }
        ],
        columns: [
            {
                type: 'index',
                width: 60,
                align: 'center'
            },
            {
                title: "日期",
                key: "createTime",
                width: 130,
                align: "left"
            },
            {
                title: "下单单量",
                key: "order_nums",
                minWidth: 120,
                sortable: true,
                align: "right"
            },
            {
                title: "退单单量",
                key: "orders",
                minWidth: 120,
                sortable: true,
                align: "right"
            },
            {
                title: "下单件数",
                key: "good_nums",
                minWidth: 120,
                sortable: true,
                align: "right"
            },
            {
                title: "退单件数",
                key: "returnGoodsNum",
                minWidth: 120,
                sortable: true,
                align: "right"
            },
            {
                title: "退货金额",
                key: "returnGoodsAmount",
                minWidth: 120,
                sortable: true,
                align: "right"
            },
            {
                title: "退款金额",
                key: "returnTotalAmount",
                minWidth: 120,
                sortable: true,
                align: "right"
            },
            {
                title: "退货比例",
                key: "return_rate",
                minWidth: 120,
                sortable: true,
                align: "right"
            }
        ]
      }
    }
  }
  