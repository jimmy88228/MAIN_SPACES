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
          title: "卡号",
          key: "user_name",
          render (h, { row }) {
            return (
              <div style="display: flex;align-items: center;">
                <Avatar src={row.wx_avatar ? row.wx_avatar : require('@rs/images/default-img.jpg')}/>
                <p style="margin-left: 10px;">{row.user_name}</p>
              </div>
            )
          }
        },
        {
          title: "手机",
          key: "mobile_phone"
        }
      ]
    }
  }
}
