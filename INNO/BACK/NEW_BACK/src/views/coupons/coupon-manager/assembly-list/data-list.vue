<template>
  <div class="assembly-data-list">
    <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable" @on-sort-change="sortPage">
      <template slot-scope="{ row }" slot="coupons">
        <span>{{row.get_coupons.type_name}}</span>
      </template>
      <template slot-scope="{ row }" slot="order">
        <span>{{row.get_order_info ? row.get_order_info.order_sn : ''}}</span>
      </template>
      <template slot-scope="{ row }" slot="phone">
        <span>{{row.get_members.mobile_phone}}</span>
      </template>
      <template slot-scope="{ row }" slot="card">
        <span>{{row.get_members.user_name}}</span>
      </template>

      <template slot-scope="{ row }" slot="realName">
        <span>{{row.get_members.real_name}}</span>
      </template>

      <template slot-scope="{ row }" slot="weixinSubscribe">
        <span>{{row.get_members.weixin_subscribe}}</span>
      </template>

      <template slot-scope="{ row }" slot="appletOpenid">
        <span>{{row.get_members.applet_openid}}</span>
      </template>

      <template slot-scope="{ row }" slot="sendTime">
        <p>{{row.send_time | initDate}}</p>
        <p>{{row.send_time | initTime}}</p>
      </template>
      <template slot-scope="{ row }" slot="usedTime">
        <p>{{row.used_time | initDate}}</p>
        <p>{{row.used_time | initTime}}</p>
      </template>
      <template slot-scope="{ row }" slot="handle">
        <span v-show="row.handle.sendremove" @click="delItem(row, '删除提示', '确定删除该类型吗？')"><a>删除</a></span>
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
    <Spin size="large" fix v-if="spinShow"></Spin>
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
  mixins: [Mixin, PageHelper],
  props: ['id'],
  components: {
    notice
  },
  data () {
    return {
      condition: {
        searchq: '',
        searchq_type: 'bonus_sn',
        time_type: 1,
        start_time: '',
        start_time: ''
      },
      typeList: {
        'send-list': 1,
        'use-list': 2,
        'del-list': 3
      },
      spinShow: false,
      sortOrder: 'desc',
      sortType: 'bonus_id',
      jobIdCol: []
    }
  },
  methods: {
    onLoadData (page, data) {
      this.spinShow = true;
      let params = Object.assign({}, data, this.condition, {
        type_id: this.id,
        show_type: this.typeList[this.$route.query.act],
        sortord: this.sortOrder,
        sort_type: this.sortType
      });
      return this.$ajax.post(this.$api.couponsAssembly, params)
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.data = res.data;
          this.canCreate = res.data && res.data.canCreate;
        }
        this.spinShow = false;
      });
    },
    sortPage ({order, key}) {
      this.sortOrder = order;
      this.sortType = key;
      this.loadData();
    },
    searchPage (searchData) {
      this.condition = searchData;
      this.loadData();
    },
    onDelItem(row) {
      return this.$ajax.post(this.$api.couponsSendRemove, {
        bonus_id: row.bonus_id
      });
    },
    handleFinish () {
      // 异步下载结束后刷新
      this.loadData();
      this.currentPage = 1;
    },
    handleExport () {
      this.$Modal.confirm({
        title: '操作提示',
        content: `确定进行导出操作`,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.spinShow = true;
          let params = Object.assign({}, this.condition, {
            type_id: this.id,
            show_type: this.typeList[this.$route.query.act]
          });
          return this.$ajax.post(this.$api.couponsSendExprot, params)
          .then(response => {
            const res = response.data;
            if (res.code) {
              this.$Message.success(res.message);
              var jobId = res.data;
              // 打开异步提示组件
              this.jobIdCol.push(jobId);
              this.$nextTick(() => {
                this.$refs[`notice${jobId}`][0].showNotice(jobId);
              });
              this.spinShow = false;
            }
          });
        }
      });
    }
  }
}
</script>

<style>

</style>
