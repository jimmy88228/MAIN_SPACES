export default {
  data () {
    return {
      tableColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '店员信息',
          key: 'staffInfo',
          align: 'left',
          slot: 'staffInfo'
        },
        {
          title: '店员代码',
          key: 'staff_code',
          align: 'left'
        },
        {
          title: '店员手机',
          key: 'staff_mobile',
          align: 'left'
        },
        {
          title: '所属店铺',
          key: 'store',
          align: 'left'
        },
        {
          title: '所属组',
          key: 'group_name',
          align: 'center'
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
