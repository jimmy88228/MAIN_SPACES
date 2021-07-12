export default {
  data () {
    return {
      tableColumns: [
        {
          title: 'id',
          key: 'id',
          align: 'center'
        },
        {
          title: '岗位',
          key: 'station_name',
          align: 'center'
        },
        {
          title: '操作',
          key: '',
          align: 'center',
          slot: 'handle'
        }
      ]
    }
  }
}
