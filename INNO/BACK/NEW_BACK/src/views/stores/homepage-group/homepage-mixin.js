export default{
	data(){
		return {
			columns: [
				{
					title: "分组名称",
					key: "name"
				},
				{
					title: "显示状态",
					slot: "is_enabled"
				},
				{
					title: "店铺数量",
					slot: "store_count"
				},
				{
					title: "操作",
					slot: "action"
				},
			]
		}
	}
}