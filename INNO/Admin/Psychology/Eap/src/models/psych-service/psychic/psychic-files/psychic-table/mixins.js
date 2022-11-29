export default{
  data(){
    return {
      columns: [
        {
          title: "时间日期",
          minWidth: 135,
          key: "intervention_time"
        },
        {
          title: "心理预警变化",
          minWidth: 135,
          slot: "getrank"
        },
        {
          title: "记录者",
          minWidth: 120,
          key: "admin_name"
        },
        {
          title: "预警记录",
          minWidth: 300,
          key: "warning_remark"
        }
      ]
    }
  }
}