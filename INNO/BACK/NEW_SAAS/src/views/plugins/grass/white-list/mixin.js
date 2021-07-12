export default {
  data () {
    return {
      tableColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '会员昵称',
          key: 'real_name'
        },
        {
          title: '手机号	',
          key: 'mobile_phone'
        },
        {
          title: '卡号',
          key: 'card_num'
        },
        {
          title: '平台来源',
          key: 'platform_src'
        },
        {
          title: '白名单',
          key: '',
          slot: 'is_enabled'
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
