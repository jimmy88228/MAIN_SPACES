<template>
	<div class="kan-list-table">
    <Table ref="myTable" :columns="tableColums" :data="tableData" disabled-hover>
      <template slot-scope="{ row }" slot="name">
        <p>订单号: {{row.order_sn}}</p>
        <div class="img_list_wrap img_list_wrap_kan">
          <div class="kan_wrapper">
            <div class="img_fixed">
              <img :src="row.picture" v-if="row.picture" :alt="row.goods_name" v-viewer/>
              <img src="@rs/images/default-img.jpg" :alt="row.goods_name" v-viewer v-else></img>
            </div>
            <div>
              <p class="name">{{row.goods_name}}</p>
              <p class="name">货号：{{row.goods_sn}}</p>
              <p class="name">{{row.goods_attr}}</p>
              <p class="name">售价: ￥{{row.fact_price}}</p>
            </div>
          </div>
          <div>
            <span>x{{row.goods_num}}</span>
          </div>
        </div>
      </template>
      <template slot-scope="{ row }" slot="user">
        <p>{{row.consignee}}</p>
        <p>{{row.phone}}</p>
        <p>活动：{{row.activity_name}}</p>
      </template>
      <template slot-scope="{ row }" slot="pay">
        <p>总额：￥{{row.order_price}}</p>
        <p>实付：￥{{row.order_fact_price}}</p>
      </template>
      <template slot-scope="{ row }" slot="create_time">
        <p>{{row.create_time | initDate}}</p>
        <p>{{row.create_time | initTime}}</p>
      </template>
      <template slot-scope="{ row }" slot="handle">
        <span><a @click="handleView(row)" v-show="row.handle.view">查看</a></span>
        <Divider type="vertical"/>
        <span><a @click="handleZView(row)" v-show="row.handle['order-view']">查看正式订单</a></span>
      </template>
    </Table>
    <div class="list_page" v-show="pageTotal">
      <Page
        :total="pageTotal"
        :page-size="pageSize"
        :current="currentPage"
        :page-size-opts="pageSizeOpts"
        @on-change="changePage"
        @on-page-size-change="ps => handlePageSize(ps)"
        show-total
        show-elevator
        show-sizer></Page>
    </div>
	</div>
</template>

<script>
import PageHelper from '@/libs/page-helper.js';
import Mixin from './mixin.js';

export default {
  mixins: [PageHelper, Mixin],
  data () {
    return {
      returnOrderList: {
        'all': 0,
        'unpay': 1,
        'finish': 2,
        'cancel': 3,
      },
      condition: {
        searchq_type: 'name',
        searchq: '',
        start_time: '',
        end_time: ''
      }
    }
  },
  methods: {
    onLoadData (page, data) {
      this.$store.commit('setLoading', true);
      let params = Object.assign({}, data, this.condition, {
        status: this.returnOrderList[this.$route.query.act]
      });
      return this.$ajax.post(this.$api.seckillOrderList, params)
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.data = res.data;
          this.statusList = res.data && res.data.status;
        }
        this.$store.commit('setLoading', false);
      });
    },
    searchPage (searchData) {
      this.condition = searchData;
      this.loadData();
    },
    handleView (row) {
      let routeUrl = this.$router.resolve({
        name: 'seckill-order-details',
        params: {
          sn: row.id
        }
      });
      window.open(routeUrl.href, '_blank');
    },
    handleZView (row) {
      let routeUrl = this.$router.resolve({
        name: 'order-info',
        params: {
          sn: row.relate_order_id
        }
      });
      window.open(routeUrl.href, '_blank');
    }
  }
}
</script>
<style lang="less">
.kan-list-table{
  .img_list_wrap_kan{
    justify-content: space-between;
    .kan_wrapper{
      display: flex;
      align-items: center;
    }
  }
  .header_inline{
    white-space: pre-wrap;
    .header_item{
      margin-right: 30px;
    }
  }
}
</style>
