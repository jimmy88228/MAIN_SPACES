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
          title: "品牌名称",
          key: "goods_brand_name",
          minWidth: 120,
          render (h, { row }) {
            return (
              <div style="display: flex;align-items: center;">
                <Avatar src={row.goods_brand_image ? row.goods_brand_image : require('@rs/images/default-img.jpg')}/>
                <p>&nbsp;&nbsp;{row.goods_brand_name}</p>
              </div>
            )
          }
        },
				{
				  title: "ID",
				  key: "goods_brand_id"
				},
        {
          title: "code",
          key: "goods_brand_code",
          align: "center"
        }
      ]
    }
  }
}
