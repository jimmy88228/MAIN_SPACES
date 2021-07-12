export default {
  data () {
    return {
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "标题",
          key: "title"
        },
        {
          title: "状态",
          key: "status",
          align: "center",
          render (h, params) {
            const Tag = 'Tag';
            return (
              <Tag type='dot' color={params.row.status == 1 ? 'success' : 'error'}>{params.row.status == 1 ? '已发布' : '已下线'}</Tag>
            )
          }
        }
      ]
    }
  }
}
