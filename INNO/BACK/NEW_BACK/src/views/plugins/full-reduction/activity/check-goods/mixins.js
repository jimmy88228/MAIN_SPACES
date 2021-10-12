export default{
	data(){
		return {
			tableColumns: [
				{
					key: 'goods_sns', 
					title: '货号'
				},
				{
					key: 'rule_name',
					title: '促销名称'
				},
				{
					key: 'is_enable',
					align: 'center',
					slot: 'is_enable',
					width: 100,
					title: '是否启用'
				},
				{
					key: 'goods_num',
					slot: 'goods_num',
					width: 150,
					align: 'center',
					title: '查询结果'
				}
			]
		}
	}
}