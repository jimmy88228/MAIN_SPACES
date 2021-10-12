export default {
  watch: {
    defaultColums (orderColum) {
      const _this = this;
      this.columns = orderColum.map(item => {
        switch (item.key) {
          case 'cat_name':
            return {
              ...item,
              align: 'left',
              minWidth: 150
            }
          case 'attr_group':
            return {
              ...item,
              align: 'left',
              minWidth: 150
            }
          case 'enabled':
            return {
              ...item,
              align: 'left',
              minWidth: 150,
              render: function (h, params) {
                return h('i-switch', {
                  props: {
                    value: params.row.enabled,
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
          case 'handle':
            return {
              ...item,
              slot: 'handle',
              width: 280
            }
          default:
            return item;
        }
      });
    }
  }
}
