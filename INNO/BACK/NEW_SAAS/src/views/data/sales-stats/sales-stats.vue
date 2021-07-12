
<template>
  <Card class="visit-page statistics-page">
	<stats-back :isBack="brandId" :type="brandId ? 'brand':''" :data="{id: brandId, name: brandName}" @on-changeData="changeBrand"></stats-back>
	<sales-form
	:formSearch="formSearch"
	@on-search="searchData" 
	@on-handleExport="handleExport"
	></sales-form>
	<div class="span-parent">
		<div class="model-area">
		<Row type="flex" justify="center" >
			<div class="total-item" v-for="(item, index) in totalData" :key="index">
				<p class="total-name">{{ item.name }}</p>
				<p class="total-val">{{ item.data }}</p>
			</div>
		</Row>
		</div>
		<Divider orientation="left">访问走势</Divider>
		<div class="model-area">
			<div id="dataChart" class="data-chart"></div>
		</div>
		<div class="flex divider-area">
			<Divider class="i-flex" orientation="left">详细数据</Divider>
			<div class="operate-btn">
				<Button type="primary" @click="handleExport">导出</Button>
			</div>
		</div>
		<Table :max-height="500" :columns="columns" :data="tableData" ref="myTable"></Table>
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
import mixin from './mixin.js';
import vueUtils from '@/libs/vue-utils.js';
import notice from '@/views/my-components/mq-notice/mq-notice';
import salesForm from './search-form/sales-stats-form';
import statsBack from '@/views/data/components/stats-back'
export default {
	name: 'salesStats',
	mixins: [mixin],
	components: {
		notice,
		salesForm,
		statsBack
	},
	data () {
		return {
			formSearch:{
                start_time: "",
                end_time: "",
                platform_src:"all",
                choose_type: "hh",
                order_type: 0,
                agent_id: [],
                store_id:0
            },
			showSpin: true,
			tableData: [],
			brandId:0,
			brandName: "",
			jobIdCol:[]
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
			this.showSpin = true;
			let formSearch = this.formSearch;
			util.ajax.post(util.apiUrl.salesStatsView, {
				...formSearch,
				agent_id: formSearch.agent_id.slice(-1)[0],
				search_type_new: "",
				brand_id: this.brandId || 0, 
			}).then(e =>{
				let res = e.data || {};
				if(res.code) {
					let data = res.data || {};
					let sum = data.sum;
					for(let i = 0; i < this.totalData.length; i++){
						this.totalData[i].data = sum[i] || 0;
					}
					this.tableData = data.items;
					this.initChart(data.items);
				}
			}).catch(e=>{
				this.$Message.warning("请求出错");
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
		initChart(items){
			this.dataChart = echarts.init(document.getElementById("dataChart"));
			let legend_title = [], list_data = [];
			let xData = this.getFilterX([]);
			for (let i = 0; i < this.totalData.length; i++){
				let name = this.totalData[i].name;
				legend_title.push({
					name: name,
					icon:'circle'
				});
				let item = []; 
				for (let j = 0; j < items.length; j++){
					item.push(items[j][i+1])
				}
				list_data.push({
					name: name,
					type: 'line',
					data: item
				})
			}
			let option = {
				tooltip: {
					trigger: 'axis',
					formatter: function(data){
						let html = '', lis = '';
						let limitL = 3;
						for(let i = 0; i < data.length; i++){
							lis += '<li class="tit">' + data[i].seriesName + '</li><li class="tit">' + data[i].value + '</li>'
							if(data.length > limitL){
								if(i % limitL == 0 && i != 0){
									html += '<ul>' + lis + '</ul>';
									lis = "";
								}
							} else if((i + 1) == data.length){
								html += '<ul>' + lis + '</ul>';
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
		handleExport () {
			this.$Modal.confirm({
				title: '操作提示',
				content: '确定导出数据么',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					let formSearch = this.formSearch;
					return this.$ajax.post(this.$api.salesStatsExport,{
						...formSearch,
						agent_id: formSearch.agent_id.slice(-1)[0],
						search_type_new: "",
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

