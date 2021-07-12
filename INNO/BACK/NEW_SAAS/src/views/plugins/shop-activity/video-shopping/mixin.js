export default {
  data () {
    return {
      tableColumns: [
        {
          title: '活动名称',
          key: 'active_name'
        },
        {
          title: '商品数量',
          key: 'goods_num'
        },
        {
          title: '分享数',
          key: 'shares'
        },
        {
          title: '点赞数',
          key: 'likes'
        },
        {
          title: '状态',
          key: 'is_enabled',
          slot: 'is_enabled'
        },
        {
          title: '排序',
          key: 'sort',
          slot: 'sort'
        },
        {
          title: '操作',
					width: 200,
          key: 'handle',
          slot: 'handle'
        }
      ]
    }
  }
}
