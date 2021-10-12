export default {
  data () {
    return {
      tableColumns: [
        {
          title: '直播间信息',
          key: '',
          slot: 'name'
        },
        {
          title: '直播状态',
          key: 'live_status_str'
        },
        {
          title: '直播列表',
          key: 'is_enable_type',
          slot: 'is_enable'
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
