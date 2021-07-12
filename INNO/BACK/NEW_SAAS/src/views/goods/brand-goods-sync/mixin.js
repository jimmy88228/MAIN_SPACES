export default {
  data () {
    return {
      tableColumns: [
        {
          title: '任务名称',
          key: 'name'
        },
        {
          title: '创建时间',
          key: 'created_at'
        },
        {
          title: '创建人',
          key: 'user_name'
        },
        {
          title: '状态',
          key: 'status',
          slot: 'status'
        },
        {
          title: '执行时间',
          key: 'exec_time'
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
