<template>
  <div class="article-list">
    <Card>
      <div class="btn-group">
        <Button type="primary" icon="md-add" v-if="canCreate.add" @click="createItem">添加文章</Button>
      </div>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
        <template slot-scope="{ row }" slot="handle">
          <span v-show="row.handle.edit" @click="editItem(row)"><a>编辑</a></span>
          <Divider type="vertical" v-show="row.handle.edit && row.handle.remove"/>
          <span v-show="row.handle.remove" @click="delItem(row, '删除提示', '确定删除文章吗？')"><a>删除</a></span>
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
import Mixin from './mixin.js';
import PageHelper from '@/libs/page-helper.js';

export default {
  data () {
    return {
      canCreate: {}
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    onLoadData (page, data) {
      let params = Object.assign({}, data);
      return this.$ajax.post(this.$api.protocolArticleList, params)
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.data = res.data;
          this.canCreate = res.data && res.data.canCreate;
        }
      });
    },
    createItem () {
      this.$router.push({
        name: 'protocol-article-add'
      });
    },
    editItem (row) {
      this.$router.push({
        name: 'protocol-article-edit',
        params: {
          id: row.id
        }
      });
    },
    onDelItem (row) {
      return this.$ajax.post(this.$api.protocolArticleRemove, {
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
.article-list{
  .btn-group{
    text-align: right;
    margin-bottom: 10px;
  }
}
</style>
