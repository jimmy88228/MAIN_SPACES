export default{
  data(){
    return {
      columns: [
        {
          type: "selection",
          width: 60,
        },
        {
          title: "基本信息",
          slot: "psychiatrist",
          minWidth: 200
        },
        {
          title: "手机号",
          key: "mobile_phone",
          minWidth: 130,
          align: "center",
        },
        {
          title: "资质",
          key: "qualification",
          minWidth: 200,
          align: "center",
        },
        {
          title: "擅长",
          key: "field_str",
          minWidth: 200,
          align: "center",
        },
        {
          title: "操作",
          slot: "handle",
          align: "center",
          width: 120
        }
      ]
    }
  }
}