export default {
    data() {
      const _this = this;
      return {
        totalData: [
            {
                name: "成交额",
                data: 0
            },
            {
                name: "订单数",
                data: 0
            },
            {
                name: "成交件数",
                data: 0
            },
            {
                name: "客单数",
                data: 0
            },
            {
                name: "成交用户数",
                data: 0
            },
            {
                name: "总额",
                data: 0
            },
            {
                name: "促销优惠金额",
                data: 0
            },
            {
                name: "积分抵扣",
                data: 0
            },
            {
                name: "优惠券",
                data: 0
            },
            {
                name: "储值抵扣",
                data: 0
            },
            {
                name: "余额抵扣",
                data: 0
            },
            {
                name: "红包",
                data: 0
            },
            {
                name: "运费",
                data: 0
            },
            {
                name: "拆单误差",
                data: 0
            },
            {
                name: "商品销售额",
                data: 0
            },
            {
                name: "差异数",
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
                title: "时间",
                key: "0",
                width: 120,
                align: "left"
            },
            {
                title: "成交额",
                key: "1",
                minWidth: 100,
                sortable: true,
                align: "right"
            },
            {
                title: "订单数",
                key: "2",
                minWidth: 100,
                sortable: true,
                align: "right"
            },
            {
                title: "成交件数",
                key: "3",
                minWidth: 120,
                sortable: true,
                align: "right"
            },
            {
                title: "客单价",
                key: "4",
                minWidth: 100,
                sortable: true,
                align: "right"
            },
            {
                title: "成交用户数",
                key: "5",
                minWidth: 130,
                sortable: true,
                align: "right"
            },
            {
                title: "总额",
                key: "6",
                minWidth: 100,
                sortable: true,
                align: "right"
            },
            {
                title: "促销优惠金额",
                key: "7",
                minWidth: 140,
                sortable: true,
                align: "right"
            },
            {
                title: "积分抵扣",
                key: "8",
                minWidth: 120,
                sortable: true,
                align: "right"
            },
            {
                title: "优惠券",
                key: "9",
                minWidth: 100,
                sortable: true,
                align: "right"
            },
            {
                title: "储值抵扣",
                key: "10",
                minWidth: 120,
                sortable: true,
                align: "right"
            },
            {
                title: "余额抵扣",
                key: "11",
                minWidth: 120,
                sortable: true,
                align: "right"
            },
            
            {
                title: "红包",
                key: "12",
                minWidth: 100,
                sortable: true,
                align: "right"
            },
            {
                title: "运费",
                key: "13",
                minWidth: 100,
                sortable: true,
                align: "right"
            },
            {
                title: "拆单误差",
                key: "14",
                minWidth: 130,
                sortable: true,
                align: "right"
            },
            {
                title: "商品销售额",
                key: "15",
                minWidth: 140,
                sortable: true,
                align: "right"
            },
            {
                title: "差异数",
                key: "16",
                minWidth: 100,
                sortable: true,
                align: "right"
            }
        ]
      }
    }
  }
  