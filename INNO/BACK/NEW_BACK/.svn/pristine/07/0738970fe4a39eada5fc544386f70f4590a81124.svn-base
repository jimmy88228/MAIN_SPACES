
<template>
  <Card class="transform-page statistics-page">
	<stats-back :isBack="brandId"  :type="brandId ? 'brand' : ''" :data="{id: brandId, name: brandName}" @on-changeData="changeBrand"></stats-back>
	<behavior-form
	:formSearch="formSearch"
	@on-search="searchData" 
	@on-handleExport="handleExport"
	></behavior-form>
    <div class="model-area">
      <Row type="flex" justify="center" >
          <div class="total-item" v-for="(item, index) in totalData" :key="index">
            <p class="total-name">{{ item.name }}</p>
            <p class="total-val">{{ item.data }}</p>
			<p class="total-percen " v-if="item.percen" :class="item.percen > 0 ? 'rise' : 'drop'">{{item.percen}}%<span class="">{{item.percen > 0 ? '↑': '↓'}}</span></p>
          </div>
      </Row>
    </div>
    <Divider orientation="left">访问走势</Divider>
    <div class="model-area">
      <div id="dataChart" class="data-chart">

      </div>
    </div>
    <Divider orientation="left">详细数据</Divider>
	<Table :max-height="500" :columns="columns" :data="tableData" ref='myTable'></Table>
	<!--异步处理导出excel组件-->
    <div class="col">
      <notice :ref="'notice' + item" @finish="handleFinish" v-for="item in jobIdCol" :key="item"></notice>
    </div>
  </Card>
</template>

<script>
import util from '@/libs/util.js';
import echarts from 'echarts';
import mixin from './mixins/behaviorMixin.js';
import vueUtils from '@/libs/vue-utils.js';
import notice from '@/views/my-components/mq-notice/mq-notice';
import behaviorForm from './search-form/behavior-form';
import statsBack from '@/views/data/components/stats-back'

export default {
	name: 'transformStats',
	mixins: [mixin],
	components: { notice, behaviorForm, statsBack },
	data () {
		return {
			totalData: [
				{
					name: "新增会员数",
					key: "new_users",
					rateKey: "c_newuser_rate",
					data: 0,
					percen: 0
				},
				{
					name: "交互人数",
					key: "active_users",
					rateKey: "c_active_rate",
					data: 0,
					percen: 0
				},
				{
					name: "收藏人数",
					key: "collection_users",
					rateKey: "c_collect_rate",
					data: 0,
					percen: 0
				},
				{
					name: "加购物车人数",
					key: "add_carts",
					rateKey: "c_addcart_rate",
					data: 0,
					percen: 0
				},
				{
					name: "加购物车转化率",
					key: "add_cart_rate",
					rateKey: "c_tsf_addcart_rate",
					data: 0,
					percen: 0
				},
				{
					name: "下单人数",
					key: "orders",
					rateKey: "c_orders_rate",
					data: 0,
					percen: 0
				},
				{
					name: "下单转化率",
					key: "orders_rate",
					rateKey: "c_tsf_orders_rate",
					data: 0,
					percen: 0
				},
				{
					name: "支付人数",
					key: "pays",
					rateKey: "c_pays_rate",
					data: 0,
					percen: 0
				},
				{
					name: "支付转化率",
					key: "pays_rate",
					rateKey: "c_tsf_pays_rate",
					data: 0,
					percen: 0
				}
			],
			formSearch:{
                start_time: "",
                end_time: "",
            },
			jobIdCol:[],
			tableData: [],
			brandId:0,
			brandName: ""
		}
	},
	computed: {},
	mounted(){
		this.initParams();
		this.searchData();
	},
	methods: {
		initParams(){
			let query = this.$route.query || {};
			this.brandId = query.brandId || 0;
			this.brandName = query.brandName || "";
			window.addEventListener('resize', () => {
				this.dataChart && this.dataChart.resize();
			}, false)
		},
		searchData(formData){
			this.formSearch = formData || this.formSearch;
			console.log(this.formSearch,"formSearch");
			this.showSpin = true;
			util.ajax.post(util.apiUrl.behaviorVisitView, {
				...this.formSearch,
				brand_id: this.brandId || 0
			}).then(e =>{
				let res = e.data || {};
				if(res.code) {
					let data = res.data || {};
					let sum = data.sum && data.sum[0];
					let floating_rate = data.floating_rate[0] || {};
					for(let i = 0; i < this.totalData.length; i++){
						let key = this.totalData[i].key;
						let rateKey = this.totalData[i].rateKey;
						this.totalData[i].data = sum[key] || 0;
						this.totalData[i].percen = (floating_rate[rateKey] && parseFloat(floating_rate[rateKey])) || 0
					}
					this.tableData = data.items;
					this.initChart(data.items);
				}
			}).finally(()=>{
				this.showSpin = false
			})
		},
		getFilterX(){
			let dateRange = this.dateRange;
			let formSearch = this.formSearch;
			let start_time = formSearch.start_time || new Date();
			let end_time = formSearch.end_time || new Date();
			let XData = [];
			let startDate = Date.parse(start_time);
			let endDate = Date.parse(end_time);
			let _date = startDate;
			let limitTime = 24 * 60 * 60 * 1000;
			while(_date < endDate || _date == endDate){
				XData.push(vueUtils.format(new Date(_date), "MM-dd"));
				_date = _date + limitTime;
			}
			return XData;
		},
		initChart(items){
			this.dataChart = echarts.init(document.getElementById("dataChart"));
			let legend_title = [], list_data = [];
			let xData = this.getFilterX([]);
			for (let i = 0; i < this.totalData.length; i++){
				let name = this.totalData[i].name;
				let key = this.totalData[i].key;
				legend_title.push({
					name: name,
					icon:'circle'
				});
				let item = []
				for(let j = 0; j < items.length; j++){
					item.push(items[j][key]);
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
					formatter: function(data){
						let html = '', lis = '';
						let limitL = 2;
						for(let i = 0; i < data.length; i++){
							lis += '<li class="tit">' + data[i].seriesName + '</li><li class="tit">' + data[i].value + '</li>'
							console.log()
							if(data.length > limitL){
								if(i % limitL == 0 && i != 0){
									html += '<ul>' + lis + '</ul>';
									lis = "";
								}
							} else if((i + 1) == data.length){
								html += '<ul>' + lis + '</ul>';
								lis = ""
							}
						}
						if(lis) {
							html += '<ul>' + lis + '</ul>';
							lis = "";
						}
						html = '<div class="echart_formatter">' + html + '</div>';
						return html;
					},
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
		handleFinish () {
			// 异步下载结束后刷新
			this.searchData();
		},
		handleExport(){
			this.$Modal.confirm({
				title: '操作提示',
				content: `确定进行导出操作`,
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					// let dateRange = this.dateRange;
					return this.$ajax.post(util.apiUrl.behaviorVisitExport,{
						// start_time: vueUtils.format(dateRange[0], "yyyy-MM-dd"),
						// end_time: vueUtils.format(dateRange[1], "yyyy-MM-dd"),
						...this.formSearch,
						brand_id: this.brandId || 0
					})
					.then(response => {
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
.transform-page{
	.model-area{
		.rise{
			color:#2FBF62;
		}
		.drop{
			color:#CD0A0A;
		}
	}
}
  
</style> 

