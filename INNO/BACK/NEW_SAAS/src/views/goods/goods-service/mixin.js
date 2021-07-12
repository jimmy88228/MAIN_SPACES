export default {
  watch: {
    defaultColums (orderColum) {
      const _this = this;
      this.columns = orderColum.map(item => {
        switch (item.key) {
          case 'name':
            return {
              ...item,
              slot: 'name',
              align: 'left',
              minWidth: 200
            }
          case 'enable':
            return {
              ...item,
              render: function (h, params) {
                return h('i-switch', {
                  props: {
                    value: params.row.enable,
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
              width: 'auto',
              minWidth: 200,
              align: 'left',
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
