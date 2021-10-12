export default {
    data() {
      return {
        sourceCol: [
            {
                title: "自定义渠道名称",
                minWidth: 150,
                key: "channel_name",
                align: "left"
            },
            {
                title: "自定义渠道代码",
                minWidth: 130,
                key: "channel_code",
                sortable: true,
                align: "center"
            },
            {
                title: "操作",
                fixed:"right",
                minWidth: 100,
                slot: "action",
                align: "center"
            },
        ]
      }
    }
  }
  