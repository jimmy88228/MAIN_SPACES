<style lang="less">
  @import "./member.less";
</style>
<template>
	<div class="save-dashboard">
		<div class="p-right-15 p-top-15 flex f-just-end">
			<Button type="primary" @click="saveToImg()">
				<Icon type="md-cloud-download" />&nbsp;保存为图片
			</Button>
		</div>
		<Card class="member-dashboard area-block" id="saveDashboard">
			<div class="user-board-page">
			<div class="user-board-page-l">
				<div class="chart-item map-chart-item">
				<div class="chart-item-t">全国数据地图</div>
				<div class="map-chart-title">会员总数</div>
				<div class="chart-item-c">
					<div class="map-chart" id="mapChart"></div>
					<div class="map-chart-statistics " style="margin-left:70px;" v-html="dataTotal.map"></div>
				</div>
				</div>
				<div class="formatter-prov">
				<div class="formatter-prov-t">省份</div>
				<dl class="formatter-prov-c">
					<dt class="prov-head">
					<div class="prov-head-l fl">城市</div>
					<div class="prov-head-r fr">会员数(人)</div>
					</dt>
					<dd class="prov-cont">
					<div v-if="mapHoverHtml" v-html="mapHoverHtml"></div>
					<div v-else class="prov-cont-stay">请选择省市</div>
					</dd>
				</dl>
				</div>
				<div class="chart-item store-rang">
				<div class="chart-item-t">店铺会员总数排行</div>
				<div class="chart-item-c">
					<div class="chart-item-c-t">排名</div>
					<ul class="store-rang-list" id="storeRangList" v-html="storeRangList"></ul>
				</div>
				</div>
			</div>
			<div class="user-board-page-r">
				<div class="user-board-meber-lack-pie">
				<div class="chart-item lack-pie-item">
					<div class="chart-item-t">会员来源</div>
					<div class="chart-item-c">
					<div class="chart-item-c-t">会员来源</div>
					<div class="memberSource" id="memberSource">
					</div>
					</div>
				</div>
				<div class="chart-item lack-pie-item memberbehavior">
					<div class="chart-item-t">会员行为</div>
					<div class="chart-item-c behavior-lack-pie">
					<div class="chart-item-c-tit">
						<div class="chart-item-c-t">活跃度</div>
						<div class="chart-item-c-t">消费频次</div>
					</div>
					<div class="memberActive" id="memberActive">
					</div>

					<div class="memberConsume" id="memberConsume">
					</div>
					</div>
				</div>
				</div>
				<div class="user-board-meber-pie-bar">
				<div class="user-board-meber-pie">
					<div class="chart-item">
					<div class="chart-item-t">性别分布</div>
					<div class="chart-item-c">
						<div class="memberSex" id="memberSex"></div>
					</div>
					</div>
					<div class="chart-item">
					<div class="chart-item-t">会员等级</div>
					<div class="chart-item-c">
						<div class="memberLevel" id="memberLevel"></div>
					</div>
					</div>
					<div class="chart-item">
					<div class="chart-item-t">绑定手机</div>
					<div class="chart-item-c">
						<div class="bindPhone" id="bindPhone"></div>
					</div>
					</div>
					<div class="chart-item">
					<div class="chart-item-t">关注服务号</div>
					<div class="chart-item-c">
						<div class="followPublic" id="followPublic"></div>
					</div>
					</div>
				</div>
				<div class="user-board-meber-bar">
					<div class="board-meber-bar-t">
					<div class="board-meber-bar-t-l">
						<div class="chart-item">
						<div class="chart-item-t">年龄分布</div>
						<div class="memberAge-statistics oh">
							<div class="memberAge-statistics-stay item-t-f-area" v-html="dataTotal.memberAge"></div>
						</div>
						<div class="chart-item-c">
							<div class="memberAge" id="memberAge"></div>
						</div>
						</div>
					</div>
					<div class="board-meber-bar-t-r">
						<div class="chart-item">
						<div class="chart-item-t">生日分布
							<div v-html="dataTotal.memberBirthday" class="item-t-f-area"></div>
						</div>
						<div class="chart-item-c">
							<div class="memberBirthday" id="memberBirthday"></div>
						</div>
						</div>
						<div class="chart-item">
						<div class="chart-item-t">星座分布
							<div v-html="dataTotal.memberConstellation" class="item-t-f-area"></div>
						</div>
						<div class="chart-item-c">
							<div class="memberConstellation" id="memberConstellation"></div>
						</div>
						</div>
					</div>
					</div>
					<div class="board-meber-bar-f">
					<div class="chart-item">
						<div class="chart-item-t">会龄分布</div>
						<div class="chart-item-c">
						<div class="joinAge" id="joinAge"></div>
						</div>
					</div>
					</div>
				</div>
				</div>
			</div>
			</div>
		</Card>
	</div>
