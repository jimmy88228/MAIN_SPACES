export default {
  data () {
    return {
      tableColumns: [
        {
          title: "员工姓名",
          key: "name",
          align: "center",
          width: 160,
        },
        {
          title: "账号",
          key: "worker_id",
          align: "center",
          width: 160
        },
        {
          title: "企微手机号",
          key: "mobile",
          align: "center",
          width: 150
        },
        {
          title: "所属店员代码",
          key: "worker_no",
          align: "center",
          width: 180,
          slot: 'worker_no'
        },
        {
          title: "所属店铺",
          key: "store_name",
          align: "center",
          width: 200,
          slot: 'store_name'
        },
        {
          title: "是否开启",
          key: "is_enabled",
          align: "center",
          minWidth: 130,
          slot: 'is_enabled'
        },
        {
          title: "创建时间",
          key: "created_at",
          align: "center",
          minWidth: 150
        },
        {
          title: "更新时间",
          key: "updated_at",
          align: "center",
          minWidth: 150
        },
      ]
    }
  }
}
