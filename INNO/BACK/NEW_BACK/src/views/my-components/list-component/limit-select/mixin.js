export default {
  data () {
    return {
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "活动名称",
          key: "name",
        },
		{
		  title: "开始时间",
		  key: "stime",
		},
		{
		  title: "结束时间",
		  key: "etime",
		}
      ]
    }
  }
}
