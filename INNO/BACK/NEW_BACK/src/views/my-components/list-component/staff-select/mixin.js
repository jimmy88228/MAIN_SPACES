export default {
  data () {
    return {
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "员工代码",
          key: "staff_code"
        },
        {
          title: "员工姓名",
          key: "staff_name"
        },
        // {
        //   title: "员工电话",
        //   key: "staff_mobile"
        // },
        {
          title: "所属店铺",
          key: "store_name"
        },
        {
          title: "店铺编码",
          key: "store_code"
        }
      ]
    }
  }
}
