<template>
	<Card class="delivery-order-list">
		<Row type="flex" style="margin-bottom: 10px;">
			<Col style="flex:1 1 0%;">
				<searchForm :status-list="statusList" @on-search="searchPage" :keywords="sn"></searchForm>
			</Col>	
			<Col style="width:360px;text-align: right;">
				<Button type="info" @click="handleExport">导出</Button>
				<Button type="success" @click="handleOrderUpload">上传物流单号</Button>
				<Button type="warning" @click="handleOrderCreate">批量生成发货单</Button>
				<Button icon="md-refresh" @click="loadData" shape="circle" title="刷新列表"></Button>
			</Col>
		</Row>

		<Table ref="myTable" :columns="tableColums" :data="tableData" :span-method="handleSpan" disabled-hover>
			<template slot-scope="{ row }" slot="orderInfo">
				<div class="header_inline">
					<span class="header_item">发货号:{{row.delivery_sn}}</span>
					<span class="header_item">关联订单号:<a @click="handleGoOrderInfo(row)">{{row.order_sn}}</a></span>
					<span class="header_item">所属店铺:{{row.store_name}}</span>
					<span class="header_item">发货门店:{{row.delivery_store_name ? row.delivery_store_name : '--'}}</span>
				</div>
			</template>
		</Table>
		<div class="list_page" v-show="pageTotal">
			<Page :total="pageTotal" :page-size="pageSize" :current="currentPage" :page-size-opts="pageSizeOpts" @on-change="changePage"
			 @on-page-size-change="ps => handlePageSize(ps)" show-total show-elevator show-sizer></Page>
		</div>
		<BatchImport ref="batchImport" :download-pay-load="downloadPayLoad" :up-load-pay-load="payLoad" @on-success="onImportSuccess">
		</BatchImport>
		<BatchImport ref="batchImport2" :download-pay-load="downloadPayLoad2" @on-success="onImportSuccess"></BatchImport>
      <!--异步操作组件-->
  <mqNotice ref="mq-notice"></mqNotice>
	</Card>
</template>

<script>
import searchForm from './search-form';
import PageHelper from '@/libs/page-helper.js';
import Mixin from './mixin.js';
import BatchImport from '@/views/my-components/batch-import/batch-import';
import mqNotice from '@/views/my-components/mq-notice/mq-notice';

export default {
  props: ['sn'],
  mixins: [PageHelper, Mixin],
  components: {
    searchForm,
    BatchImport,
    mqNotice
  },
  data () {
    return {
      condition: {
        search_type: '',
        keywords: '',
        startTime: '',
        endTime: '',
        status: 0,
        store_id: 0,
        delivery_store_id: 0
      },
      statusList: {},
      isClose: false,
      payLoad: {
        import_type: '0'
      },
      downloadPayLoad: {
        type: 1
      },
      downloadPayLoad2: {
        type: 2
      },
    }
  },
  methods: {
    handleSpan({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        return [1, 7];
      } else if (columnIndex > 1) {
        return [0, 0];
      }
    },
    onLoadData (page, data) { 
      this.$store.commit('setLoading', true);
      let params = {
        ...data,
        ...this.condition,
        search_type: 'order_sn',
        keywords: this.sn
      }
      return this.$ajax.post(this.$api.ShopShipmentList, params)
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
    handleExport () {
      this.$Modal.confirm({
        title: '操作提示',
        content: `确定进行导出操作`,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          // ajax 请求获取数据
				  this.tableLoading = true;
          this.$ajax.post(this.$api.ShopDeliveryExport, this.condition)
            .then((response) => {
              this.tableLoading = false;
              var res = response.data;
              if (res.code) {
                var jobId = res.data;
                // 打开异步提示组件
                // console.log("$refs",this.$refs)
                this.$refs['mq-notice'].showNotice(jobId);
              }
            });
        }
      });

    },
    confirm () {},
    cancel () {},
    confirmCreate () {},
    cancelCreate () {},
    handleOrderUpload () {
      this.$refs.batchImport.openModal({
        upload: true,
        download: true
      }, this.$api.ShopUploadLogisticsBill, this.$api.ShopDownloadLogisticsBill);
    },
    handleOrderCreate () {
      this.$refs.batchImport2.openModal({
        upload: true,
        download: true
      }, this.$api.ShopUploadLogisticsBill, this.$api.ShopDownloadLogisticsBill);
    },
    onImportSuccess () {
      this.loadData();
    },
    handleGoOrderInfo (row) {
      let routeUrl = this.$router.resolve({
        name: 'shop-order-info',
        params: {
          sn: row.order_id
        }
      });
      window.open(routeUrl.href, '_blank');
    }
  },
  watch: {

  },
  mounted () {
    this.loadData();
  }
}
</script>

<style lang="less" scoped>
.delivery-order-list{
  .btn_wrapper{
    text-align: right;
    .btn{
      margin-bottom: 10px;
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
<style lang="less">
.delivery-order-list{
  .ivu-table-cell-expand{
    display: none;
  }
  td.ivu-table-expanded-cell {
    padding: 0 0 10px 0;
  }
}
</style>
