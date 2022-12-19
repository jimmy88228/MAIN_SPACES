export default{
  data(){
    return {
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: "姓名",
          key: "name",
          minWidth: 100
        },
        {
          title: "手机号",
          key: "mobile_phone",
          minWidth: 150,
        },
        {
          title: "状态",
          slot: "state",
          minWidth: 100,
        },
        {
          title: "操作",
          slot: "handle",
          align: "center",
          width: 100  
        }
      ]
    }
  }
}