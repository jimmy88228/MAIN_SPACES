export default {
  data () {
    return {
      tableColumns: [
        {
          title: '活动名称',
          key: '',
          slot: 'activity'
        },
        {
          title: '商品',
          key: 'related_name',
          render (h, {row}) {
            return h('p', row.related.related_name)
          }
        },
        {
          title: '排序',
          key: 'sort'
        },
        {
          title: '活动开始时间',
          key: '',
          slot: 'from_time'
        },
        {
          title: '活动结束时间',
          key: '',
          slot:'to_time'
        },
        {
          title: '状态',
          key: 'is_enabled',
          slot: 'is_enabled'
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
