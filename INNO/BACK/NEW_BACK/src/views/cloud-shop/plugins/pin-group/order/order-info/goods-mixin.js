export default {
  data() {
    return {
      columns: [{
          title: '商品详情',
          key: 'goods_name',
          align: 'left',
          width: 300,
          render (h, params)  {
            return h('div', {
              style: {
                display: 'flex'
              }
            }, [
              h('img', {
                style: {
                  width: '60px',
                  height: '60px',
                  display: 'block',
                  margin: '10px 10px 10px 0',
                  objectFit: 'contain',
                  flexShrink: 0
                },
                attrs: {
                  src: params.row.thumb_url
                }
              }),
              h('div', {
                style: {
                  marginTop: '10px'
                },
              }, [
                h('p', {
                  attrs: {
                    class: 'clamp2'
                  }
                }, params.row.goods_name),
                h('p', {
                  attrs: {
                    // class: 'clamp2'
                  }
                }, '款号:' + params.row.goods_sn),
                h('p', {
                  attrs: {
                    // class: 'clamp2'
                  }
                }, params.row.goods_attr)
              ])
            ]);
          }
        },
        {
          title: '商品条码',
          key: 'product_sn',
          align: 'center'
        },
        {
          title: '商品价格',
          key: 'market_price',
          align: 'center'
        },
        {
          title: '实际价格',
          key: 'sale_price',
          align: 'center'
        },
        {
          title: '数量',
          key: 'goods_number',
          align: 'center'
        },
        {
          title: '小计',
          key: 'goods_amount',
          align: 'center'
        }
      ],
      tableData: []
    }
  }
}
