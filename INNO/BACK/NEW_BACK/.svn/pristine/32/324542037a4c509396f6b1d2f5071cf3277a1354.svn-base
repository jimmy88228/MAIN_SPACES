import InputNum from '@/views/my-components/input-num/input-num';

export default {
  data () {
    return {
      // 这个单纯展示，不涉及iview的列计算，直接使用iview中的列，会导致多次渲染，页面卡顿
      columns: []
    }
  },
  components: {
    InputNum
  },
  methods: {
    calcFiled() {
      const _this = this;
      let columns = [
        {
          key: 'color_name',
          title: this.colorUnit
        }, {
          key: 'size_name',
          title: this.sizeUnit
        }, {
          key: 'product_sn',
          title: '商品条码'
        }, {
          key: 'market_price',
          title: '售价'
        }, {
          key: 'market_price',
          title: '市场价'
        }, {
          key: 'sale_price',
          title: '促销价'
        }, {
          key: 'goods_weight',
          title: '重量'
        }, {
          key: 'goods_cost',
          title: '成本价'
        }, {
          key: 'product_number',
          title: '库存'
        }, {
          key: 'hold_number',
          title: '库存占用'
        }, {
          key: 'is_onsale',
          title: '上架'
        }
      ];
      let filed = [{
        key: 'color_name',
        title: this.colorUnit,
        minWidth: 140,
        align: 'center',
        className: 'reset_padding'
        // fixed: 'left'
      }, {
        key: 'size_name',
        title: this.sizeUnit,
        minWidth: 140,
        align: 'center',
        className: 'reset_padding'
        // fixed: 'left'
      }, {
        key: 'product_sn',
        minWidth: 140,
        align: 'center',
        title: '商品条码',
        className: 'reset_padding',
        // fixed: 'left',
        render: function (h, params) {
          return h('div', [
            h(InputNum, {
              props: {
                value: params.row.product_sn,
                isLimit: false,
                configTips: {
                  empty: {
                    t: '请输入商品条码',
                    r: /\S+/
                  },
                  range: null
                }
              },
              on: {
                input: function (value) {
                  _this.tableData[params.index].product_sn = value;
                }
              }
            })
          ]);
        }
      }, {
        key: 'market_price',
        minWidth: 120,
        align: 'center',
        title: '售价',
        className: 'reset_padding',
        render: function (h, params) {
          return h('div', [
            h(InputNum, {
              props: {
                value: params.row.market_price,
                configTips: {
                  empty: {
                    t: '请输入售价',
                    r: /\S+/
                  },
                  range: {
                    t: '售价须大于0'
                  }
                }
              },
              on: {
                input: function (value) {
                  _this.tableData[params.index].market_price = value;
                }
              }
            })
          ]);
        }
      }, {
        key: 'market_price',
        minWidth: 120,
        align: 'center',
        title: '市场价',
        className: 'reset_padding',
        render: function (h, params) {
          return h('div', [
            h(InputNum, {
              props: {
                value: params.row.market_price,
                configTips: {
                  empty: {
                    t: '请输入市场价',
                    r: /\S+/
                  },
                  range: {
                    t: '市场价须大于0'
                  }
                }
              },
              on: {
                input: function (value) {
                  _this.tableData[params.index].market_price = value;
                }
              }
            })
          ]);
        }
      }, {
        key: 'sale_price',
        minWidth: 120,
        align: 'center',
        title: '促销价',
        className: 'reset_padding',
        render: function (h, params) {
          return h('div', [
            h(InputNum, {
              props: {
                value: params.row.sale_price,
                configTips: {
                  empty: {
                    t: '请输入促销价',
                    r: /\S+/
                  },
                  range: {
                    t: '促销价须大于0'
                  }
                }
              },
              on: {
                input: function (value) {
                  _this.tableData[params.index].sale_price = value;
                }
              }
            })
          ]);
        }
      }, {
        key: 'goods_weight',
        title: '重量',
        minWidth: 120,
        align: 'center',
        className: 'reset_padding',
        render: function (h, params) {
          return h(InputNum, {
            props: {
              value: params.row.goods_weight,
              configTips: {
                empty: null,
                range: null
              }
            },
            on: {
              input: function (value) {
                _this.tableData[params.index].goods_weight = value;
              }
            }
          });
        }
      }, {
        key: 'goods_cost',
        title: '成本价',
        minWidth: 120,
        align: 'center',
        className: 'reset_padding',
        render: function (h, params) {
          return h(InputNum, {
            props: {
              value: params.row.goods_cost,
              configTips: {
                empty: null,
                range: null
              }
            },
            on: {
              input: function (value) {
                _this.tableData[params.index].goods_cost = value;
              }
            }
          });
        }
      }, {
        key: 'product_number',
        title: '库存',
        minWidth: 80,
        align: 'center',
        className: 'reset_padding',
        render: function (h, params) {
          return h(InputNum, {
            props: {
              value: params.row.product_number,
              configTips: {
                empty: null,
                range: null
              }
            },
            on: {
              input: function (value) {
                _this.tableData[params.index].product_number = value;
              }
            }
          });
        }
      },
      {
        key: 'hold_number',
        title: '库存占用',
        align: 'center',
        minWidth: 60,
        className: 'reset_padding',
      }, {
        key: 'is_onsale',
        title: '上架',
        minWidth: 86,
        align: 'center',
        className: 'reset_padding',
        render: function (h, params) {
					let is_onsale = params.row.is_onsale;
					if(typeof(is_onsale) == 'number') is_onsale = is_onsale + '';
          return h('i-switch', {
            props: {
              value: is_onsale,
              'true-value': '1',
              'false-value': '0',
              'before-change'() {
                return new Promise((resolve, reject) => {
                  if (_this.saleStatus == '1') {
                    const result = _this.tableData.filter(item => item.is_onsale == '1');
                    if (result.length > 1) {
                      resolve();
                    } else {
                      if (is_onsale == '1') {
                        _this.$Message.error('请先设置商品下架！商品上架后，条码不允许全部下架哦！');
                        reject();
                      } else {
                        resolve();
                      }
                    }
                  }
                  if (_this.saleStatus == '0') {
                    _this.$Message.error('请先设置商品上架，方可设置条码的上架状态哦！');
                    reject();
                  }
                })
              }
            },
            on: {
              'on-change': function (val) {
                _this.tableData[params.index].is_onsale = val;
              }
            }
          }, [
            h('span', {
              slot: 'open'
            }, '是'),
            h('span', {
              slot: 'close'
            }, '否')
          ]);
        }
      }];
      if (this.saleType == 1) {
        // 正常商品
        filed.splice(5, 1);
        filed.splice(4, 1);

        columns.splice(5, 1);
        columns.splice(4, 1);
      } else {
        filed.splice(3, 1);
        columns.splice(3, 1);
      }
      if (this.isSingle) {
        filed.splice(1, 1);
        columns.splice(1, 1);
      }
      this.columns = columns;
      return filed;
    }
  }
}
