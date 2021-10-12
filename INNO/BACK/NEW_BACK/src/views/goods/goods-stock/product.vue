<template>
  <div class="product">
    <PageTopBase>
      <div class="content">
        <p>店铺: {{storeName}}</p>
        <p>款号: {{goodsSn}}</p>
        <Table :columns="columns" :data="tableData" ref="myTable" :span-method="handleSpan" border></Table>
      </div>
    </PageTopBase>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>
import PageTopBase from '@/views/my-components/page-top-base/index';

const COLUMNS = [
  {
    title: "颜色",
    key: "color_name",
    minwidth: 200,
    align: "center"
  },
  {
    title: "尺码",
    key: "size_name",
    align: "center",
    minWidth: 200
  },
  {
    title: "商品条码",
    key: "product_sn",
    align: "center",
    width: 180
  },
  {
    title: "库存",
    key: "P_num",
    align: "center",
    width: 80
  },
  {
    title: "最后上传时间",
    key: "createdate",
    align: "center",
    width: 200
  }
]
export default {
  props: ['data'],
  components: {
    PageTopBase
  },
  data () {
    return {
      tableData: [],
      columns: COLUMNS,
      storeName: '',
      goodsSn: '',
      spinShow: false
    }
  },
  methods: {
    loadData () {
      const data = JSON.parse(this.data);
      this.storeName = data.name;
      this.goodsSn = data.goods_sn;
      this.spinShow = true;
      return this.$ajax.post(this.$api.goodsStockProduct, {
        goods_id: data.goods_id,
        depotid: data.depotid,
        stock_type: data.stock_type
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          let resData = res.data;
          let items = resData.items;
          const result = [];
          let prev = null;
          for (const key in items) {
            items[key].list.forEach(item => {
              const len = items[key].list.length;
              result.push(Object.assign({}, item, {
                rowSpan: (!prev || prev != item.color_id) ? len : 0,
                colSpan: (!prev || prev != item.color_id) ? 1 : 0
              }));
              prev = item.color_id;
            });
          }
          this.tableData = result;
        }
        this.spinShow = false;
      });
    },
    handleSpan ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return [this.tableData[rowIndex].rowSpan, this.tableData[rowIndex].colSpan];
      }
    }
  },
  mounted () {
    this.loadData();
  }
}
</script>

<style lang="less" scoped>
.product{

}
</style>
