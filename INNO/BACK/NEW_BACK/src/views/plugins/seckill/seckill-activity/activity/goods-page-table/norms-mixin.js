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
          title: '颜色',
          key: 'color_name',
          width: 160,
          align: 'left'
        },
        {
          title: '尺码',
          key: 'size_name',
          width: 160,
          align: 'left'
        },
        {
          title: '已售',
          key: 'sale_number',
          width: 160,
          align: 'left'
        },
        {
          title: '库存',
          key: 'product_number',
          width: 160,
          align: 'left'
        },
        {
          title: '原价',
          key: 'market_price',
          align: 'left',
          width: 160,
          className: 'padd',
          slot: 'market_price'
        },
        {
          title: '秒杀价',
          key: 'price',
          align: 'left',
          width: 160,
          className: 'padd',
          slot: 'price'
        },
        {
          title: '活动库存',
          key: 'inventory',
          align: 'left',
          width: 160,
          className: 'padd',
          slot: 'inventory'
        },
        {
          title: '启用',
          key: 'enable',
          align: 'left',
          width: 120,
          slot: 'enable'
        },
        {
          title: '售罄',
          key: 'is_sellout',
          align: 'left',
          width: 120,
          slot: 'is_sellout'
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
