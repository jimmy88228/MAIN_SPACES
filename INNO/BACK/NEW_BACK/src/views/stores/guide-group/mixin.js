export default {
  data () {
    return {
      tableColumns: [
        {
          title: '组名称',
          key: 'group_name',
          align: 'left'
        },
        {
          title: '组人数',
          key: 'group_staff',
          align: 'left'
        },
        {
          title: '排序',
          key: 'sort',
          align: 'left',
          slot: 'sort'
        },
        {
          title: '操作',
          key: 'handle',
          align: 'center',
          slot: 'handle'
        }
      ],
      memberColumns: [
        {
          title: '店员信息',
          key: 'staff_name',
          align: 'left',
          slot: 'staffInfo'
        },
        {
          title: '店员代码',
          key: 'staff_code',
          align: 'left'
        },
        {
          title: '店员手机',
          key: 'staff_mobile',
          align: 'left'
        },
        {
          title: '所属店铺',
          key: 'store_name',
          align: 'left'
        },
        {
          title: '所属组',
          key: 'group_name',
          align: 'center'
        }
      ]
    }
  }
}
