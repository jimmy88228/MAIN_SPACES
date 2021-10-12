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
          slot: 'name'
        },
        {
          title: '限售数量',
          key: 'limitNumber',
          align: 'left',
          slot: 'limitNumber'
        },
        {
          title: '折后/元(活动价)',
          key: 'discountPrice',
          align: 'left',
          slot: 'discountPrice'
        },
        {
          title: '每单限购',
          key: 'perOrder',
          align: 'left',
          className: 'padd',
          slot: 'perOrder'
        },
        {
          title: '每人限购',
          key: 'perUser',
          align: 'left',
          className: 'padd',
          slot: 'perUser'
        },
        {
          title: '排序',
          key: 'sortOrder',
          align: 'left',
          className: 'padd',
          slot: 'sortOrder'
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
