<template>
  <div class="weixin-group-list">
    <Card>
      <Row>
        <Col span="16">
          <SearchForm ref="search" @on-search="searchPage"></SearchForm>
        </Col>
        <Col span="8" class="btn-group">
          <div class="btn_group">
            <Button type="primary" icon="md-add" @click="createActicity">创建购券活动</Button>
          </div>
        </Col>
      </Row>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
        <template slot-scope="{ row }" slot="fromTime">
          <p>{{row.fromTime | initDate}}</p>
          <p>{{row.fromTime | initTime}}</p>
        </template>
        <template slot-scope="{ row }" slot="toTime">
          <p>{{row.toTime | initDate}}</p>
          <p>{{row.toTime | initTime}}</p>
        </template>
        <template slot-scope="{ row }" slot="isEnabled">
          <Tag type="dot" :color="Number(row.isEnabled) === 0 ? 'primary' : (Number(row.isEnabled) === 1 ? 'success' : 'error')">
            {{Number(row.isEnabled) === 0 ? '未开启' : (Number(row.isEnabled) === 1 ? '开启中' : '已失效')}}
          </Tag>
        </template>
        <template slot-scope="{ row, index }" slot="handle">
          <span v-show="row.handle.edit" @click="editBrand(row)"><a>编辑</a></span>
          <Divider type="vertical" v-show="row.handle.edit && row.handle.results"/>
          <span v-show="row.handle.results" @click="lookup(row)"><a>查看结果</a></span>
          <Divider type="vertical" v-show="row.handle.results && row.handle.copy"/>
          <span v-show="row.handle.copy" @click="copyUrl(row)"><a>复制链接</a></span>
          <Divider type="vertical" v-show="row.handle.copy && row.handle.remove"/>
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
  </div>
</template>
<script>
import SearchForm from './search-form';
import Mixin from './mixin.js';
import PageHelper from '@/libs/page-helper.js';
import util from '@/libs/util.js';

export default {
  components: {
    SearchForm
  },
  data () {
    return {
      canCreate: {},
      condition: {
        searchq: '',
        seart_type: -1,
        start_time: '',
        end_time: ''
      }
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    onLoadData (page, data) {
      let params = Object.assign({}, data, this.condition);
      return this.$ajax.post(this.$api.couponsBagActivityList, params)
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
    createActicity () {
      this.$router.push({
        name: 'coupons-bag-activity-add'
      });
    },
    lookup (row) {
      this.$router.push({
        name: 'activity-result',
        params: {
          id: row.activityId
        }
      });
    },
    editBrand (row) {
      this.$router.push({
        name: 'coupons-bag-activity-edit',
        params: {
          id: row.activityId
        }
      })
    },
    copyUrl (row) {
      util.copyTextToClipBoard(row.copy_url);
    },
    onDelItem (row) {
      return this.$ajax.post(this.$api.couponsBagActivityRemove, {
        activityId: row.activityId
      });
    }
  },
  mounted () {
    this.loadData();
  }
}
</script>

<style lang="less" scoped>
.weixin-group-list{
  .brand-list_import{
    margin-right: 10px;
  }
  .btn_group{
    text-align: right;
    margin-bottom: 24px;
  }
}
</style>
