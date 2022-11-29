export default{
  data(){
    return {
      columns: [
        {
          title: "姓名",
          slot: "student",
          minWidth: 100
        },
        {
          title: "组织",
          slot: "structure",
          minWidth: 150,
        }, 
        {
          title: "预生成时间",
          key: "create_time",
          minWidth: 120
        },
        {
          title: "测评量表",
          key: "model_name",
          minWidth: 200,
        },
        {
          title: "心理预警情况",
          slot: "getrank",
          minWidth: 120,
        },
        {
          title: "测评得分",
          key: "coefficient_points",
          minWidth: 150,
        },
        {
          title: "审核状态",
          key: "state_str",
          minWidth: 150,
        },
        {
          title: "操作",
          slot: "handle",
          align: "center",
          width: 200  
        }
      ]
    }
  }
}