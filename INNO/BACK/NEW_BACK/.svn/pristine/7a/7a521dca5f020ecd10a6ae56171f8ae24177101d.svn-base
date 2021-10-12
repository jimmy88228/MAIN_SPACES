<template>
  <div class="cart-recommend-activity">
    <Card>
      <Row>
        <Col span="12">
          <SearchForm ref="search" @on-search="searchPage"></SearchForm>
        </Col>
        <Col span="12" class="btn-group">
          <Button type="primary" icon="md-add" @click="openModal({})" v-if="canCreate.add">添加活动</Button>
        </Col>
      </Row>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
        <template slot-scope="{ row }" slot="stime">
          <template v-if="row.is_enabled == 1">
            <p>{{row.stime | initDate}}</p>
            <p>{{row.stime | initTime}}</p>
          </template>
          <template v-else>-</template>
        </template>
        <template slot-scope="{ row }" slot="etime">
          <template v-if="row.is_enabled == 1">
            <p>{{row.etime | initDate}}</p>
            <p>{{row.etime | initTime}}</p>
          </template>
          <template v-else>-</template>
        </template>
        <template slot-scope="{ row }" slot="is_enabled">
          <Tag type="dot" :color="row.is_enabled == '1' ? 'success' : 'error'">{{row.is_enabled === '1'  ? '启用' : '关闭'}}</Tag>
        </template>
        <template slot-scope="{ row, index }" slot="handle">
          <span v-show="row.handle.edit" @click="editBrand(index, row)"><a>编辑</a></span>
          <Divider type="vertical" v-show="row.handle.edit && row.handle.remove"/>
          <span v-show="row.handle.remove" @click="delItem(row, '删除提示', '确定删除活动吗？')"><a>删除</a></span>
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
    <cartRecommendForm ref="cartRecommendForm" @on-success="onFormSuccess"></cartRecommendForm>
  </div>
</template>
<script>
import SearchForm from './search-form';
import Mixin from './mixin.js';
import cartRecommendForm from './cart-recommend-form';
import PageHelper from '@/libs/page-helper.js';

export default {
  components: {
    SearchForm,
    cartRecommendForm
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
      return this.$ajax.post(this.$api.cartRecommendList, params)
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
      this.$refs.cartRecommendForm.setData(row).show();
    },
    editBrand (index, row) {
      this.openModal(row);
    },
    onDelItem (row) {
      return this.$ajax.post(this.$api.cartRecommendRemove, {
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
.cart-recommend-activity{
  .btn-group{
    text-align: right;
  }
}
</style>
