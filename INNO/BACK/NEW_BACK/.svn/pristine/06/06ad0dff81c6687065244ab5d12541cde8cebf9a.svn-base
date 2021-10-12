export default {
  watch: {
    defaultColums (orderColum) {
      const _this = this;
      this.columns = orderColum.map(item => {
        switch (item.key) {
          case 'suppliers_name':
            return {
              ...item,
              slot: 'suppliers_name',
              align: 'left',
              minWidth: 200
            }
          case 'suppliers_code':
            return {
              ...item,
              align: 'left',
              width: 'auto',
              minWidth: 200
            }
          case 'is_enabled':
            return {
              ...item,
              render: function (h, params) {
                return h('i-switch', {
                  props: {
                    value: params.row.is_enabled,
                    size: 'large',
                    'true-value': '1',
                    'false-value': '0',
                    'before-change'() {
                      return new Promise((resolve, reject) => {
                        _this.updateEnabled(params.index, params.row).then(() => {
                          resolve();
                        });
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
            }
          case 'created_at_format':
            return {
              ...item,
              align: 'left',
              width: 'auto',
              minWidth: 120,
              slot: 'createTime'
            }
          case 'handle':
            return {
              ...item,
              slot: 'handle'
            }
          default:
            return item;
        }
      });
    }
  }
}
