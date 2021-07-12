<template>
  <div class="pk-list">
    <Card>
      <Row>
        <Col :span="20">
          <SearchForm ref="search" @on-search="searchPage"></SearchForm>
        </Col>
        <Col :span="4">
          <div style="text-align: right;">
            <Button type="primary" :loading="exportLoading" @click="exportForm">导出</Button>
          </div>
        </Col>
      </Row>
      <Table :loading="tableLoading" :height="tableHeight" :columns="defaultColums" :data="tableData" ref="myTable" @on-sort-change="handleSort"></Table>
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
import PageHelper from '@/libs/page-helper.js';

export default {
  components: {
    SearchForm
  },
  data () {
    return {
      canCreate: {},
      condition: {
        isInit: 1,
        sortField: 'day',
        sortType: 'asc',
        searchType: 2,
        day: ''
      },
      sortField: 'day',
      sortType: 'asc',
      exportLoading: false
    }
  },
  mixins: [PageHelper],
  methods: {
    onLoadData (page, data) {
      let params = Object.assign({}, data, this.condition, {
        sortField: this.sortField,
        sortType: this.sortType,
        isExport: 0
      });
      return this.$ajax.post(this.$api.pkReportList, params)
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.data = res.data;
          this.canCreate = res.data && res.data.canCreate;
        }
      });
    },
    searchPage (searchData) {
      this.condition = searchData;
      this.loadData();
    },
    handleSort ({key, order}) {
      this.sortField = key;
      this.sortType = order;
      this.loadData();
    },
    exportForm () {
      this.exportLoading = true;
      let params = Object.assign({}, this.condition, {
        page: 1, //没什么用，只是占位符，防止服务器报错
        pageSize: 20, //没什么用，只是占位符，防止服务器报错
        isExport: 1
      });
      return this.$ajax.post(this.$api.pkReportExport, params)
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.$refs.myTable.exportCsv({
            filename: 'pk报表',
            columns: res.data.columns,
            data: res.data.items
          });
        }
        this.exportLoading = false;
      });
    }
  },
  mounted () {
    this.loadData();
  }
}
</script>

<style lang="less" scoped>
.pk-list{
  .pk-list_import{
    margin-right: 10px;
  }
  .btn-group{
    text-align: right;
  }
}
</style>
