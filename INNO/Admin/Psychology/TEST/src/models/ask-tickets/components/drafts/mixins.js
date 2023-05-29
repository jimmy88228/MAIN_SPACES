export default{
  data(){
    return {
      columns: [
        {
          title: "问券标题",
          key: "admin_name",
          minWidth: 200
        },
        {
          title: "最后修改时间",
          key: "admin_account",
          minWidth: 200,
        },
        {
          title: "操作",
          slot: "handle",
          align: "center",
          width: 200  
        }
      ]
    }
  }
}