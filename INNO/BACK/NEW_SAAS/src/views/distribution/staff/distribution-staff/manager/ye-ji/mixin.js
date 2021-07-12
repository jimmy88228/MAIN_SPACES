export default {
  data () {
    return {
      tableColumns: [
        {
          title: '订单编号',
          key: 'related_order_sn'
        },
        {
          title: '下单会员',
          key: '',
          render(h, {row}) {
            return h('p', row.get_members.real_name)
          }
        },
        {
          title: '会员编号',
          key: '',
          render(h, {
            row
          }) {
            return h('p', row.get_members.card_num)
          }
        },
        {
          title: '下单时间',
          key: 'comm_date'
        },
        {
          title: '订单金额',
          key: 'order_amount'
        },
        {
          title: '订单收益',
          key: 'income'
        },
        {
          title: '收益状态',
          key: 'status_str'
        },
        {
          title: '操作',
          key: '',
          slot: 'handle'
        },
      ]
    }
  }
}
