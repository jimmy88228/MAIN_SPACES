export default {
  data () {
    return {
      tableColumns: [
        {
          title: '活动名称',
          key: 'activity_name'
        },
        {
          title: '活动开始时间',
          key: 'from_time',
          slot: 'from_time'
        },
        {
          title: '活动结束时间',
          key: 'to_time',
          slot: 'to_time'
        },
        {
          title: '总邀请人数',
          key: 'invite_users'
        },
        {
          title: '被邀请总人数',
          key: 'visit_users'
        },
        {
          title: '成功奖励人数',
          key: 'benefit_users'
        }
      ]
    }
  }
}
