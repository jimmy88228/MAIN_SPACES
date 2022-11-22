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
          title: "班级",
          key: "structure_name",
          minWidth: 100
        },
        {
          title: "校区",
          slot: "campus",
          minWidth: 100
        },
        {
          title: "班主任",
          slot: "admin",
          minWidth: 100
        },
        {
          title: "班级人员",
          key: "get_user_count",
          minWidth: 100
        },
        {
          title: "状态",
          key: "state_str",
          width: 150,
        },
        {
          title: "推广",
          slot: "extend",
          align: "center",
          width: 200,
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