export default {
    data() {
      const _this = this;
      return {
        columns: [
            {
                title: '店铺',
                key: "store_name",
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
                title: "总数",
                key: "total_user",
                align: "right"
            },
            {
                title: "占比",
                key: "countrate",
                align: "right"
            }
        ]
      }
    }
  }
  