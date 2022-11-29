export default{
  data(){
    return {
      columns: [
        {
          title: "预约人",
          key: "name",
          minWidth: 120
        },
        {
          title: "咨询方向",
          slot: "directionConsultation",
          minWidth: 130
        },
        {
          title: "督导方式",
          slot: "superviseWay",
          minWidth: 130
        },
        {
          title: "来源",
          slot: "target",
          minWidth: 200
        },
        {
          title: "创建日期",
          key: "createTime",
          minWidth: 170
        },
        {
          title: "预约状态",
          slot: "sub_str",
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