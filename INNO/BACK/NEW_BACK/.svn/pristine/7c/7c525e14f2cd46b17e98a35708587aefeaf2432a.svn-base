<template>
	<div class="recycle-list">
    <Card>
      <searchForm @on-search="searchPage" ref="search-form"></searchForm>

      <Table :columns="tableColums" :data="tableData" :span-method="handleSpan" disabled-hover>
        <template slot-scope="{ row }" slot="orderInfo">
          <div class="header_inline">
            <span class="header_item">退单号:{{row.return_sn}}</span>
            <span class="header_item">关联订单号:<a @click="handleGoOrderInfo(row.related_order_id)">{{row.related_order_sn}}</a></span>
            <span class="header_item">所属门店:{{row.store_name}}</span>
          </div>
        </template>
      </Table>
      <div class="list_page" v-show="pageTotal">
        <Page
          :total="pageTotal"
          :page-size="pageSize"
          :current="currentPage"
          :page-size-opts="pageSizeOpts"
          @on-change="changePage"
          @on-page-size-change="ps => handlePageSize(ps)"
          show-total
          show-elevator
          show-sizer></Page>
      </div>
    </Card>
	</div>
</template>

<script>
import PageHelper from '@/libs/page-helper.js';
import searchForm from './search-form';
import Mixin from './mixin.js';

export default {
  mixins: [PageHelper, Mixin],
  data () {
    return {
      condition: {
        search_type: 'related_order_sn',
        keywords: ''
      }
    }
  },
  components: {
    searchForm
  },
  methods: {
   handleSpan({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        return [1, 6];
      } else if (columnIndex > 1) {
        return [0, 0];
      }
    },
    onLoadData (page, data) {
      this.$store.commit('setLoading', true);
      let params = Object.assign({}, data, this.condition);
      return this.$ajax.post(this.$api.recycleBinList, params)
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.data = res.data;
          this.statusList = res.data && res.data.status;
        }
        this.$store.commit('setLoading', false);
      });
    },
    searchPage (searchData) {
      this.condition = searchData;
      this.loadData();
    },
    handleGoOrderInfo (id) {
      let routeUrl = this.$router.resolve({
        name: 'order-info',
        params: {
          sn: id
        }
      });
      window.open(routeUrl.href, '_blank');
    }
  },
  mounted () {
    this.loadData();
  }
}
</script>

<style lang="less">
.recycle-list{
  .ivu-table-cell-expand{
    display: none;
  }
  td.ivu-table-expanded-cell {
    padding: 0 0 10px 0;
  }
  .header_inline{
    white-space: pre-wrap;
    .header_item{
      margin-right: 30px;
    }
  }
}
</style>
