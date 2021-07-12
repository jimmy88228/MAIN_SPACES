<template>
  <div class="time-limit-activity">
    <Card>
      <Row>
        <Col span="12">
          <SearchForm ref="search" @on-search="searchPage"></SearchForm>
        </Col>
        <Col span="12" class="btn-group">
          <Button type="primary" icon="md-add" @click="createActivity" v-if="canCreate.add">创建活动</Button>
        </Col>
      </Row>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
        <template slot-scope="{ row }" slot="stime">
          <p>{{row.stime | initDate}}</p>
          <p>{{row.stime | initTime}}</p>
        </template>
        <template slot-scope="{ row }" slot="etime">
          <p>{{row.etime | initDate}}</p>
          <p>{{row.etime | initTime}}</p>
        </template>
        <template slot-scope="{ row }" slot="is_enable">
          <i-switch v-model="row.is_enable" true-value="1" false-value="0" size="large" :before-change="() => {return handleStatus(row)}">
            <span slot="open">开启</span>
            <span slot="close">关闭</span>
          </i-switch>
        </template>
        <template slot-scope="{ row }" slot="goods_num">
          <p><a style="text-decoration: underline;" @click="goGoods(row)">{{row.goods_num}}</a></p>
        </template>
        <template slot-scope="{ row}" slot="handle">
          <span v-show="row.handle.edit" @click="editBrand(row)"><a>编辑</a></span>
          <span v-show="row.handle.remove" @click="delItem(row)"><a>删除</a></span>
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
        searchq: ''
      },
      spinShow: false
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    onLoadData (page, data) {
      let params = Object.assign({}, data, this.condition);
      return this.$ajax.post(this.$api.timeLimitActivityList, params)
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
        name: 'time-limit-activity-add',
        query: {
          step: 0
        }
      })
    },
    editBrand (row) {
      this.$router.push({
        name: 'time-limit-activity-edit',
        params: {
          id: row.issue_id
        },
        query: {
          step: 0
        }
      })
    },
    goGoods (row) {
      this.$router.push({
        name: 'time-limit-activity-edit',
        params: {
          id: row.issue_id
        },
        query: {
          step: 1
        }
      })
    },
    onDelItem (row) {
      return this.$ajax.post(this.$api.timeLimitActivityRemove, {
        id: row.issue_id
      });
    },
    handleActivityStatus (row) {
      this.spinShow = true;
      return this.$ajax.post(this.$api.timeLimitActivityEditStatus, {
        id: row.issue_id,
        type: 1,
        is_enable: !Number(row.is_enable) ? 1 : 0
      }).then(response => {
        const res = response.data;
        if (res.code) {
          this.$Message.success(res.message);
          this.loadData();
        }
        this.spinShow = false;
      });
    },
    handleStatus (row) {
      return new Promise((resolve, reject) => {
        this.handleActivityStatus(row);
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
.time-limit-activity{
  .handle_wrapper{
    margin: 10px 10px 0 10px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }
  .brand-list_import{
    margin-right: 10px;
  }
  .btn-group{
    text-align: right;
  }
}
</style>
