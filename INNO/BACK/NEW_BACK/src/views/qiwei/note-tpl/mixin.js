export default {
  data () {
    return {
      tableColumns: [
        {
          title: '短信模板ID',
          key: 'template_id',
          width:150,
          align: 'left'
        },
        {
          title: '短信内容',
          key: 'content',
          align: 'left'
        },
        {
          title: '模板状态',
          key: 'status_str',
          width:150,
          align: 'left'
        },
        {
          title: '最后修改时间',
          key: 'last_time',
          width:120,
          align: 'left'
        }
      ],
    }
  }
}
