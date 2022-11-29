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
          title: "ID",
          slot:"school_code",
          minWidth: 150
        },
        {
          title: "组织名称",
          key:"structure_name",
          minWidth: 100
        },
        {
          title: "联系方式",
          slot: "contact_way",
          minWidth: 100
        },
        {
          title: "学校管理者",
          slot: "admin",
          minWidth: 100
        },
        {
          title: "操作",
          slot: "handle",
          width: 200  
        }
      ]
    }
  }
}