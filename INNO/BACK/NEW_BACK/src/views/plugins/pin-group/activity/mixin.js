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
          title: '活动ID',
          key: 'id',
					width:80,
          align: 'left'
        },
        {
          title: '活动名称',
          key: 'activity_name',
          align: 'left',
          minWidth: 200,
          slot: 'name'
        },
        {
          title: '商品名称',
          key: 'goods_name',
          width: 200,
          align: 'left'
        },
        {
          title: '商品货号',
          key: 'goods_sn',
          width: 200,
          align: 'left'
        },
        {
          title: '拼团价',
          key: 'collage_sale_price',
          width: 200,
          align: 'left'
        },
        {
          title: '活动排序',
          key: 'sort',
          width: 100,
          align: 'left',
          slot:'sort',
        },
        {
          title: '活动时间',
          key: 'from_date',
          align: 'left',
          minWidth: 340,
          slot: 'time'
        },
        {
          title: '状态',
          key: 'status',
          align: 'left',
          width: 160,
          slot: 'isEnabled'
        },
        {
          title: '操作',
          key: 'handle',
          align: 'left',
          width: 80,
          slot: 'handle'
        }
      ]
    }
  }
}
