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
          align: 'left'
        },
        {
          title: '尺码',
          key: 'size_name',
          align: 'left'
        },
        {
          title: '库存',
          key: 'qty',
          align: 'left'
        },
        {
          title: '原价',
          key: 'market_price',
          align: 'left'
        },
        {
          title: '售卖价',
          key: 'packagePrice',
          align: 'left',
          width: 160,
          className: 'padd',
          slot: 'packagePrice'
        },
        {
          title: '排序',
          key: 'sortOrder',
          align: 'left',
          width: 160,
          className: 'padd',
          slot: 'sortOrder'
        },
        {
          title: '启用',
          key: 'enable',
          align: 'left',
          width: 120,
          slot: 'enable'
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
