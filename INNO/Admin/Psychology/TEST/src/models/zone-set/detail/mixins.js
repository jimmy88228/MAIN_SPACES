export default{
  data(){
    return {
      columns: [
        {
          title: '测验题目',
          slot: 'tasteTestInfo',
          minWidth: 200,
        },
        {
          title: '题目数量',
          key: 'questionCount',
          minWidth: 100,
        },
        {
          title: '上架状态',
          slot: 'state',
          minWidth: 120,
        },
        {
          title: '测评次数',
          key: 'number_count',
          minWidth: 100,
        },
        {
          title: '测评人数',
          key: 'user_count',
          minWidth: 100,
        },
        {
          title: "操作",
          width: 120,
          slot: "handle"
        }
      ]
    }
  }
}