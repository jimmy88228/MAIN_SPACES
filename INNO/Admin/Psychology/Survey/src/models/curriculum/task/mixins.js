export default{
  data(){
    return {
      columns: [
        {
          title: "课程",
          slot: "name",
          minWidth: 250,
        },
        {
          title: "任务期限",
          slot: "limit_time",
          align: "center",
          minWidth: 200,
        },
        {
          title: "学习人数",
          key: "user_count",
          minWidth: 100,
        },
        {
          title: "创建者",
          key: "structure_type_str",
          minWidth: 100,
        },
        {
          title: "参与限制",
          key: "join_type_str",
          minWidth: 100,
        },
        {
          title: "关联班级",
          slot: "relate_class",
          align: "center",
          minWidth: 120,
        },
        {
          title: "推广链接",
          slot: "page_link",
          minWidth: 200,
        },
        {
          title: "活动状态",
          slot: "state",
          minWidth: 100,
        },
        {
          title: "操作",
          width: 200,
          align: "right",
          slot: "handle"
        }
      ]
    }
  }
}