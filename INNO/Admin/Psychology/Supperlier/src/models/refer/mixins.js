export default{
  data(){
    return {
      columns: [
        {
          type:"selection",
          width: 60,
        },
        {
          title: "请求人信息",
          slot: "request",
          minWidth: 130
        },
        {
          title: "转介对象",
          slot: "refer",
          minWidth: 130
        },
        {
          title: "来源",
          slot: "target",
          minWidth: 200
        },
        {
          title: "创建日期",
          key: "create_time",
          minWidth: 180
        },
        {
          title: "转介状态",
          key: "state_str",
          minWidth: 150
        },
        {
          title: "操作",
          slot: "handle",
          align: "left",
          width: 160
        }
      ]
    }
  }
}