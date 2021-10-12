export default {
  data () {
    return {
      tableColumns: [
        {
          title: '类型',
          key: 'c_type_str'
        },
        {
          title: '使用人员',
          key: 'worker_str',
           slot: 'worker_str'
        },
        {
          title: '备注',
          key: 'remark'
        },
        {
          title: '操作',
          key: 'handle',
          width: 300,
          align: 'center',
          slot: 'handle'
        }
      ]
    }
  }
}
