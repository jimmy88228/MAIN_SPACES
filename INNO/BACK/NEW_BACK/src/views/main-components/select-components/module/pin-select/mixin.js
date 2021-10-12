export default {
  data () {
    return {
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
				{
				  title: "活动ID",
				  width: 80,
					key: 'id',
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
                  <img src={row.active_image ? row.active_image : require('@rs/images/default-img.jpg')} style="width: 50px;height: 50px;object-fit: contain;"/>
                </div>
                <div>
                  <p class="clamp2">{row.goods_name}</p>
                  <p>{row.goods_sn}</p>
                </div>
              </div>
            )
          }
        },
				{
					title: '活动名称',
					key: 'activity_name'
				}
      ]
    }
  }
}
