export default {
  data () {
    return {
      columns: [
        {
          title: '操作者',
          key: 'action_user',
          align: 'center'
        },
        {
          title: '操作时间',
          key: 'log_time',
          align: 'center'
        },
        {
          title: '退单状态',
          key: 'refund_status_str',
          align: 'center'
        },
        {
          title: '审核状态',
          key: 'confirm_status_str',
          align: 'center'
        },
        // {
        //   title: '账务状态',
        //   key: 'clear_status_name',
        //   align: 'center'
        // },
        {
          title: '备注',
          key: 'action_note',
          align: 'center'
        }
      ],
      tableData: []
    }
  }
}
