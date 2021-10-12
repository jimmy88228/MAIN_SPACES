export default {
  data () {
    return {
      tableColumns: [
        {
          title: '优惠券类型',
          key: 'name',
          align: 'left'
        },
        {
          title: '编码',
          key: 'code',
          align: 'left'
        },
        {
          title: '是否启用',
          key: 'is_enabled',
          align: 'left',
          slot: 'enable'
        },
        {
          title: '操作',
          key: 'handle',
          align: 'left',
          slot: 'handle'
        }
      ]
    }
  }
}
