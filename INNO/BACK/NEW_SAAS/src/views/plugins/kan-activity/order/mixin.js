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
          title: '价格',
          key: '',
					minWidth: 100,
          slot: 'price'
        },
        {
          title: '买家',
					minWidth: 100,
          key: 'haggle_activity_name'
        },
        {
          title: '实付',
					minWidth: 100,
          key: 'order_amount'
        },
        {
          title: '下单时间',
					minWidth: 120,
          key: 'create_time',
          slot: 'create_time'
        },
        {
          title: '支付状态',
					minWidth: 120,
          key: 'pay_status_str'
        },
        {
          title: '订单状态',
					minWidth: 120,
          key: 'activity_status_str'
        },
        {
          title: '操作',
          key: 'handle',
          width: 200,
          slot: 'handle'
        }
      ]
    }
  }
}
