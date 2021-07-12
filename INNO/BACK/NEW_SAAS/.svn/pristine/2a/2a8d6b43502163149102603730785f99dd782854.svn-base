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
          title: '可用库存',
          key: 'limit_qty',
          align: 'left'
        },
        {
          title: '限售数量',
          key: 'limitNumber',
          align: 'left',
          width: 160,
          className: 'padd',
          slot: 'limitNumber'
        },
        {
          title: '折后/元',
          key: 'discountPrice',
          align: 'left',
          width: 160,
          className: 'padd',
          slot: 'discountPrice'
        },
        {
          title: '已售',
          key: 'sale_qty',
          align: 'left'
        },
        {
          title: '原价',
          key: 'sale_price',
          align: 'left'
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
