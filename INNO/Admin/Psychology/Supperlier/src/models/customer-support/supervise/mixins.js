export default{
  data(){
    return {
      columns: [
        {
          title: "EAP专员",
          key: "name",
          minWidth: 120
        },
        {
          title: "咨询方向",
          slot: "field_way",
          minWidth: 130
        },
        {
          title: "督导方式",
          slot: "consultant_way",
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
          title: "预约状态",
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