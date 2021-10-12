export default {
  data () {
    return {
      tableColumns: [
        {
          title: '活动名称',
          key: 'activity_name',
          align: 'left'
        },
        {
          title: '会员卡号',
          key: 'card_num',
          align: 'left'
        },
        {
          title: '会员名称',
          key: 'nick_name',
          align: 'left'
        },
        {
          title: '手机号',
          key: 'mobile_phone',
          align: 'left'
        },
        {
          title: '状态',
          key: 'receive_status_str',
          align: 'left'
        },
				{
				  title: '中奖时间',
				  key: 'create_time',
				  align: 'left',
				  slot: 'create_time'
				},
				{
				  title: '领奖时间',
				  key: 'receive_time',
				  align: 'left',
				  slot: 'receive_time'
				},
        {
          title: '奖品类型',
          key: 'prizes_type_str',
          align: 'left'
        },
        {
          title: '奖品图片',
          key: 'prize_img',
          align: 'left',
          slot: 'prize_img'
        },
        {
          title: '奖品清单',
          key: 'prizes_name',
          align: 'left'
        },
        // {
        //   title: '活动开始时间',
        //   key: 'create_time',
        //   align: 'left',
        //   slot: 'create_time'
        // },
        // {
        //   title: '活动结束时间',
        //   key: 'receive_time',
        //   align: 'left',
        //   slot: 'receive_time'
        // }
      ]
    }
  }
}
