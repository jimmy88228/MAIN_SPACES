export default {
  data () {
    return {
      tableColumns: [
        {
          title: '优惠券名称',
          width: 160,
          key: 'type_code'
        },
        {
          title: '优惠券编码',
          width: 160,
          key: 'type_name'
        },
        {
          title: '优惠券序列号',
          width: 160,
          key: 'bonus_sn'
        },
        {
          title: '订单号',
          width: 160,
          key: 'order_sn'
        },
        {
          title: '手机号',
          width: 160,
          key: 'mobile_phone'
        },
        {
          title: '会员卡号',
          width: 160,
          key: 'card_num'
        },
        {
          title: '发放时间',
          width: 160,
          key: 'send_time',
          slot: 'send_time'
        },
        {
          title: '使用时间',
          width: 160,
          key: 'used_time',
          slot: 'used_time'
        },
        {
          title: '使用店铺',
          width: 160,
          key: 'store_code'
        },
        {
          title: '店铺名称',
          width: 160,
          key: 'store_name'
        },
        {
          title: '备注',
          width: 160,
          key: 'remark'
        },
        {
          title: '转赠会员',
          width: 160,
          key: 'share_people'
        },
        {
          title: '转赠成功时间',
          width: 160,
          key: 'share_time',
          slot: 'share_time'
        },
        {
          title: '操作',
          key: ''
        }
      ]
    }
  }
}
