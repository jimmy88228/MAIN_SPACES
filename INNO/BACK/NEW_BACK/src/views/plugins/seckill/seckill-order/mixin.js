export default {
  data () {
    return {
      tableColums: [
        {
          title: '订单详情',
          key: '',
          slot: 'name',
          minWidth: 300
        },
        {
          title: '买家',
          key: '',
          slot: 'user'
        },
        {
          title: '实付',
          key: '',
          slot: 'pay'
        },
        {
          title: '下单时间',
          key: '',
          slot: 'create_time'
        },
        {
          title: '支付状态',
          key: 'pay_state_str'
        },
        {
          title: '订单状态',
          key: 'order_state_str'
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
