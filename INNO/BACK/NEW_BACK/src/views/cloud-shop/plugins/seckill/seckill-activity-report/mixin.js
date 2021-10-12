export default {
  data () {
    return {
      tableColumns: [
        {
          title: '序号',
          key: 'id',
          align: 'center',
          width: 100,
        },
		{
			title: '活动名称',
			key: 'activity_name',
			align: 'center',
		},
        {
          title: '发起人会员号',
          key: 'user_card_num',
          align: 'center',
        },
        {
          title: '发起时间',
          key: 'create_time',
          align: 'left',
		  width: 140,
          slot: 'create_time'
        },
        {
          title: '获得资格时间',
          key: 'finish_time',
          align: 'left',
		  width: 140,
          slot: 'finish_time'
        },
        {
          title: '助力人会员卡号',
          key: 'friend_card_num',
          align: 'left',
		  width: 150,
        },
          {
          title: '助力人手机号',
          key: 'friend_mobile_phone',
          align: 'left',
		  width: 150,
        },
          {
          title: '助力时间',
          key: 'friend_help_time',
          align: 'left',
		  width: 120,
          slot: 'friend_help_time'
        },
          {
          title: '资格状态',
          key: 'state',
          align: 'left',
		  width: 120,
        }
      ]
    }
  }
}
