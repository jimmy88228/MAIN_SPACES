export default {
  data () {
    return {
      tableColumns: [
        {
          title: '活动名称',
          key: 'activityName'
        },
        {
          title: '价格',
          key: 'orderAmount'
        },
        {
          title: '会员',
          key: 'cardNum'
        },
        {
          title: '手机',
          key: 'mobilePhone'
        },
        {
          title: '购买时间',
          key: 'payTime',
          slot: 'payTime'
        },
        {
          title: '支付单号',
          key: 'paymentSn'
        },
        {
          title: '状态',
          key: 'returnStatus'
        }
      ]
    }
  }
}
