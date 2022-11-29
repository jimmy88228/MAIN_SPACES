export default{
  data(){
    return {
      columns: [
        {
          type:"selection",
          width: 60,
        },
        {
          title: "咨询人",
          key: "",
          minWidth: 120
        },
        {
          title: "手机号",
          key: "",
          minWidth: 120
        },
        {
          title: "所属平台",
          key: "",
          minWidth: 200
        },
        {
          title: "心理咨询师",
          slot: "consult",
          minWidth: 200
        },
        {
          title: "预约结果",
          key: "",
          minWidth: 100
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