export default {
  data () {
    return {
      tableColumns: [
        {
          title: '活动名称',
          key: 'activity_name'
        },
        {
          title: '活动状态',
          key: 'time_type'
        },
        {
          title: '抽奖活动',
          key: 'lotter_data'
        },
        {
          title: '赠送优惠券',
          key: 'bouns_data',
          slot: 'bouns'
        },
        {
          title: '赠送积分',
          key: 'gift_points'
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
          title: '是否可用',
          key: 'is_enable',
          slot: 'is_enable'
        },
        {
          title: '操作',
          key: 'handle',
          slot: 'handle'
        }
      ]
    }
  }
}
