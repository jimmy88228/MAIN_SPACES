export default {
  data () {
    return {
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "尺码名称",
          key: "name",
          minWidth: 120
        },
        {
          title: "ID",
          key: "id"
        },
      ]
    }
  }
}
