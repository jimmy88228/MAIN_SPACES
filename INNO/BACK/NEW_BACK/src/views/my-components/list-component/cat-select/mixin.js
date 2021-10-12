export default {
  data () {
    return {
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        }
      ],
      cat_columns: [
        {
          title: "分类名称",
          key: "cat_name",
          tree: true,
          minWidth: 120,
          // render (h, { row }) {
          //   return (
          //     <span>{row.cat_name}</span>
          //   )
          // }
        },
        {
          title: "分类code",
          key: "cat_code"
        }
      ],
      vcat_columns: [
        {
          title: "分类名称",
          key: "vcat_name",
          tree: true,
          minWidth: 120,
          // render (h, { row }) {
          //   return (
          //     <span>{row.vcat_name}</span>
          //   )
          // }
        },
        {
          title: "分类id",
          key: "vcat_id"
        }
      ]
    }
  }
}
