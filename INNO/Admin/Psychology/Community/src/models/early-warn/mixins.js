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
          key: "student_name",
          minWidth: 100
        },
        {
          title: "学号",
          key: "student_number",
          minWidth: 150,
        },
        {
          title: "性别",
          key: "student_sex_str",
          minWidth: 100
        },
        {
          title: "年级",
          key: "class_grade",
          minWidth: 120,
        },
        {
          title: "班别",
          key: "class_class",
          minWidth: 120,
        },
        {
          title: "校区",
          key: "campus",
          minWidth: 150,
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