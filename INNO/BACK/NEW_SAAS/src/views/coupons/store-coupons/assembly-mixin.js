export default {
  data() {
    return {
      tableColumns: [{
          title: '会员卡号',
          key: 'card',
          align: 'left',
          slot: 'card',
          width: 140
        },
        {
          title: '手机号',
          key: 'phone',
          align: 'left',
          slot: 'phone',
          width: 140
        },
        {
          title: '订单号',
          key: 'order_sn',
          align: 'left',
          width: 160
        },
        {
          title: '订单金额',
          key: 'realmoney',
          align: 'left',
          slot: 'realmoney',
          width: 120
        },
        {
          title: '发放时间',
          key: 'create_time',
          align: 'left',
          slot: 'createTime',
          width: 140
        },
        {
          title: '券号',
          key: 'bonus_sn',
          align: 'left',
          width: 220
        },
        {
          title: '券名',
          key: 'type_name',
          align: 'left',
          slot: 'typeName',
          width: 120
        },
        {
          title: '使用状态',
          key: 'used_status',
          align: 'left',
          width: 100
        },
        {
          title: '使用时间',
          key: 'used_time',
          align: 'left',
          width: 120
        },
        {
          title: '赠送抽奖活动',
          key: 'get_lottery_activity',
          align: 'left',
          slot: 'getLotteryActivity',
          width: 140
        },
        {
          title: '赠送抽奖次数',
          key: 'gived_activity_num',
          align: 'left',
          width: 140
        }
      ]
    }
  }
}
