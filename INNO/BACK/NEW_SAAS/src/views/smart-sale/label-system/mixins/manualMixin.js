export default {
    data() {
      return {
        columns: [
            {
                title: '分组名称',
                key: "cat_name",
                align: 'left',
                tree: true
            },
            {
                title: "标签名",
                key: "tag_name",
                align: "center"
            },
            {
                title: "会员人数",
                slot: "user_total",
                align: "center"
            },
            {
                title: "更新时间",
                key: "last_modify",
                align: "center"
            },
            {
                title: "操作",
                slot: "action",
                fixed: "right",
                align: "center"
            }
        ]
      }
    }
  }
  