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
                  src: params.row.goods_img
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
          key: 'goods_price',
          align: 'center'
        },
        {
          title: '积分',
          key: 'real_Integral',
          align: 'center'
        },
        // {
        //   title: '储值余额',
        //   key: 'real_stored_value',
        //   align: 'center'
        // },
        {
          title: '退款数量',
          key: 'return_number',
          align: 'center'
        }
      ],
      tableData: []
    }
  }
}
