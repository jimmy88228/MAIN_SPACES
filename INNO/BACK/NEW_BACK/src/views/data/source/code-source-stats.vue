
<template>
  <Card class="visit-page span-parent statistics-page">
	<stats-back :isBack="true"  :type="brandId ? 'brand' : ''" :data="{id: brandId, name: brandName}" @on-changeData="changeBrand"></stats-back>
	<div class="flex f-align-center f-just-between">
		<div class="flex f-align-center ">
			选择日期:&nbsp;&nbsp;
			<date-select ref="dateSelect" defaultTime="month" dateType="report" class="space-nowrap" @sT="handleStart" @eT="handleEnd"/>&nbsp;&nbsp;
			<Input
			class=""
			style="width:250px"
			v-model="formSearch.searchq"
			placeholder="请输入商品名称"
			clearable
			search
			enter-button
			@on-search="loadData()"
			@on-clear="loadData()"
			@keydown.native.enter.prevent="loadData()">
				<div slot="prepend">商品名称</div>
			</Input>
		</div>
		<div>
			<!-- <Button type="primary" icon="md-cloud-download" @click="handleExport">导出</Button> -->
		</div>
	</div>
	<div class="span-parent">
		<Divider orientation="left">监控数据</Divider>
		<div class="model-area">
			<Row type="flex" justify="center" >
				<div class="total-item" v-for="(item, index) in totalData" :key="index">
					<p class="total-name">{{ item.name }}</p>
					<p class="total-val">{{ item.data }}</p>
				</div>
			</Row>
		</div>
		<div class="model-area">
			<div id="dataChart" class="data-chart">

			</div>
		</div>
		<Table :columns="dataCol" :data="sourceData" :height="500"></Table>
		<Divider orientation="left">商品转化数据</Divider>
		<Table :columns="goodsCol" :data="goodsList" :height="500">
			<template slot-scope="{ row }" slot="goods_img">
				<div class="img_list_wrap">
					<p class="img_fixed" v-if="row.goods_img"><img :src="row.goods_img" /></p>
				</div>
			</template>
		</Table>
		<div class="page-area list_page" >
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
		<Spin :fix="true" v-if="showSpin"></Spin>
		<!--异步处理导出excel组件-->
		  <!-- <div class="col">
		    <notice :ref="'notice' + item" @finish="loadData" v-for="item in jobIdCol" :key="item"></notice>
		  </div> -->
	</div>
  </Card>
</template>

