export default {
  data () {
    return {
      tableColumns: [
        {
          title: '购买会员',
          key: 'cardNum'
        },
        {
          title: '手机号',
          key: 'mobilePhone'
        },
        {
          title: '购买次数',
          key: 'buyTimes'
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
