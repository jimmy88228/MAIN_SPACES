export default{
  data(){
    return {
      columns: [
        // {
        //   type: 'selection',
        //   width: 60,
        //   align: 'center'
        // },
        {
          title: "姓名",
          key: "student_name",
          width: 100
        },
        {
          title: "学号",
          key: "student_number",
          width: 160,
        },
        {
          title: "学校",
          key: "school_name",
          minWidth: 200,
        },
        {
          title: "校区",
          key: "campus",
          minWidth: 120,
        },
        // {
        //   title: "学年",
        //   key: "school_year",
        //   minWidth: 100,
        // },
        // {
        //   title: "年级",
        //   key: "class_grade",
        //   width: 120,
        // },
        {
          title: "班级",
          slot: "class_name",
          align: "left",
          minWidth: 160,
        },
        {
          title: "测评进度",
          key: "state_str",
          minWidth: 120
        },
        {
          title: "开始时间",
          slot: "create_time",
          key: "record_create_time",
          width: 110,
          sortMethod: this.sortChange,
          sortable: true
        },
        {
          title: "完成时间",
          slot: "complete_time",
          key: "record_complete_time",
          width: 110,
          sortMethod: this.sortChange,
          sortable: true
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