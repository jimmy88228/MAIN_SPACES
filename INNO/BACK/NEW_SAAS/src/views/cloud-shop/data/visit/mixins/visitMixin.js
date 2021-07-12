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
                key: "range_desc",
                minWidth: 130,
                align: "left"
            },
            {
                title: "浏览量(PV)",
                key: "page_visit",
                minWidth: 130,
                sortable: true,
                align: "right"
            },
            {
                title: "访客数(UV)",
                key: "user_visit",
                minWidth: 130,
                sortable: true,
                align: "right"
            },
            {
                title: "分享访问次数",
                key: "share_page_visit",
                minWidth: 140,
                sortable: true,
                align: "right"
            },
            {
                title: "分享访问人数",
                key: "share_user_visit",
                minWidth: 140,
                sortable: true,
                align: "right"
            },
            {
                title: "商品访问次数",
                key: "goods_visit",
                minWidth: 140,
                sortable: true,
                align: "right"
            },
            {
                title: "商品访问人数",
                key: "goods_user_visit",
                minWidth: 140,
                sortable: true,
                align: "right"
            },
        ]
      }
    }
  }
  