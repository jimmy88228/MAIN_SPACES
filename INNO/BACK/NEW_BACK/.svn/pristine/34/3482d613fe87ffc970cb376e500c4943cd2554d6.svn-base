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
		// {
		// 	type: 'expand',
		// 	width: 50,
		// 	render: (h, params) => {
		// 		return h(expandRow, {
		// 			props: {
		// 				row: params.row
		// 			}
		// 		})
		// 	}
		// },
        {
          title: '商品',
          key: 'name',
          align: 'left',
		  minWidth: 200,
          slot: 'name'
        },
        {
          title: '原价',
          key: 'price',
          align: 'left',
          slot: 'price'
        },
        {
          title: '套餐价',
          key: 'packagePrice',
          align: 'left',
          slot: 'packagePrice'
        },
        {
          title: '搭配数量',
          key: 'packageNum',
          align: 'left',
          className: 'padd',
          slot: 'packageNum'
        },
        {
          title: '主商品',
          key: 'main',
          align: 'left',
          slot: 'main'
        },
        {
          title: '必选',
          key: 'request',
          align: 'left',
          slot: 'request'
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
