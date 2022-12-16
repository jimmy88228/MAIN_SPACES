export default{
  data(){
    return {
      columns: [
        {
          title: "客户资源",
          slot: "customer",
          minWidth: 400
        },
        {
          title: "音频",
          key: "audio_number",
          minWidth: 100,
          align: "center",
        },
        {
          title: "视频",
          key: "video_number",
          minWidth: 100,
          align: "center",
        },
        {
          title: "文章",
          key: "article_number",
          minWidth: 100,
          align: "center",
        },
        {
          title: "课程内容",
          key: "course_number",
          minWidth: 100,
          align: "center",
        },
        {
          title: "趣味测试",
          key: "funtest_number",
          minWidth: 100,
          align: "center",
        },
        {
          title: "心理专员",
          key: "consultant_number",
          minWidth: 100,
          align: "center",
        },
        {
          title: "操作",
          slot: "handle",
          align: "center",
          // fixed: "right",
          width: 300
        }
      ]
    }
  }
}