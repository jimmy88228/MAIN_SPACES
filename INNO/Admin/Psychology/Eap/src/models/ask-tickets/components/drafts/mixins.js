export default{
  data(){
    return {
      columns: [
        {
          title: "问券标题",
          key: "title",
          minWidth: 200
        },
        {
          title: "最后修改时间",
          key: "_update_time",
          minWidth: 200,
        },
        {
          title: "操作",
          slot: "handle",
          width: 200  
        }
      ]
    }
  }
}