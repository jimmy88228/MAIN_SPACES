export default {
  data () {
    return {
      tableColumns: [
        {
          title: '标签名称',
          key: 'group_name',
        },
        {
          title: '数量',
          key: 'num'
        },
        {
          title: '排序',
          key: 'sort'
        },
        {
          title: '添加时间',
          key: 'created_at',
          slot: 'created_at'
        },
        {
          title: '更新时间',
          key: 'updated_at',
          slot:'updated_at'
        },
        {
          title: '是否启用',
          key: 'enable',
          slot: 'enable'
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
