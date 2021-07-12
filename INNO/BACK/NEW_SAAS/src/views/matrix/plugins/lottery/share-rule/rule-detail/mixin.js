export default {
  data () {
    return {
      tableColumns: [
        {
          title: '活动名称',
          key: 'activity_name',
					minWidth: 150,
          align: 'left'
        },
        {
          title: '分享手机号',
          key: 'mobile_phone',
					minWidth: 180,
          align: 'left'
        },
        {
          title: '分享人卡号',
          key: 'card_num',
					width: 170,
          align: 'left'
        },
        {
          title: '分享访问次数',
					key:"visit_count",
					minWidth: 200,
          align: 'left'
        }, 
				{
          title: '分享访问人数',
					key:"visit_user",
					width: 120,
          align: 'center'
        },
				{
				  title: '分享参与人数',
					key:"join_user",
					width: 120,
				  align: 'center'
				},
				{
				  title: '分享注册人数',
					key:"reg_user",
					width: 120,
				  align: 'center'
				},
				{
				  title: '分享人获得奖励',
					key:"self_reward",
					width: 140,
				  align: 'center'
				},
				{
				  title: '参与人获得奖励',
					key:"friend_reward",
					width: 140,
				  align: 'center'
				},
      ]
    }
  }
}
