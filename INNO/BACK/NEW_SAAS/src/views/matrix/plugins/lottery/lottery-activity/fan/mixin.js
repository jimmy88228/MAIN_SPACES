export default {
  data () {
    return {
      tableColumns:[
        {
          title: '活动名称',
					minWidth: 140,
          key: 'name'
        },
        {
          title: '抽奖机会',
					minWidth: 200,
          slot: 'joinKindStr'
        },
        {
          title: '开始时间',
          key: 'start_time',
					minWidth: 120,
          slot: 'fromDate'
        },
        {
          title: '结束时间',
          key: 'end_time',
					minWidth: 120,
          slot: 'toDate'
        },
				{
				  title: '所属分享规则',
					minWidth: 180,
				  slot: 'get_lottery_share_rule',
				},
        {
          title: '状态',
					minWidth: 140,
          key: 'isEnabled',
          slot: 'isEnabled'
        },
        {
          title: '操作',
					minWidth: 160,
          key: '	',
          slot: 'handle'
        }
      ]
    }
  }
}
