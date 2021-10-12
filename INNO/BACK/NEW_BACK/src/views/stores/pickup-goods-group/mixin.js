export default{
	data(){
		return {
			columns: [
				{
					title: "分组名称",
					key: "name",
                    align: "center"
				},
				{
					title: "状态",
					slot: "is_enabled",
                    align: "center"
				},
				{
					title: "店铺数量",
					key: "store_count",
					slot: "store_count",
                    align: "center"
				},
				{
					title: "商品数量",
					key: "goods_count",
                    slot: "goods_count",
					align: "center"
				},
				{
					title: "操作",
					slot: "action",
                    align: "center"
				},
			]
		}
	}
}