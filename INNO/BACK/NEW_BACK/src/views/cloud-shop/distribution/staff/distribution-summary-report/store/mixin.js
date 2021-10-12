export default {
  data() {
    return {
      tableColumns: [
        {
          title: '店铺名称',
          width: 180,
          key: 'storeName'
        },
        {
          title: '店铺代码	',
          width: 140,
          key: 'storeCode'
        },
        {
          title: '省份	',
          width: 140,
          key: 'provinceName'
        },
        {
          title: '简介	',
          width: 140,
          key: 'remark'
        },
        {
          title: '一级渠道	',
          width: 140,
          key: 'firstAgentName'
        },
        {
          title: '二级渠道	',
          width: 140,
          key: 'secondAgentName'
        },
        {
          title: '三级渠道	',
          width: 140,
          key: 'thirdAgentName'
        },
        {
          title: '四级渠道	',
          width: 140,
          key: 'fourthAgentName'
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
          title: '卡片回访人数',
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
          title: '新增会员数',
          width: 140,
          sortable: "custom",
          key: 'belongUsers'
        },
        {
          title: '新增粉丝数',
          width: 140,
          sortable: "custom",
          key: 'fanUsers'
        }
      ]
    }
  }
}
