
<template>
  <Card class="transform-page statistics-page">
	<stats-back type="store" :isBack="false" :showHead="true" :data="storeList" @on-changeData="changeStore"></stats-back>
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
import storeMixin from '@/views/cloud-shop/data/storeMixin';
export default {
	name: 'cloudBehaviorStats',
	mixins: [mixin, storeMixin],
	components: { notice, behaviorForm, statsBack },
	data () {
		return {
			totalData: [
				{
					name: "新增会员数",
					key: "reg_user",
					rateKey: "reg_user_change",
					data: 0,
					percen: 0
				},
				{
					name: "交互人数",
					key: "active_user",
					rateKey: "active_user_change",
					data: 0,
					percen: 0
				},
				{
					name: "收藏人数",
					key: "fav_user",
					rateKey: "fav_user_change",
					data: 0,
					percen: 0
				},
				{
					name: "加购物车人数",
					key: "addcart_user",
					rateKey: "addcart_user_change",
					data: 0,
					percen: 0
				},
				{
					name: "加购物车转化率",
					key: "addcart_rate",
					rateKey: "addcart_rate_change",
					data: 0,
					percen: 0
				},
				{
					name: "下单人数",
					key: "order_user",
					rateKey: "order_user_change",
					data: 0,
					percen: 0
				},
				{
					name: "下单转化率",
					key: "order_rate",
					rateKey: "order_rate_change",
					data: 0,
					percen: 0
				},
				{
					name: "支付人数",
					key: "pay_user",
					rateKey: "pay_user_change",
					data: 0,
					percen: 0
				},
				{
					name: "支付转化率",
					key: "pay_rate",
					rateKey: "pay_rate_change",
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
			window.addEventListener('resize', () => {
				this.dataChart && this.dataChart.resize();
			}, false)
		},
		searchData(formData){
			this.formSearch = formData || this.formSearch;
			this.showSpin = true;
			util.ajax.post(util.apiUrl.CloudBehaviorVisitView, {
				...this.formSearch,
				storeIds: this.storeIds
			}).then(e =>{
				let res = e.data || {};
				if(res.code) {
					let data = res.data || {};
					let sum = data.sumary && data.sumary[0];
					//let floating_rate = data.floating_rate[0] || {};
					for(let i = 0; i < this.totalData.length; i++){
						let key = this.totalData[i].key;
						let rateKey = this.totalData[i].rateKey;
						this.totalData[i].data = sum[key] || 0;
						this.totalData[i].percen = sum[rateKey] || 0//(floating_rate[rateKey] && parseFloat(floating_rate[rateKey])) || 0
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
					return this.$ajax.post(util.apiUrl.CloudBehaviorVisitExport,{
						...this.formSearch,
						storeIds: this.storeIds
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

