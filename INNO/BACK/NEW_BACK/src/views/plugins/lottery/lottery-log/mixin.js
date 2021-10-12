export default {
  data () {
    return {
      tableColumns: [
        {
          title: '活动名称',
          key: 'activity_name',
          align: 'left'
        },
        {
          title: '参与人数',
          key: 'join_user',
          align: 'left'
        },
        {
          title: '参与次数',
          key: 'join_count',
          align: 'left'
        },
        {
          title: '奖品总数',
          key: 'prize_count',
          align: 'left'
        },
        {
          title: '中奖数量',
          key: 'winning_count',
          align: 'left'
        }, {
          title: '剩余数量',
          key: 'rest_count',
          align: 'left'
        },
        {
          title: '类型',
          key: 'activity_type_name',
          align: 'left'
        },
        {
          title: '操作',
          key: 'handle',
          align: 'center',
          width: 300,
          slot: 'handle'
        },
      ]
    }
  }
}
