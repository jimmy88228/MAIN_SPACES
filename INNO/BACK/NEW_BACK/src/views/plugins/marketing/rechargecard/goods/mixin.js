export default {
  data () {
    return {
      tableColumns: [
        // {
        //   type: 'selection',
        //   width: 60,
        //   align: 'left'
        // },
        // {
        //   title: '标题',
        //   key: 'tag_name',
        //   align: 'left',
        //   // width: 100,
        // },
        {
          title: '会员信息',
          key: 'name',
          align: 'left',
          slot: 'name'
        },
        {
          title: '充值卡号',
          key: 'card_code',
          align: 'left',
          // width: 100,
        },
        {
          title: '充值余额',
          key: 'card_value',
          align: 'left',
          // width: 100,
        },
        {
          title: '赠送余额',
          key: 'card_attached_value',
          align: 'left',
          // width: 100,
        },
        {
          title: '下单时间',
          key: 'add_time',
          align: 'left',
          // width: 100,
        },
	
      //   {
      //     title: '资格开放时间',
      //     key: 'ready_time',
      //     align: 'left',
      //     slot: 'ready_time',
		  // width: 140,
      //   },
      //   {
      //     title: '活动开始时间',
      //     key: '',
      //     align: 'left',
      //     slot: 'start_time',
		  // width: 140,
      //   },
      //   {
      //     title: '活动结束时间',
      //     key: '',
      //     align: 'left',
      //     slot: 'end_time',
		  // width: 140,
      //   },
      //   {
      //     title: '是否开启',
      //     key: 'enable',
      //     align: 'left',
      //     slot: 'enable',
		  // width: 120,
      //   },
      //   {
      //     title: '操作',
      //     key: 'handle',
      //     align: 'left',
      //     slot: 'handle'
      //   }
      ]
    }
  }
}
