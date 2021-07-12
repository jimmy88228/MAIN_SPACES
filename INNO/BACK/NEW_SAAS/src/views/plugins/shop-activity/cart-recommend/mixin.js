export default {
  data () {
    return {
      tableColumns: [
        {
          title: '活动推荐名称',
          key: 'active_name'
        },
        {
          title: '活动开始时间',
          key: 'stime',
          slot: 'stime'
        },
        {
          title: '活动结束时间',
          key: 'etime',
          slot: 'etime'
        },
        {
          title: '是否启用',
          key: 'is_enabled',
          slot: 'is_enabled'
        },
        {
          title: '操作',
          key: 'handle',
          align: 'center',
          slot: 'handle'
        }
      ]
    }
  }
}
