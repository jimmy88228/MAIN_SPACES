export default {
  data () {
    return {
      tableColumns: [
        {
          title: '活动名称',
          key: 'name',
          width: '350',
          align: 'center'
        },
        {
          title: '小程序页面',
          key: 'page_name',
          width: '350',
          align: 'center'
        },
        {
          title: '启用状态',
          key: 'is_enable_type',
          align: 'center',
          slot: 'isEnabled'
        },
        /*{
          title: '标签',
          key: 'expire',
          align: 'center'
        },*/
          {
          title: '排序',
          key: 'sort',
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
