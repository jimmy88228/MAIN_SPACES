export default {
  data () {
    return {
      tableColumns: [
        {
          title: '活动名称',
          key: 'name',
          align: 'center'
        },
        {
          title: '活动开始时间',
          key: 'start_time',
          slot: 'start_time',
          align: 'center'
        },
        {
          title: '活动结束时间',
          key: 'end_time',
          slot: 'end_time',
          align: 'center'
        },
        {
          title: '是否可用',
          key: 'is_enabled',
          slot: 'is_enabled',
          align: 'center'
        },
        {
          title: '操作',
          key: 'handle',
          slot: 'handle',
          align: 'center'
        }
      ]
    }
  }
}
