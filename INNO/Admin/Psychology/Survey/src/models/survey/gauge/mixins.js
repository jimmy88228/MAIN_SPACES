export default{
  data(){
    return {
      columns: [
        {
          title: "量表名称",
          key: "model_name"
        },
        {
          title: "题目",
          key: "question_count"
        },
        {
          title: "创建时间",
          key: "create_time"
        },
        {
          title: "操作",
          slot: "handle",
          width: 120
        }
      ]
    }
  }
}