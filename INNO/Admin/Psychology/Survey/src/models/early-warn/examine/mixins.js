export default{
  data(){
    return {
      columns: [
        {
          title: "姓名",
          slot: "student",
          minWidth: 110
        },
        {
          title: "学号",
          slot: "student_number",
          minWidth: 150,
        },
        {
          title: "学校",
          slot: "school",
          minWidth: 150,
        },
        {
          title: "校区",
          slot: "campus",
          minWidth: 100,
        },
        {
          title: "学年",
          slot: "school_year",
          minWidth: 80,
        },
        {
          title: "班级",
          slot: "class",
          minWidth: 120,
        },
        {
          title: "记录生成时间",
          slot: "create_time",
          minWidth: 180
        },
        {
          title: "测评量表",
          slot: "model",
          minWidth: 200,
        },
        {
          title: "最新心理预警",
          slot: "getrank",
          minWidth: 120,
        },
        {
          title: "测评得分",
          slot: "coefficient_points",
          minWidth: 80,
        },
        {
          title: "得分状态",
          slot: "points_str",
          minWidth: 150,
        },
        {
          title: "审核状态",
          slot: "state_str",
          minWidth: 180,
        },
        {
          title: "操作",
          slot: "handle",
          align: "center",
          minWidth: 200  
        }
      ]
    }
  }
}