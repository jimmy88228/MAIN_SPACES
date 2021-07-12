export default {
  data () {
    return {
      tableColumns: [
        {
          title: '活动名称',
          key: 'name'
        },
        {
          title: '活动简称',
          key: 'short_name'
        },
        {
          title: '活动开始时间',
          key: 'stime',
          slot: 'stime'
        },
        {
          title: '活动结束时间',
          key: 'etime',
          slot: 'etime'
        },
        {
          title: '绑定商品',
          key: 'goods_num'
        },
        {
          title: '操作',
          key: 'handle',
          width: 300,
          align: 'center',
          slot: 'handle'
        }
      ]
    }
  }
}
