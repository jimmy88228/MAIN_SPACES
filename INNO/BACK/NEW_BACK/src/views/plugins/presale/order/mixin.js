export default {
  data () {
    return {
      tableColumns: [
        {
          title: '订单详情',
          key: 'order_detail',
          align: 'left',
          minWidth: 420,
          slot: 'orderInfo'
        },
        {
          title: '买家',
          key: 'user',
          align: 'left',
          width: 200,
          slot: 'user'
        },
        {
          title: '实付',
					minWidth: 100,
          key: 'pay',
          align: 'left',
          slot: 'pay'
        },
        {
          title: '下单时间',
          key: 'modify_date',
					minWidth: 120,
          align: 'left',
          slot: 'modifyDate'
        },
        {
          title: '支付状态',
					minWidth: 110,
          key: 'pay_status_str',
          align: 'left'
        },
        {
          title: '订单状态',
					minWidth: 110,
          key: 'order_status_str',
          align: 'left'
        },
        {
          title: '操作',
          key: 'handle',
          width: 200,
          align: 'left',
          slot: 'handle'
        }
      ]
    }
  }
}
