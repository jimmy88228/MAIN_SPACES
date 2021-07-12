<template>
  <div class="fan-list">
    <Card>
      <Row>
        <Col :span="20">
          <SearchForm ref="search" @on-search="searchPage"></SearchForm>
          <div>
            导购人数: {{guideNum}} 吸粉人数: {{fanNum}}
          </div>
        </Col>
        <Col :span="4">
          <div style="text-align: right;">
            <Button type="primary" :loading="exportLoading" @click="exportForm">导出</Button>
          </div>
        </Col>
      </Row>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable"></Table>
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
        groupName: '',
        staffSeachStr: '',
        startTime: '',
        endTime: '',
        store_id: 0,
        staffStatus: 0
      },
      guideNum: 0,
      fanNum: 0,
      exportLoading: false
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    onLoadData (page, data) {
      let params = Object.assign({}, data, this.condition, {
        isExport: 0
      });
      return this.$ajax.post(this.$api.fansReportList, params)
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.data = res.data;
          this.canCreate = res.data && res.data.canCreate;
          this.guideNum = res.data && res.data.total;
          this.fanNum = res.data && res.data.Fans;
        }
      });
    },
    searchPage (searchData) {
      this.condition = searchData;
      this.loadData();
    },
    exportForm () {
      this.exportLoading = true;
      let params = Object.assign({}, this.condition, {
        isExport: 1
      });
      return this.$ajax.post(this.$api.fansReportExport, params)
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.$refs.myTable.exportCsv({
            filename: '吸粉统计报表',
            columns: this.tableColumns,
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
.fan-list{
  .fan-list_import{
    margin-right: 10px;
  }
  .btn-group{
    text-align: right;
  }
}
</style>
