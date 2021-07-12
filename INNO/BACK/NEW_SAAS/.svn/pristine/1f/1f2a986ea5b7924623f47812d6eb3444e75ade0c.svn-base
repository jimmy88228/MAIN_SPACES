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
        <p class="strong_tips">发起资格人数</p>
        <p class="data">{{activityInfo.launchUsers}}</p>
      </Col>
      <Col :span="8" class="col-data">
        <p class="strong_tips">助力人数</p>
        <p class="data">{{activityInfo.helpUsers}}</p>
      </Col>
      <Col :span="8" class="col-data">
        <p class="strong_tips">获取资格人数</p>
        <p class="data">{{activityInfo.succUsers}}</p>
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
        <p class="strong_tips">新会员</p>
        <p class="data">{{activityInfo.newUsers}}</p>
      </Col>
    </Row>
    <Row class="col-wrapper">
      <Col :span="6" class="col-data">
        <p class="strong_tips">订单数</p>
        <p class="data">{{activityInfo.orderCount}}</p>
      </Col>
      <Col :span="6" class="col-data">
        <p class="strong_tips">下单人数</p>
        <p class="data">{{activityInfo.goodsCount}}</p>
      </Col>
      <Col :span="6" class="col-data">
        <p class="strong_tips">商品销售总数</p>
        <p class="data">{{activityInfo.orderCount}}</p>
      </Col>
      <Col :span="6" class="col-data">
        <p class="strong_tips">销售金额</p>
        <p class="data">{{activityInfo.orderAmount}}</p>
      </Col>
    </Row>
    <titleBar>商品统计</titleBar>
    <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="goodsInfo" ref="myTable" @on-sort-change="handleSort">
      <template slot-scope="{ row }" slot="name">
        <div class="img_list_wrap">
          <div class="img_fixed">
            <img :src="row.picture" v-if="row.picture" :alt="row.goodsName" v-viewer/>
            <img src="@rs/images/default-img.jpg" :alt="row.goodsName" v-viewer v-else></img>
          </div>
          <span class="name">{{row.goodsName}}</span>
        </div>
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
      goodsInfo: [],
      field: '',
      sort_by: '',
      spinShow: false
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
      this.spinShow = true;
      let params = Object.assign({}, data, this.condition, {
        id: this.id,
        field: this.field,
        sort_by: this.sort_by,
      });
      return this.$ajax.post(this.$api.seckillActivityData, params)
      .then(response => {
        const res = response.data;
        if (res.code) {
          let {activity_data, list} = res.data;
          this.activityInfo = activity_data;
          this.goodsInfo = list;
        }
        this.spinShow = false;
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
    },
    handleSort ({column, key, order}) {
      this.field = key;
      this.sort_by = order;
      this.loadData();
    }
  },
  mounted () {
    this.loadData();
  }
}
</script>

<style lang="less">
.bargin-statistics{
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
