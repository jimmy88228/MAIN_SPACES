export default {
    data() {
      return {
        goodsTotalCol: [
            {
                title: '款号',
                width: 140,
								key: 'goods_sn',
                align: 'left'
            },
            {
                title: "商品名称",
                key: "goods_name",
                width: 200,
                align: "left"
            },
            {
                title: "1星评价",
                key: "one_star",
                minWidth: 100,
         
                align: "right"
            },
            {
                title: "占比",
                key: "one_star_rate",
                minWidth: 100,
         
                align: "right"
            },
            {
                title: "2星评价",
                key: "two_star",
                minWidth: 100,
         
                align: "right"
            },
            {
                title: "占比",
                key: "two_star_rate",
                minWidth: 100,
         
                align: "right"
            },
            {
                title: "3星评价",
                key: "three_star",
                minWidth: 100,
         
                align: "right"
            },
            {
                title: "占比",
                key: "three_star_rate",
                minWidth: 100,
         
                align: "right"
            },
            {
                title: "4星评价",
                key: "four_star",
                minWidth: 100,
         
                align: "right"
            },
						{
						    title: "占比",
						    key: "four_star_rate",
						    minWidth: 100,
			
						    align: "right"
						},
						{
						    title: "5星评价",
						    key: "five_star",
						    minWidth: 100,
			
						    align: "right"
						},
						{
						    title: "占比",
						    key: "five_star_rate",
						    minWidth: 100,
			
						    align: "right"
						},
						{
						    title: "评价得分",
						    key: "avg_star",
						    minWidth: 100,
			
						    align: "right"
						},
						{
						    title: "正面评价",
						    key: "positive_comment_count",
						    minWidth: 100,
			
						    align: "right"
						},
						{
						    title: "负面评价",
						    key: "negative_comment_count",
						    minWidth: 100,
			
						    align: "right"
						},
        ],
				goodsDetailCol: [
					{
						title: "订单编号",
						key: "order_sn",
						minWidth: 150,
						align: "right"
					},
					{
						title: "商品评分",
						key: "comment_level",
						minWidth: 100,
						align: "right"
					},
					{
						title: "商品名称",
						key: "goods_name",
						minWidth: 200,
						align: "right"
					},
					{
						title: "颜色名称",
						key: "color_name",
						minWidth: 120,
						align: "right"
					},
					{
						title: "尺码名称",
						key: "size_name",
						minWidth: 120,
						align: "right"
					},
					{
						title: "商品款号",
						key: "goods_sn",
						minWidth: 130,
						align: "right"
					},
					{
						title: "会员卡号",
						key: "card_no",
						minWidth: 140,
						align: "right"
					},
					{
						title: "会员昵称",
						key: "real_name",
						minWidth: 140,
						align: "right"
					},
					{
						title: "店铺名称",
						key: "store_name",
						minWidth: 120,
						align: "right"
					},
					{
						title: "店铺编码",
						key: "store_code",
						minWidth: 120,
						align: "right"
					},
					{
						title: "评论时间",
						key: "create_time",
						width: 115,
						align: "center"
					},
					{
						title: "下单时间",
						key: "order_time",
						width: 115,
						align: "center"
					}
				],
				serviceTotalCol: [
					{
						title: "服务类别",
						key: "level_type_name",
						minWidth: 120,
						align: "right"
					},
					{
						title: "1星评价",
						key: "one_star",
						minWidth: 100,
						align: "right"
					},
					{
						title: "占比",
						key: "one_star_rate",
						minWidth: 100,
						align: "right"
					},
					{
						title: "2星评价",
						key: "two_star",
						minWidth: 100,
						align: "right"
					},
					{
						title: "占比",
						key: "two_star_rate",
						minWidth: 100,
						align: "right"
					},
					{
						title: "3星评价",
						key: "three_star",
						minWidth: 100,
						align: "right"
					},
					{
						title: "占比",
						key: "three_star_rate",
						minWidth: 100,
						align: "right"
					},
					{
						title: "4星评价",
						key: "four_star",
						minWidth: 100,
						align: "right"
					},
					{
						title: "占比",
						key: "four_star_rate",
						minWidth: 100,
						align: "right"
					},
					{
						title: "5星评价",
						key: "five_star",
						minWidth: 100,
						align: "right"
					},
					{
						title: "评价得分",
						key: "five_star_rate",
						minWidth: 100,
						align: "right"
					}
				],
				serviceDetailCol: [
					{
						title: "订单编号",
						key: "order_sn",
						minWidth: 120,
						align: "right"
					},
					// 根据不同类型插入数据
					{
						title: "会员卡号",
						key: "card_no",
						minWidth: 140,
						align: "right"
					},
					{
						title: "会员昵称",
						key: "real_name",
						minWidth: 120,
						align: "right"
					},
					{
						title: "店铺名称",
						key: "store_name",
						minWidth: 120,
						align: "right"
					},
					{
						title: "店铺编码",
						key: "store_code",
						minWidth: 120,
						align:"right"
					},
					{
						title: "评论时间",
						key: "comm_time",
						width: 115,
						align: "right"
					},
					{
						title: "下单时间",
						key: "add_time",
						width: 115,
						align: "right"
					}
				],
				storeServiceDetailCol: [
					{
						title: "店铺环境评分",
						key: "store_level",
						minWidth: 140,
						align: "right"
					},
					{
						title: "导购服务评分",
						key: "manner_level",
						minWidth: 140,
						align: "right"
					},
					{
						title: "导购仪表评分",
						key: "staff_level",
						minWidth: 140,
						align: "right"
					}
				],
				goodsServiceDetailCol: [
					{
						title: "包裹评分",
						key: "package_level",
						minWidth: 110,
						align: "right"
					},
					{
						title: "快递速度评分",
						key: "shipping_level",
						minWidth: 140,
						align: "right"
					},
					{
						title: "快递员态度评分",
						key: "manner_level",
						minWidth: 140,
						align: "right"
					}
				]
      }
    }
  }
  