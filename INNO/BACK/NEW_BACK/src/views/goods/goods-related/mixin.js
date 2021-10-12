export default {
  watch: {
    defaultColums (orderColum) {
      const _this = this;
      this.columns = orderColum.map(item => {
        switch (item.key) {
          case 'extend_product_sn':
            return {
              ...item,
              render: function (h, params) {
                return h('Poptip', {
                  props: {
                    value: params.row.isVisible,
                    placement: 'right'
                  },
                  on: {
                    'on-popper-show' () {
                      _this.tableData[params.index].isVisible = true;
                    }
                  }
                }, [
                  h('span', {
                    style: {
                      cursor: 'pointer'
                    }
                  }, params.row.extend_product_sn),
                  h('Icon', {
                    props: {
                      type: 'ios-create-outline',
                      size: '20'
                    },
                    style: {
                      cursor: 'pointer'
                    }
                  }),
                  h('div', {
                    slot: 'content'
                  }, [
                    h('Input', {
                      attrs: {
                        placeholder: '请输入关联条码'
                      },
                      props: {
                        value: params.row.edit_extend_product_sn
                      },
                      on: {
                        input (value) {
                          _this.tableData[params.index].edit_extend_product_sn = value;
                        }
                      }
                    }),
                    h('div', {
                      style: {
                        textAlign: 'left',
                        marginTop: '10px'
                      }
                    }, [
                      h('Button', {
                        style: {
                          marginRight: '10px'
                        },
                        props: {
                          type: 'primary'
                        },
                        on: {
                          click () {
                            _this.tableData[params.index].isVisible = false;
                            _this.editRelatedInformation(params.row);
                          }
                        }
                      }, '确定'),
                      h('Button', {
                        on: {
                          click () {
                            _this.tableData[params.index].isVisible = false;
                          }
                        }
                      }, '取消')
                    ])
                  ])
                ])
              }
            }
          case 'suppliers_name':
            return {
              ...item,
              render: function (h, params) {
                return h('div', [
                  h('p', {
                    style: {
                      cursor: 'pointer',
                      marginBottom: '10px'
                    }
                  }, params.row.is_master_name),
                  h('Badge', {
                    props: {
                      count: params.row.cross_goods_suppliers_relation.length
                    }
                  }, [
                    h('Button', {
                      props: {
                        icon: 'md-add'
                      },
                      on: {
                        click () {
                          _this.$router.push({
                            name: 'goods-Related-supply',
                            params: {
                              id: params.row.goods_id
                            }
                          });
                        }
                      }
                    }, '查看')
                  ])
                ])
              }
            }
          default:
            return item;
        }
      });
    }
  }
}
