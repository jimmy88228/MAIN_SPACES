const linesType = [
  {
    id: -1,
    key: "all",
    name: "全部"
  },
  {
    id: 0,
    key: "offline",
    name: "线下"
  },
  {
    id: 1,
    key: "online",
    name: "线上"
  }
]
export default{
  data(){
    return {
      columns: [
        {
          title: "讲座",
          slot: "info",
          minWidth: 250,
        },
        {
          title: "讲座类型",
          key: "type_str",
          minWidth: 200,
        },
        // {
        //   title: "主办单位",
        //   slot: "organizer",
        //   minWidth: 150,
        //   align: "left",
        // }, 
        // {
        //   title: "绑定组织",
        //   slot: "organizer",
        //   minWidth: 150,
        //   align: "left",
        // },
        {
          title: "推广",
          slot: "extend",
          minWidth: 200,
        },
        {
          title: "活动状态",
          slot: "state",
          align: 'center',
          minWidth: 200,
        },
        {
          title: "操作",
          width: 120,
          slot: "handle"
        }
      ],
      screenData: {
        base: [
          {
            label: "讲座类型",
            labelWidth: 70,
            type: "select",
            key: "type",
            data: linesType
          }
        ]
      },
      linesType: linesType
    }
  }
}