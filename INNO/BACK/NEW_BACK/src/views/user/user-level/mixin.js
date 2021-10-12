export default {
  data () {
    return {
      tableColumns: [
        {
          title: '会员中心背景图',
          align: 'left',
          key: 'rank_image',
          slot: 'bg',
          minWidth: 140
        },
        {
          title: '等级名称',
          align: 'center',
          key: 'rank_name',
          slot: 'name',
          minWidth: 120
        },
        {
          title: '等级码',
          align: 'left',
          key: 'rank_code',
          minWidth: 100
        },
        {
          title: '积分下限',
          align: 'left',
          key: 'min_points',
          minWidth: 100
        },
        {
          title: '正价折扣率(%)',
          align: 'left',
          key: 'prom_discount',
          minWidth: 140
        },
        {
          title: '折上折扣率(%)',
          align: 'left',
          key: 'discount',
          minWidth: 140
        },
        {
          title: '免邮下限(元)',
          align: 'left',
          key: 'limit_free_shipping',
          minWidth: 140
        },
        {
          title: '操作',
          align: 'left',
          key: 'handle',
          slot: 'handle',
          width: 200,
          fixed: 'right'
        }
      ]
    }
  }
}
