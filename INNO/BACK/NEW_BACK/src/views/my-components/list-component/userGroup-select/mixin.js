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
		  title: "ID",
		  key: "_id",
		  minWidth: 120,
		},
		{
		  title: "标签名",
		  key: "name",
		  minWidth: 120,
		},
      ],
      
    }
  }
}
