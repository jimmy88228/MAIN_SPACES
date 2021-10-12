<template>
  <div class="phone-call-list">
    <Card>
      <Row>
        <Col span="12">
          <SearchForm ref="search" @on-search="searchPage"></SearchForm>
        </Col>
        <Col span="12" class="btn-group">
          <Button type="primary"  @click="gainItem()" v-if="canCreate.gain">获取线路</Button>
        </Col>
      </Row>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
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
    <Spin size="large" fix v-show="spinShow"></Spin>
  </div>
</template>
<script>
import SearchForm from './search-form';
import Mixin from './mixin.js';
import PageHelper from '@/libs/page-helper.js';

export default {
  components: {
    SearchForm,
  },
  data () {
    return {
      canCreate: {},
      condition: {
        searchq: ''
      },
      spinShow: false,
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    clearOptions () {
      this.condition = {
        searchq: ''
      };
      this.$refs.search.clearOptions();
    },
    onLoadData (page, data) {
      let params = Object.assign({}, data, this.condition);
      return this.$ajax.post(this.$api.outboundRoutesList, params)
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
    gainItem () {
      this.spinShow=true;
      return this.$ajax.post(this.$api.outboundRoutesGain).then(response => {
          const res = response.data;
          if (res.code) {
            this.$Message.success(res.message);
            this.spinShow=false;
            return this.loadData();
          }
        }).finally(()=>{
              this.spinShow = false;
        })
    }
  },
  mounted () {
    this.loadData();
  }
}
</script>

<style lang="less" scoped>
.phone-call-list{
  .btn-group{
    text-align: right;
  }
}
</style>
