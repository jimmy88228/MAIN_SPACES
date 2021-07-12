<template>
  <div class="guide-group-list">
    <Card>
      <Row>
        <Col span="12">
          <SearchForm ref="search" @on-search="searchPage"></SearchForm>
        </Col>
        <Col span="12" class="btn-group">
          <Button type="primary" icon="md-add" @click="openModal({})" v-if="canCreate.addgroup">添加分组</Button>
        </Col>
      </Row>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
        <template slot-scope="{ row }" slot="sort">
          <GuideGroupSort :sort="row.sort" :group-id="row.id" @edit-sort="loadData"/>
        </template>
        <template slot-scope="{ row }" slot="handle">
          <span v-show="row.handle.edit" @click="editItem(row)"><a>编辑</a></span>
          <Divider type="vertical" v-show="row.handle.edit && row.handle.remove"/>
          <span v-show="row.handle.remove" @click="delItem(row, '删除提示', '确定要删除该组吗？组员也将会一并清除，删除后数据将不可恢复，请谨慎操作，点‘确定’继续删除')"><a>删除</a></span>
          <Divider type="vertical" v-show="row.handle.remove && row.handle.add"/>
          <span v-show="row.handle.add" @click="addMember(row)"><a>添加组员</a></span>
          <Divider type="vertical" v-show="row.handle.add && row.handle.import"/>
          <span v-show="row.handle.import"><a>导入组员</a></span>
          <Divider type="vertical" v-show="row.handle.import && row.handle.export"/>
          <span v-show="row.handle.export" @click="exportData(row)"><a>导出组员</a></span>
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
    <GuideForm ref="brandForm" @on-success="onFormSuccess"></GuideForm>
    <Spin size="large" fix v-show="spinShow"></Spin>
  </div>
</template>
<script>
import SearchForm from './search-form';
import Mixin from './mixin.js';
import GuideForm from './guide-group-form';
import PageHelper from '@/libs/page-helper.js';
import GuideGroupSort from './guide-group-sort';

export default {
  components: {
    SearchForm,
    GuideForm,
    GuideGroupSort
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
    clearOptions () {
      this.condition = {
        searchq: ''
      };
      this.$refs.search.clearOptions();
    },
    onLoadData (page, data) {
      let params = Object.assign({}, data, this.condition);
      return this.$ajax.post(this.$api.shopSettingList, params)
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
    editItem (row) {
      this.openModal(row);
    },
    onDelItem (row) {
      return this.$ajax.post(this.$api.shopSettingRemove, {
        id: row.id
      });
    },
    addMember (row) {
      this.$router.push({
        name: 'member-list',
        params: {
          id: row.id
        }
      });
    },
    onFormSuccess () {
      this.loadData();
    },
    exportData (row) {
      this.spinShow = true;
      return this.$ajax.post(this.$api.shopSettingExport, {
        isExport: 1,
        group_id: row.id
      }).then(response => {
        const res = response.data;
        if (res.code) {
          this.$refs.myTable.exportCsv({
            filename: '组员报表',
            columns: this.memberColumns,
            data: res.data.items
          });
        }
        this.spinShow = false;
      });;
    }
  },
  mounted () {
    this.loadData();
  }
}
</script>

<style lang="less" scoped>
.guide-group-list{
  .btn-group{
    text-align: right;
  }
}
</style>
