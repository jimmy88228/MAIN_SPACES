export default {
  data() {
    return {
      // 这里slot用在jsx中的渲染
      tableColums: [{
          title: "退换单详情",
          key: "order_sn",
          ellipsis: true,
          minWidth: 420,
          slot: 'orderInfo'
        },
        {
          title: "退换时间",
          key: "add_time",
          align: "left",
          minWidth: 120,
          slot: 'returnTime'
        },
        {
          title: "申请人",
          key: "user_name",
          align: "left",
          minWidth: 100,
          slot: 'user'
        },
        {
          title: "类型",
          key: "return_type_str",
          align: "left",
          minWidth: 120,
          slot: 'returnType'
        },
        {
          title: "状态",
          key: "return_status_str",
          align: "left",
          minWidth: 100,
          slot: 'status'
        },
        {
          title: "操作",
          key: "handle",
          align: "center",
          minWidth: 80,
          slot: 'handle'
        }
      ]
    }
  }
}
