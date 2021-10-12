export default {
  data () {
    return {
      tableColumns: [
        {
          title: '优惠券名称',
          width: 160,
          key: 'type_name'
        },
        {
          title: '优惠券编码',
          width: 160,
          key: 'bonus_sn'
        },
        {
          title: '手机号',
          width: 120,
          key: 'mobile_phone'
        },
        {
          title: '会员卡号',
          width: 160,
          key: 'card_num'
        },
        {
          title: '派发分销员名称',
          width: 140,
          key: 'staff_name'
        },
        {
          title: '派发分销员代码',
          width: 140,
          key: 'staff_code'
        },
        {
          title: '派发开始时间',
          key: 'activityDate',
          width: 120,
          slot: 'activityDate'
        },
        {
          title: '派发结束时间',
          key: 'activityDateEnd',
          width: 120,
          slot: 'activityDateEnd'
        },
        {
          title: '派发备注	',
          width: 160,
          key: 'remark'
        },
        {
          title: '发放时间	',
          width: 120,
          key: 'created_at',
          slot: 'created_at'
        },
        {
          title: '可用时间	',
          width: 120,
          key: 'useDate',
          slot: 'useDate'
        },
        {
          title: '转赠会员',
          width: 140,
          key: 'share_card_num'
        },
        {
          title: '转赠成功时间',
          width: 120,
          key: 'share_time',
          slot: 'share_time'
        }
      ]
    }
  }
}
