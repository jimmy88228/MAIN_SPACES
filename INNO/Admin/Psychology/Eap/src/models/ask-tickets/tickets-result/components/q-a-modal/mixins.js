export default{
  data(){
    return {
      columns: [
        {
          title: "用户",
          key: "user_name",
          width: 100
        },
        {
          title: "提交时间",
          key: "_update_time",
          width: 180,
        },
        {
          title: "答案文本",
          key: "option_content",
          minWidth: 200,
        },
      ]
    }
  }
}