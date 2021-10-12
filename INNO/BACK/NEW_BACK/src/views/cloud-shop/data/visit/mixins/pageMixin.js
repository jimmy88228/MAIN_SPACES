export default {
    data() {
      return {
        columns: [
            {
                title: '页面id',
                width: 100,
								key: "related_id",
                align: 'center'
            },
            {
                title: "页面名称",
                key: "page_name",
                minWidth: 150,
                align: "left"
            },
            {
                title: "页面类型",
                key: "page_type_name",
                minWidth: 130,
                sortable: true,
                align: "right"
            },
            {
                title: " 浏览量",
                key: "visit_count",
                minWidth: 130,
                sortable: true,
                align: "right"
            },
            {
                title: "访客数",
                key: "user_visit",
                minWidth: 140,
                sortable: true,
                align: "right"
            },
            {
                title: "分享访问次数",
                key: "share_visit_count",
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
                title: "平均访问时长",
                key: "average_visit_time",
                minWidth: 140,
                sortable: true,
                align: "right"
            },
        ]
      }
    }
  }
  