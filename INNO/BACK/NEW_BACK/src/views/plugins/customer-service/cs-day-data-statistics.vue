
<template>
  <Card class="transform-page statistics-page">
	<stats-back :isBack="brandId"  :type="brandId ? 'brand' : ''" :data="{id: brandId, name: brandName}" @on-changeData="changeBrand"></stats-back>
	<!-- <behavior-form
	:formSearch="formSearch"
	@on-search="searchData" 
	@on-handleExport="handleExport"
	></behavior-form> -->
	<div class="table-topbar">
		<Form ref="formSearch" :model="formSearch" inline>
			<FormItem>
				<date-select ref="dateSelect" @sT="handleStart" @eT="handleEnd" extra/>
			</FormItem>
			<FormItem>
				客服人员：
				<Tag v-if="formSearch.workerSearchName!='' " closable @on-close="workerClose" size="large">{{formSearch.workerSearchName}}</Tag>
				<Button v-else @click="onSelectWorker">选择客服人员...</Button>
			</FormItem>
			<FormItem>
				咨询时间段：
				 <TimePicker v-model="formSearch.consultTimeRange" confirm type="timerange" placement="bottom-end" placeholder="咨询时间段" style="width: 168px"></TimePicker>
			</FormItem>
			<FormItem>
				<Button type="primary" icon="ios-search" @click="searchData()">搜索</Button>
			</FormItem>
			<FormItem>
				<Button type="success" icon="md-arrow-round-down" @click="exportExcel('day')">导出每日分析数据</Button>
				<Button type="success" icon="md-arrow-round-down" @click="exportExcel('order')">导出订单数据</Button>
			</FormItem>
		</Form>
	</div>
    <div class="model-area">
      <Row type="flex" justify="center" >
          <div class="total-item" v-for="(item, index) in totalData" :key="index">
            <p class="total-name">{{ item.name }}</p>
            <p class="total-val">{{ item.data }}</p>
			<p class="total-percen " v-if="item.percen" :class="item.percen > 0 ? 'rise' : 'drop'">{{item.percen}}%<span class="">{{item.percen > 0 ? '↑': '↓'}}</span></p>
          </div>
      </Row>
    </div>
    <!-- <Divider orientation="left">访问走势</Divider>
    <div class="model-area">
      <div id="dataChart" class="data-chart">

      </div>
    </div> -->
    <Divider orientation="left">每日分析数据</Divider>
	<Table :max-height="500" :columns="columns" :data="tableData" ref='myTable'></Table>

	<Divider orientation="left">订单数据</Divider>
	<Table :max-height="500" :columns="columns2" :data="tableData2" ref='myTable2'></Table>
	<!--异步处理导出excel组件-->
    <div class="col">
      <notice :ref="'notice' + item" @finish="handleFinish" v-for="item in jobIdCol" :key="item"></notice>
    </div>

	<!--选择在线客服-->
		<csWorkerSelect ref="cs-worker-select" :canSelectAll="true" @on-ok="onSelectOk"></csWorkerSelect>
  </Card>
</template>

<script>
import util from '@/libs/util.js';
import echarts from 'echarts';
import mixin from './mixins/dayDataStatisticsMixin.js';
import vueUtils from '@/libs/vue-utils.js';
import notice from '@/views/my-components/mq-notice/mq-notice';
// import behaviorForm from './search-form/day-data-statistics-form.vue';
import csWorkerSelect from '@/views/my-components/cs-worker-select/cs-worker-select';
import statsBack from '@/views/data/components/stats-back';
import DateSelect from '@/views/my-components/date-select/index.vue';

export default {
	name: 'transformStats',
	mixins: [mixin],
	// components: { notice, behaviorForm, statsBack },
	components: { notice, statsBack, csWorkerSelect, DateSelect },
	data () {
		return {
			totalData: [
				{
					name: "总接待量",
					key: "reception_count",
					rateKey: "c_newuser_rate",
					data: 0,
					percen: 0
				},
				{
					name: "总咨询人数",
					key: "consult_user",
					rateKey: "c_active_rate",
					data: 0,
					percen: 0
				},
				{
					name: "首次响应时长",
					key: "first_resp_time",
					rateKey: "c_collect_rate",
					data: 0,
					percen: 0
				},
				{
					name: "平均响应时长",
					key: "average_resp_time",
					rateKey: "c_addcart_rate",
					data: 0,
					percen: 0
				}
			],
			formSearch:{
                // start_time: "",
                // end_time: "",
				// searchq:'',
				searchTime:[],
				workerSearchId: '',
				workerSearchName:'',
				consultTimeRange:[]
            },
			jobIdCol:[],
			tableData: [],
			tableData2: [],
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
			// 默认是选中一个月
			this.$refs['dateSelect'].handleOrderDay('month');
			// window.addEventListener('resize', () => {
			// 	this.dataChart && this.dataChart.resize();
			// }, false)
		},
		searchData(formData){
			this.formSearch = formData || this.formSearch;
			console.log(this.formSearch,"formSearch");
			this.showSpin = true;
			util.ajax.post(util.apiUrl.csDayDataStatistics, {
				...this.formSearch,
				brand_id: this.brandId || 0
			}).then(e =>{
				let res = e.data || {};
				if(res.code) {
					let data = res.data || {};
					let sum = data.sum && data.sum[0];
					// let floating_rate = data.floating_rate[0] || {};
					for(let i = 0; i < this.totalData.length; i++){
						let key = this.totalData[i].key;
						let rateKey = this.totalData[i].rateKey;
						this.totalData[i].data = sum[key] || 0;
						// this.totalData[i].percen = (floating_rate[rateKey] && parseFloat(floating_rate[rateKey])) || 0
					}
					this.tableData = data.day_data;
					this.tableData2 = data.order_data;
					// this.initChart(data.items);
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
		},
		// 清除选中的客服人员
		workerClose(){
			this.formSearch.workerSearchName = '';
			this.formSearch.workerSearchId = 0;

			this.$nextTick(()=>{
				this.searchData();
			});
		},
		// 打开客服选择器
		onSelectWorker(){
			this.$refs['cs-worker-select'].openModal( [], 'radio' );
		},
		// 选管客服的组件的 回调
		onSelectOk( items ){
			if( items.length > 0 ){
				this.$set( this.formSearch, 'workerSearchId', items[0]['id'] );
				this.$set( this.formSearch, 'workerSearchName', items[0]['nick_name'] );
			}
		},
		// 选择日期的回调
		handleStart( date ){
			this.$set( this.formSearch.searchTime, 0, date);
		},
		handleEnd( date ){
			this.$set( this.formSearch.searchTime, 1, date);
		},
		// 导出excel
		exportExcel(type) {
			this.tableLoading = true;
			// this.formSearch = formData || this.formSearch;
			// ajax 请求获取数据
			this.$ajax.post(this.$api.csDayDataStatisticsExport, {
				...this.formSearch,
				brand_id: this.brandId || 0,
				type:type
			})
				.then((response) => {
					this.tableLoading = false;
					var res = response.data;
						if (res.code) {
							var jobId = res.data;
							this.jobIdCol.push(jobId);
							this.$nextTick(() => {
								this.$refs[`notice${jobId}`][0].showNotice(jobId);
							});
							this.$Message.success(res.message);
						} else {
							this.$Message.error(res.message);
						}
				});
		},
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

