export default {
  data () {
    const _this = this;
    return {
      indeterminateTable: false,
      tableColumn: [
        {
          width: 60,
          renderHeader(h) {
            return h('Checkbox', {
              props: {
                indeterminate: _this.indeterminateTable,
                value: _this.checkTableAll
              },
              nativeOn: {
                click() {
                  _this.checkTableAll = !_this.checkTableAll;
                }
              }
            })
          },
          render(h, {row, index}) {
            return h('Checkbox', {
              props: {
                indeterminate: row._indeterminate,
                value: row._checked
              },
              on: {
                'on-change'(val) {
                  _this.originData[index]._checked = val;
                }
              },
              nativeOn: {
                'click'(e) {
                  e.preventDefault();
			            e.stopPropagation();
                  _this.originData[index].isVisible = !_this.originData[index].isVisible;
                }
              }
            })
          }
        },
        {
          title: '商品',
          slot: 'name'
        },
        {
          title: '规格',
          slot: 'norms'
        },
        {
          title: "库存",
          key: "inventory"
        },
        {
          title: "状态",
          key: "is_on_sale",
          align: "center",
          slot: 'status'
        }
      ]
    }
  }
}
