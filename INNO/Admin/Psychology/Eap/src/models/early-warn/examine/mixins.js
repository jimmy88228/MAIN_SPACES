export default{
  data(){
    return {
      columns: [
        {
          title: "姓名",
          slot: "member_info",
          minWidth: 110
        },
        {
          title: "组织",
          slot: "structure",
          minWidth: 150,
        }, 
        {
          title: "记录生成时间",
          isRow: true,
          align: "center",
          slot: "create_time",
          minWidth: 180
        },
        {
          title: "测评量表",
          isRow: true,
          align: "center",
          slot: "model_name",
          minWidth: 200,
        },
        {
          title: "最新心理预警",
          isRow: true,
          align: "center",
          slot: "getrank",
          minWidth: 120,
        },
        {
          title: "测评得分",
          isRow: true,
          align: "center",
          slot: "coefficient_points",
          minWidth: 100,
        },
        {
          title: "得分状态",
          isRow: true,
          align: "center",
          slot: "points_str",
          minWidth: 150,
        },
        {
          title: "审核状态",
          isRow: true,
          align: "center",
          slot: "state_str",
          minWidth: 180,
        },
        {
          title: "操作",
          isRow: true,
          slot: "handle",
          align: "center",
          minWidth: 200  
        }
      ]
    }
  }
}