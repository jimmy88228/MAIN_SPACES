export default {
  data () {
    return {
      tableColumns: [
        {
          title: "会员卡号",
          key: "card_num",
          align: "center",
          width: 160,
        },
        {
          title: "会员电话",
          key: "mobile_phone",
          align: "center",
          width: 150
        },
        {
          title: "会员店铺",
          key: "store_name",
          align: "center",
          minWidth: 160,
        },
        {
          title: "赠送店员",
          key: "staff_name",
          align: "center",
          minWidth: 120,
        },
        {
          title: "店员店铺代码",
          key: "staff_store_code",
          align: "center",
          minWidth: 130,
        },
        {
          title: "店员电话",
          key: "staff_mobile",
          align: "center",
          minWidth: 130,
        },
        {
          title: "赠送时间",
          key: "created_at",
          align: "center",
          minWidth: 130,
        },
        {
          title: "积分数",
          key: "give_point",
          align: "center",
          minWidth: 120,
        },
        {
          title: "优惠券",
          key: "bonus_name",
          align: "center",
          minWidth: 160,
        },
      ]
    }
  }
}
