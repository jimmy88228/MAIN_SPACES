export default {
    data() {
      return {
        columns: [
            {
                type: 'selection',
                width: 50,
                align: "center"
            },
            {
                title: '会员名称',
                slot: "real_name",
                align: 'left',
                minWidth: 100,
                tree: true
            },
            {
                title: "会员卡号",
                key: "card_num",
                minWidth:180,
                align: "center"
            },
            {
                title: "会员等级",
                key: "rank_name",
                minWidth:150,
                align: "center"
            },
            {
                title: "手机号",
                key: "mobile_phone",
                minWidth:130,
                align: "center"
            },
            {
                title: "归属店铺",
                key: "store_name",
                minWidth:150,
                align: "center"
            },

            {
                title: "归属店员",
                key: "staff_name",
                minWidth:100,
                align: "center"
            },
            {
                title: "注册时间",
                key: "reg_time",
                width:120,
                align: "center"
            },
            {
                title: "生日",
                key: "birthday",
                width:120,
                align: "center"
            },
            {
                title: "最后购买时间",
                key: "con_lastday",
                width:120,
                align: "center"
            },
            {
                title: "购买总额",
                key: "con_sum",
                minWidth:100,
                align: "center"
            },
            {
                title: "是否关注微信",
                slot: "weixin_subscribe",
                minWidth:100,
                align: "center"
            },
            {
                title: "操作",
                slot: "action",
                minWidth:100,
                fixed:"right",
                align: "center"
            }
        ]
      }
    }
  }
  