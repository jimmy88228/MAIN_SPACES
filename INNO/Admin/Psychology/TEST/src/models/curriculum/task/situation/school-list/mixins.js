export default{
  data(){
    return {
      columns: [
        {
          title: "参与人",
          slot: "join_user",
          minWidth: 100,
        },
        {
          title: "所属组织",
          slot: "organize",
          minWidth: 250,
        },
        {
          title: "学习进度",
          slot: "study_progress",
          minWidth: 100,
        },
        
        {
          title: "测验进度",
          slot: "test_progress",
          minWidth: 100,
        },
        {
          title: "测验均分",
          slot: "avg_exam",
          minWidth: 100,
        },
        {
          title: "课程状态",
          key: "state_str",
          minWidth: 100,
        }
      ],
      screenData: {
        base: [
          {
            labelWidth: 0,
            type:"search",
            key: "searchq",
            placeholder: "请输入关键词"
          }
        ]
      }
    }
  }
}