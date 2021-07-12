<template>
  <PageTopBase>
    <div class="binding-goods">
      <div>
        <Row>
          <Col span="12">
            <SearchForm ref="search" @on-search="searchPage"></SearchForm>
          </Col>
          <Col span="12" class="btn-group">
            <Button type="primary" icon="md-add" @click="createActivity">添加商品</Button>
          </Col>
        </Row>
        <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable" @on-selection-change="handleSelect">
          <template slot-scope="{ row }" slot="name">
            <div class="img_list_wrap">
              <div class="img_fixed">
                <img :src="row.goods_thumb" v-if="row.goods_thumb" :alt="row.goods_thumb" v-viewer/>
                <img src="@rs/images/default-img.jpg" :alt="row.goods_name" v-viewer v-else></img>
              </div>
              <div class="sort_wrapper">
                {{row.goods_name}}
                <p>{{row.goods_sn}}</p>
              </div>
            </div>
          </template>
          <template slot-scope="{ row }" slot="status">
            <Tag type="dot" :color="row.is_on_sale == '上架' ? 'success' : 'error'">{{row.is_on_sale}}</Tag>
          </template>
          <template slot-scope="{ row }" slot="handle">
            <span @click="delItem(row, '删除提示', '确定删除商品吗？')"><a>删除</a></span>
          </template>
        </Table>
        <div v-show="pageTotal > 0" class="handle_wrapper">
          <div style="padding-left:6px;">
            <Button @click="handleBatch">批量删除</Button>
          </div>
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
        </div>
      </div>
      <goodsSelect :data="goodsSelect"/>
    </div>
  </PageTopBase>
</template>
<script>
import SearchForm from './search-form';
import Mixin from './mixin.js';
import PageHelper from '@/libs/page-helper.js';
import goodsSelect from '@/views/my-components/goods-select/goods-select';
import PageTopBase from '@/views/my-components/page-top-base/index';

export default {
  props: ['id'],
  components: {
    SearchForm,
    goodsSelect,
    PageTopBase
  },
  data () {
    return {
      canCreate: {},
      condition: {
        searchq: '',
        status: -1
      },
      goodsSelect: [],
      selectedData: {}
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    onLoadData (page, data) {
      let params = Object.assign({}, data, this.condition, {
        id: this.id
      });
      return this.$ajax.post(this.$api.cloudBindingRecommendGoodsList, params)
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.data = res.data;
          this.canCreate = res.data && res.data.canCreate;
        }
      });
    },
    addGood (data) {
      return this.$ajax.post(this.$api.cloudBindingRecommendGoodsAdd, {
        id: this.id,
        goods_ids: data.map(item => item.id).join()
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.$Message.success(res.message);
        }
        this.loadData();
      });
    },
    searchPage (searchData) {
      this.condition = searchData;
      this.loadData();
    },
    createActivity () {
      this.$selectContent({
        mode: 'cloud-goods',
        type: 'checkbox',
        data: this.goodsSelect,
        getList: (data) => {
          this.goodsSelect = data;
          this.$Modal.confirm({
            title: '提示',
            content: '确定添加商品吗？',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
              this.addGood(data);
            }
          });
        }
      })
    },
    onDelItem (row) {
      return this.$ajax.post(this.$api.cloudBindingRecommendGoodsRemove, {
        id: this.id,
        goods_id: row.goods_id
      });
    },
    handleSelect (selected) {
      this.selectedData = {};
      let idCols = Object.keys(this.selectedData);
      selected.forEach((item) => {
        if (!idCols.includes(item.goods_id)) {
          this.selectedData[item.goods_id] = item;
        }
      });
    },
    handleBatch () {
      this.$Modal.confirm({
        title: '提示',
        content: '确定批量删除商品吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          return this.$ajax.post(this.$api.cloudBindingRecommendGoodsBatchRemove, {
            id: this.id,
            goods_ids: Object.keys(this.selectedData).join()
          }).then(response => {
            const res = response.data;
            if (res.code) {
              this.$Message.success(res.message);
            }
            this.loadData();
          });
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
.binding-goods{
  .btn-group{
    text-align: right;
  }
  .sort_wrapper{
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: 150px;
  }
  .handle_wrapper{
    margin: 10px 10px 0 10px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }
}
</style>
