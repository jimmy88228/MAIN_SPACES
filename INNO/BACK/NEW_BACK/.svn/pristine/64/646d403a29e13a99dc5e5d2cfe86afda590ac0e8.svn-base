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
          title: '会员信息',
          width: 240,
          key: '',
          slot: 'member'
        },
        {
          title: '分销员名称',
          width: 140,
          key: 'dstb_staff_name'
        },
        {
          title: '分销员代码',
          width: 140,
          key: 'dstb_staff_code'
        },
        {
          title: '电话',
          width: 140,
          key: 'dstb_staff_phone'
        },
        {
          title: '分销身份',
          width: 140,
          key: 'level_name'
        },
        {
          title: '上级分销员',
          width: 140,
          key: 'staff_related_user'
        },
        {
          title: '分销等级',
          width: 140,
          key: 'rank_name'
        },
        {
          title: '所属店铺',
          width: 200,
          key: 'store_name',
          render (h, {row}) {
            return h('div', [
              h('p', row.store_name),
              h('p', ( row.store_code != '' ? '( ' + row.store_code + ' )' : '' ) )
            ])
          }
        },
        {
          title: '状态',
          width: 140,
          key: 'status'
        },
        {
          title: '是否启用',
          width: 140,
          key: 'is_enabled',
          slot: 'is_enabled'
        },
        {
          title: '下线会员',
          width: 140,
          key: 'offline_count'
        },
        {
          title: '创建时间',
          width: 140,
          sortable: "custom",
          key: 'create_time',
          slot: 'create_time'
        },
        {
          title: '操作',
          key: 'handle',
          width: 260,
          align: 'center',
          slot: 'handle',
          fixed: 'right'
        },
      ]
    }
  }
}
