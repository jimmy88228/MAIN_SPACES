export default {
  data () {
    const Avatar = 'Avatar';
    return {
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center",
        },
        {
          title: "品牌名称",
          key: "brandName",
          minWidth: 120,
          render (h, { row }) {
            return (
              <div style="display: flex;align-items: center;">
                <Avatar src={row.logo_format ? row.logo_format : require('@rs/images/default-img.jpg')}/>
                <p>{row.brandName}</p>
              </div>
            )
          }
        },
        {
          title: "ID",
          key: "brandId"
        },
      ]
    }
  }
}
