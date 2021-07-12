<template>
	<div class="kan-list-table">
    <Table ref="myTable" :columns="tableColums" :data="tableData" disabled-hover>
      <template slot-scope="{ row }" slot="name">
        <p>订单号: {{row.activity_sn}}</p>
        <div class="img_list_wrap img_list_wrap_kan">
          <div class="kan_wrapper">
            <div class="img_fixed">
              <img :src="row.goods_img" v-if="row.goods_img" :alt="row.goods_name" v-viewer/>
              <img src="@rs/images/default-img.jpg" :alt="row.goods_name" v-viewer v-else></img>
            </div>
            <div>
              <p class="name">{{row.goods_name}}</p>
              <p class="name">货号：{{row.goods_sn}}</p>
              <p class="name">{{row.color_name}}{{row.size_name}}</p>
            </div>
          </div>
          <div>
            <span>x{{row.goods_number}}</span>
          </div>
        </div>
      </template>
      <template slot-scope="{ row }" slot="price">
        <p>售价: {{row.market_price}}</p>
        <p>底价: {{row.bottom_price}}</p>
        <p>已砍: {{row.cut_joins}}</p>
        <p>当前: {{row.fact_price}}</p>
      </template>
      <template slot-scope="{ row }" slot="create_time">
        <p>{{row.create_time | initDate}}</p>
        <p>{{row.create_time | initTime}}</p>
      </template>
      <template slot-scope="{ row }" slot="handle">
				<div class="v-lines">
					<span><a @click="viewInfo(row)" v-if="row.handle.view">查看</a></span>
					<Divider class="v-line" type="vertical" v-if="row.handle.view"/>
					<span><a @click="viewZInfo(row)" v-if="row.handle['order-view']">查看正式订单</a></span>
					<Divider class="v-line" type="vertical" v-if="row.handle['order-view']"/>
				</div>
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
      orderList: {
        'all': 0,
        'kan-success': 1,
        'kaning': 2,
        'invalid': 3,
      },
      condition: {
        searchq_type: 'activity_name',
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
        status: this.orderList[this.$route.query.act]
      });
      return this.$ajax.post(this.$api.bargainOrderList, params)
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
    viewInfo (row) {
      let routeUrl = this.$router.resolve({
        name: 'kan-order-info',
        params: {
          sn: row.id
        }
      });
      window.open(routeUrl.href, '_blank');
    },
    viewZInfo (row) {
      let routeUrl = this.$router.resolve({
        name: 'order-info',
        params: {
          sn: row.related_order_id
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
