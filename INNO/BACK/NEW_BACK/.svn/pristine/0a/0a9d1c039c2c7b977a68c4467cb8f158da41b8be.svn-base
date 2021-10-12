<template>
  <div class="presale-order-list">
    <Card>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
        <template slot-scope="{ row }" slot="orderInfo">
          <p>订单号: {{row.presale_order_sn}}</p>
          <div style="display: flex; justify-content: space-between;">
            <div class="img_list_wrap">
              <div class="img_fixed">
                <img :src="row.img_url" v-if="row.img_url" :alt="row.goods_name" v-viewer/>
                <img src="@rs/images/default-img.jpg" :alt="row.goods_name" v-viewer v-else/>
              </div>
              <div>
                <span class="name">{{row.goods_name}}</span>
                <p>货号:{{row.goods_sn}} 售价:￥{{row.goods_amount}}</p>
                <p>规格:{{row.color_name}}, {{row.size_name}}</p>
              </div>
            </div>
            <span>x{{row.goods_number}}</span>
          </div>
        </template>
        <template slot-scope="{ row }" slot="user">
          <p>{{row.consignee}}</p>
          <p>{{row.consignee_mobile}}</p>
          <p>活动名称: {{row.activity_name}}</p>
        </template>
        <template slot-scope="{ row }" slot="pay">
          <p>定金: ￥{{row.pay_deposit_amount}}</p>
          <p>尾款: ￥{{row.pay_tail_amount}}</p>
        </template>
        <template slot-scope="{ row }" slot="modifyDate">
          <p>{{row.add_time | initDate}}</p>
          <p>{{row.add_time | initTime}}</p>
        </template>
        <template slot-scope="{ row }" slot="handle">
          <template>
            <span v-if="row.handle.view" @click="viewInfo(row)"><a>查看明细</a></span>
            <span v-if="row.handle.order_view" @click="viewDetail(row)"><a>查看正式订单</a></span>
          </template>
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
    <!--异步处理导出excel组件-->
    <div class="col">
      <notice :ref="'notice' + item" @finish="handleFinish" v-for="item in jobIdCol" :key="item"></notice>
    </div>
  </div>
</template>
<script>
import PageHelper from '@/libs/page-helper.js';
import Mixin from './mixin';
import notice from '@/views/my-components/mq-notice/mq-notice';

export default {
  data () {
    return {
      canCreate: {},
      condition: {
        searchq_type: 'presale_order_sn',
        searchq: '',
        start_time: '',
        end_time: ''
      },
      typeMap: {
        'all': 0,
        'finished': 1,
        'pay-money': 2,
        'cancel': 3
      },
      jobIdCol: []
    }
  },
  mixins: [Mixin, PageHelper],
  components: {
    notice
  },
  methods: {
    onLoadData (page, data) {
      let params = Object.assign({}, data, this.condition, {
        status: this.typeMap[this.$route.query.act]
      });
      return this.$ajax.post(this.$api.presaleOrderList, params)
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.data = res.data;
        }
      });
    },
    searchPage (searchData) {
      this.condition = searchData;
      this.loadData();
    },
    viewInfo (row) {
      let routeUrl = this.$router.resolve({
        name: 'presale-order-info',
        params: {
          sn: row.id
        }
      });
      window.open(routeUrl.href, '_blank');
    },
    viewDetail (row) {
      let routeUrl = this.$router.resolve({
        name: 'order-info',
        params: {
          sn: row.related_order_id
        }
      });
      window.open(routeUrl.href, '_blank');
    },
    handleFinish () {
      // 异步下载结束后刷新
      this.loadData();
    },
    handleExport () {
      this.$Modal.confirm({
        title: '操作提示',
        content: `确定进行导出操作`,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.$store.commit('setLoading', true);
            let params = {
              ...this.condition,
              status: this.typeMap[this.$route.query.act],
            };
          return this.$ajax.post(this.$api.presaleOrderExport,params)
          .then(response => {
            const res = response.data;
            if (res.code) {
              var jobId = res.data;
              // 打开异步提示组件
              this.jobIdCol.push(jobId);
              this.$nextTick(() => {
                this.$refs[`notice${jobId}`][0].showNotice(jobId);
              });
              this.$Message.success(res.message);
            } else {
              this.$Message.error(res.message);
            }
            this.$store.commit('setLoading', false);
          });
        }
      });
    }
  }
}
</script>
