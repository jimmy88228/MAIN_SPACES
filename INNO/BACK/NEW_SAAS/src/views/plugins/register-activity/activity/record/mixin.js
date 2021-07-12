export default {
  data () {
    return {
      tableColumns: [
        {
          title: '会员号',
          key: 'card_num'
        },
        {
          title: '手机号',
          key: 'mobile_phone'
        },
        {
          title: '发放店铺',
          key: 'from_store_name'
        },
        {
          title: '赠送时间',
          key: 'create_time'
        },
        {
          title: '积分数',
          key: 'gift_points'
        },
        {
          title: '优惠券',
          key: 'gift_bonus_str'
        }
      ]
    }
  }
}
