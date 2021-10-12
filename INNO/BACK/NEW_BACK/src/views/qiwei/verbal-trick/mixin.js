export default {
  data () {
    return {
      tableColumns: [
        {
          title: '话术ID',
          key: 'robot_def_id',
          width:200,
          align: 'left'
        },
        {
          title: '话术名称',
          key: 'robot_name',
          align: 'left'
        },
        {
          title: '状态',
          key: 'robot_status_str',
          width:200,
          align: 'left'
        }
      ],
    }
  }
}
