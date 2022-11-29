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
          title: "名称",
          key: "user_name",
          minWidth: 150
        },
        {
          title: "账号",
          key: "account",
          minWidth: 150
        },
        {
          title: "手机号",
          key: "mobile_phone",
          minWidth: 150
        },
        {
          title: "账号状态",
          minWidth: 120,
          slot: "state"
        }, 
        {
          title: "操作",
          slot: "handle",
          align: "left",
          minWidth: 150  
        }
      ]
    }
  }
}