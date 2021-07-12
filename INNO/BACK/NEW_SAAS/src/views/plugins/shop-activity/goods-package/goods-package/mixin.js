export default {
  data () {
    return {
      tableColumns: [
        {
          title: '套餐图片',
          key: 'package_bg_image',
          slot: 'package_bg_image'
        },
        {
          title: '商品',
          key: 'goods_thumb2',
          slot: 'goods_thumb2'
        },
        {
          title: '套餐名称',
          key: 'package_name',
          width: 160
        },
        {
          title: '商品名称',
          key: 'goods_name',
          width: 160
        },
        {
          title: '搭配数量',
          key: 'qty',
          align: 'center'
        },
        {
          title: '商品价',
          key: 'market_price_rang'
        },
        {
          title: '搭配价',
          key: 'sale_price_rang'
        },
        {
          title: '商品类型',
          key: 'is_master',
          align: 'center'
        },
        {
          title: '套餐状态',
          key: 'is_enabled',
          slot: 'is_enabled',
          width: 120
        },
        {
          title: '套餐顺序',
          key: 'g_sort',
          align: 'center',
          slot: 'g_sort'
        },
        {
          title: '操作',
          key: 'handle',
          slot: 'handle',
          width: 300,
          align: 'center'
        }
      ]
    }
  }
}
