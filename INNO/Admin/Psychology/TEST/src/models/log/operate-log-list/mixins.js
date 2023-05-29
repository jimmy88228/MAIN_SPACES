export default{
  data(){
    return {
      columns: [
        {
          title: "操作员",
          slot: "admin_user",
          minWidth: 200
        },
        {
          title: "操作内容",
          key: "log_content",
          minWidth: 300,
        },
        {
          title: "操作时间",
          key: "create_time",
          minWidth: 200
        },
        {
          title: "IP",
          key: "ip",
          minWidth: 200,
        },
        // {
        //   title: "操作",
        //   slot: "handle",
        //   width: 120
        // }
      ]
    }
  }
}