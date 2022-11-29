export default{
  data(){
    return {
      columns: [
        {
          title: "ID",
          key: "id",
          minWidth: 70
        },
        {
          title: "页面标题",
          slot: "title",
          minWidth: 200,
        },
        {
          title: "排序",
          slot: "sort",
          minWidth: 70,
        },
        {
          title: "推广",
          minWidth: 150,
          slot: "spread"
        },
        {
          title: "最后更新时间",
          key: "update_time_str",
          minWidth: 200
        },
        {
          title: "操作",
          width: 200,
          slot: "handle"
        }
      ]
    }
  }
}