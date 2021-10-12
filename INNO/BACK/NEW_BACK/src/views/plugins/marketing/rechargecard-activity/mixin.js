export default{
  data () {
    return {
      tableColumns: [
        {
          title: '活动名称	',
          key: 'activity_name',
          align: 'left'
        },
        {
          title: '活动开始时间	',
          key: 'from_time',
          align: 'left',
          slot: 'from_time'
        },
        {
          title: '活动结束时间',
          key: 'to_time',
          align: 'left',
          slot: 'to_time'
        },
        {
          title: '备注',
          key: 'activity_remark',
          align: 'left'
        },
        {
          title: '是否可用',
          key: 'is_enable',
          slot: 'is_enable',
          align: 'left'
        },
        {
          title: '默认活动',
          key: 'is_activity',
          slot: 'is_activity',
          align: 'left'
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
