export default {
    data() {
      const _this = this;
      return {
        columns: [
            {
                title: '品牌',
                minWidth:120,
                key: "brand_name",
                align: 'left'
            },
            {
                title: "公众号菜单",
                minWidth:110,
                key: "offiaccount_menu",
                align: "right"
            },
            {
                title: "公众号消息",
                minWidth:110,
                key: "offiaccount_msg",
                align: "right"
            },
            {
                title: "公众号文章",
                minWidth:110,
                key: "offiaccount_article",
                align: "right"
            },
            {
                title: "小程序扫码",
                minWidth:110,
                key: "mini_qrcode",
                align: "right"
            },
            {
                title: "群分享",
                minWidth:100,
                key: "group_share",
                align: "right"
            },
						{
						    title: "视频号直播",
						    minWidth:100,
						    key: "video-live",
						    align: "right"
						},
            {
                title: "其他小程序",
                minWidth:110,
                key: "minipro",
                align: "right"
            },
            {
                title: "操作",
                minWidth:100,
                slot: "action",
                fixed: "right",
                align: "center"
            }
        ]
      }
    }
  }
  