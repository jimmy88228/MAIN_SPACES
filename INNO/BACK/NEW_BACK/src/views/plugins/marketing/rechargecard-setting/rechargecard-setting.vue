<template>
  <div class="register-activity">
    <Card>
      <div class="btn_group">
        <Button type="primary" icon="md-add" @click="createActivity">新增充值送券规则</Button>
      </div>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
        <template slot-scope="{ row }" slot="is_enable">
          <Tag type="dot" :color="row.is_enabled === '1' ? 'success' : 'error'">{{row.is_enabled === '1'  ? '开启' : '关闭'}}</Tag>
        </template>
        <template slot-scope="{ row }" slot="from_time">
          <p>{{row.from_time | initDate}}</p>
          <p>{{row.from_time | initTime}}</p>
        </template>
        <template slot-scope="{ row }" slot="to_time">
          <p>{{row.to_time | initDate}}</p>
          <p>{{row.to_time | initTime}}</p>
        </template>
        <template slot-scope="{ row, index }" slot="handle">
          <span v-show="row.handle.edit" @click="handleEdit(row)"><a>编辑</a></span>
          <Divider type="vertical" v-show="row.handle.remove"/>
          <span v-show="row.handle.remove" @click="delItem(row, '删除提示', '确定删除活动吗？')"><a>删除</a></span>
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
  </div>
</template>
<script>
import Mixin from './mixin.js';
import PageHelper from '@/libs/page-helper.js';

export default {
  data () {
    return {
      canCreate: {},
      spinShow: false
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    onLoadData (page, data) {
      let params = Object.assign({}, data, this.condition);
      return this.$ajax.post(this.$api.storeRechargecardCouponsList, params)
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
    onDelItem (row) {
      return this.$ajax.post(this.$api.storeRechargecardCouponsRemove, {
        id: row.id
      });
    },
    createActivity () {
      this.$router.push({
        name: 'store-rechargecard-coupons-add'
      })
    },
    handleEdit (row) {
      this.$router.push({
        name: 'store-rechargecard-coupons-edit',
        params: {
         id: row.id
        }
      })
    }
  },
  mounted () {
    this.loadData();
  }
}
</script>

<style lang="less" scoped>
.register-activity{
  .btn_group{
    text-align: right;
    margin-bottom: 24px;
  }
}
</style>
