<template>
  <div class="goods-coupons-activity">
    <Card>
      <Row>
        <Col span="12">
          <SearchForm ref="search" @on-search="searchPage"></SearchForm>
        </Col>
        <Col span="12" class="btn-group">
          <Button type="primary" icon="md-add" @click="createActivity" v-if="canCreate.add">添加活动</Button>
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
        <template slot-scope="{ row }" slot="handle">
          <span v-show="row.handle.goods" @click="handleBinding(row)"><a>绑定商品</a></span>
          <Divider type="vertical" v-show="row.handle.goods"/>
          <span v-show="row.handle.edit" @click="editItem(row)"><a>编辑</a></span>
          <Divider type="vertical" v-show="row.handle.edit"/>
          <span v-show="row.handle.remove" @click="delItem(row, '删除提示', '确定删除活动吗？')"><a>删除</a></span>
          <Divider type="vertical" v-show="row.handle.remove"/>
          <span v-show="row.handle.copy" @click="handleCopy(row)"><a>复制</a></span>
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

export default {
  components: {
    SearchForm
  },
  data () {
    return {
      canCreate: {},
      condition: {
        searchq: ''
      }
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    onLoadData (page, data) {
      let params = Object.assign({}, data, this.condition);
      return this.$ajax.post(this.$api.goodsCouponsActivityList, params)
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
        name: 'goods-coupons-activity-add'
      });
    },
    editItem (row) {
      this.$router.push({
        name: 'goods-coupons-activity-edit',
        params: {
          id: row.id
        }
      });
    },
    handleBinding (row) {
      this.$router.push({
        name: 'goods-coupons-activity-goods',
        params: {
          id: row.id
        }
      });
    },
    handleCopy (row) {
      return this.$ajax.post(this.$api.goodsCouponsActivityCopy, {
        id: row.id
      }).then(() => {
        this.loadData();
      });
    },
    onDelItem (row) {
      return this.$ajax.post(this.$api.goodsCouponsActivityRemove, {
        id: row.id
      });
    }
  },
  mounted () {
    this.loadData();
  }
}
</script>

<style lang="less" scoped>
.goods-coupons-activity{
  .btn-group{
    text-align: right;
  }
}
</style>
