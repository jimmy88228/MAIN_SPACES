
<template>
  <Card class="visit-page statistics-page">
	<sales-form
	:formSearch="formSearch"
	@on-search="searchData" 
	@on-handleExport="handleExport"
	></sales-form>
	<div class="span-parent">
		<div class="model-area">
		<Row type="flex" justify="center" >
			<div class="total-item f-just-center" v-for="(item, index) in totalData" :key="index">
				<div class="total-name">{{ item.name }}</div>
				<div class="total-val flex f-just-center">
					<div class="">
						<p class="total-c">{{item.c_value || 0}}</p>
						<p class="total-s">{{item.s_value || 0}}</p>
					</div>
					<div class="total-hold" v-if="item.rate"></div>
					<div class="total-rate" v-if="item.rate">{{item.rate}}</div>
				</div>
			</div>
		</Row>
		</div>
		<!-- <Divider orientation="left">访问走势</Divider>
		<div class="model-area">
			<div id="dataChart" class="data-chart"></div>
		</div> -->
		<div class="flex divider-area">
			<Divider class="i-flex" orientation="left">详细数据</Divider>
			<div class="operate-btn">
				<Button type="primary" @click="handleExport">导出</Button>
			</div>
		</div>
		<Table :max-height="600" :loading="tableLoading" :columns="columns" height="600" :data="tableData" ref="myTable">
			<template slot-scope="{ row }" slot="goods_thumb">
				<div class="img_list_wrap">
					<div class="img_fixed">
						<img :src="row.goods_thumb" v-if="row.goods_thumb" :alt="row.real_name" v-viewer/>
						<img src="@rs/images/default-img.jpg" :alt="row.real_name" v-viewer v-else></img>
					</div>
				</div>
			</template>
		</Table>
		<Spin :fix="true" v-if="showSpin"></Spin>
	</div>
	<!--异步处理导出excel组件-->
    <div class="col">
      <notice :ref="'notice' + item" @finish="handleFinish" v-for="item in jobIdCol" :key="item"></notice>
    </div>
  </Card>
</template>

