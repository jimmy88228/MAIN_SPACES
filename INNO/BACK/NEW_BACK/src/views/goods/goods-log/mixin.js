export default {
  data () {
    return {
      tableColumns: [
        {
          key: 'goods_name',
          title: '商品',
          align: 'left',
          slot: 'name',
          minWidth: 200
        },
        {
          key: 'nick_name',
          title: '管理员',
          align: 'left',
          slot: 'adminstrator',
          minWidth: 200
        },
        {
          key: 'log_type',
          title: '日志类型',
          align: 'left',
          minWidth: 100
        },
        {
          key: 'log_content',
          title: '日志内容',
          align: 'left',
          minWidth: 140
        },
        {
          key: 'created_at_format',
          title: '创建时间',
          align: 'left',
          minWidth: 100,
          slot: 'createTime'
        },
        {
          key: 'ip_address',
          title: 'IP地址',
          align: 'left',
          width: 100
        }
      ]
    }
  }
}
