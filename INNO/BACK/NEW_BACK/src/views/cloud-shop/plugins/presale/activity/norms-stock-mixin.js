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
          title: '关联店铺',
          key: 'store_name',
          width: 350,
          align: 'left'
        },
        {
          title: '店铺最大可售库存',
          key: 'inventory_number',
          slot: 'inventory_number',
          align: 'left'
        }
      ]
    }
  }
}
