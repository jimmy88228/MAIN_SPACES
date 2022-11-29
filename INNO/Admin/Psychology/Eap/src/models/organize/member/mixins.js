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
          key: "member_name",
          minWidth: 100
        },
        {
          title: "手机",
          key: "mobile_phone",
          minWidth: 150,
        },
        {
          title: "性别",
          slot: "gender", // 0:保密;1:男;2:女 null 未知
          minWidth: 120
        },
        {
          title: "组织",
          key: "structure_name",
          minWidth:200,
        },
        {
          title: "操作",
          slot: "handle",
          
          minWidth: 120  
        }
      ]
    }
  }
}