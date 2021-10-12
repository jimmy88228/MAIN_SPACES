export default {
  data () {
    return {
      tableColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'left'
        },
        {
          title: '活动名称',
          key: 'name',
          align: 'left',
          slot: 'name',
          width: 240
        },
        {
          title: '商品名称',
          key: 'goods_name',
          align: 'left',
          width: 200
        },
        {
          title: '预售时间',
          key: 'createTime',
          align: 'left',
          width: 320,
          slot: 'createTime'
        },
        {
          title: '预售类型',
          key: 'activity_type_str',
          align: 'left',
          minWidth: 140
        },
        {
          title: '退还定金',
          key: 'refund',
          align: 'left',
          slot: 'refund',
		      align: 'center',
          minWidth: 120
        },
        {
          title: '状态',
          key: 'is_enabled',
          align: 'left',
          width: 120,
		      align: 'center',
          slot: 'is_enabled'
        },
        {
          title: '活动排序',
          key: 'sort',
          align: 'right',
          width: 120,
          slot:'sort',
        },
        {
          title: '操作',
          key: 'handle',
          align: 'center',
          slot: 'handle',
          width: 120
        }
      ]
    }
  }
}
