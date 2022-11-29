export default{
  data(){
    return {
      columns: [
        // {
        //   type: 'selection',
        //   width: 60,
        //   align: 'center'
        // },
        {
          title: "活动名称",
          key: "activity_name",
          minWidth: 200
        },
        {
          title: "活动时间",
          slot: "time",
          minWidth: 210,
        },
        {
          title: "活动状态",
          key: "state_str",
          minWidth: 120
        },
        {
          title: "推广",
          slot: "extend",
          align: "center",
          width: 200,
        },
        {
          title: "操作",
          key: "",
          slot: "handle",
          align: "center",
          width: 200  
        }
      ]
    }
  }
}