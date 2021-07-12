<template>
  <Card class="visit-page statistics-page">
	<stats-back :isBack="brandId" :type="brandId ? 'brand':''" :data="{id: brandId, name: brandName}" @on-changeData="changeBrand"></stats-back>
	<hist-form
	:formSearch="searchForm"
	@on-search="searchData" 
	@on-handleExport="handleExport"
	></hist-form>
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
			<div id="dataChart" class="data-chart">

			</div>
		</div>
		<Divider orientation="left">详细数据</Divider>
		<Table :max-height="500" :columns="columns" :data="tableData"></Table>
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
import visitMixin from './mixins/visitMixin.js';
import vueUtils from '@/libs/vue-utils.js';
import notice from '@/views/my-components/mq-notice/mq-notice';
import histForm from './search-form/hist-form';
import statsBack from '@/views/data/components/stats-back'
export default {
	name: 'historyVisit',
	mixins: [visitMixin],
	components: {
		notice,
		histForm,
		statsBack
	},
	data () {
		return {
			totalData: [
				{
					name: "浏览量(PV)",
					data: 0
				},
				{
					name: "访客数(UV)",
					data: 0
				},
				{
					name: "分享访问次数",
					data: 0
				},
				{
					name: "分享访问人数",
					data: 0
				},
				{
					name: "商品访问次数",
					data: 0
				},
				{
					name: "商品访问人数",
					data: 0
				}
			],
			searchForm: {
				start_time: "",
                end_time: "",
                choose_type: "H"
			},
			tableData: [],
			showSpin: true,
			jobIdCol:[],
			brandId: 0,
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
			this.brandName = query.brandName || ""
	},
	searchData(formData){
		
		this.searchForm = formData || this.searchForm;
		console.log("searchForm", this.searchForm)
		this.showSpin = true;
		util.ajax.post(util.apiUrl.histVisitView, {
			...this.searchForm,
			brand_id: this.brandId
		}).then(e =>{
			console.log(res);
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
	getFilterX(){
		let searchForm = this.searchForm;
		let start_time = searchForm.start_time || new Date();
		let end_time = searchForm.end_time || new Date();
		let XData = [];
		switch(searchForm.choose_type){
			case "H":
				for(let i = 0; i < 24; i++){
					XData.push(i);
				}
				break;
			case "D":
				let startDate = Date.parse(start_time);
				let endDate = Date.parse(end_time);
				let _date = startDate;
				let limitTime = 24 * 60 * 60 * 1000;
				while(_date < endDate || _date == endDate){
					XData.push(vueUtils.format(new Date(_date), "MM-dd"));
					_date = _date + limitTime;
				}
				break;
			case "M":
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
		let dataChart = echarts.init(document.getElementById("dataChart"));
		let legend_title = [], list_data = [];
		let xData = this.getFilterX();
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
			tooltip : {
				trigger: 'axis',
				formatter:'<div class="echart_formatter"><ul>\
				<li class="tit">{a0}</li>\
				<li class="val">{c0}</li>\
				<li class="tit">{a1}</li>\
				<li class="val">{c1}</li>\
				<li class="tit">{a2}</li>\
				<li class="val">{c2}</li></ul>\
				<ul><li class="tit">{a3}</li>\
				<li class="val">{c3}</li>\
				<li class="tit">{a4}</li>\
				<li class="val">{c4}</li>\
				<li class="tit">{a5}</li>\
				<li class="val">{c5}</li>\
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
				'#28a6ff', '#ff8439','#34a905','#00b3b5','#7053b6','#dc0fe4'
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
		dataChart.setOption(option); 
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
				return this.$ajax.post(this.$api.hisVisitExport,{
					...this.searchForm,
					brand_id: this.brandId
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

