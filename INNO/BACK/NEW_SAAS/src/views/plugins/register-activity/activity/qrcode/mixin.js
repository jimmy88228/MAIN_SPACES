export default {
  data () {
    return {
      tableColumns: [
        {
          type: 'selection',
          width: 60
        },
        {
          title: '店铺名称',
          key: 'name'
        },
        {
          title: '店铺代码',
          key: 'code'
        },
        {
          title: '活动二维码',
          key: 'from_store_name',
          align: 'center',
          slot: 'handle'
        }
      ]
    }
  }
}
