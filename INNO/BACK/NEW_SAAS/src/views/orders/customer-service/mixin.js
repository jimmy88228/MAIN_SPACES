export default {
  data () {
    return {
      columns: [
        {
          title: '商品详情',
          align: 'left',
          slot: 'name',
          width: 300
        },
        {
          title: '颜色',
          align: 'left',
          slot: 'color'
        },
        {
          title: '尺码',
          align: 'left',
          slot: 'size'
        },
        {
          title: '库存',
          key: 'inventory',
          align: 'left'
        },
        {
          title: '数量',
          key: 'goods_number',
          align: 'left'
        },
        {
          title: '市场价格',
          align: 'left',
          slot: 'market'
        },
        {
          title: '售价',
          align: 'left',
          slot: 'sale'
        },
        {
          title: '操作',
          key: 'handle',
          align: 'left',
          slot: 'handle'
        }
      ]
    }
  }
}
