export default {
  data () {
    return {
      tableColumns: [
        {
          title: '活动名称',
          key: 'activity_name',
          align: 'center'
        },
        {
          title: '会员卡号',
          key: 'card_num',
          align: 'center'
        },
        {
          title: '手机号',
          key: 'mobile_phone',
          align: 'center'
        },
        {
          title: '所领赠品',
          key: 'goods_name',
          align: 'center'
        },
        {
          title: '领取时间',
          key: 'receive_time',
          slot: 'receive_time',
          align: 'center'
        },
        {
          title: '领取状态',
          key: 'receive_status',
          align: 'center'
        },
        {
          title: '关联订单号',
          key: 'related_order_sn',
          slot: 'related_order_sn',
          align: 'center',
          width: '300',
        }
      ]
    }
  }
}
