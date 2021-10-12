<template>
  <div class="log-list">
    <Card>
      <SearchForm ref="search" :log-type-list="logTypeList" @on-search="searchPage"></SearchForm>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
        <template slot-scope="{ row }" slot="name">
          <div class="img_list_wrap">
            <div class="img_fixed">
              <img :src="row.goods_img" v-if="row.goods_img"/>
              <img src="@rs/images/default-img.jpg" v-else></img>
            </div>
            <span class="name">{{row.goods_name}}</span>
          </div>
        </template>
        <template slot-scope="{ row }" slot="adminstrator">
         <!-- <div class="img_list_wrap img_list_wrap_circle">
            <div class="img_fixed img_fixed_circle">
              <img :src="row.avatar_format" v-if="row.avatar_format"/>
              <img src="@rs/images/default-img.jpg" v-else></img>
            </div>
          </div>-->
           <span class="name">{{row.nick_name}}</span>
        </template>
        <template slot-scope="{ row }" slot="createTime">
          <p>{{row.created_at_format | initDate}}</p>
          <p>{{row.created_at_format | initTime}}</p>
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
import SearchForm from './search-form';
import PageHelper from '@/libs/page-helper.js';
import Mixin from './mixin.js';

export default {
  props: ['id'],
  mixins: [Mixin, PageHelper],
  components: {
    SearchForm
  },
  data () {
    return {
      condition: {
        searchq: '',
        searchType: '',
        searchAdminIdList: [],
        searchTime: ''
      },
      logTypeList: {}
    }
  },
  methods: {
    onLoadData (page, data) {
      let params = Object.assign({}, data, this.condition, {
        isInit: 1,
        goodsId: this.id || 0
      });
      return this.$ajax.post(this.$api.ShopGoodsLogList, params)
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.data = res.data;
          this.logTypeList = res.data && res.data.logTypeList;
        }
      });
    },
    searchPage (searchData) {
      this.condition = searchData;
      this.loadData();
    }
  },
  mounted () {
    this.loadData();
  }
}
</script>

<style lang="less" scoped>
.log-list{
  .img_list_wrap_circle{
    height: 100%;
    .img_fixed_circle{
      width: 32px;
      height: 32px;
      border-radius: 50%;
      cursor: default;
    }
  }
}
</style>
