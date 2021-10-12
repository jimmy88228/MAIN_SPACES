export default {
    data() {
      const _this = this;
      return {
        columns: [
            {
                title: "优惠券类型",
                key: "bonus_type_name",
                width: 140,
                align: "left"
            },
            {
                title: "优惠券名称",
                key: "type_name",
                minWidth: 120,
                align: "right"
            },
            {
                title: "现金券编码",
                key: "type_code",
                minWidth: 160,
                align: "right"
            },
            {
                title: "发放会员数",
                key: "total_qty",
								sortable: true,
                minWidth: 130,
                align: "center"
            },
            {
                title: "会员使用数量",
                key: "used_qty",
								sortable: true,
                minWidth: 140,
                align: "right"
            },
            {
                title: "使用生意额",
                key: "saleAmount",
								sortable: true,
                minWidth: 140,
                align: "right"
            },
            {
                title: "平均折扣",
                key: "aver_discount",
								sortable: true,
                minWidth: 120,
                align: "right"
            },
            {
                title: "交易笔数",
                key: "saleQty",
								sortable: true,
                minWidth: 140,
                align: "right"
            },
						{
						    title: "未使用会员数",
						    key: "un_used_qty",
						    minWidth: 130,
						    align: "right"
						},
						{
						    title: "使用比例",
						    key: "used_rate",
						    minWidth: 120,
						    align: "right",
								render: (h, params) => {
									return h('div', params.row.used_rate + '%');
							}
						}
        ]
      }
    }
  }
  