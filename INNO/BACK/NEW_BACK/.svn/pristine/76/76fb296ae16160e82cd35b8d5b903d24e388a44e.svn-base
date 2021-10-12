export default {
  data () {
    return {
      tableColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '主题 ',
          width: 140,
          key: 'pub_title',
        },
        {
          title: '发布人',
          key: 'real_name',
          width: 140
        },
        {
          title: '会员卡号',
          key: 'card_num',
          width: 140,
        },
        {
          title: '分类',
          width: 180,
          key: 'cat_name'
        },
        {
          title: '点击数',
          width: 140,
          sortable: "custom",
          key: 'clicks'
        },
        {
          title: '评论数',
          width: 140,
          sortable: "custom",
          key: 'comments'
        },
        {
          title: '点赞数',
          width: 140,
          sortable: "custom",
          key: 'likes'
        },
        {
          title: '收藏数',
          width: 140,
          sortable: "custom",
          key: 'collections'
        },
        {
          title: '关联商品',
          width: 140,
          key: 'goods_num'
        },
        {
          title: '标签',
          width: 140,
          key: 'label',
          render (h, {row}) {
            let r = row.label_name.map(item => {
              return h('p', item);
            })
            return h('div', r)
          }
        },
        {
          title: '审核时间',
          width: 180,
          sortable: "custom",
          key: 'audit_time'
        },
        {
          title: '发布时间',
          width: 180,
          sortable: "custom",
          key: 'create_time'
        },
        {
          title: '图片/视频',
          width: 140,
          key: 'media_type_str'
        },
        {
          title: '是否显示',
          width: 140,
          key: 'is_show',
          slot: 'is_show'
        },
        {
          title: '审核状态',
          width: 140,
          key: 'status_str'
        },
        {
          title: '操作',
          width: 180,
          key: 'handle',
          slot: 'handle'
        }
      ]
    }
  }
}
