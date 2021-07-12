<template>
  <div class="group-list">
    <Card>
      <Row>
        <Col span="12">
          <SearchForm ref="search" @on-search="searchPage"></SearchForm>
        </Col>
        <Col span="12" class="btn-group">
          <Button type="primary" icon="md-add" @click="openModal({})" v-if="canCreate">添加类型分组</Button>
        </Col>
      </Row>
      <Table :loading="tableLoading" :height="tableHeight" :columns="columns" :data="tableData" ref="myTable">
        <template slot-scope="{ row }" slot="handle">
          <span @click="handleRedirect(row)"><a>属性列表</a></span>
          <Divider type="vertical"/>
          <span v-show="row.handle.edit" @click="editGroup(row)"><a>编辑</a></span>
          <Divider type="vertical" v-show="row.handle.edit && row.handle.remove"/>
          <span v-show="row.handle.remove" @click="delItem(row, '删除提示', '确定删除类型组吗？')"><a>删除</a></span>
          <Divider type="vertical" v-show="row.handle.remove && row.handle.export"/>
          <span v-show="row.handle.export" @click="exportData(row)"><a>导出</a></span>
        </template>
      </Table>
      <div v-show="pageTotal" class="list_page">
        <Page
          :total="pageTotal"
          :page-size="pageSize"
          :current="currentPage"
          :page-size-opts="pageSizeOpts"
          @on-change="changePage"
          @on-page-size-change="ps => handlePageSize(ps)"
          show-elevator
          show-total
          show-sizer></Page>
      </div>
      <Spin size="large" fix v-if="spinShow"></Spin>
    </Card>
    <AttrGroupForm ref="attrGroupForm" @on-success="onFormSuccess"></AttrGroupForm>
  </div>
</template>
<script>
import SearchForm from './search-form';
import PageHelper from '@/libs/page-helper.js';
import Mixin from './mixin.js';
import AttrGroupForm from './attr-group-form';

export default {
  components: {
    SearchForm,
    AttrGroupForm
  },
  data () {
    return {
      spinShow: false,
      canCreate: false,
      condition: {
        searchq: ''
      }
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    clearOptions () {
      this.condition.searchq = '';
      this.$refs.search.clearOptions();
    },
    onLoadData (page, data) {
      return this.$ajax.post(this.$api.goodsAttrGroupList, {
        isInit: 1,
        searchq: this.condition.searchq,
        ...data
      })
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
      this.$refs.attrGroupForm.openModal(row);
    },
    editGroup (row) {
      this.openModal(row);
    },
    onDelItem (row) {
      return this.$ajax.post(this.$api.goodsAttrGroupRemove, {
        cat_id: row.cat_id
      });
    },
    // 开启/关闭
    updateEnabled (index, row) {
      this.tableLoading = true;
      return this.$ajax.post(this.$api.goodsAttrGroupIsenable, {
        cat_id: row.cat_id,
        enabled: !Number(row.enabled)
      })
      .then((response) => {
        var res = response.data;
        if (res.code) {
          this.$Message.success('保存成功');
          this.handleUpdate();
        }
        this.tableLoading = false;
      });
    },
    exportData (row) {
      this.tableLoading = true;
      return this.$ajax.post(this.$api.goodsTypeExport, {
        cat_id: row.cat_id
      })
      .then((response) => {
        var res = response.data;
        if (res.code) {
          this.$Message.success(res.message);
          this.$refs.myTable.exportCsv({
            filename: '商品规格',
            columns: res.data.columns,
            data: res.data.items
          });
        }
        this.tableLoading = false;
      });
    },
    handleRedirect (row) {
      this.$router.push({
        name: 'attr-value-list',
        params: {
          id: row.cat_id
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
.group-list{
  .btn-group{
    text-align: right;
  }
  .group-list_title{
    display: flex;
    align-items: center;
    .group-list_back{
      margin-right: 20px;
    }
  }
}
</style>
