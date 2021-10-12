export default {
  data () {
    return {
      tableColumns: [
        {
          title: '活动名称',
          key: 'act_name'
        },
        {
          title: '优惠券',
          key: 'bouns_data',
          render (h, {row}) {
            return h('div', row.bouns_data.map(item =>  h('p', {
              style: {
                marginBottom: '10px'
              }
            }, item)))
          }
        },
        {
          title: '状态',
          key: 'is_enabled',
          slot: 'is_enabled'
        },
        {
          title: '排序',
          key: 'sort'
        },
        {
          title: '操作',
          key: 'handle',
          slot: 'handle'
        }
      ]
    }
  }
}
