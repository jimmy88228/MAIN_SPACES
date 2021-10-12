<template>
  <div class="register-activity">
    <Card>
      <div class="btn_group">
        <Button type="primary" icon="md-add" @click="createActivity">新增充值卡活动</Button>
      </div>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
        <template slot-scope="{ row }" slot="from_time">
          <p>{{row.from_time | initDate}}</p>
          <p>{{row.from_time | initTime}}</p>
        </template>
        <template slot-scope="{ row }" slot="to_time">
          <p>{{row.to_time | initDate}}</p>
          <p>{{row.to_time | initTime}}</p>
        </template>
        <template slot-scope="{ row }" slot="is_enable">
          <Tag type="dot" :color="row.is_enable === '1' ? 'success' : 'error'">{{row.is_enable === '1'  ? '开启' : '关闭'}}</Tag>
        </template>
        <template slot-scope="{ row }" slot="is_activity">
          <i-switch v-model="row.is_activity" size="large" true-value="1" false-value="0" :before-change="handleChange.bind(this, row)">
            <span slot="open">开启</span>
            <span slot="close">关闭</span>
          </i-switch>
        </template>
        <template slot-scope="{ row, index }" slot="handle">
          <span v-show="row.handle.edit" @click="editItem(row)"><a>编辑</a></span>
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
      let params = Object.assign({}, data);
      return this.$ajax.post(this.$api.storeRechargecardActivityList, params)
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
    createActivity () {
      this.$router.push({
        name: 'store-rechargecard-activity-add'
      })
    },
    editItem (row) {
      this.$router.push({
        name: 'store-rechargecard-activity-edit',
        params: {
         id: row.activity_id
        }
      })
    },
    handleToggle (row) {
      this.spinShow = true;
      return this.$ajax.post(this.$api.storeRechargecardActivityStatus, {
        id: row.activity_id
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.$Message.success(res.message);
          this.loadData();
        }
        this.spinShow = false;
      });
    },
    handleChange (row) {
      return new Promise((resolve, reject) => {
        this.handleToggle(row);
        reject();
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
