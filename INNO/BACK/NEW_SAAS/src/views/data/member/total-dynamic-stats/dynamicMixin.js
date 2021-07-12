export default {
    data() {
      const _this = this;
      return {
        columns: [
						{
								title: '',
								type: 'index',
								align: 'center'
						},
            {
                title: '日期',
                key: "op_date",
                align: 'center'
            },
            {
                title: "微信注册",
                key: "wechat_reg_user",
                align: "right"
            },
            {
                title: "店铺注册",
                key: "store_reg_user",
                align: "right"
            },
            {
                title: "新增会员数",
                key: "today_reg_user",
                align: "right"
            },
            {
                title: "总数",
                key: "today_total_user",
                align: "right"
            }
        ]
      }
    }
  }
  