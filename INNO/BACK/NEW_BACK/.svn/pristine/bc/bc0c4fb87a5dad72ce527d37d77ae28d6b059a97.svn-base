<template>
	<div class="data_view_area" v-if="showDataView" id="groupMessageChart">
		<div class="area_block user_board_page clearfix">
			<div class="user_board_page_t_l clearfix">
				<div class="user_board_page_l clearfix">
					<div class="chart_item map_chart_item">
						<div class="chart_item_t c_7f7f7f">全国数据地图</div>
						<div class="map_chart_title">会员总数</div>
						<div class="chart_item_c">
							<div class="map_chart" id="mapChart"></div>
							<div class="map_chart_statistics"></div>
						</div>
						<!--地图指示-->
						<!-- <div class="formatter_prov">
							<div class="formatter_prov_t">{{hover_map_data.prov_t ? hover_map_data.prov_t : '省份'}}</div>
							<dl class="formatter_prov_c">
								<dt class="prov_head clearfix">
									<div class="prov_head_l fl">城市</div>
									<div class="prov_head_r fr">会员数(人)</div>
								</dt>
								<dd class="prov_cont">
									<div class="clearfix prov_cont_line" v-for="(h_item , h_index) in hover_map_data.city_data" :key="h_index">
										<div class="fl">{{h_item.city_name}}</div>
										<div class="fr">{{h_item.user_sum}}</div>
									</div>
									<div class="prov_cont_stay" v-if="hover_map_data.city_data == 0">请选择省市</div>
								</dd>
							</dl>
						</div> -->
					</div>
				</div>
				<div class="user_board_page_r">
					<div class="clearfix" v-if="!is_small_w">
						<div class="w_33 clearfix fl">
							<div class="chart_item">
								<div class="chart_item_t c_7f7f7f">性别分布</div>
								<div class="chart_item_c">
									<!-- <div class="chart_item_c_t"></div> -->
									<div class="memberSex" id="memberSex"></div>
								</div>
							</div>
						</div>
						<div class="w_33 clearfix fl">
							<div class="chart_item">
								<div class="chart_item_t c_7f7f7f">会员等级</div>
								<div class="chart_item_c">
									<!-- <div class="chart_item_c_t"></div> -->
									<div class="memberLevel" id="memberLevel"></div>
								</div>
							</div>
						</div>
						<div class="w_33 clearfix fl">
							<div class="chart_item">
								<div class="chart_item_t c_7f7f7f">绑定手机</div>
								<div class="chart_item_c">
									<!-- <div class="chart_item_c_t"></div> -->
									<div class="bindPhone" id="bindPhone"></div>
								</div>
							</div>
						</div>
					</div>
					<div class="user_board_meber_lack_pie clearfix">
						<div class="w_33 clearfix fl member_activity_area">
							<div class="chart_item">
								<div class="chart_item_t c_7f7f7f">活跃度</div>
								<div class="chart_item_c">
									<!-- <div class="chart_item_c_t"></div> -->
									<div class="memberActive" id="memberActive"></div>
								</div>
							</div>
						</div>
						<div class="w_33 clearfix fl consum_frequency_area">
							<div class="chart_item">
								<div class="chart_item_t c_7f7f7f">消费频次</div>
								<div class="chart_item_c">
									<!-- <div class="chart_item_c_t"></div> -->
									<div class="memberConsume" id="memberConsume"></div>
								</div>
							</div>
						</div>
						<div class="w_33 clearfix fl" v-if="!is_small_w">
							<div class="chart_item">
								<div class="chart_item_t c_7f7f7f">关注服务号</div>
								<div class="chart_item_c">
									<!-- <div class="chart_item_c_t"></div> -->
									<div class="followPublic" id="followPublic"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!--小屏-->
			<div class="clearfix" v-if="is_small_w">
				<div class="w_33 clearfix fl">
					<div class="chart_item">
						<div class="chart_item_t c_7f7f7f">性别分布</div>
						<div class="chart_item_c">
							<!-- <div class="chart_item_c_t"></div> -->
							<div class="memberSex" id="memberSex"></div>
						</div>
					</div>
				</div>
				<div class="w_33 clearfix fl">
					<div class="chart_item">
						<div class="chart_item_t c_7f7f7f">会员等级</div>
						<div class="chart_item_c">
							<!-- <div class="chart_item_c_t"></div> -->
							<div class="memberLevel" id="memberLevel"></div>
						</div>
					</div>
				</div>
				<div class="w_33 clearfix fl">
					<div class="chart_item">
						<div class="chart_item_t c_7f7f7f">绑定手机</div>
						<div class="chart_item_c">
							<!-- <div class="chart_item_c_t"></div> -->
							<div class="bindPhone" id="bindPhone"></div>
						</div>
					</div>
				</div>
			</div>

			<!--数据中-->
			<div class="user_board_page_m clearfix">
				<div class="user_board_page_m_l w_40 fl clearfix">
					<div class="user_board_page_m_l_l" v-if="is_small_w">
						<div class="chart_item">
							<div class="chart_item_t c_7f7f7f">关注服务号</div>
							<div class="chart_item_c">
								<!-- <div class="chart_item_c_t"></div> -->
								<div class="followPublic" id="followPublic"></div>
							</div>
						</div>
					</div>
					<div class="user_board_page_m_l_r">
						<div class="chart_item">
							<div class="chart_item_t c_7f7f7f">生日分布</div>
							<div class="chart_item_c">
								<div class="memberBirthday" id="memberBirthday"></div>
							</div>
						</div>
					</div>
				</div>
				<div class="user_board_page_m_r w_60 fl clearfix">
					<div class="chart_item">
						<div class="chart_item_t c_7f7f7f">星座分布</div>
						<div class="chart_item_c">
							<div class="memberConstellation" id="memberConstellation"></div>
						</div>
					</div>
				</div>
			</div>


			<!--数据尾-->
			<div class="user_board_page_b clearfix">
				<div class="user_board_page_b_l w_40 fl clearfix">
					<div class="chart_item">
						<div class="chart_item_t c_7f7f7f">最近消费(R)</div>
						<div class="chart_item_c clearfix">
							<!-- <div class="chart_item_c_t">会员来源</div> -->
							<div class="latelyConsum" id="latelyConsum">
							</div>
						</div>
					</div>
				</div>
				<div class="user_board_page_b_r w_60 fl clearfix">
					<div class="middle_w fl">
						<div class="chart_item">
							<div class="chart_item_t c_7f7f7f">消费频次(F)</div>
							<div class="chart_item_c clearfix">
								<!-- <div class="chart_item_c_t"></div> -->
								<div class="consumFrequency" id="consumFrequency"></div>
							</div>
						</div>
					</div>
					<div class="middle_w fl">
						<div class="chart_item">
							<div class="chart_item_t c_7f7f7f">消费金额(M)</div>
							<div class="chart_item_c clearfix">
								<!-- <div class="chart_item_c_t"></div> -->
								<div class="consumAmount" id="consumAmount"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!--数据尾-->
			<div class="user_board_page_b clearfix">
				<div class="user_board_page_b_l clearfix">
					<div class="chart_item">
						<div class="chart_item_t c_7f7f7f">年龄段消费</div>
						<div class="chart_item_c clearfix">
							<div class="ageConsum" id="ageConsum">
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import echarts from 'echarts';
	import china from 'echarts/map/js/china';
	import dataMixins from './data-mixins.js';
	export default {
		props: ['grounpId'],
		mixins:[dataMixins],
		data() {
			return {
				//
				showDataView: false,
				//初始化变量
				mapChart: "",
				memberSex: "",
				bindPhone: "",
				followPublic: "",
				memberLevel: "",
				// memberAge:"",
				// store_rang_list:"",
				memberConstellation: "",
				// joinAge:"",
				memberBirthday: "",
				memberBehavior: "",
				memberSource: "",
				memberActive: "",
				memberConsume: "",
				latelyConsum: "",
				ageConsum: "",
				consumFrequency: "",
				consumAmount: "",

				//
				hover_map_data: {
					prov_t: "",
					city_data: [],
				},
				//记录数据
				map_data: {},
				all_details_data: [],
				//判断窗口大小
				is_small_w: false,
			}
		},
		methods: {
			//
			initChartSize(){
				this.memberLevel && this.memberLevel.resize();
				this.mapChart && this.mapChart.resize();
				this.memberSex && this.memberSex.resize();
				this.bindPhone && this.bindPhone.resize();
				this.followPublic && this.followPublic.resize();
				this.memberConstellation && this.memberConstellation.resize();
				this.memberActive && this.memberActive.resize();
				this.memberConsume && this.memberConsume.resize();
				this.memberBirthday && this.memberBirthday.resize();
				this.latelyConsum && this.latelyConsum.resize();
				this.consumFrequency && this.consumFrequency.resize();
				this.consumAmount && this.consumAmount.resize();
				this.ageConsum && this.ageConsum.resize();
			},
			convertData(data) {
				var res = [];
				for (var i = 0; i < data.length; i++) {
					var geoCoord = this.geoCoordMap[data[i].name];
					if (geoCoord) {
						res.push({
							name: data[i].name,
							value: geoCoord.concat(data[i].value)
						});
					}
				}
				return res;
			},
			initEchartId() {
				//
				this.memberLevel = this.memberLevel || echarts.init(document.getElementById('memberLevel'));
				//
				this.mapChart = this.mapChart || echarts.init(document.getElementById('mapChart'));
				//
				this.memberSex = this.memberSex || echarts.init(document.getElementById('memberSex'));
				//

				this.bindPhone = this.bindPhone || echarts.init(document.getElementById('bindPhone'));
				//
				this.followPublic = this.followPublic || echarts.init(document.getElementById('followPublic'));
				//
				this.memberConstellation = this.memberConstellation || echarts.init(document.getElementById(
					'memberConstellation'));
				//
				this.memberActive = this.memberActive || echarts.init(document.getElementById('memberActive'));
				//
				this.memberConsume = this.memberConsume || echarts.init(document.getElementById('memberConsume'));
				//
				this.memberBirthday = this.memberBirthday || echarts.init(document.getElementById('memberBirthday'));
				//
				this.latelyConsum = this.latelyConsum || echarts.init(document.getElementById('latelyConsum'));
				//
				this.consumFrequency = this.consumFrequency || echarts.init(document.getElementById('consumFrequency'));
				//
				this.consumAmount = this.consumAmount || echarts.init(document.getElementById('consumAmount'));
				//
				this.ageConsum = this.ageConsum || echarts.init(document.getElementById('ageConsum'));
			},
			getDataAjax(id) {
				var that = this;
				//地图
				this.$ajax.post(this.$api.GetMemberGroupMap, {
					id: id
				}).then(function(response) {
					let res = response.data || {};
					if(res.code){
						let data = res.data || {};
						let info = data.message || {};
						that.map_data = info;
						that.initMap(info);
					}
				})
				//会员详情数据
				this.$ajax.post(this.$api.GetMemberGroupGetall, {
					id: id
				}).then(function(response) {
					let res = response.data || {};
					let resData = res.data || {};
					let msg = resData.message || {};
					if (msg.code == "1") {
						let data = msg.data;
						that.all_details_data = data.typeList;
						that.initMemberDate(data);
					}
				})
				this.$ajax.post(this.$api.GetMemberGroupBasicsumType).then(function(res) {
					var msg = res.data || {};
					if (msg.code == "1") {
						var typeCode = "";
						var list = msg.data || [];
						for (var i = 0; i < list.length; i++) {
							if (list[i].type_name == "年龄") {
								typeCode = list[i].type_code;
								break;
							}
						}
						return Promise.resolve(typeCode)
					}
					return Promise.reject();
				}).then((typeCode) => {
					that.getRfmReportByType(id, typeCode);
				})
			},
			getRfmReportByType(id, typeCode) {
				var that = this;
				this.$ajax.post(this.$api.getMemberGroupRfmReportByType, {
					groupId: id,
					typeCode: typeCode
				}).then(function(response) {
					let res = response.data || {};
					// let resData = res.data || {};
					let msg = res.data;
					if (msg.code == "1") {
						let data = msg.data;
						that.initAgeConsum(data);
					}
				})
			},
			initMap: function(data) {
				var that = this;
				var user_count = data.user_count;
				var provinceEntities = data.provinceEntities;
				var cityData = [];
				var provData = [];
				var min_c = 0,
					max_c = 0,
					min_p = 0,
					max_p = 0;
				var know_meber = 0;
				for (var i in provinceEntities) {
					var City_data = provinceEntities[i].CityEntities;
					//获取省最大值
					if (max_p < provinceEntities[i].user_sum) {
						max_p = provinceEntities[i].user_sum
					}
					var map_item = {
						"name": provinceEntities[i].province_name,
						"value": provinceEntities[i].user_sum,
					}
					know_meber += provinceEntities[i].user_sum;
					for (var j in City_data) {
						if ((j * i) == 0) {
							min_c = City_data[j].user_sum;
							max_c = City_data[j].user_sum;
						} else {
							//
							if (min_c > City_data[j].user_sum) {
								min_c = City_data[j].user_sum;
							}
							if (max_c < City_data[j].user_sum) {
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
				var option = {
					title: {
						text: user_count,
						textStyle: {
							color: '#3CA1CB',
							fontSize: 50,
						},
						top: 30,
					},
					tooltip: {},
					color: ["#36A1CD"],
					legend: {
						textStyle: {
							color: '#36A1CD'
						},

					},
					trigger: {
						trigger: 'item',
						formatter: '{b}'
					},
					grid: {
						top: '1%',
						left: '1%',
						right: '1%',
						bottom: '1%',
						containLabel: true
					},
					visualMap: {
						type: "continuous",
						min: 0,
						max: max_p,
						left: 'left',
						bottom: 50,
						show: true,
						calculable: false,
						text: ['高', '低'],
						color: ['#005cc5', '#55bbfb'],
						textStyle: {
							color: '#3CA1CB'
						}
					},
					animation: true,
					animationDurationUpdate: 1000,
					animationEasingUpdate: 'cubicInOut',
					geo: {
						map: 'china',
						label: {
							normal: {
								show: false,
							},
							emphasis: {
								show: true,
								textStyle: {
									color: '#fff'
								}
							},
						},
						// roam: true,
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
					series: [{
						name: '会员数',
						type: 'map',
						geoIndex: 0,
						tooltip: {
							show: true,
							formatter: function(v) {
								var seriesName = v.seriesName;
								var name = v.name;
								var value = v.value;
								if (isNaN(value)) {
									value = 0
								}
								var dataindex = v.dataIndex;
								var prov_data = provinceEntities[dataindex];
								var html = "",
									prov_t = "";
								if (prov_data) {
									that.hover_map_data.prov_t = prov_data['province_name'];
									that.hover_map_data.city_data = prov_data['CityEntities'];
								}
								return seriesName + "\n" + name + " : " + value;
							}
						},
						data: provData,
					}]
				}
				this.mapChart.setOption(option);
				this.mapChart.hideLoading();
				//设置已知未知
				var know_m_pre = (know_meber / user_count) * 100;
				var unknow_meber = user_count - know_meber;
				var unknow_m_pre = 100 - know_m_pre;
				// setKnowHtml(know_meber,know_m_pre,unknow_meber,unknow_m_pre,'.map_chart_statistics');

			},
			initMemberDate: function(data) {
				var that = this;
				//参数: type_code: 数据类型，1性别，2等级，3年龄，4生日，5星座，6会龄，7来源，8是否关注服务号，9是否绑定手机，10活跃度，11消费频次,12 最近消费（R）,13 消费频次（F）,14 消费金额（M）
				var type_code_txt = ["性别分布", "会员等级", "年龄分布", "生日分布", "星座分布", "会龄分布", "会员来源", "关注服务号", "是否绑定手机", "活跃度",
					"消费频次", "最近消费（R）", "消费频次（F）", "消费金额（M）"
				];
				var typeList = data.typeList;
				for (let i in typeList) {
					var type_item = typeList[i];
					var type_code = type_item.type_code;
					var detailList = type_item.detailList;
					(function() {
						switch (type_code) {
							/*饼形图*/
							case 1: //性别分布
								var echart_item = that.memberSex;
								var color = ['#FF9F00', '#D00C78', '#36A1CD'];
							case 2: //会员等级
								var echart_item = echart_item ? echart_item : that.memberLevel;
							case 9: //是否绑定手机
								var color = color ? color : ['#D00C78', '#FF9F00'];
								var echart_item = echart_item ? echart_item : that.bindPhone;
							case 14: //消费金额(M)
								var color = color ? color : ['#6F53B7', '#FA863A', '#34A805', '#F35A56',
								'#26A8FD'];
								var echart_item = echart_item ? echart_item : that.consumAmount;
								var o_name = [];
								var o_data = [];
								var this_detailList = detailList;
								for (let j in this_detailList) {
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
								var code_option = {
									tooltip: {
										trigger: 'item',
										formatter: "{a} <br/>{b}: {c} ({d}%)"
									},
									legend: {
										type: 'scroll',
										orient: 'vertical',
										right: '5',
										itemWidth: 10,
										itemHeight: 10,
										data: o_name,
										formatter: function(v) {
											var legend_n, legend_v;
											for (let k in this_detailList) {
												if (this_detailList[k].key_name == v) {
													legend_n = this_detailList[k].key_name;
													legend_v = this_detailList[k].value;
													break;
												}
											}
											var arr = [
												'{a|' + legend_n + '}',
												'{b|' + legend_v + '}',
											]
											return arr.join('\n')
										},
										textStyle: {
											rich: {
												a: {

													verticalAlign: 'top',
													color: '#333',
													padding: [2, 0]
												},
												b: {
													fontSize: 14,
													color: '#333',
													fontWeight: 'bold',
													padding: [2, 0]
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
									series: [{
										name: type_code_txt[type_code - 1],
										type: 'pie',
										radius: '58%',
										center: ['35%', '50%'],
										label: {
											show: false,
											color: '#fff',
											fontSize: 15,
											position: 'inside',
											formatter: function(v) {
												var dataIndex = v.dataIndex;
												var proportion = this_detailList[dataIndex]
													.proportion;
												return proportion + '%';
											},
										},
										data: o_data
									}],
								}
								//个别处理
								if (type_code == '2') {
									delete code_option.color;
								}
								if (that.is_small_w) {
									code_option.series[0].radius = '60%'
								}
								if (type_code == '14') {
									code_option.legend.left = '3%';
									code_option.legend.top = 'middle';
									code_option.legend.height = '90%';
									code_option.series[0].center = ['70%', '50%'];
									code_option.series[0].radius = '50%'
									if (that.is_small_w) {
										code_option.legend.left = '3%';
										code_option.series[0].radius = '50%'
									}
								}
								that.setOption(code_option, echart_item);
								break;
							case 3: //年龄分布
								var x_name = [];
								var x_data = [];
								var this_detailList = detailList;
								var unknow_item = this_detailList[0];
								this_detailList.splice(0, 1);
								for (let j in this_detailList) {
									var name = this_detailList[j].key_name;
									x_name.push(name);
									x_data.push(this_detailList[j].value);
								}
								var color = new echarts.graphic.LinearGradient(1, 0, 0, 0, [ //左，下，右，上
									{
										offset: 0,
										color: '#4ebce1'
									},
									{
										offset: 1,
										color: '#107eaf'
									}
								])
								//设置未知已知
								var unknow_val = parseInt(unknow_item.value);
								var unknow_pre = parseFloat(unknow_item.proportion);
								var all_val = Math.round(unknow_val / (unknow_pre / 100));
								var known_val = all_val - unknow_val;
								var known_pre = (1 - (unknow_pre / 100)) * 100;
								setKnowHtml(known_val, known_pre, unknow_val, unknow_pre,
									'.memberAge_statistics_stay');
								var code_option = {
									tooltip: {
										trigger: 'item',
										formatter: function(v) {
											var seriesName = v.seriesName;
											var dataIndex = v.dataIndex;
											var name = v.name;
											var value = v.value;
											// var proportion = this_detailList[dataIndex].proportion;//接口返回数据占总数据比例
											if (known_val > 0) {
												var proportion = ((this_detailList[dataIndex].value /
													known_val) * 100).toFixed(2); //按照数据占有已知数据比例计算
											} else {
												var proportion = 0
											}

											return seriesName + "<br/>" + name + ": " + value + " (" +
												proportion + "%)";
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

										show: true,
										type: 'value',
										axisLine: {
											show: false,
										},
										axisLabel: {
											show: false,
										},
										splitLine: {
											show: false,
											lineStyle: {
												color: '#3a5065',
												width: 1,
												type: 'dotted'
											}
										}
									},
									yAxis: {
										data: x_name,
										axisLabel: {
											color: '#fff',
										},
										axisLine: {
											show: false,
										},
										splitLine: {
											show: false
										},
										z: 10,
									},
									series: [{
										name: type_code_txt[type_code - 1],
										type: 'bar',
										itemStyle: {
											color: color,
											barBorderRadius: 100
										},
										barWidth: 10,
										data: x_data,
										label: {
											color: '#107DAD',
											show: true,
											position: 'right',
											formatter: function(v) {
												var dataIndex = v.dataIndex;
												// var proportion = this_detailList[dataIndex].proportion;
												// return proportion+'%';
												var this_value = this_detailList[dataIndex].value
												if (known_val > 0) {
													var proportion = ((this_value / known_val) *
														100).toFixed(2);
												} else {
													var proportion = 0;
												}

												return proportion + '%';
											}
										},
									}]
								}
								that.setOption(code_option, memberAge);

								break;
								/*条形图*/
							case 4: //生日分布
								var echart_item = that.memberBirthday;
								if (!color) {
									var color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
											offset: 0,
											color: '#25A2F6'
										},
										{
											offset: 1,
											color: '#1479C1'
										}
									])
								}
								case 5: //星座分布
									var echart_item = echart_item ? echart_item : that.memberConstellation;
									if (!color) {
										var color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
												offset: 0,
												color: '#F27117'
											},
											{
												offset: 1,
												color: '#7B1188'
											}
										])
									}
									case 6: //会龄
										var echart_item = echart_item ? echart_item : that.joinAge;
										if (!color) {
											var color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
													offset: 0,
													color: '#F46E26'
												},
												{
													offset: 1,
													color: '#AE1E83'
												}
											])
										}
										case 12: //最近消费
											var echart_item = echart_item ? echart_item : that.latelyConsum;
											if (!color) {
												var color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
														offset: 0,
														color: '#25A2F6'
													},
													{
														offset: 1,
														color: '#1479C1'
													}
												])
											}
											var x_name = [];
											var x_data = [];
											var unknow_item;
											if (type_code == 4 || type_code == 5 || type_code == 12) {
												unknow_item = detailList[0];
												detailList.splice(0, 1);
												var unknow_val = parseInt(unknow_item.value);
												var unknow_pre = parseFloat(unknow_item.proportion);
												var all_val = Math.round(unknow_val / (unknow_pre / 100));
												var known_val = all_val - unknow_val;
												var known_pre = (1 - (unknow_pre / 100)) * 100;
												// var dom = echart_item._dom;
												// var chart_item = $(dom).parents(".chart_item:first");
												// var chart_item_t = chart_item.find(".chart_item_t");
												// setKnowHtml(known_val,known_pre,unknow_val,unknow_pre,chart_item_t);

											}
											var this_detailList = detailList;
											for (let j in this_detailList) {
												var name = this_detailList[j].key_name.replace(new RegExp('座'),
												"");
												x_name.push(name);
												x_data.push(this_detailList[j].value);
											}
											var code_option = {
												tooltip: {
													trigger: 'item',
													formatter: function(v) {
														var seriesName = v.seriesName;
														var dataIndex = v.dataIndex;
														var name = v.name;
														var value = v.value;
														if (known_val) {
															var proportion = ((this_detailList[dataIndex]
																.value / known_val) * 100).toFixed(
															2); //按照数据占有已知数据比例计算
														} else {
															var proportion = this_detailList[dataIndex]
																.proportion; //接口返回数据占总数据比例
														}
														return seriesName + "<br/>" + name + ": " + value +
															" (" + proportion + "%)";
													}
												},
												grid: {
													top: '5%',
													left: '5%',
													right: '5%',
													bottom: '5%',
													containLabel: true
												},
												xAxis: {
													data: x_name,
													axisLabel: {
														color: '#333',
													},
													z: 10,
												},
												yAxis: {
													show: true,
													type: 'value',
													axisLine: {
														show: false,
													},
													axisLabel: {
														show: false,
													},
													splitLine: {
														show: true,
														lineStyle: {
															color: '#3a5065',
															width: 1,
															type: 'dotted'
														}
													}
												},
												// dataZoom: [{
												//       type: 'inside'
												// }],
												series: [{
													name: type_code_txt[type_code - 1],
													type: 'bar',
													itemStyle: {
														color: color,
														barBorderRadius: 100
													},
													barWidth: 10,
													data: x_data
												}]
											}
											if (type_code == 6) {
												code_option.xAxis.axisLabel.interval = 0;
												code_option.xAxis.axisLabel.rotate = 40;
											}
											that.setOption(code_option, echart_item);
											break;
											/*饼状图*/
										case 7: //会员来源
											// var echart_item = that.memberSource;
											// var pie_color= pie_color ? pie_color : ['#056099','#4EBEE5','#053C78','#1580A6'];
										case 8: //是否关注服务号
											var color = color ? color : ['#DE0578', '#FF7802'];
											var echart_item = echart_item ? echart_item : that.followPublic;
										case 10: //活跃度
											var echart_item = echart_item ? echart_item : that.memberActive;
											var pie_color = pie_color ? pie_color : ['#54018D', '#B106A0',
												'#D70976', '#D80A79', '#FE7603', '#FF9E03', '#411394'
											];
										case 11: //消费频次
											var echart_item = echart_item ? echart_item : that.memberConsume;
											var pie_color = pie_color ? pie_color : ['#FE7A07', '#D70878',
												'#AA0894', '#780092', '#411394'
											];
										case 13: //消费频次(F)
											var echart_item = echart_item ? echart_item : that.consumFrequency;
											var pie_color = pie_color ? pie_color : ['#7553B5', '#FF8239',
												'#36A509', '#EB5A55', '#24A5F6'
											];
											var x_name = [];
											var x_data = [];
											var this_detailList = detailList;
											for (let j in this_detailList) {
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
											var code_option = {
												tooltip: {
													show: false,
													trigger: 'item',
													formatter: "{a} <br/>{b}: {c} ({d}%)",
													textStyle: {
														color: '#333',

													}
												},
												grid: {
													top: '5%',
													left: '5%',
													right: '5%',
													bottom: '5%',
													containLabel: true
												},
												legend: {
													type: 'scroll',
													orient: 'vertical',
													top: '50%',
													left: 'center',
													itemWidth: 10,
													itemHeight: 10,
													height: '45%',
													data: x_name,
													formatter: function(v) {
														var legend_n, legend_p, legend_v;
														for (let k in this_detailList) {
															if (this_detailList[k].key_name == v) {
																legend_n = this_detailList[k].key_name;
																legend_p = this_detailList[k].proportion;
																legend_v = this_detailList[k].value;
																break;
															}
														}
														if (type_code == 11) {
															var arr = [
																'{a|' + legend_n + '}',
																'{b|' + legend_v + '}',
															]
														} else {
															var arr = [
																'{a|' + legend_n + '}',
																'{b|' + legend_p + '%}',
															]
														}
														return arr.join('\t\t\t')
													},
													textStyle: {
														rich: {
															a: {
																verticalAlign: 'bottom',
																color: '#333',
																padding: [2, 0],
															},
															b: {
																fontSize: 14,
																color: '#333',
																fontWeight: "bold",
																padding: [2, 0],
															}
														}
													},
													// tooltip:{
													// 	show:true
													// }
												},
												color: pie_color,
												series: [{
													name: type_code_txt[type_code - 1],
													// stack: type_code_txt[type_code-1],
													type: 'pie',
													center: ['50%', '25%'],
													radius: ['30%', '45%'],
													avoidLabelOverlap: false,
													label: {
														show: false,
														position: 'center',
														color: '#333',
														fontSize: '14'
													},
													emphasis: {
														label: {
															show: true,
															formatter: function(v) {
																var name = v.name;
																var percent = v.percent;
																var value = v.value;
																return name + "\n" + value +
																	"\t(" + percent + "%)";
															}
														}
													},
													labelLine: {
														normal: {
															show: false
														}
													},
													data: x_data
												}]
											}
											//小屏
											if (that.is_small_w) {
												if (type_code == 10 || type_code == 11) {
													code_option.legend.top = 'middle';
													code_option.legend.right = '3%';
													code_option.legend.left = 'auto';
													code_option.legend.height = '90%';
													code_option.series[0].center = ['24%', '50%'];
													code_option.series[0].radius = ['35%', '60%'];
												}
											}
											if (type_code == 13) {
												code_option.legend.top = 'middle';
												code_option.legend.left = '3%';
												code_option.legend.height = '90%';
												code_option.series[0].center = ['70%', '50%'];
												code_option.series[0].radius = ['33%', '53%'];
												if (that.is_small_w) {
													code_option.legend.left = '3%';
												}
											}
											that.setOption(code_option, echart_item);
											break;
						}
					})();

				}
			},
			initAgeConsum: function(data) {
				if (!data.length || data.length == 0) return;
				var x_name = [],
					fre_num = [],
					money_sum = [];
				for (var i = 0; i < data.length; i++) {
					// var 
					x_name.push(data[i].range_name);
					fre_num.push(data[i].fre_sum);
					money_sum.push(data[i].money_sum);
				}
				var code_option = {
					tooltip: {
						trigger: 'item',
						// formatter: function(v){
						// 	console.log(v);
						// 	var seriesName = v.seriesName;
						// 	var dataIndex = v.dataIndex;
						// 	var name = v.name;
						// 	var value = v.value;
						// 	if(known_val){
						// 		var proportion = ((this_detailList[dataIndex].value / known_val) * 100).toFixed(2);//按照数据占有已知数据比例计算
						// 	}else{
						// 		var proportion = this_detailList[dataIndex].proportion;//接口返回数据占总数据比例
						// 	}
						// 	return seriesName + "<br/>" +name+ ": "+value+" (" +proportion+"%)";
						// }
					},
					legend: {
						data: ["消费数量", "消费金额"]
					},
					grid: {
						top: '15%',
						left: '5%',
						right: '5%',
						bottom: '5%',
						containLabel: true
					},
					xAxis: {
						data: x_name,
						axisLabel: {
							color: '#333',
						},
						z: 10,
					},
					yAxis: [{
							show: true,
							type: 'value',
							name: "消费数量",
							axisLine: {
								show: true,
							},
							axisLabel: {
								show: true,
							},
							splitLine: {
								show: true,
								lineStyle: {
									color: '#3a5065',
									width: 1,
									type: 'dotted'
								}
							}
						},
						{
							show: true,
							type: 'value',
							name: '消费金额',
							axisLine: {
								show: true,
							},
							axisLabel: {
								show: true,
							},
							splitLine: {
								show: true,
								lineStyle: {
									color: '#3a5065',
									width: 1,
									type: 'dotted'
								}
							}
						},

					],
					series: [{
							name: "消费数量",
							type: 'bar',
							itemStyle: {
								color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
										offset: 0,
										color: '#CB2B13'
									},
									{
										offset: 1,
										color: '#7B1188'
									}
								]),
								barBorderRadius: 100
							},
							barWidth: 10,
							data: fre_num
						},
						{
							name: "消费金额",
							type: 'bar',
							yAxisIndex: 1,
							itemStyle: {
								color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
										offset: 0,
										color: '#21A0D7'
									},
									{
										offset: 1,
										color: '#7B1188'
									}
								]),
								barBorderRadius: 100
							},
							barWidth: 10,
							data: money_sum
						}
					]
				}
				this.setOption(code_option, this.ageConsum);

			},
			setOption: function(setOption, chartItem) {
				if (setOption) {
					chartItem.setOption(setOption);
				}
			},
			checkWindowW() {
				let win_w = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth;
				if (parseInt(win_w) > 1400) { //大屏
					this.is_small_w = false;
				} else {
					this.is_small_w = true;
				}
			},
			//已知未知
			// setKnowHtml(known_val,known_pre,unknow_val,unknow_pre,item){
			// 	known_pre = known_pre.toFixed(2);
			// 	unknow_pre = unknow_pre.toFixed(2);
			// 	var unknow_html = '<div class="chart_item_t_f">\
			// 			<span>未知</span>\
			// 			<span class="c_49BFE3">'+unknow_val+'('+unknow_pre+'%)</span>\
			// 		</div>';
			// 	var known_html = '<div class="chart_item_t_f">\
			// 			<span>已知</span>\
			// 			<span class="c_49BFE3">'+known_val+'('+known_pre+'%)</span>\
			// 		</div>';
			// 	$(item).append(unknow_html);
			// 	$(item).append(known_html);
			// }
		},
		mounted() {
			this.checkWindowW();
			this.$nextTick(()=>{
				this.initEchartId();
			})
		},
		watch: {
			grounpId: {
				handler(n, o) {
					if (n != 0) {
						this.showDataView = true;
						this.getDataAjax(n);
					} else {
						this.showDataView = false;
					}

				},
				// immediate:true,
				// deep:true,
			},
			'$store.state.app.winResize':{
				handler(n, o){
					if(this.timer){
						clearTimeout(this.timer);
						this.timer = null;
					}
					this.timer = setTimeout(()=>{
						this.checkWindowW();
						this.initChartSize();
					}, 500);
				}
			}
		}
	}
</script>
<style lang="less">
	@import "./data_view.less";
</style>
