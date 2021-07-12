export default {
  data () {
    return {
      tableColumns: [
        {
          title: '商品名称',
          key: 'goodsName',
          align: 'left'
        },
        {
          title: '浏览量',
          key: 'pageVisits',
          align: 'left'
        },
        {
          title: '访客数',
          key: 'userVisits',
          align: 'left'
        },
        {
          title: '平均访问时长',
          key: 'averageVisitTime',
          align: 'left'
        },
        {
          title: '销售数量',
          key: 'saleCount',
          align: 'left'
        },
        {
          title: '销售金额',
          key: 'salePrice',
          align: 'left'
        }
      ]
    }
  }
}
