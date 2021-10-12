<template>
	<div class="group-list-table">
    <Table ref="myTable" :columns="tableColums" :data="tableData" :span-method="handleSpan" disabled-hover>
      <template slot-scope="{ row }" slot="orderInfo">
        <div class="header_inline">
          <span class="header_item">拼团活动:{{row.activity_name}}</span>
          <span class="header_item">{{row.join_mans}}人团</span>
          <span class="header_item">状态:{{row.status_str}}</span>
          <span class="header_item">成团时间:{{row.modify_time}}</span>
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
    <!--异步处理导出excel组件-->
    <div class="col">
      <notice :ref="'notice' + item" @finish="handleFinish" v-for="item in jobIdCol" :key="item"></notice>
    </div>
	</div>
</template>

<script>
import PageHelper from '@/libs/page-helper.js';
import Mixin from './mixin.js';
import notice from '@/views/my-components/mq-notice/mq-notice';

export default {
  mixins: [PageHelper, Mixin],
  data () {
    return {
      groupStatus: {
        'all': 0,
        'grouping': 1,
        'grouped': 2,
        'groupfail': 3,
        'joinfail': 4
      },
      condition: {
        searchq_type: '',
        searchq: '',
        start_time: '',
        end_time: ''
      },
      jobIdCol: []
    }
  },
  components: {
    notice
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
      let params = Object.assign({}, data, this.condition, {
        confirm_status: this.groupStatus[this.$route.query.act]
      });
      return this.$ajax.post(this.$api.cloudGroupOrderList, params)
      .then(response => {
        const res = response.data;
        if (res.code) {
          if (res.data) {
            const result = res.data.items.map(item => {
              return Object.assign({}, item, {
                get_collage_group_user_order: item.get_collage_group_user_order.filter(child => {
                  child.isVisible = false;
                  child.nodeValue = '';
                  return true;
                })
              });
            });
            this.data = {
              canCreate: res.data.canCreate,
              total: res.data.total,
              pageSize: res.data.pageSize,
              items: result
            }
            this.statusList = res.data && res.data.status;
          }

        }
        this.$store.commit('setLoading', false);
      });
    },
    searchPage (searchData) {
      this.condition = searchData;
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
                let params ={
                  ...this.condition,
                  confirm_status: this.groupStatus[this.$route.query.act]
                };
          return this.$ajax.post(this.$api.cloudGroupOrderExport,params)
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
    },
    handleFinish () {
      // 异步下载结束后刷新
      this.loadData();
    },
    handleGoOrderInfo (id) {
      let routeUrl = this.$router.resolve({
        name: 'shop-order-info',
        params: {
          sn: id
        }
      });
      window.open(routeUrl.href, '_blank');
    }
  }
}
</script>
<style lang="less">
.group-list-table{
  .header_inline{
    white-space: pre-wrap;
    .header_item{
      margin-right: 30px;
    }
  }
  .ivu-table-expanded-cell{
    padding: 0 0 10px 0;
  }
  .ivu-table-cell{
    padding: 0;
  }
}
</style>

