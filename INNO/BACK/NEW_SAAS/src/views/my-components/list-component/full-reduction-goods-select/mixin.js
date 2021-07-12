export default {
  data () {
    const Avatar = 'Avatar';
    return {
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "商品",
          key: "goods_name",
          minWidth: 120,
          render (h, { row }) {
            return (
              <div style="display: flex;align-items: center;margin: 10px 0;">
                <div class = "img_wrapper" style = "width: 50px;height: 50px;border: 1px solid #efefef;overflow: hidden;flex-shrink: 0;margin-right:4px;">
                  <img src={row.goods_thumb2 ? row.goods_thumb2 : require('@rs/images/default-img.jpg')} style="width: 50px;height: 50px;object-fit: contain;"/>
                </div>
                <div>
                  <p class="clamp2">{row.goods_name}</p>
                  {row.min_price == row.max_price ? <p>￥{row.min_price}</p> : <p>￥{row.min_price}-￥{row.max_price}</p>}
                </div>
              </div>
            )
          }
        },
        {
          title: "库存",
          key: "inventory"
        },
        {
          title: "状态",
          key: "is_on_sale",
          align: "center",
          render (h, { row }) {
            const Tag = 'Tag';
            return (
              <Tag type='dot' color={row.is_on_sale == 1 ? 'success' : 'error'}>{row.is_on_sale === '1' ? '上架' : '下架'}</Tag>
            )
          }
        }
      ]
    }
  }
}
