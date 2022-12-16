export default{
  data(){
    return {
      fixedColumns: [
        {
          title: "指导语",
          minWidth: 180,
          maxWidth: 300,
          slot: "instruction"
        },
        {
          title: "维度",
          minWidth: 80,
          maxWidth: 180,
          slot: "dimensions"
        },
        {
          title: "序号",
          width: 80,
          key: "sort"
        },
        {
          title: "题干",
          minWidth: 300,
          key: "question"
        },
      ],
      columns: []
    }
  }
}