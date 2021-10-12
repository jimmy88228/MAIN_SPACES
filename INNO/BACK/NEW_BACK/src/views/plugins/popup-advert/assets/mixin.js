export default {
  data () {
    return {
      tableColumns: [
        {
          title: '活动信息',
          key: 'name',
          slot: 'name'
        },
        {
          title: '活动开始时间',
          key: 'begin_time',
          slot: 'begin_time'
        },
        {
          title: '活动结束时间',
          key: 'end_time',
          slot: 'end_time'
        },
        {
          title: '活动状态',
          key: 'enable_str'
        },
        {
          title: '排序',
          key: 'sort'
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
