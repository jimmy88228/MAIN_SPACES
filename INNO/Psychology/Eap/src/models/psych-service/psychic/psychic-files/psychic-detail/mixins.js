export default{
  data(){
    return {
      columns: [
        {
          title: "参与的活动名称",
          minWidth: 135,
          key: "activity_name"
        },
        {
          title: "量表",
          minWidth: 135,
          slot: "model_name"
        },
        {
          title: "参与的日期",
          minWidth: 120,
          key: "join_time"
        },
        {
          title: "完成量表耗时",
          minWidth: 120,
          slot: "survey_time"
        },
        {
          title: "完成情况",
          minWidth: 120,
          key: "join_state"
        },
        {
          title: "总分",
          minWidth: 100,
          key: "coefficient_points"
        },
        {
          title: "测评结果",
          minWidth: 150,
          key: "survey_result"
        },
        {
          title: "操作",
          minWidth: 180,
          slot: "handle"
        }
      ]
    }
  }
}