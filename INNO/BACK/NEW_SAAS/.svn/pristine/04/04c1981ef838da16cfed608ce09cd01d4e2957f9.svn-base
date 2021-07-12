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
          key: "name",
          minWidth: 120,
          render (h, { row }) {
            return (
              <div style="display: flex;align-items: center;">
                <Avatar src={row.logo_format ? row.logo_format : require('@rs/images/default-img.jpg')}/>
                <p>{row.brand_name}</p>
              </div>
            )
          }
        },
        // {
        //   title: "ID",
        //   key: "brand_id"
        // },
        {
          title: "联系人",
          key: "linkman"
        },
        {
          title: "状态",
          key: "status",
          align: "center",
          render (h, { row }) {
            const Tag = 'Tag';
            return (
              <Tag type='dot' color={row.status == 1 ? 'success' : 'error'}>{row.status === '1' ? '正常' : '锁定'}</Tag>
            )
          }
        }
      ]
    }
  }
}
