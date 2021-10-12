<template>
  <div class="brand-list">
    <Card>
      <Row>
        <Col span="20">
          <SearchForm ref="search" @on-search="searchPage"></SearchForm>
        </Col>
        <Col span="4" class="btn-group">
          <Button type="primary" @click="openModal">添加分类</Button>
        </Col>
      </Row>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
        <template slot-scope="{ row }" slot="created_at">
          <p>{{row.created_at | initDate}}</p>
          <p>{{row.created_at | initTime}}</p>
        </template>
        <template slot-scope="{ row }" slot="updated_at">
          <p>{{row.updated_at | initDate}}</p>
          <p>{{row.updated_at | initTime}}</p>
        </template>
        <template slot-scope="{ row }" slot="enable">
          <i-switch v-model="row.enable" true-value="1" false-value="0" size="large" :before-change="handleEnableChange.bind(this, row)">
            <span slot="open">开启</span>
            <span slot="close">关闭</span>
          </i-switch>
        </template>
        <template slot-scope="{ row }" slot="handle">
          <span v-show="row.handle.edit" @click="editBrand(row)"><a>编辑</a></span>
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
    <BrandForm ref="brandForm" @on-success="onFormSuccess"></BrandForm>
  </div>
</template>
<script>
import SearchForm from './search-form';
import Mixin from './mixin.js';
import PageHelper from '@/libs/page-helper.js';
import BrandForm from './brand-form';

export default {
  components: {
    SearchForm,
    BrandForm
  },
  data () {
    return {
      canCreate: {},
      condition: {
        enable: '-1',
        searchq: ''
      },
      modalShow: false
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    onLoadData (page, data) {
      let params = Object.assign({}, data, this.condition, {
        show_type: 0
      });
      return this.$ajax.post(this.$api.distributionList, params)
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
    openModal (row = {}) {
      this.$refs.brandForm.setData(row).show();
    },
    editBrand (row) {
      this.openModal(row);
    },
    onFormSuccess () {
      this.loadData()
    },
    toggleChange (row) {
      return this.$ajax.post(this.$api.distributionStatus, {
        id: row.id,
        show_type: '0',
		    enable: row.enable == 1 ? 0 : 1
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.$Message.success(res.message);
          this.loadData();
        }
      });
    },
    handleEnableChange (row) {
      return new Promise((resolve, reject) => {
        this.toggleChange(row);
        reject();
      })
    }
  }
}
</script>

<style lang="less" scoped>
.brand-list{
  .brand-list_import{
    margin-right: 10px;
  }
  .btn-group{
    text-align: right;
  }
}
</style>
