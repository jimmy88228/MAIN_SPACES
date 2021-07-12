export default {
  data () {
    return {
      tableColumns: [
        {
          title: '上级区域',
          width: 140,
          key: 'parentAgentName'
        },
        {
          title: '区域名称',
          width: 140,
          key: 'agentName'
        },
        {
          title: '区域代码	',
          width: 140,
          key: 'agentCode'
        },
        {
          title: '分销业绩',
          width: 140,
          sortable: "custom",
          key: 'orderPrice'
        },
        {
          title: '分销收益',
          width: 140,
          sortable: "custom",
          key: 'commAmount'
        },
        {
          title: '静默数量',
          width: 140,
          sortable: "custom",
          key: 'silentCount'
        },
        {
          title: '静默比例(%)	',
          width: 140,
          sortable: "custom",
          key: 'silentRate'
        },
        {
          title: '生成卡片数量',
          width: 140,
          sortable: "custom",
          key: 'createPosterCount'
        },
        {
          title: '卡片回访热书',
          width: 140,
          sortable: "custom",
          key: 'fromPosterUv'
        },
        {
          title: '分享链接次数',
          width: 140,
          sortable: "custom",
          key: 'createShareCount'
        },
        {
          title: '链接回访次数',
          width: 140,
          sortable: "custom",
          key: 'fromShareUv'
        },
        {
          title: '新怎会员数',
          width: 140,
          sortable: "custom",
          key: 'belongUsers'
        },
        {
          title: '新怎粉丝数',
          width: 140,
          sortable: "custom",
          key: 'fanUsers'
        }
      ]
    }
  }
}
