export default {
  data () {
    return {
      tableColumns: [
        {
          title: '卡号',
          key: 'cardNum'
        },
        {
          title: '手机号',
          key: 'mobilePhone'
        },
        {
          title: '订单号',
          key: 'applySn'
        },
        {
          title: '订单金额',
          key: 'orderAmount'
        },
        {
          title: '实付金额',
          key: 'moneyPaid'
        },
        {
          title: '类型',
          key: 'moneyPaid'
        },
        {
          title: '支付单号',
          key: 'paymentSn'
        },
        {
          title: '下单时间',
          key: 'createTime',
          slot: 'createTime'
        },
        {
          title: '获得奖励',
          key: 'giftName'
        }
      ]
    }
  }
}
