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
          title: "分组名称",
          key: "name",
          align: 'left'
        },
		{
		  title: "是否开启",
		  key: "enable_str",
		  align: 'center',
		  width: 100
		}
      ]
    }
  }
}
