export default{
  data(){
    return {
      columns: [
        // {
        //   type: "selection",
        //   width: 60,
        // },
        {
          title: "基本信息",
          slot: "psychiatrist",
          minWidth: 200
        },
        // {
        //   title: "手机号",
        //   key: "mobilePhone",
        //   minWidth: 130,
        //   
        // },
        {
          title: "资质",
          key: "qualification",
          minWidth: 200,
        },
        {
          title: "擅长领域",
          key: "fields",
          minWidth: 200,
          slot:"fields"
        },
        // {
        //   title: "前端显示",
        //   key: "state",
        //   minWidth: 200,
        //   
        //   slot:"state"
        // },
        {
          title: "咨询师来源",
          key: "supplierName",
          minWidth: 200,
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