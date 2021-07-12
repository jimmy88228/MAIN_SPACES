<template>
  <div class="goods-tag-list">
    <Card>
      <div class="action">
        <Button type="primary" icon="md-add" @click="openModal({})" v-if="canCreate">添加标签</Button>
      </div>
      <Table :loading="tableLoading" :height="tableHeight" :columns="field" :data="tableData" ref="myTable">
        <template slot-scope="{ row }" slot="handle">
          <span v-show="row.handle.goods" @click="handleRedirect(row)"><a>商品列表</a></span>
          <Divider type="vertical" v-show="row.handle.goods && row.handle.edit"/>
          <span v-show="row.handle.edit" @click="editTag(row)"><a>编辑</a></span>
          <Divider type="vertical" v-show="row.handle.edit && row.handle.remove"/>
          <span v-show="row.handle.remove" @click="delItem(row, '删除提示', '确定删除标签吗？')"><a>删除</a></span>
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
      <Spin size="large" fix v-if="spinShow"></Spin>
    </Card>
    <TagForm ref="tagForm" @on-success="onFormSuccess"></TagForm>
  </div>
</template>

<script>
import PageHelper from '@/libs/page-helper.js';
import Mixin from './mixin.js';
import TagForm from './tag-form';

export default {
  components: {
    TagForm
  },
  data () {
    return {
      spinShow: false,
      canCreate: false
    }
  },
  mixins: [PageHelper, Mixin],
  methods: {
    onLoadData (page, data) {
      return this.$ajax.post(this.$api.ShopGoodsTagManage, { isInit: 1, ...data })
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.data = res.data;
          this.canCreate = res.data && res.data.canCreate;
        }
      });
    },
    openModal (row) {
      this.$refs.tagForm.openModal(row);
    },
    editTag (row) {
      this.openModal(row);
    },
    onDelItem (row) {
      return this.$ajax.post(this.$api.ShopGoodsDelTag, {
        tag_id: row.tag_id
      });
    },
    // 开启/关闭
    updateEnabled (row) {
      this.tableLoading = true;
      return this.$ajax.post(this.$api.ShopGoodsChangMesage, {
        type: "is_show",
        tag_id: row.tag_id,
        is_show: row.is_show === '1' ? '0' : '1'
      })
      .then((response) => {
        var res = response.data;
        if (res.code) {
          this.$Message.success(res.message);
          this.handleUpdate();
        }
        this.tableLoading = false;
      });
    },
    handleRedirect (row) {
      this.$router.push({
        name: 'shop-goods-tag-link',
        params: {
          id: row.tag_id
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
.goods-tag-list{
  .action{
    text-align: right;
    margin-bottom: 10px;
  }
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
