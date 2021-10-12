<template>
  <div class="activity-list">
    <Card>
      <Row>
        <Col span="18">
          <SearchForm ref="search" @on-search="searchPage"></SearchForm>
        </Col>
        <Col span="6" class="btn-group">
          <Button type="primary" icon="md-add" @click="createActivity" v-if="canCreate.add">添加标签</Button>
        </Col>
      </Row>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable" @on-selection-change="handleSelectData">
        <template slot-scope="{ row }" slot="is_enabled">
          <Tag type="dot" :color="row.is_enabled === '1' ? 'success' : 'error'">{{row.is_enabled === '1'  ? '是' : '否'}}</Tag>
        </template>
        <template slot-scope="{ row }" slot="handle">
          <span v-show="row.handle.join" @click="handleEditWhite(row, row.is_enabled === '1')"><a>{{row.is_enabled === '1' ? '移出白名单' : '加入白名单'}}</a></span>
        </template>
      </Table>
      <div v-show="pageTotal" class="list_page">
        <div style="float: left;margin-bottom: 24px;">
          <Button @click="handleBatchWhite(1)">加入白名单</Button>
          <Button @click="handleBatchWhite(0)">移出白名单</Button>
        </div>
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
    <TagForm ref="sortForm"></TagForm>
  </div>
</template>
<script>
import SearchForm from './search-form';
import Mixin from './mixin.js';
import PageHelper from '@/libs/page-helper.js';
import TagForm from './tag-form';

export default {
  components: {
    SearchForm,
    TagForm
  },
  data () {
    return {
      canCreate: {},
      condition: {
        searchq_type: '',
        searchq: '',
        is_enabled: '-1',
        store_id: 0
      },
      selectData: [],
      spinShow: false
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    onLoadData (page, data) {
      let params = Object.assign({}, data, this.condition);
      return this.$ajax.post(this.$api.communityWhiteBookList, params)
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
    openModal (row) {
      this.$refs.brandForm.setData(row).show();
    },
    editBrand (index, row) {
      this.openModal(row);
    },
    onDelItem (row) {
      return this.$ajax.post(this.$api.popupAdvertRemove, {
        id: row.id
      });
    },
    createActivity() {
      this.$refs.sortForm.setData({}).show();
    },
    editItem(row) {
      this.$router.push({
        name: 'popup-activity-edit',
        params: {
          id: row.id
        }
      })
    },
    handleEditWhite(row, type) {
      this.spinShow = true;
      return this.$ajax.post(this.$api.communityWhiteBookJoin, {
        user_id: row.user_id,
        type: type ? 2 : 1
      }).then(response => {
        const res = response.data;
        if (res.code) {
          this.loadData();
        }
        this.spinShow = false;
      });
    },
    handleSelectData (data) {
      this.selectData = data.map(item => item.user_id);
      console.log(data)
    },
    handleBatchWhite(type) {
      if (this.selectData.length === 0) {
        this.$Message.error('请选择内容');
        return;
      }
      this.spinShow = true;
      return this.$ajax.post(this.$api.communityWhiteBookBatchJoin, {
        user_ids: this.selectData,
        type: type ? 1 : 2
      }).then(response => {
        const res = response.data;
        if (res.code) {
          this.selectData = [];
          this.loadData();
        }
        this.spinShow = false;
      });
    }
  },
  created () {
    this.loadData();
  }
}
</script>

<style lang="less" scoped>
.activity-list{
  .brand-list_import{
    margin-right: 10px;
  }
  .btn-group{
    text-align: right;
  }
}
</style>
