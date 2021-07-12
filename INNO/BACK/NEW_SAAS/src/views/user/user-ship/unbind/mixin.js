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
          title: '会员卡号',
          key: 'user_name',
          align: 'left'
        },
        {
          title: '会员昵称',
          key: 'real_name',
          align: 'left'
        },
        {
          title: '所属导购',
          key: 'store_code',
          align: 'left'
        }
      ]
    }
  }
}
