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
          title: "参与日期",
          key: "join_time",
          minWidth: 250,
        },
        {
          title: "所在年级",
          slot: "organize",
          minWidth: 250,
        },
        {
          title: "完成进度",
          slot: "test_progress",
          minWidth: 100,
        },
        {
          title: "完成状态",
          key: "state_str",
          minWidth: 100,
        }
      ]
    }
  }
}