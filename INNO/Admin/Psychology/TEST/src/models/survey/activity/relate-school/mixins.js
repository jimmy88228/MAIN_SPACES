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
          title: "学校名称",
          minWidth: 200,
          key: "structure_name"
        },
        {
          title: "上级组织",
          minWidth: 200,
          slot: "get_self"
        },
        {
          title: "状态",
          slot: "state",
          minWidth: 140,
          align: "center"
        },
        {
          title: "操作",
          slot: "handle",
          align: "center",
          width: 140
        }
      ]
    }
  }
}