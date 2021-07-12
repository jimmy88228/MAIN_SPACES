export default {
  data () {
    return {
      columns: [
        {
          title: '操作者',
          key: 'action_user',
          align: 'center'
        },
        {
          title: '操作时间',
          key: 'action_time',
          align: 'center'
        },
        {
          title: '订单状态',
          key: 'order_status',
          align: 'center'
        },
        {
          title: '付款状态',
          key: 'pay_status',
          align: 'center'
        },
        {
          title: '发货状态',
          key: 'shipping_status',
          align: 'center'
        },
        {
          title: '备注',
          key: 'action_note',
          align: 'center'
        }
      ],
      tableData: []
    }
  }
}