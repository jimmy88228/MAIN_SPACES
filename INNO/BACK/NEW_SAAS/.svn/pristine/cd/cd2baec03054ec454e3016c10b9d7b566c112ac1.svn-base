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
                  <p>吊牌价: {row.market_price}</p>
                </div>
              </div>
            )
          }
        },
        {
          title: "货号",
          key: "goods_sn"
        }
      ]
    }
  }
}
