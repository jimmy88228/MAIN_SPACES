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
									_this.$set(_this.originData[index], '_checked', val);
                }
              },
              nativeOn: {
                'click'(e) {
                  e.preventDefault();
			            e.stopPropagation();
									let isVisible = _this.originData[index].isVisible || false;
									let _rowNorms = _this.$refs['rowNorms' + index];
									if(_rowNorms) {
										_rowNorms.rowDataWatch(row.get_products);
									}
									if(_this.customSpec){ // 自定义勾选
										let originData = _this.originData || [];
										for(let i = 0; i < originData.length; i++){
											if(index != i && originData[i].isVisible){
												_this.$set(_this.originData[i], 'isVisible', false)
											}
										}
										_this.$set(_this.originData[index], 'isVisible', !isVisible);
									} else {
										if(_this.$refs['rowNorms' + index]){
											_this.$nextTick(()=>{
												_this.$refs['rowNorms' + index].checkAll = true;
											})
										}
									}
                }
              }
            })
          }
        },
        {
          title: '商品',
          slot: 'name',
					minWidth: 300
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
