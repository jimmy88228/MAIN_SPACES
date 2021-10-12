export default {
    data() {
      const _this = this;
      return {
        columns: [
            {
                type: 'index',
                width: 60,
                align: 'center'
            },
            {
                title: "日期",
                key: "0",
                minWidth: 130,
                align: "left"
            },
            {
                title: "浏览量(PV)",
                key: "1",
                minWidth: 130,
                sortable: true,
                align: "right"
            },
            {
                title: "访客数(UV)",
                key: "2",
                minWidth: 130,
                sortable: true,
                align: "right"
            },
            {
                title: "分享访问次数",
                key: "3",
                minWidth: 140,
                sortable: true,
                align: "right"
            },
            {
                title: "分享访问人数",
                key: "4",
                minWidth: 140,
                sortable: true,
                align: "right"
            },
            {
                title: "商品访问次数",
                key: "5",
                minWidth: 140,
                sortable: true,
                align: "right"
            },
            {
                title: "商品访问人数",
                key: "6",
                minWidth: 140,
                sortable: true,
                align: "right"
            },
        ]
      }
    }
  }
  