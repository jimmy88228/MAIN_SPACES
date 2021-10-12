export default {
  data () {
    return {
      tableColumns: [
        {
          title: '群ID',
          key: 'group_id'
        },
        {
          title: '群名称',
          key: 'group_name'
        },
        {
          title: '群编码',
          key: 'group_code'
        },
        {
          title: '群管理员',
          key: 'group_manager'
        },
        {
          title: '店铺名称',
          key: 'get_store',
          slot: 'storeName'
        },
        {
          title: '店铺代码',
          key: 'get_store',
          slot: 'storeCode'
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
