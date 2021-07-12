export default {
    data() {
      const _this = this;
      return {
        columns: [
            {
                title: '会员',
                key: "user_name",
                align: 'center'
            },
            {
                title: "上级会员",
                key: "parent_name",
                align: "right"
            },
            {
                title: "所属店铺",
                key: "store_name",
                align: "right"
            }
        ]
      }
    }
  }
  