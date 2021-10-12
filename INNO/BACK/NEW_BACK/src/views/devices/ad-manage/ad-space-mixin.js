export default {
  data () {
    return {
      tableColumns: [
        {
          title: '广告位名',
          key: 'name',
          align: 'center',
          minWidth: 200,
        },
        {
          title: '广告位code',
          key: 'position_code',
          minWidth: 200,
          align: 'center'
        },
        {
          title: '创建时间',
          key: 'create_time',
          minWidth: 250,
          align: 'center',
        }
      ]
    }
  }
}
