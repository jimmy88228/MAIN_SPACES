export default {
    data() {
      const _this = this;
      return {
        columns: [
            {
                title: '品牌',
                key: "brand_name",
                align: 'center'
            },
            {
                title: "新增会员数",
                key: "total_users",
                align: "right"
            },
            {
                title: "小程序注册",
                key: "wxapp_users",
                align: "right"
            },
            {
                title: "公众号注册",
                key: "wechat_users",
                align: "right"
            },
            {
                title: "店铺注册",
                key: "erp_users",
                align: "right"
            },
        ]
      }
    }
  }
  