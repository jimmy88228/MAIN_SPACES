export default {
  data () {
    return {
      tableColumns: [
        {
          title: '活动名称',
          key: 'activityName'
        },
        {
          title: '卡号',
          key: 'cardNum'
        },
        {
          title: '手机号',
          key: 'mobilePhone'
        },
        {
          title: '支付单号',
          key: 'paymentSn'
        },
        {
          title: '支付金额',
          key: 'orderAmount'
        },
        {
          title: '支付时间',
          key: 'payTime',
          slot: 'payTime'
        },
        {
          title: '发放的优惠券',
          key: 'bonusNameList'
        }
      ]
    }
  }
}
