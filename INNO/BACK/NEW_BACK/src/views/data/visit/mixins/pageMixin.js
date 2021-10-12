export default {
    data() {
      const _this = this;
      return {
        columns: [
            {
                title: '页面ID',
                width: 100,
								key: 'related_id',
                align: 'center'
            },
            {
                title: "页面名称",
                key: "page_name",
                minWidth: 140,
                align: "left"
            },
						{
						    title: "页面类型",
						    key: "page_type_name",
						    minWidth: 130,
						    align: "left"
						},
            {
                title: "浏览量(PV)",
                key: "brows",
                minWidth: 130,
                sortable: true,
                align: "right"
            },
            {
                title: "访客数(UV)",
                key: "visits",
                minWidth: 130,
                sortable: true,
                align: "right"
            },
            {
                title: "分享访问次数",
                key: "share_visit_timers",
                minWidth: 140,
                sortable: true,
                align: "right"
            },
            {
                title: "分享访问人数",
                key: "share_visit_mens",
                minWidth: 140,
                sortable: true,
                align: "right"
            },
            {
                title: "平均访问时长",
                key: "average_visit_time",
                minWidth: 160,
                sortable: true,
                align: "right"
            },
        ]
      }
    }
  }
  