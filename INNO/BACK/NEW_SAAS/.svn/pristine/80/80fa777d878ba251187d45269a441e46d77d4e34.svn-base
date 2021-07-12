<template>
  <div class="stock-list">
    <Card>
      <SearchForm ref="search" :stock-type="stockType" :store-list="storeList" :ware-house="warehouse" @on-search="searchPage"></SearchForm>
      <Table :loading="tableLoading" :height="tableHeight" :columns="columns" :data="tableData" ref="myTable">
        <template slot-scope="{ row }" slot="handle">
          <span v-show="row.handle.view" @click="viewInfo(row)"><a>查看明细</a></span>
        </template>
      </Table>
      <div v-show="pageTotal" class="list_page">
        <Page
          :total="pageTotal"
          :page-size="pageSize"
          :current="currentPage"
          :page-size-opts="pageSizeOpts"
          @on-change="e => changePage(e)"
          @on-page-size-change="ps => handlePageSize(ps)"
          show-elevator
          show-total
          show-sizer></Page>
      </div>
    </Card>
  </div>
</template>
<script>
import SearchForm from './search-form';
import Mixin from './mixin.js';
import PageHelper from '@/libs/page-helper.js';

export default {
  components: {
    SearchForm
  },
  data () {
    return {
      canCreate: {},
      condition: {
        stock_type: '1',
        store_id: '0',
        stock_id: '0',
        goods_sn: ''
      },
      stockType: {},
      storeList: [],
      warehouse: [],
      productColumns: []
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    clearOptions () {
      this.condition = {
        stock_type: '1',
        store_id: '0',
        stock_id: '0',
        goods_sn: ''
      };
      this.$refs.search.clearOptions();
    },
    onLoadData (page, data) {
      let params = Object.assign({}, data, this.condition);
      return this.$ajax.post(this.$api.goodsStockList, params)
    		.then(response => {
    			const res = response.data;
    			if (res.code) {
            this.data = res.data;
            this.canCreate = res.data && res.data.canCreate;
            this.stockType = res.data && res.data.stock_type;
            this.storeList = res.data && res.data.store_list;
            this.warehouse = res.data && res.data.warehouse;
            this.productColumns = res.data && res.data.columns2;
          }
        });
    },
    searchPage (searchData) {
      this.condition = searchData;
      this.loadData();
    },
    viewInfo (row) {
      this.$router.push({
        name: 'goods-product',
        params: {
          data: JSON.stringify({
            goods_id: row.goods_id,
            name: row.name,
            goods_sn: row.goods_sn,
            depotid: row.depotid,
            stock_type: this.condition.stock_type
          })
        }
      });
    }
  },
  mounted () {
    this.loadData();
  }
}
</script>
<style lang="less" scoped>
.stock-list{
  .stock-list_import{
    margin-right: 10px;
  }
  .btn-group{
    text-align: right;
  }
}
</style>
