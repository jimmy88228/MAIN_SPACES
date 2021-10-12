export default {
  data () {
    let _this = this;
    return {
      columns: [
        {
          type: 'selection',
          width: 60
        },
        {
          title: '商品名',
          key: 'productName',
          render (h, params) {
            return h('div', [
              h('p', params.row.productName),
              h('p', `(款号: ${params.row.sn})`)
            ])
          }
        },
        {
          title: '订单编号',
          key: 'orderSn',
        },
        {
          title: '会员卡号',
          key: 'cardSn',
        },
        {
          title: '评分',
          key: 'rate',
          align: 'right',
		  width: 90
        },
        {
          title: '评论内容',
          key: 'commentContent',
        },
        {
          title: '回复内容',
          key: 'replyContent',
        },
        {
          title: '自主评价',
          key: 'commentMine',
          align: 'center',
		  width: 110,
          render: function (h, params) {
            const text = params.row.commentMine == 1 || params.row.commentMine == 'true' ? '是' : '否';
            return h('Tag', {
              style: {
                cursor: 'pointer'
              },
              props: {
                type: 'dot',
                color: params.row.commentMine == 1 || params.row.commentMine == 'true' ? 'success' : 'error'
              }
            }, text);
          }
        },
        {
          title: '显示/隐藏',
          key: 'show',
          align: 'center',
		  width: 110,
          render: function (h, params) {
            const text = params.row.show == 1 || params.row.show == 'true' ? '是' : '否';
            return h('Tag', {
              style: {
                cursor: 'pointer'
              },
              props: {
                type: 'dot',
                color: params.row.show == 1 || params.row.show == 'true' ? 'success' : 'error'
              }
            }, text);
          }
        },
        {
          title: '操作',
          key: 'handle',
          align: 'center',
          render: function (h, params) {
            const wrapper = [];
            if (params.row.handle.del) {
              wrapper.push(
                h('span', [
                  h('a', {
                    on: {
                      click: () => {
                        this.editSpec(params.index, params.row, true);
                      }
                    }
                  }, '删除'),
                  h('Divider', {
                    style: {
                      display: 'inline-block'
                    },
                    props: {
                      type: "vertical"
                    }
                  })
                ])
              );
            }
            if (params.row.handle.reply) {
              wrapper.push(
                h('span', [
                  h('a', {
                    on: {
                      click: () => {
                        _this.showReply = true;
                      }
                    }
                  }, '回复'),
                  h('Divider', {
                    style: {
                      display: 'inline-block'
                    },
                    props: {
                      type: "vertical"
                    }
                  })
                ])
              );
            }
            if (params.row.handle.setChange) {
              // 编辑按钮
              wrapper.push(
                h('i-switch', {
                  props: {
                    size: 'large'
                  },
                  on: {
                    click: () => {
                      // _this.editSupplier(params.index, params.row);
                    }
                  }
                }, [
                  h('span', {
                    slot: 'open'
                  }, '好评'),
                  h('span', {
                    slot: 'close'
                  }, '差评')
                ])
              );
            }
            return h('div', wrapper);
          }
        },
      ],
      data: [
        {
          productName: '商品1',
          orderSn: '001602003232358133355741',
          sn: 'JW025547',
          cardSn: 'SHB80004312',
          rate: 4,
          commentContent: '扭扭捏捏6666552020 - 03 - 24 00: 00: 16 ',
          replyContent: '感谢亲亲的支持哟~ 2020-03-18 17:58:39',
          commentMine: 0,
          show: 1,
          commentType: 0, //0 为负面评价/1 为正面评价
          handle: {
            reply: true,
            del: true,
            setChange: true
          }
        }
      ]
    }
  }
}
