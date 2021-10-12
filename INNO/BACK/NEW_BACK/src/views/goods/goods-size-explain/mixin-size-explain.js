export default {
  data () {
    return {
      tableColumns: [
        {
          title: '尺码图',
          key: 'name',
          // width: '130',
          align: 'center',
          slot: 'name'
        },
        {
          title: '尺码图分类',
          key: 'cat_name',
          width: '250',
          align: 'center'
        },
        {
          title: '更新时间',
          key: 'updated_at',
          // slot: 'createTime',
          align: 'center'
        },
        // {
        //   title: '结束时间',
        //   key: 'to_date',
        //   slot: 'endTime',
        //   align: 'center'
        // },
        // {
        //   title: '状态',
        //   key: 'is_enabled',
        //   slot: 'isEnabled',
        //   align: 'center'
        // },
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
