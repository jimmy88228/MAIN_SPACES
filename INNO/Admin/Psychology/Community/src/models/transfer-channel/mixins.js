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
          title: "机构名称",
          key: "name",
          minWidth: 250,
        },
        {
          title: "地址",
          key: "address",
          minWidth: 200,
        },
        {
          title: "操作",
          width: 100,
          slot: "handle"
        }
      ]
    }
  }
}