export default {
  data () {
    return {
      tableColumns: [
        {
          title: '大屏编号',
          key: 'machine_no',
          align: 'center',
          minWidth: 200,
        },
        {
          title: '登录账号',
          key: 'machine_account',
          minWidth: 200,
          align: 'center'
        },
        {
          title: '关联的店铺',
          key: 'store',
          minWidth: 250,
          align: 'center',
        },
        {
          title: '激活时间',
          key: 'activate_time',
          minWidth: 200,
          align: 'center'
        },
        {
          title: '有效期',
          key: 'expire_time',
          minWidth: 200,
          align: 'center'
        },
        {
          title: '操作',
          key: 'handle',
          width: 100,
          align: 'center',
          fixed: 'right',
          slot: 'handle'
        }
      ]
    }
  }
}
