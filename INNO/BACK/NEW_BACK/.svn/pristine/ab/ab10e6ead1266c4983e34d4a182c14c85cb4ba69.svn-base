export default {
  data () {
    let _this = this;
    return {
      columns: [
        {
          width: 60,
          render(h, {
            row,
            index
          }) {
            return h('Checkbox', {
              props: {
                value: row._checked
              },
              on: {
                'on-change'(val) {
                  _this.formDynamic.pageData[index]._checked = val;
                }
              }
            })
          }
        },
        {
          title: '商品',
          key: 'name',
          align: 'left',
          slot: 'name',
          width: 300
        },
        {
          title: '实际库存',
          key: 'goods_number',
          align: 'left',
          width: 160
        },
        {
          title: '活动库存',
          key: 'goodsInventory',
          align: 'left',
          width: 160
        },
        {
          title: '已售',
          key: 'sale_number',
          align: 'left',
          width: 120,
          slot: 'sale_number'
        },
        {
          title: '原价',
          key: 'market_price',
          align: 'left',
          width: 160,
          slot: 'market_price'
        }, {
          title: '秒杀价',
          key: 'price',
          align: 'left',
          width: 160,
          slot: 'price'
        },
        {
          title: '限购数量',
          key: 'limit_count',
          align: 'left',
          className: 'padd',
          slot: 'limit_count',
          width: 160
        },
        {
          title: '预占销量',
          key: 'fake_sales',
          align: 'left',
          className: 'padd',
          slot: 'fake_sales',
          width: 160
        },
        {
          title: '排序',
          key: 'sort',
          className: 'padd',
          align: 'left',
          slot: 'sort',
          width: 160
        },
        {
          title: '启用',
          key: 'enable',
          align: 'left',
          slot: 'enable',
          width: 160
        },
        {
          title: '原价购买',
          key: 'allow_direct_buy',
          align: 'left',
          slot: 'allow_direct_buy',
          width: 160
        },
        {
          title: '托管任务',
          key: 'task_data',
          align: 'center',
          slot: 'task_data',
          width: 420
        },
        {
          title: '操作',
          key: 'handle',
          align: 'center',
          width: 140,
          slot: 'handle'
        }
      ]
    }
  }
}
