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
          key: 'spec1_name',
          title: this.colorUnit
        }, {
          key: 'spec2_name',
          title: this.sizeUnit
        }, {
          key: 'product_sn',
          title: '商品条码'
        }, {
          key: 'market_price',
          title: '吊牌价'
        }, {
          key: 'goods_weight',
          title: '重量'
        }, {
          key: 'goods_cost',
          title: '成本价'
        }
      ];
      let filed = [{
        key: 'spec1_name',
        title: this.colorUnit,
        minWidth: 140,
        align: 'center',
        className: 'reset_padding'
        // fixed: 'left'
      }, {
        key: 'spec2_name',
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
          console.log('条码')
          console.log(params.row)
          console.log(_this.tableData)
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
        title: '吊牌价',
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
      }];
      // if (this.saleType == 1) {
      //   // 正常商品
      //   filed.splice(5, 1);
      //   filed.splice(4, 1);

      //   columns.splice(5, 1);
      //   columns.splice(4, 1);
      // } else {
      //   filed.splice(3, 1);
      //   columns.splice(3, 1);
      // }
      if (this.isSingle) {
        filed.splice(1, 1);
        columns.splice(1, 1);
      }
      this.columns = columns;
      return filed;
    }
  }
}
