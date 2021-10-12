<template>
  <PageTopBase>
    <div class="send-list">
      <Card>
        <SearchForm ref="search" @on-search="searchPage"></SearchForm>
        <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
          <template slot-scope="{ row }" slot="portrait_path">
            <div class="img_fixed">
              <img :src="row.portrait_path" v-if="row.portrait_path" :alt="row.card_num" v-viewer/>
              <img src="@rs/images/default-img.jpg" :alt="row.card_num" v-viewer v-else></img>
            </div>
          </template>
          <template slot-scope="{ row }" slot="add_time">
            <p>{{row.add_time | initDate}}</p>
            <p>{{row.add_time | initTime}}</p>
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
  </PageTopBase>
</template>
<script>
import SearchForm from './search-form';
import Mixin from './mixin.js';
import PageHelper from '@/libs/page-helper.js';
import PageTopBase from '@/views/my-components/page-top-base/index';

export default {
  props: ['id'],
  components: {
    SearchForm,
    PageTopBase
  },
  data () {
    return {
      condition: {
        searchq: ''
      }
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    onLoadData (page, data) {
      let params = Object.assign({}, data, this.condition, {
        id: this.id
      });
      return this.$ajax.post(this.$api.birthdayActivitySend, params)
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.data = res.data;
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
.send-list{
  .brand-list_import{
    margin-right: 10px;
  }
  .btn-group{
    text-align: right;
  }
  .img_fixed {
    height: 60px;
    width: 60px;
    border: 1px solid #eee;
    border-radius: 5px;
    cursor: pointer;
    margin: 8px 5px 8px 0;
    overflow: hidden;
    flex-shrink: 0;
    img{
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
}
</style>
