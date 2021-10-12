<template>
  <div class="goods-tag-list">
    <PageTopBase>
      <div class="action">
        <Button type="primary" icon="md-add" @click="openModal({})" v-if="canCreate">添加商品</Button>
      </div>
      <Table :loading="tableLoading" :height="tableHeight" :columns="field" :data="tableData" ref="myTable">
        <template slot-scope="{ row }" slot="goods_thumb">
          <div class="img_list_wrap">
            <div class="img_fixed">
              <img :src="row.goods_thumb" v-if="row.goods_thumb" :alt="row.goods_name" v-viewer/>
              <img src="@rs/images/default-img.jpg" :alt="row.goods_name" v-viewer v-else></img>
            </div>
          </div>
        </template>
        <template slot-scope="{ row }" slot="handle">
          <span v-show="row.handle.remove" @click="delItem(row, '删除提示', '确定删除该商品吗？')"><a>删除</a></span>
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
    </PageTopBase>
    <TagForm ref="tagForm" @on-success="onFormSuccess"></TagForm>
  </div>
</template>

<script>
import PageHelper from '@/libs/page-helper.js';
import Mixin from './mixin.js';
import TagForm from './tag-form';
import PageTopBase from '@/views/my-components/page-top-base/index';

export default {
  props: ['id'],
  components: {
    TagForm,
    PageTopBase
  },
  data () {
    return {
      spinShow: false,
      canCreate: false,
      tagName: ''
    }
  },
  mixins: [PageHelper, Mixin],
  methods: {
    onLoadData (page, data) {
      return this.$ajax.post(this.$api.ShopGoodsTagGoods, { tag_id: this.id, ...data })
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.data = res.data;
          this.canCreate = res.data && res.data.canCreate;
          this.tagName = res.data && res.data.tag_name;
        }
      });
    },
    openModal (row) {
      this.$refs.tagForm.openModal(row, this.id, this.tagName);
    },
    editTag (row) {
      this.openModal(row);
    },
    onDelItem (row) {
      return this.$ajax.post(this.$api.ShopGoodsDelTagGoods, {
        tag_id: row.tag_id,
        tag_goods_ids: [row.tag_goods_id]
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
