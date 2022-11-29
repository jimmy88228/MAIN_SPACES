export default{
  data(){
    return {
      columns: [
        {
          title: "参与的活动名称",
          minWidth: 150,
          align:'center',
          slot: "activity_name",
        },
        {
          title: "量表",
          align:'center',
          minWidth: 135,
          slot: "model_name",
        },
        {
          title: "参与的日期",
          align:'center',
          minWidth: 120,
          slot: "start_time",
        },
        {
          title: "完成量表耗时",
          align:'center',
          minWidth: 135,
          slot: "survey_time",
        },
        {
          title: "完成情况",
          align:'center',
          minWidth: 120,
          slot: "state_str",
        },
        {
          title: "总分",
          align:'center',
          minWidth: 100,
          slot: "coefficient_points",
        },
        {
          title: "测评结果",
          align:'center',
          minWidth: 120,
          slot: "survey_result",
        },
        {
          title: "操作",
          align:'center',
          minWidth: 180,
          slot: "handle"
        }
      ]
    }
  }
} 