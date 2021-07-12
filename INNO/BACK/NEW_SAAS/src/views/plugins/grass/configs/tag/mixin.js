export default {
  data () {
    return {
      tableColumns: [
        {
          title: '标签名称 ',
          key: 'label_name'
        },
        {
          title: '内容数量	',
          key: 'num'
        },
        {
          title: '排序',
          key: 'sort'
        },
        {
          title: '是否启用',
          key: 'is_enabled',
          slot: 'is_enabled'
        },
        {
          title: '操作',
          key: 'handle',
          slot: 'handle'
        }
      ]
    }
  }
}
