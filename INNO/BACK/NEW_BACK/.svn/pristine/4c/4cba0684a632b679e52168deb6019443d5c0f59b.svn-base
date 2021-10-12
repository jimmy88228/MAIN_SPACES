<template>
  <PageTopBase class="store-assembly-list">
    <Card>
      <div class="btn-group">
        <Button type="primary" icon="md-add" v-if="canCreate.export" @click="handleExport">导出流水</Button>
      </div>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
        <template slot-scope="{ row }" slot="card">
          <span>{{row.get_members ? row.get_members.card_num : '--'}}</span>
        </template>
        <template slot-scope="{ row }" slot="phone">
          <span>{{row.get_members ? row.get_members.mobile_phone : '--'}}</span>
        </template>
        <template slot-scope="{ row }" slot="realmoney">
          <span>{{row.get_store_order_benfit_record_log ? row.get_store_order_benfit_record_log.realmoney : '--'}}</span>
        </template>
        <template slot-scope="{ row }" slot="createTime">
          <p>{{row.create_time | initDate}}</p>
          <p>{{row.create_time | initTime}}</p>
        </template>
        <template slot-scope="{ row }" slot="typeName">
          <span>{{row.get_coupons ? row.get_coupons.type_name : '--'}}</span>
        </template>
        <template slot-scope="{ row }" slot="getLotteryActivity">
          <span>{{row.get_lottery_activity ? row.get_lottery_activity.activity_name : '--'}}</span>
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
    <Spin size="large" fix v-if="spinShow"></Spin>
  </PageTopBase>
</template>
<script>
import PageHelper from '@/libs/page-helper.js';
import Mixin from './assembly-mixin';
import PageTopBase from '@/views/my-components/page-top-base/index';

export default {
  props: ['id'],
  data () {
    return {
      canCreate: {
        export:false
      },
      spinShow: false
    }
  },
  components: {
    PageTopBase
  },
  mixins: [Mixin, PageHelper],
  methods: {
    onLoadData (page, data) {
      let params = Object.assign({}, data);
      return this.$ajax.post(this.$api.DistributionWater, {
        id: this.id
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          const result = [];
          let data = res.data.items;
          data.forEach(item => {
            if (item.get_user_bouns.length) {
              item.get_user_bouns.forEach(child => {
                result.push(Object.assign({}, item, child));
              })
            } else {
              result.push(item);
            }
          });
          this.data = {
            total: result.length,
            items: result
          };
          this.canCreate = res.data && res.data.canCreate;
        }
      });
    },
    handleExport () {
      this.$Modal.confirm({
        title: '操作提示',
        content: `确定进行导出操作`,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.spinShow = true;
          return this.$ajax.post(this.$api.DistributionExprot, {
            id: this.id
          })
          .then(response => {
            const res = response.data;
            if (res.code) {
              this.$refs.myTable.exportCsv({
                filename: '商铺消费送券流水',
                columns: this.tableColumns,
                data: res.data
              });
            }
            this.spinShow = false;
          });
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
.store-assembly-list{
  .coupon-list_import{
    margin-right: 10px;
  }
  .btn-group{
    text-align: right;
    margin-bottom: 24px;
  }
}
</style>
