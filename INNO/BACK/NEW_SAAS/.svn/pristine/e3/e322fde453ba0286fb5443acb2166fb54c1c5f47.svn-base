<template>
  <div class="size_spec_list">
    <PageTopBase topTitle="规格列表">
      <div class="action_header">
        <Row>
          <Col span="18">
            <Input
              v-model="searchq"
              style="width:280px;"
              placeholder="规格值 模糊查询"
              clearable
              search
              enter-button
              @on-search="searchPage"
              @on-clear="searchPage"
              @keydown.native.enter.prevent="searchPage"></Input>
          </Col>
          <Col span="6" class="btn-group">
            <Button v-if="add" type="primary" icon="md-add" @click="onAdd">添加规格值</Button>
          </Col>
        </Row>
      </div>

      <Table :loading="tableLoading" :height="tableHeight" :columns="columns" :data="tableData" ref="myTable" @on-selection-change="handleSelect">
        <template slot-scope="{ row }" slot="handle">
          <span v-show="row.handle.synchronization" @click="handleSync(row)"><a>同步名称</a></span>
          <Divider type="vertical" v-show="row.handle.synchronization && row.handle.edit"/>
          <span v-show="row.handle.edit" @click="editSpec(row)"><a>编辑</a></span>
          <Divider type="vertical" v-show="row.handle.edit && row.handle.remove"/>
          <span v-show="row.handle.remove" @click="delItem(row, '删除提示', '确定删除该规格值吗？')"><a>删除</a></span>
        </template>
      </Table>
      <div v-show="pageTotal" class="list_page">
        <Button v-if="synchronization" class="spec-list_import" @click="handelSyncMulti">批量同步名称</Button>
        <Page
          :total="pageTotal"
          :page-size="pageSizeDef"
          :current="currentPage"
          :page-size-opts="pageSizeOpts"
          @on-change="e => changePage(e)"
          @on-page-size-change="ps => handlePageSize(ps)"
          show-elevator
          show-total
          show-sizer></Page>
      </div>
    </PageTopBase>

    <specValueForm ref="spec-value-form" @on-success="onFormSuccess"></specValueForm>

    <!--加载提示-->
		<Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>
import Mixin from './mixin.js';
import PageHelper from '@/libs/page-helper.js';
import specValueForm from './spec-value-form';
import PageTopBase from '@/views/my-components/page-top-base/index';

export default {
  props: ['id'],
  mixins: [Mixin, PageHelper],
  data () {
    return {
      // 搜索表单
      searchq: '',
      add: false,
      synchronization: false,
      sizecat_name: '',
      selection: [],
      spinShow: false
    }
  },
  components: {
    specValueForm,
    PageTopBase
  },
  methods: {
    clearOptions () {
      this.searchq = '';
    },
    onLoadData (page, data) {
      return this.$ajax.post(this.$api.ShopGoodsSizeValueList, {
        sizecat_id: this.id,
        searchq: this.searchq,
        ...data
       })
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.data = res.data;
          this.add = res.data && res.data.canCreate.add;
          this.synchronization = res.data && res.data.canCreate.synchronization;
          this.sizecat_name = res.data && res.data.sizecat_name;
        }
      });
    },
    searchPage (searchData) {
      this.searchq = searchData;
      this.loadData();
    },
    onDelItem (row) {
      return this.$ajax.post(this.$api.ShopGoodsSizeValueRemove, {
        size_id: row.size_id
      });
    },
    onAdd () {
      this.$refs['spec-value-form'].openModal(this.id, 0, {
        sizeCatName: this.sizecat_name
      });
    },
    handleSelect (selection) {
      this.selection = selection;
    },
    handelSyncMulti () {
      const result = this.selection.map(item => item.size_id);
      this.handleSynchronization(result);
    },
    handleSynchronization (arr) {
      if (arr.length === 0) {
        this.$Message.error('请选择尺码规格');
        return false;
      }
      this.$Modal.confirm({
        title: '操作提示',
        content: '是否同步关联商品的尺寸名称?',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.spinShow = true;
          return this.$ajax.post(this.$api.ShopSizeSysnchroAttr, {
            size_ids: arr
          })
          .then((response) => {
            var res = response.data;
            if (res.code) {
              this.$Message.success(res.message);
              this.spinShow = false;
            }
          });
        }
      });
    },
    handleSync (row) {
      this.handleSynchronization([row.size_id]);
    },
    editSpec (row) {
      this.$refs['spec-value-form'].openModal(this.id, row.size_id, {
        sizeCatName: this.sizecat_name,
        size_name: row.size_name,
        size_code: row.size_code,
        size_sort: row.size_sort
      });
    }
  },
  mounted () {
    this.loadData();
  }
}
</script>

<style lang="less">
.size_spec_list{
  .action_header{
    margin-bottom: 10px;
  }
  .list_page{
    margin: 10px 10px 0 10px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .btn-group{
    text-align: right;
  }
  .ivu-input-icon{
    right: 50px;
  }
}
</style>
