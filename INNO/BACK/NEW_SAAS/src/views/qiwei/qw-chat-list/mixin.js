export default {
  data () {
    return {
      tableColumns: [
        {
          title: "外部ID",
          key: "chat_id",
          align: "center",
          width: 330,
        },
        {
          title: "内部ID",
          key: "chat_no",
          align: "center",
          width: 330
        },
        {
          title: "群名",
          key: "name",
          align: "center",
          width: 150
        },
        {
          title: "群主",
          key: "staff_code_name",
          align: "center",
          width: 250,
        },
        {
          title: "所属店铺",
          key: "store_name",
          align: "center",
          width: 150,
        },
        {
          title: "所属员工",
          key: "employee_name",
          align: "center",
          width: 130,
        },
        {
          title: "开启状态",
          key: "is_enabld",
          align: "center",
          minWidth: 130,
          slot: 'is_enabled'
        },
        {
            title: "操作",
            key: "handle",
            align: "center",
            slot: 'handle',
            minWidth: 80,
            fixed: 'center'
        }
      ]
    }
  }
}