<script>
import util from '@/libs/util.js';
import echarts from 'echarts';
import mixdata from './mixins/data.js';
import mixgoods from './mixins/goods.js';
import vueUtils from '@/libs/vue-utils.js';
import PageHelper from '@/libs/page-helper.js';
import DateSelect from '@/views/my-components/date-select/index.vue';
import statsBack from '@/views/data/components/stats-back';
// import notice from '@/views/my-components/mq-notice/mq-notice';
export default {
	name: 'source-stats-detail',
	mixins: [ mixdata, mixgoods, PageHelper],
	components: { DateSelect, statsBack },
	data () {
		return {
			totalData: [
				{
					name: "到达浏览量",
					key: "total_pv",
					data: 0
				},
				{
					name: "到达访客数",
					key: "total_uv",
					data: 0
				},
				{
					name: "下单人数",
					key: "order_users",
					data: 0
				},
				{
					name: "付款人数",
					key: "pay_users",
					data: 0
				},
				{
					name: "下单转化率",
					key: "order_convert_rate",
					data: 0
				},
				{
					name: "付款订单数",
					key: "pay_orders",
					data: 0
				},
				{
					name: "付款转化率",
					key: "pay_convert_rate",
					data: 0
				},
				{
					name: "成交金额",
					key: "order_amount",
					data: 0
				}
			],
			formSearch: {
				start_time: new Date(),
				end_time: new Date(),
				searchq: "",
				type: "",
				sortField: "",
				sortBy: "ASC",
			},
			goodsList: [],
			sourceData: [],
			showSpin: true,
			dataChart: null,
			brandId: 0,
			brandName: "",
			jobIdCol: []
		}
	},
	computed: {},
	mounted(){
		this.initParams();
		this.loadData();
	},
	methods: {
		initParams(){
			let query = this.$route.query || {};
			this.formSearch.type = query.qrcode_type;
			this.brandId = parseInt(query.brandId) || 0;
			this.brandName = query.brandName || "";
			window.addEventListener('resize', () => {
				this.dataChart && this.dataChart.resize();
			}, false)
		},
		onLoadData(page, extendData){
			this.showSpin = true;
			return util.ajax.post(util.apiUrl.codeChannelDetails, {
				...this.formSearch,
				brand_id: this.brandId || 0,
				...extendData,
			}).then(e =>{
				let res = e.data || {};
				if(res.code) {
					let data = res.data || {};
					let sumary = data.sumary || [];
					let goods_data = data.items || [];
					let titleItem = {};
					for(let i = 0; i < sumary.length; i++){
						if(sumary[i].op_date == "汇总"){
							titleItem = sumary[i];
							break;
						}
					}
					for(let i = 0; i < this.totalData.length; i++){
						let key = this.totalData[i].key;
						this.totalData[i].data = titleItem[key] || 0;
					}
					this.goodsList = goods_data || [];
					this.data = {
						items: this.goodsList,
						total: goods_data.length || 0
					}
					this.sourceData = sumary;
					this.initChart(data.sumary);
				}
			}).finally(()=>{
				this.showSpin = false
			})
		},
		getFilterX(){
			let XData = [];
			let startDate = Date.parse(this.formSearch.start_time);
			let endDate = Date.parse(this.formSearch.end_time);
			let _date = startDate;
			let limitTime = 24 * 60 * 60 * 1000;
			while(_date < endDate || _date == endDate){
				XData.push(vueUtils.format(new Date(_date), "MM-dd"));
				_date = _date + limitTime;
			}
			return XData;
		},
		handleStart (date) {
				this.formSearch.start_time = date;
		},
		handleEnd (date) {
				this.formSearch.end_time = date;
		},
		initChart(items){
			this.dataChart = echarts.init(document.getElementById("dataChart"));
			let legend_title = [], list_data = [];
			let xData = this.getFilterX();
			items.reverse();
			for (let i = 0; i < this.totalData.length; i++){
				let name = this.totalData[i].name;
				legend_title.push({
					name: name,
					icon:'circle'
				});
				let key = this.totalData[i].key;
				let item = []; 
				for (let j = 0; j < items.length; j++){
					if(items[j].op_date != "汇总"){
						item.push(items[j][key])
					}
				}
				list_data.push({
					name: name,
					type: 'line',
					data: item
				})
			}
			let option = {
				tooltip : {
					trigger: 'axis',
					formatter:'<div class="echart_formatter"><ul>\
					<li class="tit">{a0}</li>\
					<li class="val">{c0}</li>\
					<li class="tit">{a1}</li>\
					<li class="val">{c1}</li>\
					<li class="tit">{a2}</li>\
					<li class="val">{c2}</li>\
					<li class="tit">{a3}</li>\
					<li class="val">{c3}</li>\</ul>\
					<ul><li class="tit">{a4}</li>\
					<li class="val">{c4}</li>\
					<li class="tit">{a5}</li>\
					<li class="val">{c5}</li>\
					<li class="tit">{a6}</li>\
					<li class="val">{c6}</li>\
					<li class="tit">{a7}</li>\
					<li class="val">{c7}</li>\
					</ul></div>',
					backgroundColor:'rgba(0,0,0,0.7)'
				},
				legend: {
					data: legend_title
				},
				grid: {
					left: '1%',
					right: '1%',
					bottom: '1%',
					containLabel: true
				},
				toolbox: {
					show : false,
					feature : {
						mark : {
							width:'2px'
						},
						dataView : false,
						magicType:['line','bar'],
						restore : false,
						saveAsImage : true
					}
				},
				calculable : false,
				color: [
					'#28a6ff', '#ff8439','#34a905','#00b3b5','#7053b6','#dc0fe4','#EF4949'
				],
				xAxis: [
					{
						type : 'category',
						
						data : xData,
						axisLabel:{
							show:true,
							textStyle:{
								color:"#ababab"
							}
						},
						axisLine:{show:false},
						axisTick:{show:false},
						splitLine:{
							show:false
						},
						splitArea:{
							show:true,
							areaStyle:{
								color:['#fbfbfb','#fff'],
								opacity:0.5
							}
						}
					}
				],
				yAxis: [
					{
						type : 'value',
						axisLabel : {
							formatter: '{value}',
							textStyle:{
								color:"#ababab"
							}
						},
						splitLine:{
							lineStyle:{
								type:'dotted',
							}
						},
						axisLine:{show:false},
						axisTick:{show:false},
						minInterval:1
					}
				],
				series: list_data
			};						  
			this.dataChart.setOption(option); 
		},
		changeBrand(data){
			if(data){
				let brandInfo = data[0] || {};
				this.brandId = brandInfo.brandId;
				this.brandName = brandInfo.brandName;
				this.searchData();
			}
		},
		// handleExport () {
		// 	this.$Modal.confirm({
		// 		title: '操作提示',
		// 		content: '确定导出数据么',
		// 		okText: '确定',
		// 		cancelText: '取消',
		// 		onOk: () => {
		// 			let formSearch = this.formSearch;
		// 			return this.$ajax.post(this.$api.customChannelDATAExport,{
		// 				...formSearch,
		// 			}).then((response) => {
		// 					var res = response.data;
		// 					if (res.code) {
		// 						var jobId = res.data;
		// 						// 打开异步提示组件
		// 						this.jobIdCol.push(jobId);
		// 						this.$nextTick(() => {
		// 							this.$refs[`notice${jobId}`][0].showNotice(jobId);
		// 						});
		// 						this.$Message.success(res.message);
		// 					} else {
		// 						this.$Message.error(res.message);
		// 					}
		// 			});
		// 		}
		// 	});
		// }
	}
}
</script>
<style lang="less">
.visit-page{
	.page-area{
		padding:20px 0px;
	}
}
  
</style> 

