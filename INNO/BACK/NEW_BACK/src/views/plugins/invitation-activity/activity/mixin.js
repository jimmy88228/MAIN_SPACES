export default {
  data () {
    return {
      tableColumns: [
        {
          title: '活动名称',
          key: 'name'
        },
        {
          title: '活动时间',
          key: 'range'
        },
        {
          title: '创建时间',
          key: 'createTime'
        },
        {
          title: '状态',
          key: 'status'
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
