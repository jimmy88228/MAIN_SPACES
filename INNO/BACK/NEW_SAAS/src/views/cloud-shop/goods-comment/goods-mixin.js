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
					minWidth: 100,
          key: 'productName',
          render (h, params) {
            return h('div', [
              h('p', params.row.goods_name),
              h('p', `(款号: ${params.row.goods_sn})`)
            ])
          }
        },
        {
          title: '订单编号',
					minWidth: 100,
          key: 'order_sn',
        },
        {
          title: '会员卡号',
					minWidth: 110,
          key: 'card_num',
        },
        {
          title: '评分',
          key: 'comment_level',
					width: 50,
          align: 'center',
					width: 90
        },
        {
          title: '评论内容',
          slot: 'comment_content',
					minWidth: 240
        },
        {
          title: '回复内容',
          key: 'reply_msg',
					minWidth: 120,
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
          slot: 'is_show',
          align: 'center',
					width: 110,
        },
        {
          title: '操作',
					slot: 'action',
					width: 150,
          align: 'center',
      //     render: function (h, params) {
      //       const wrapper = [];
						// let handle = params.row.handle || {};
      //       if (handle.del) {
      //         wrapper.push(
      //           h('span', [
      //             h('a', {
      //               on: {
      //                 click: () => {
      //                   this.editSpec(params.index, params.row, true);
      //                 }
      //               }
      //             }, '删除'),
      //             h('Divider', {
      //               style: {
      //                 display: 'inline-block'
      //               },
      //               props: {
      //                 type: "vertical"
      //               }
      //             })
      //           ])
      //         );
      //       }
      //       if (handle.reply) {
      //         wrapper.push(
      //           h('span', [
      //             h('a', {
      //               on: {
      //                 click: () => {
      //                   _this.showReply = true;
      //                 }
      //               }
      //             }, '回复'),
      //             h('Divider', {
      //               style: {
      //                 display: 'inline-block'
      //               },
      //               props: {
      //                 type: "vertical"
      //               }
      //             })
      //           ])
      //         );
      //       }
      //       if (handle.setChange) {
      //         // 编辑按钮
      //         wrapper.push(
      //           h('i-switch', {
      //             props: {
      //               size: 'large'
      //             },
      //             on: {
      //               click: () => {
      //                 // _this.editSupplier(params.index, params.row);
      //               }
      //             }
      //           }, [
      //             h('span', {
      //               slot: 'open'
      //             }, '好评'),
      //             h('span', {
      //               slot: 'close'
      //             }, '差评')
      //           ])
      //         );
      //       }
      //       return h('div', wrapper);
      //     }
        },
      ]
    }
  }
}
