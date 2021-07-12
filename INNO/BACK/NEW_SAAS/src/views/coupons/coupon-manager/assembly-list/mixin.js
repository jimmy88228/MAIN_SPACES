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
          title: '优惠券序列号',
          key: 'bonus_sn',
          align: 'center',
          width: 140
        },
        {
          title: '现金券类型',
          key: 'get_coupons',
          align: 'center',
          slot: 'coupons',
          width: 120
        },
        {
          title: '订单号',
          key: 'order',
          align: 'center',
          slot: 'order',
          width: 100
        },
        {
          title: '手机号',
          key: 'phone',
          align: 'center',
          slot: 'phone',
          width: 140
        },
        {
          title: '会员卡号',
          key: 'card',
          align: 'center',
          slot: 'card',
          width: 140
        },
        {
          title: '会员昵称',
          key: 'real_name',
          align: 'center',
          slot: 'realName',
          width: 140
        },
        {
          title: '关注公众号',
          key: 'weixin_subscribe',
          align: 'center',
          width: 100,
          slot: 'weixinSubscribe'
        },
        {
          title: '绑定小程序',
          key: 'applet_openid',
          align: 'center',
          width: 100,
          slot: 'appletOpenid'
        },
        {
          title: '发放时间',
          key: 'send_time',
          align: 'center',
          slot: 'sendTime',
          width: 140,
          sortable: 'custom'
        },
        {
          title: '领取渠道',
          key: 'channel_type',
          align: 'center',
          width: 100
        },
        {
          title: '使用时间',
          key: 'used_time',
          align: 'center',
          width: 140,
          slot: 'usedTime',
          sortable: 'custom'
        },
        {
          title: '使用店铺',
          key: 'store_name',
          align: 'center',
          width: 140
        },
        {
          title: '店铺名称',
          key: 'store_name',
          align: 'center',
          width: 140
        },
        {
          title: '备注',
          key: 'remark',
          align: 'center',
          width: 120
        },
        {
           title: '转赠会员',
           key: 'share_people',
           align: 'center',
           width: 120
         },
        {
          title: '转赠成功时间',
          key: 'share_time',
          align: 'center',
          width: 140,
          sortable: 'custom'
        },
        {
          title: '操作',
          key: 'handle',
          align: 'left',
          slot: 'handle',
          width: 80
        }
      ]
    }
  }
}