<script>
import util from '@/libs/util.js';
import echarts from 'echarts';
import mixin from './detailMixin.js';
import vueUtils from '@/libs/vue-utils.js';
import notice from '@/views/my-components/mq-notice/mq-notice';
import salesForm from './search-form/sales-detail-form';
// import statsBack from '@/views/data/components/stats-back'
import PageHelper from '@/libs/page-helper.js';
export default {
	name: 'cloudSalesStats',
	mixins: [PageHelper, mixin],
	components: {
		notice,
		salesForm,
		// statsBack,
	},
	data () {
		return {
			formSearch:{
				searchq: "",
				start_time: "",
				end_time: "",
				catId: "",
				goodsBrandId: "",
				topCount: "0",
				sortField: "",
				sortBy: "",
				styleType: "1",
				agentId: [],
				storeIds:0
			},
			totalData: [
				{
					name: "吊牌总额",
					key: "market_price",
					c_value: "2",
					s_value: "2",
					rate: "10%"
				},
				{
					name: "原价总额",
					key: "goods_price",
					c_value: "2",
					s_value: "2",
					rate: "10%"
				},
				{
					name: "实销总额",
					key: "real_price",
					c_value: "2",
					s_value: "2",
					rate: "10%"
				},
				{
					name: "销量",
					key: "goods_number",
					c_value: "2",
					s_value: "2",
					rate: "10%"
				},
				// {
				// 	name: "积分抵扣",
				// 	key: "ALL_integral_money",
				// 	c_value: "2",
				// 	s_value: "2",
				// 	rate: ""
				// },
				// {
				// 	name: "余额抵扣",
				// 	key: "ALL_surplus",
				// 	c_value: "2",
				// 	s_value: "2",
				// 	rate: ""
				// }
			],
			totalView:{},
			showSpin: true,
			brandId:0,
			brandName: "",
			jobIdCol:[]
		}
	},
	computed: {
		agentId(){
			let formSearch = this.formSearch || {};
			return formSearch.agentId.slice(-1)[0] || 0;
		}
	},
	mounted(){
		this.initParams();
		this.searchData();
	},
	methods: {
		initParams(){
			let query = this.$route.query || {};
			this.brandId = query.brandId;
			this.brandName = query.brandName;
			window.addEventListener('resize', () => {
				this.dataChart && this.dataChart.resize();
			}, false)
		},
		searchData(formData){
			this.formSearch = formData || this.formSearch;
			this.loadData();
		},
		onLoadData(page, data){
			this.showSpin = true;
			let formSearch = this.formSearch;
			return util.ajax.post(util.apiUrl.CloudSalesDetailView, {
				...data,
				...formSearch,
				agentId: this.agentId,
				// brand_id: this.brandId || 0,
			}).then(e =>{
				let res = e.data || {};
				if(res.code) {
					let data = res.data || {};
					this.data = {
						items: data.items,
						total: data.totalCount
					}
					let totalView = data.items.length > 0 && data.items[0];
					let list = data.list || [];
					let totalData = this.totalData || [];
					for(let i = 0; i < totalData.length; i++){
						let key = totalData[i].key;
						switch(key){
							case "market_price":
								totalData[i].c_value = list[i].c_market_price;
								totalData[i].s_value = list[i].s_market_price;
								totalData[i].rate = list[i].market_price_rate;
								break;
							case "goods_price":
								totalData[i].c_value = list[i].c_goods_price;
								totalData[i].s_value = list[i].s_goods_price;
								totalData[i].rate = list[i].goods_price_rate;
								break;
							
							case "real_price":
								totalData[i].c_value = list[i].c_real_price;
								totalData[i].s_value = list[i].s_real_price;
								totalData[i].rate = list[i].real_price_rate;
								break;
							case "goods_number":
								totalData[i].c_value = list[i].c_goods_number;
								totalData[i].s_value = list[i].s_goods_number;
								totalData[i].rate = list[i].goods_number_rate;
								break;
						}
					}
					this.totalData = totalData;
				}
			}).finally(()=>{
				this.showSpin = false
			})
		},
		getFilterX(data){
			let formSearch = this.formSearch;
			let start_time = formSearch.start_time || new Date();
			let end_time = formSearch.end_time || new Date();
			let choose_type = formSearch.choose_type;
			let XData = [];
			switch(choose_type){
				case "hh":
					for(let i = 0; i < 24; i++){
						XData.push(i);
					}
					break;
				case "dd":
					let startDate = Date.parse(start_time);
					let endDate = Date.parse(end_time);
					let _date = startDate;
					let limitTime = 24 * 60 * 60 * 1000;
					while(_date < endDate || _date == endDate){
						XData.push(vueUtils.format(new Date(_date), "MM-dd"));
						_date = _date + limitTime;
					}
					break;
				case "mm":
					let startY = new Date(start_time).getFullYear();
					let endY = new Date(start_time).getFullYear();
					let startM = new Date(start_time).getMonth() + 1;
					let endM = new Date(end_time).getMonth() + 1;
					let i = startM, currYear = startY;
					let endI = startM > endM ? 12 : endM;
					while(i < endI || i == endI){
						let fullI = i < 10 ? "0" + i : i;
						XData.push(currYear + "-" + fullI);
						if(i == endI && startM > endM){
							i = 0;
							endI = endM;
							currYear = endY;
						}
						i++;
					}
					break;
			}
			return XData;
		},
		handleFinish () {
			// 异步下载结束后刷新
			this.searchData();
		},
		handleExport () {
			this.$Modal.confirm({
				title: '操作提示',
				content: '确定导出数据么',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					let formSearch = this.formSearch;
					return this.$ajax.post(this.$api.CloudSalesDetailExport,{
						...formSearch,
						agentId: this.agentId,
						brand_id: this.brandId || 0,
					}).then((response) => {
						var res = response.data;
						if (res.code) {
							var jobId = res.data;
							// 打开异步提示组件
							this.jobIdCol.push(jobId);
							this.$nextTick(() => {
								this.$refs[`notice${jobId}`][0].showNotice(jobId);
							});
							this.$Message.success(res.message);
						} else {
							this.$Message.error(res.message);
						}
					});
				}
			});
		},
		changeBrand(data){
			if(data){
				let brandInfo = data[0] || {};
				this.brandId = brandInfo.brandId;
				this.brandName = brandInfo.brandName;
				this.searchData();
			}
		}
	}
}
</script>
<style lang="less">
.visit-page{
	.model-area{
		.total-item{
			border-right:1px solid #efefef;
			.total-c{
				color:#b2b2b2;
			}
			.total-hold{
				width:20px;
			}
			.total-rate{
			}
		}
		.total-item:last-child{
			border-right:0  none;
		}
	}
	.divider-area{
		width:100%;
		align-items: center;
		.i-flex{
			min-width: unset;
		}
		.operate-btn{
			margin-left:40px;
			margin-right:20px;
		}
	}
}
  
</style> 