</template>

<script>
import util from '@/libs/util.js';
// import echarts from 'echarts/dist/echarts.min.js';
import echarts from 'echarts';
import china from 'echarts/map/json/china.json';
echarts.registerMap('china', china);
import map from './mixins/map.js';
import html2canvas from 'html2canvas';
export default {
  name: 'memberDashboard',
  mixins: [ map ],
  components: {
  },
  data () {
    return {
		mapData: {},
		storeData: [],
		userData: {},
		mapHoverHtml: "",
		dataTotal:{},

		memberLevel: null,
		memberAge: null,
		storeRangList: null,
		mapChart: null,
		memberSex: null,
		bindPhone: null,
		followPublic: null,
		memberConstellation: null,
		joinAge: null,
		memberSource: null,
		memberActive: null,
		memberConsume: null,
		memberBirthday: null
    }
  },
  mounted(){
	 this.getData().then(()=>{
		this.initData();
		this.initMap(this.mapData);
		this.initStoreRank(this.storeData);
		this.initMemberDate(this.userData);
	})
  },
  methods: {
    initData(){
      	let load = {
			text :'',
			color:'#28A5FF',
			maskColor:'rgba(255, 255, 255, 0)'
		}
		//
		this.memberLevel = echarts.init(document.getElementById('memberLevel'));
		// // memberLevel.showLoading(load);
		// //
		this.memberAge = echarts.init(document.getElementById('memberAge'));
		// // memberAge.showLoading(load);
		// //
		// this.storeRangList = echarts.init(document.getElementById('storeRangList'));
		// // storeRangList.showLoading(load);
		// //
		this.mapChart = echarts.init(document.getElementById('mapChart'));
		// // mapChart.showLoading(load);
		// //
		this.memberSex = echarts.init(document.getElementById('memberSex'));
		// memberSex.showLoading(load);
		//
		this.bindPhone = echarts.init(document.getElementById('bindPhone'));
		// bindPhone.showLoading(load);
		//
		this.followPublic = echarts.init(document.getElementById('followPublic'));
		// followPublic.showLoading(load);
		//
		this.memberConstellation = echarts.init(document.getElementById('memberConstellation'));
		// memberConstellation.showLoading(load);
		//
		this.joinAge = echarts.init(document.getElementById('joinAge'));
		// joinAge.showLoading(load);
		//
		this.memberSource = echarts.init(document.getElementById('memberSource'));
		// memberSource.showLoading(load);
		//
		this.memberActive = echarts.init(document.getElementById('memberActive'));
		// memberActive.showLoading(load);
		//
		this.memberConsume = echarts.init(document.getElementById('memberConsume'));
		// memberConsume.showLoading(load);
		//
		this.memberBirthday = echarts.init(document.getElementById('memberBirthday'));
		// memberBirthday.showLoading(load);
		window.addEventListener('resize', () => {
			this.memberLevel && this.memberLevel.resize();
			this.memberAge && this.memberAge.resize();
			this.store_rang_list && this.store_rang_list.resize();
			this.mapChart && this.mapChart.resize();
			this.memberSex && this.memberSex.resize();
			this.bindPhone && this.bindPhone.resize();
			this.followPublic && this.followPublic.resize();
			this.memberConstellation && this.memberConstellation.resize();
			this.joinAge && this.joinAge.resize();
			this.memberSource && this.memberSource.resize();
			this.memberActive && this.memberActive.resize();
			this.memberConsume && this.memberConsume.resize();
			this.memberBirthday && this.memberBirthday.resize();
		}, false)
	},
	getData(){
		this.showSpin = true;
		return util.ajax.post(util.apiUrl.dataBoard,{
			pageSize: 10
		}).then(e =>{
			console.log("结果",e)
			let res = e.data || {};
			if(res.code) {
				let data = res.data || {};
				this.mapData = data.map_data || {};
				this.storeData = data.store_data || [];
				this.userData = data.user_data || {};
				return Promise.resolve();
			}
			return Promise.reject();
		}).finally(()=>{
			this.showSpin = false
		})
	},
    initMap:function(data){
		let that = this;
		data = data || {}
		let user_count = data.user_count;
		let provinceEntities = data.provinceEntities;
		let cityData = [];
		let provData = [];
		let min_c = 0, max_c = 0, min_p = 0, max_p = 0;
		let know_meber = 0;
		for(let  i in provinceEntities){
			let City_data = provinceEntities[i].CityEntities;
			//获取省最大值
			if(max_p < provinceEntities[i].user_sum){
				max_p = provinceEntities[i].user_sum
			}
			let map_item = {
				"name" : provinceEntities[i].province_name,
				"value" : provinceEntities[i].user_sum,
			}
			know_meber += provinceEntities[i].user_sum;
			for(let j in City_data){
				if((j*i) == 0){
					min_c = City_data[j].user_sum;
					max_c = City_data[j].user_sum;
				}else{
					//
					if(min_c > City_data[j].user_sum){
						min_c = City_data[j].user_sum;
					}
					if(max_c < City_data[j].user_sum){
						max_c = City_data[j].user_sum;
					}
				}
				cityData.push({
					"name": City_data[j].city_name,
					"value": City_data[j].user_sum,
				});
			}
			provData.push(map_item);
		}
		let option = {
			title:{
				text: user_count,
				textStyle:{
					color: '#3CA1CB',
					fontSize: 50,
				},
				top:30,
			},
			tooltip:{},
			color:["#36A1CD"],
			legend:{
				textStyle:{
					color:'#36A1CD'
				},
			},
			trigger:{
				trigger: 'item',
				formatter: '{b}'
			},
			grid: {
				top:'1%',
				left: '1%',
				right: '1%',
				bottom: '1%',
				containLabel: true
			},
			visualMap: {
				type:"continuous",
				min: 0,
				max: max_p,
				left: 'left',
				bottom: 50,
				show: true,
				calculable: false,
				text: ['高','低'],
				color:['#005cc5','#55bbfb'],
				textStyle:{
					color:'#3CA1CB'
				}
			},
			animation:true,
			animationDurationUpdate:1000,
			animationEasingUpdate: 'cubicInOut',
			geo: {
				map: 'china',
				zoom: 1.1,
				nameMap: {
					'China': '中国'
				},
				label: {
					normal: {
						show: true,
					},
					emphasis:{
						show:true,
						textStyle: {
							color: '#fff'
						}
					},
				},
				itemStyle: {
					normal: {
						areaColor: '#55C2FB',
						borderColor: '#005cc5'
					},
					emphasis: {
						areaColor: '#fcb928'
					}
				}
			},
			series:[
			{
				name: '会员数',
				type: 'map',
				coordinateSystem: 'geo',
				geoIndex: 0,
				tooltip: {
					show: true,
					formatter:function(v){
						let seriesName = v.seriesName;
						let name = v.name;
						let value = v.value;
						if(isNaN(value)){
							value = 0
						}
						let dataindex = v.dataIndex;
						let prov_data = provinceEntities[dataindex];
						let html="",prov_t="";

						if(prov_data){
							prov_t = prov_data['province_name'];
							let city_data = prov_data['CityEntities'];
							for( let i in city_data ){
								html += '<div class="prov-cont-line flex f-just-between">\
											<div >'+city_data[i].city_name+'</div>\
											<div class="c-49BFE3">'+city_data[i].user_sum+'</div>\
										</div>';
							}
						}else{
							prov_t = "省份";
							html = '<div class="prov-cont-stay text-c">没有数据！</div>';
						}
						that.mapHoverHtml = html;
						return seriesName +"\n"+name+" : "+value ;
					}
				},
				data:convertData(provData),
			}
			]
		}

		this.setOption(option, this.mapChart);
		//设置已知未知
		let know_m_pre = (know_meber/user_count)*100;
		let unknow_meber = user_count - know_meber;
		let unknow_m_pre = 100 - know_m_pre;
		setKnowHtml.call(this,know_meber,know_m_pre,unknow_meber,unknow_m_pre,'map');
	},
	initStoreRank (data){
		let html="";
		for(let i in data){
			html += '<li class="store-rang-item clearfix">\
						<span class="rang-sort">'+data[i].sort+'</span>\
						<span class="rang-store_name">'+data[i].store_name+'</span>\
						<span class="rang-val c-49BFE3">'+data[i].user_sum+'</span>\
					</li>';
		}
		this.storeRangList = html;
		console.log("233",this.storeRangList);
	},
	initMemberDate:function(data){
		//参数: type_code: 数据类型，1性别，2等级，3年龄，4生日，5星座，6会龄，7来源，8是否关注服务号，9是否绑定手机，10活跃度，11消费频次
		let type_code_txt=["性别分布","会员等级","年龄分布","生日分布","星座分布","会龄分布","会员来源","关注服务号","是否绑定手机","活跃度","消费频次"];
		let typeList = data.typeList;
		for(let i = 0; i < typeList.length; i++){
			let type_item = typeList[i];
			let type_code = type_item.type_code;
			let detailList = type_item.detailList;
			let echart_item = null, color = "", pie_color = "", this_detailList = {}, code_option = {};
			let x_name = [], x_data = [], unknow_item = {};
			console.log("type_code", type_code);
			switch(type_code){
				/*饼形图*/
				case 1: //性别分布
					echart_item = this.memberSex;
					color= ['#36A1CD','#FF9F00','#D00C78'];
				case 2: //会员等级
					echart_item = echart_item ? echart_item : this.memberLevel;
				case 8: //是否关注服务号
					color= color ? color : ['#49C153','#02A611'];
					echart_item = echart_item ? echart_item : this.followPublic;
				case 9: //是否绑定手机
					color= color? color : ['#053C7F','#4EBCE1'];
					echart_item = echart_item ? echart_item : this.bindPhone;
					let o_name = [];
					let o_data = [];
					this_detailList = detailList;
					for(let j in this_detailList){
						o_name.push({
							"name": this_detailList[j].key_name,
							"icon": 'circle'
						});
						o_data.push({
							'name': this_detailList[j].key_name,
							'value': this_detailList[j].value,
						})
					}
					//设置option
					code_option = {
						tooltip: {
							trigger: 'item',
							formatter: "{a} <br/>{b}: {c} ({d}%)"
						},
						legend: {
							type: 'scroll',
							orient: 'vertical',
							right:'5',
							itemWidth:10,
							itemHeight:10,
							data: o_name,
							formatter:function(v){
								let legend_n,legend_v;
								for(let k in this_detailList){
									if(this_detailList[k].key_name == v){
										legend_n = this_detailList[k].key_name;
										legend_v = this_detailList[k].value;
										break;
									}
								}
								let arr = [
									'{a|'+legend_n+'}',
									'{b|'+legend_v+'}',
								]
								return arr.join('\n')
							},
							textStyle:{
								rich:{
									a:{

										verticalAlign:'top',
										color:'#fff',
										padding:[2,0]
									},
									b:{
										fontSize:14,
										color:'#4CBDE0',
										padding:[2,0]
									}
								}
							}

						},
						grid: {
							left: '1%',
							right: '1%',
							bottom: '1%',
							containLabel: true
						},
						color: color,
						series:[{
							name: type_code_txt[type_code-1],
							type: 'pie',
							radius : '55%',
							center: ['35%', '50%'],
							label:{
								show:false,
								color:'#fff',
								fontSize:15,
								position:'inside',
								formatter:function(v){
									let dataIndex = v.dataIndex;
									let proportion = this_detailList[dataIndex].proportion;
									return proportion+'%';
								},
							},
							data: o_data
						}],
					}
					if( type_code == '2'){
						delete code_option.color;
					}
					this.setOption(code_option,echart_item);
					break;
				case 3://年龄分布
					x_name = [];
					x_data = [];
					this_detailList = detailList;
					unknow_item = this_detailList[0];
					this_detailList.splice(0,1);
					for(let j in this_detailList){
						let name = this_detailList[j].key_name;
						x_name.push(name);
						x_data.push(this_detailList[j].value);
					}
					color = new echarts.graphic.LinearGradient(1, 0, 0, 0,[//左，下，右，上
							{offset: 0, color: '#4ebce1'},
							{offset: 1, color: '#107eaf'}
						]
					)
					//设置未知已知
					let unknow_val = parseInt(unknow_item.value);
					let unknow_pre = parseFloat(unknow_item.proportion);
					let all_val = Math.round(unknow_val / (unknow_pre/100));
					let known_val = all_val - unknow_val;
					let known_pre = (1 - (unknow_pre/100))*100;
					setKnowHtml.call(this, known_val,known_pre,unknow_val,unknow_pre,'memberAge');
					code_option={
						tooltip: {
							trigger: 'item',
							formatter: function(v){
								let seriesName = v.seriesName;
								let dataIndex = v.dataIndex;
								let name = v.name;
								let value = v.value;
								let proportion = "";
								if(known_val > 0){
									proportion = ((this_detailList[dataIndex].value / known_val) * 100).toFixed(2);//按照数据占有已知数据比例计算
								}else{
									proportion = 0
								}

								return seriesName + "<br/>" +name+ ": "+value+" (" +proportion+"%)";
							}
						},
						grid: {
							top: '1%',
							left: '1%',
							right: '16%',
							bottom: '1%',
							containLabel: true
						},
						xAxis: {

							show:true,
							type : 'value',
							axisLine:{
								show:false,
							},
							axisLabel:{
								show:false,
							},
							splitLine:{
								show:false,
								lineStyle:{
									color:'#3a5065',
									width:1,
									type:'dotted'
								}
							}
						},
						yAxis: {
							data: x_name,
							axisLabel: {
								color:'#fff',
							},
							axisLine:{
								show:false,
							},
							splitLine:{
								show:false
							},
							z: 10,
						},
						// dataZoom: [{
						//       type: 'inside'
						// }],
						series:[{
								name: type_code_txt[type_code-1],
								type: 'bar',
								itemStyle:{
									color: color,
									barBorderRadius:100
								},
								barWidth: 10,
								data: x_data,
								label: {
									color:'#107DAD',
									show:true,
									position: 'right',
									formatter:function(v){
										let dataIndex = v.dataIndex;
										let proportion = "";
										let this_value = this_detailList[dataIndex].value
										if(known_val > 0){
											proportion = ((this_value / known_val) * 100).toFixed(2);
										}else{
											proportion = 0;
										}
										return proportion+'%';
									}
								},
							}]
					}
					this.setOption(code_option,this.memberAge);
					break;
				/*条形图*/
				case 4://生日分布
					echart_item = this.memberBirthday;
					if(!color){
						color = new echarts.graphic.LinearGradient(0, 0, 0, 1,[
								{offset: 0, color: '#D1147A'},
								{offset: 1, color: '#7B1188'}
							]
						)
					}
				case 5://星座分布
					echart_item = echart_item ? echart_item : this.memberConstellation;
					if(!color){
						color = new echarts.graphic.LinearGradient(0, 0, 0, 1,[
								{offset: 0, color: '#4ebce1'},
								{offset: 1, color: '#107eaf'}
							]
						)
					}
				case 6://会龄
					echart_item = echart_item ? echart_item : this.joinAge;
					if(!color){
						color = new echarts.graphic.LinearGradient(0, 0, 0, 1,[
								{offset: 0, color: '#F46E26'},
								{offset: 1, color: '#AE1E83'}
							]
						)
					}
					x_name = [];
					x_data = [];
					unknow_item = {};
					if(type_code == 4 || type_code == 5 ){
						unknow_item = detailList[0];
						detailList.splice(0,1);
						let unknow_val = parseInt(unknow_item.value);
						let unknow_pre = parseFloat(unknow_item.proportion);
						let all_val = Math.round(unknow_val / (unknow_pre/100));
						let known_val = all_val - unknow_val;
						let known_pre = (1 - (unknow_pre/100))*100;
						// let dom = echart_item._dom;
						// let chart_item = $(dom).parents(".chart_item:first");
						// let chart_item_t = chart_item.find(".chart_item_t");
						let key = type_code == 4 ? 'memberBirthday' : 'memberConstellation';
						setKnowHtml.call(this,known_val,known_pre,unknow_val,unknow_pre, key);

					}
					this_detailList = detailList;
					for(let j in this_detailList){
						let name = this_detailList[j].key_name.replace(new RegExp('座'),"");
						x_name.push(name);
						x_data.push(this_detailList[j].value);
					}
					code_option={
						tooltip: {
							trigger: 'item',
							formatter: function(v){

								let seriesName = v.seriesName;
								let dataIndex = v.dataIndex;
								let name = v.name;
								let value = v.value;
								let proportion = ""
								if(known_val){
									proportion = ((this_detailList[dataIndex].value / known_val) * 100).toFixed(2);//按照数据占有已知数据比例计算
								}else{
									proportion = this_detailList[dataIndex].proportion;//接口返回数据占总数据比例
								}
								return seriesName + "<br/>" +name+ ": "+value+" (" +proportion+"%)";
							}
						},
						grid: {
							top: '1%',
							left: '1%',
							right: '1%',
							bottom: '1%',
							containLabel: true
						},
						xAxis: {
							data: x_name,
							axisLabel: {
								color:'#fff',
							},
							z: 10,
						},
						yAxis: {
							show:true,
							type : 'value',
							axisLine:{
								show:false,
							},
							axisLabel:{
								show:false,
							},
							splitLine:{
								show:true,
								lineStyle:{
									color:'#3a5065',
									width:1,
									type:'dotted'
								}
							}
						},
						// dataZoom: [{
						//       type: 'inside'
						// }],
						series:[{
								name: type_code_txt[type_code-1],
								type: 'bar',
								itemStyle:{
									color: color,
									barBorderRadius:100
								},
								barWidth: 10,
								data: x_data
							}]
					}
					if(type_code == 6){
						// console.log(this_detailList);
						code_option.xAxis.axisLabel.interval=0;
						code_option.xAxis.axisLabel.rotate=40;
					}
					this.setOption(code_option,echart_item);
					break;
				/*饼状图*/
				case 7://会员来源
					echart_item = this.memberSource;
					pie_color= pie_color ? pie_color : ['#056099','#4EBEE5','#053C78','#1580A6'];
				case 10://活跃度
					echart_item = echart_item ? echart_item : this.memberActive;
					pie_color= pie_color ? pie_color : ['#54018D','#B106A0','#D70976','#D80A79','#FE7603','#FF9E03','#411394'];
				case 11://消费频次
					echart_item = echart_item ? echart_item : this.memberConsume;
					pie_color= pie_color ? pie_color : ['#FE7A07','#D70878','#AA0894','#780092','#411394'];
					x_name = [];
					x_data = [];
					this_detailList = detailList;
					for(let j in this_detailList){
						x_name.push({
							"name": this_detailList[j].key_name,
							"icon": 'circle'
						});
						x_data.push({
							'name': this_detailList[j].key_name,
							'value': this_detailList[j].value,
							// 'selected': j == 0
						});
					}
					code_option = {
						tooltip: {
							show:false,
							trigger: 'item',
							formatter: "{a} <br/>{b}: {c} ({d}%)"
						},
						legend: {
							orient: 'vertical',
							top: 'middle',
							right:'10',
							itemWidth:10,
							itemHeight:10,
							data: x_name,
							formatter:function(v){
								let legend_n,legend_p,legend_v;
								for(let k in this_detailList){
									if(this_detailList[k].key_name == v){
										legend_n = this_detailList[k].key_name;
										legend_p = this_detailList[k].proportion;
										legend_v = this_detailList[k].value;
										break;
									}
								}
								let arr = [];
								if(type_code == 11){
									arr =[
										'{a|'+legend_n+'}',
										'{b|'+legend_v+'}',
									]
								}else{
									arr = [
										'{a|'+legend_n+'}',
										'{b|'+legend_p+'%}',
									]
								}
								return arr.join('\t\t\t')
							},
							textStyle:{
								rich:{
									a:{
										verticalAlign:'top',
										color:'#fff',
										padding:[2,0]
									},
									b:{
										fontSize:14,
										color:'#4CBDE0',
										padding:[2,0]
									}
								}
							},
							// tooltip:{
							// 	show:true
							// }
						},
						color: pie_color,
						series: [
							{
								name: type_code_txt[type_code-1],
								// stack: type_code_txt[type_code-1],
								type:'pie',
								center:['30%','50%'],
								radius: ['35%', '55%'],
								avoidLabelOverlap: false,
								label: {
									show: false,
									position:'center',
									color:'#fff',
									fontSize:'14'
								},
								emphasis:{
									label:{
										show:true,
										formatter:function(v){
											let name = v.name;
											let percent = v.percent;
											let value = v.value;
											return name + "\n" +value+"\t("+percent+"%)";
										}
									}
								},
								labelLine: {
									normal: {
										show: false
									}
								},
								data: x_data
							}
							]
					}
					this.setOption(code_option,echart_item);
					break;
				}
		}

	},
	setOption(setOption,chartItem){
		if(setOption){
			chartItem.setOption(setOption);
		}

	},
	saveToImg(){
		html2canvas(document.querySelector("#saveDashboard"),{
			allowTaint: false,
			backgroundColor: "transparent",
			useCORS: true
		}).then(canvas => {
			// 转成图片，生成图片地址
			let imgUrl = canvas.toDataURL("image/png");
			let a = document.createElement("a");
			a.style.display = "none";
			a.download = "会员看板数据图";
			a.href = imgUrl;
			a.click();
		});
	}
  },
}
//get 已知，未知
function setKnowHtml(known_val,known_pre,unknow_val,unknow_pre,item){
	known_pre = known_pre.toFixed(2);
	unknow_pre = unknow_pre.toFixed(2);
	let unknow_html = '<div class="chart-item-t-f">\
		<span>未知</span>\
		<span class="c-49BFE3">'+unknow_val+'('+unknow_pre+'%)</span>\
		</div>';
	let known_html = '<div class="chart-item-t-f">\
		<span>已知</span>\
		<span class="c-49BFE3">'+known_val+'('+known_pre+'%)</span>\
		</div>';
		this.$nextTick().then(() => {
			this.$set(this.dataTotal, item, unknow_html + known_html)
			console.log("dataTotal", this.dataTotal);
		})
}
//
function convertData (data) {
	let res = [];
	for (let i = 0; i < data.length; i++) {
		let name = data[i].name.replace(/省|市/g,'');
		if (name) {
			res.push({
				name: name,
				value: data[i].value
			});
		}
	}
	console.log(res);
	return res;
}
</script>

