export default {
  data () {
    return {
      tableColumns: [
        {
          title: '任务名称',
          key: 'plan_name',
          align: 'left',
          width:300,
        },
        {
          title: '推送时间',
          key: 'plan_exec_time',
          align: 'left',
          width:120,
        },
        {
          title: '执行状态',
          key: 'status_str',
          align: 'center',
          width:300,
        },
        {
          title: '关联呼出任务',
          key: 'phone_name',
          align: 'left'
        },
        {
          title: '已推送人数',
          key: 'log_count',
          align: 'right'
        },
        {
          title: '操作',
          key: 'handle',
          align: 'center',
          slot: 'handle'
        }
      ],
    }
  }
}
