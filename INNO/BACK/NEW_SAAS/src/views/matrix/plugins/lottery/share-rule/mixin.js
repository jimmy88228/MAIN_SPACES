export default {
  data () {
    return {
      tableColumns: [
        {
          title: '规则名称',
          key: 'name',
					minWidth: 150,
          align: 'left'
        },
        {
          title: '活动时间',
          slot: 'time',
					minWidth: 180,
          align: 'left'
        },
        {
          title: '允许奖励次数',
          key: 'reward_loop',
					width: 140,
          align: 'left'
        },
        {
          title: '抽奖活动',
					slot:"activitys",
					minWidth: 200,
          align: 'left'
        }, {
          title: '是否启用',
					slot:"enable",
					width: 120,
          align: 'center'
        },
        {
          title: '操作',
          key: 'handle',
          align: 'center',
          width: 200,
          slot: 'handle'
        },
      ]
    }
  }
}
