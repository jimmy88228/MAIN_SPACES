export default {
  data () {
    return {
      tableColumns: [
        {
          title: '活动名称',
          key: 'issue_name'
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
          title: '状态',
          key: 'is_enable',
          slot: 'is_enable'
        },
        {
          title: '商品数量',
          key: 'goods_num',
          align: 'center',
          slot: 'goods_num'
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
