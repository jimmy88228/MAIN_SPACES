export default {
  data () {
    return {
      tableColumns: [
        {
          title: '活动名称',
          key: 'name'
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
          title: '操作',
          key: 'handle',
          slot: 'handle'
        }
      ]
    }
  }
}
