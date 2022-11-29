export default{
  data(){
    return {
      columns: [
        {
          title: "记录者",
          slot: "admin",
          minWidth: 100
        },
        {
          title: "记录时间",
          key: "intervention_time",
          minWidth: 150,
        },
        {
          title: "干预方式",
          key: "intervention_str",
          minWidth: 100
        },
        {
          title: "干预对象",
          slot: "student",
          minWidth: 120,
        },
        {
          title: "预警等级",
          slot: "getrank",
          minWidth: 120,
        },
        {
          title: "测评量表",
          slot: "model",
          minWidth: 150,
        },
        {
          title: "评估建议",
          key: "assess_suggest",
          minWidth: 250,
          ellipsis: true
        },
        {
          title: "操作",
          slot: "handle",
          
          minWidth: 80  
        }
      ]
    }
  }
}