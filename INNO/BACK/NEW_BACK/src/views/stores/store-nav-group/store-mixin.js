export default{
	data(){
		return {
			columns: [
				{
					type: "selection",
					width: 60,
					align: 'center'
				},
				{
					title: "店铺名称",
					key: "name"
				},
				{
					title: "店铺代码",
					key: "code"
				},
				{
					title: "操作",
					slot: "action",
					width: 100,
					align: 'right'
				},
			]
		}
	}
}