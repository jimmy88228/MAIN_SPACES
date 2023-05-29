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
          title: "校区",
          key: "campus",
          minWidth: 100
        },
        {
          title: "学段",
          key: "grade_type_str",
          minWidth: 100
        },
        {
          title: "年级",
          slot: "grade",
          minWidth: 150
        },
        {
          title: "班别",
          key: "class",
          minWidth: 120
        },
        {
          title: "班级人员",
          key: "get_student_count",
          minWidth: 100
        },
        {
          title: "班主任",
          slot: "admin",
          minWidth: 200
        },
        {
          title: "操作",
          slot: "handle",
          align: "center",
          width: 200  
        }
      ]
    }
  }
}