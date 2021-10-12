export default{
	data(){
		return {
			columns: [
				{
				  title: '活动名称',
				  key: 'activity_name'
				},
				{
				  title: '活动时间',
					align: 'center',
				  slot: 'from_time'
				},
				{
				  title: '是否开启',
					align: 'center',
				  slot: 'switch'
				},
				{
				  title: '操作',
					align: 'center',
				  slot: 'action'
				},
			]
		}
	},
}