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
          title: "门店名称",
          key: "name",
          minWidth: 120
        },
        {
          title: "门店编码",
          key: "code",
          minWidth: 120
        },
        {
          title: "回收站",
          key: "cancel",
          align: "center",
          minWidth: 120,
          render (h, params) {
            const Tag = 'Tag';
            return (
              <Tag type='dot' color={params.row.cancel === 'Y' ? 'error' : 'success'}>{params.row.cancel === 'Y' ? '是' : '否'}</Tag>
            )
          }
        }
      ]
    }
  }
}
