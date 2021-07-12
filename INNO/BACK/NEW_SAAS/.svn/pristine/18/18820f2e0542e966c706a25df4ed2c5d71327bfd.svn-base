export default {
  data () {
    const _this = this;
    return {
      cusColumns: [{
        title: '为主供应商',
        key: 'is_master',
        align: 'center',
        render: function (h, params) {
          return h('i-switch', {
            props: {
              value: params.row.is_master,
              size: 'large',
              'before-change'() {
                return new Promise((resolve, reject) => {
                  if (_this.searchForm.selectRange == 2) {
                    if (!params.row._checked) {
                      _this.$Message.error('请从已选供应商进行设置');
                      return false;
                    }
                  }
                  _this.tableData.forEach(item => {
                    item.is_master = false;
                  });
                  _this.tableData[params.index].is_master = true;
                  _this.supplierId = params.row.id;
                  _this.handleInfoSetting();
                })
              }
            }
          }, [
            h('span', {
              slot: 'open'
            }, '开启'),
            h('span', {
              slot: 'close'
            }, '关闭')
          ])
        }
      },
      {
        title: '供应商名称',
        key: 'suppliers_name',
        align: 'center'
      },
      {
        title: '供应商代码',
        key: 'suppliers_code',
        align: 'center'
      },
      {
        title: '操作',
        width: 120,
        align: 'center',
        key: 'handle',
        render: function (h, params) {
          return h('a', {
            on: {
              click: () => {
                _this.$Modal.confirm({
                  title: '删除提示',
                  content: '确定删除该供应商吗？',
                  okText: '确定删除',
                  cancelText: '取消',
                  onOk: () => {
                    _this.$nextTick(() => {
                      _this.delData(params.row.special_id);
                    })
                  }
                });
              }
            }
          }, '删除')
        }
      }
      ]
    }
  }
}
