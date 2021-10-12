export default {
  data () {
    return {
      tableColumns: [
        {
          title: '小程序路径',
          key: 'path',
          width: '350',
          align: 'center'
        },
        {
          title: '跳转链接',
          key: 'link',
          width: '350',
          align: 'center'
        },
        {
          title: '链接备注',
          key: 'remark',
          align: 'center'
        },
        {
          title: '有效期类型',
          key: 'expire',
          align: 'center'
        },
        {
          title: '操作',
          key: 'handle',
          slot: 'handle',
          align: 'center'
        }
      ]
    }
  }
}
