<template>
  <PageTopBase class="bargin-statistics">
    <Form ref="formSearch" :model="formSearch" inline :label-width="80">
      <FormItem label="活动时间" class="date-form-item">
        <date-select ref="dateSelect" @sT="handleStart" @eT="handleEnd"/>
      </FormItem>
      <Button @click="searchPage" type="primary">搜索</Button>
    </Form>
    <titleBar>活动统计</titleBar>
    <Row class="col-wrapper">
      <Col :span="8" class="col-data">
        <p class="strong_tips">发起砍价人数</p>
        <p class="data">{{activityInfo.launchUsers}}</p>
      </Col>
      <Col :span="8" class="col-data">
        <p class="strong_tips">帮砍人数</p>
        <p class="data">{{activityInfo.helpUsers}}</p>
      </Col>
      <Col :span="8" class="col-data">
        <p class="strong_tips">帮砍新会员</p>
        <p class="data">{{activityInfo.newUsers}}</p>
      </Col>
    </Row>
    <Row class="col-wrapper">
      <Col :span="8" class="col-data">
        <p class="strong_tips">浏览量</p>
        <p class="data">{{activityInfo.pageVisits}}</p>
      </Col>
      <Col :span="8" class="col-data">
        <p class="strong_tips">访客数</p>
        <p class="data">{{activityInfo.userVisits}}</p>
      </Col>
      <Col :span="8" class="col-data">
        <p class="strong_tips">下单人数</p>
        <p class="data">{{activityInfo.orderUsers}}</p>
      </Col>
    </Row>
    <Row class="col-wrapper">
      <Col :span="8" class="col-data">
        <p class="strong_tips">订单数</p>
        <p class="data">{{activityInfo.orderCount}}</p>
      </Col>
      <Col :span="8" class="col-data">
        <p class="strong_tips">商品销售总数</p>
        <p class="data">{{activityInfo.goodsCount}}</p>
      </Col>
      <Col :span="8" class="col-data">
        <p class="strong_tips">销售总额</p>
        <p class="data">{{activityInfo.orderAmount}}</p>
      </Col>
    </Row>
    <titleBar>商品统计</titleBar>
    <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="goodsInfo" ref="myTable"></Table>
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
  </PageTopBase>
</template>

<script>
import PageTopBase from '@/views/my-components/page-top-base/index';
import DateSelect from '@/views/my-components/date-select/index.vue';
import PageHelper from '@/libs/page-helper.js';
import titleBar from '@/views/my-components/title-bar/title-bar';
import GoodsMixin from './goods-mixin';

export default {
  props: ['id'],
  data () {
    return {
      formSearch: {
        start_time: '',
        end_time: ''
      },
      activityInfo: {},
      goodsInfo: []
    }
  },
  components: {
    PageTopBase,
    DateSelect,
    titleBar
  },
  mixins: [PageHelper, GoodsMixin],
  methods: {
    onLoadData (page, data) {
      let params = Object.assign({}, data, this.formSearch, {
        id: this.id
      });
      return this.$ajax.post(this.$api.cloudBargainActivityData, params)
      .then(response => {
        const res = response.data;
        if (res.code) {
          let {activityInfo, goodsInfo} = res.data;
          this.activityInfo = activityInfo;
          this.goodsInfo = goodsInfo;
        }
      });
    },
    searchPage () {
      this.condition = this.formSearch;
      this.loadData();
    },
    handleStart (date) {
      this.formSearch.start_time = date;
    },
    handleEnd (date) {
      this.formSearch.end_time = date;
    }
  },
  mounted () {
    this.loadData();
  }
}
</script>

<style lang="less">
.bargin-statistics{
  .date-form-item{
    .ivu-form-item-content{
      width: 100%;
    }
  }
  .col-wrapper{
    margin-bottom: 24px;
    .col-data{
      text-align: center;
      .data{
        font-size: 20px;
        font-weight: 600;
      }
    }
  }
}
</style>
