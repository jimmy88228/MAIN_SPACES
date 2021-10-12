export default {
  data () {
    return {
      tableColumns: [
        {
          title: '店铺',
          key: '',
          width: 180,
          render (h, {row}) {
            return h('div', [
              h('p', row.store_name),
              h('p', row.store_code),
            ])
          }
        },
        {
          title: '	分销员名称',
          key: 'dstb_staff_name'
        },
        {
          title: '分销员代码	',
          key: 'dstb_staff_code'
        },
        {
          title: '关联会员卡号',
          key: 'card_num'
        },
        {
          title: '分销员电话	',
          key: 'dstb_staff_phone'
        },
        {
          title: '分销身份',
          key: 'dstb_staff_level'
        },
        {
          title: '销售额	',
          key: 'order_amount'
        },
        {
          title: '提成总金额	',
          key: 'comm_amount'
        },
        {
          title: '结算中的金额	',
          key: 'frzon_amount'
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

