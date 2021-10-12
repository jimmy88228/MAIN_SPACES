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
          title: "用户名",
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
          key: "mobile"
        }
        // {
        //   title: "状态",
        //   key: "status",
        //   align: "center",
        //   render (h, { row }) {
        //     const Tag = 'Tag';
        //     return (
        //       <Tag type='dot' color={row.status == 1 ? 'success' : 'error'}>{row.status === '1' ? '正常' : (row.status == 2 ? '锁定' : '未知')}</Tag>
        //     )
        //   }
        // }
      ]
    }
  }
}
