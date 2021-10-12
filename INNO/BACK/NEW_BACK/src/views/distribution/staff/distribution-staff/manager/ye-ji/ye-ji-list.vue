<template>
  <PageTopBase>
    <div class="brand-list">
      <Row>
        <Col span="12">
          <SearchForm ref="search" @on-search="searchPage"></SearchForm>
        </Col>
        <Col span="12" class="btn-group">
          <p>分销员：{{$route.query.name}} 销售额：{{amount.order_amount}} 总收益：{{amount.comm_amount}}（结算中收益：{{amount.freeze_amount}}）</p>
          <p>自购销售额：{{amount.self_amount}}</p>
        </Col>
      </Row>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
        <template slot-scope="{ row }" slot="createTime">
          <p>{{row.created_at_format | initDate}}</p>
          <p>{{row.created_at_format | initTime}}</p>
        </template>
        <template slot-scope="{ row }" slot="handle">
          <span v-show="row.handle.view" @click="handleGoOrder(row)"><a>查看</a></span>
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
  </div>
  </PageTopBase>
</template>
<script>
import SearchForm from './search-form';
import Mixin from './mixin.js';
import PageHelper from '@/libs/page-helper.js';
import PageTopBase from '@/views/my-components/page-top-base/index';

export default {
  props: ['id'],
  components: {
    SearchForm,
    PageTopBase
  },
  data () {
    return {
      canCreate: {},
      condition: {
        searchq: '',
        searchq_type: 'related_order_sn',
        status: '-1',
        start_time: '',
        end_time: ''
      },
      amount: {}
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    onLoadData (page, data) {
      let params = Object.assign({}, data, this.condition, {
        dstb_staff_id: this.id
      });
      return this.$ajax.post(this.$api.distributionStaffPerformance, params)
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.data = res.data;
          this.amount = res.data && res.data.hander;
        }
      });
    },
    searchPage (searchData) {
      this.condition = searchData;
      this.loadData();
    },
    handleGoOrder (row) {
      let routeUrl = this.$router.resolve({
        name: 'order-info',
        params: {
          sn: row.related_order_sn
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

<style lang="less" scoped>
.brand-list{
  .brand-list_import{
    margin-right: 10px;
  }
  .btn-group{
    text-align: right;
  }
}
</style>
