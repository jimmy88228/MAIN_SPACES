const stateList = [
  {
      id: -1,
      name: "全部",
  },
  {
      id: 0,
      name: "未审核",
  },
  {
      id: 1,
      name: "审核通过",
  },
  {
      id: 2,
      name: "复核已通过",
  },
];
export default{
  data(){
    return {
      stateList: stateList,
      columns: [
        {
          title: "姓名",
          slot: "student",
          minWidth: 110
        },
        {
          title: "学号",
          slot: "student_number",
          minWidth: 150,
        },
        {
          title: "学校",
          slot: "school",
          minWidth: 150,
        },
        {
          title: "校区",
          slot: "campus",
          minWidth: 100,
        },
        {
          title: "学年",
          slot: "school_year",
          minWidth: 120,
        },
        {
          title: "班级",
          slot: "class",
          minWidth: 120,
        },
        {
          title: "记录生成时间",
          isRow: true,
          slot: "create_time",
          align: "center",
          minWidth: 180
        },
        {
          title: "测评量表",
          isRow: true,
          slot: "model",
          align: "center",
          minWidth: 200,
        },
        {
          title: "最新心理预警",
          isRow: true,
          slot: "getrank",
          align: "center",
          minWidth: 120,
        },
        {
          title: "测评得分",
          slot: "coefficient_points",
          align: "center",
          isRow: true,
          minWidth: 120,
        },
        {
          title: "得分状态",
          isRow: true,
          slot: "points_str",
          align: "center",
          minWidth: 150,
        },
        {
          title: "审核状态",
          isRow: true,
          slot: "state_str",
          align: "center",
          minWidth: 180,
        },
        {
          title: "操作",
          isRow: true,
          slot: "handle",
          align: "center",
          minWidth: 200  
        }
      ],
      screenData: {
        base: [
            {
              type: "search",
              labelWidth: 0,
              placeholder: "请输入搜索名称",
              key: "searchq",
              data: [],
              cell: {}
          },
          {
              type: "select",
              label: "审核状态",
              labelWidth: 80,
              key: "state",
              data: stateList,
              cell: {}
          }
        ],
        extra: [
          {
              type: "button",
              label: "导出结果",
              noFormItem: true,
              cell: {},
              icon: "md-cloud-download",
              active: this.exportHandle
          }
        ],
        more: [
          {
              type: "structure",
              label: "",
              labelWidth: 0,
              noFormItem: true,
              cell: {
                isShowSchoolYear: true,
                hideSelect: ['area', 'street', 'grade-type']
              },
          }
        ]
      }
    }
  }
}