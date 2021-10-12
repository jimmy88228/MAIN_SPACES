<style lang="less">
	.activity-reward-area{
		.input_style {
			margin: 5px;
			float: left;
		}

		.input_style_table {
			margin-top: 10px;
			margin-left: 20px;
			margin-right: 20px;
		}

		.page_style {
			text-align: center;
			margin-bottom: 20px;
		}

		.radio_div {
			height: 200px;
			overflow: scroll;
			overflow: auto;
		}

		.colorshow {
			color: #bfc2c5;
			margin-left: 3px;
			height: 20px;
		}

		.card_style {
			margin: 20px;
			display: inline-block;
			vertical-align: top;
		}

		.card_son {
			height: 100%;
			width: 350px;
			float: left;
			margin: 10px;
		}

		.ivu-col-span-11 {
			width: 100%;
		}
		.rule-rewards{
			max-width:1000px;
			.rule-reward{
				border-radius: 10px;
				// border:1px solid #e8eaec;
				margin-bottom:10px;
				list-style: none;
				.reward-header{
					position:relative;
					padding: 10px;
					.remove-reward{
						position:absolute;
						top:0px;
						right:0px;
						transform: translate(50%, -50%);
						cursor: pointer;
					}
				}
				
			}
		}
		
	}

	.edit_area_view.active {
		margin-top: 10px;
		border: 1px dashed #FE8337;
	}

	.edit_area_check {
		line-height: 30px;
		text-align: center;
		border-top: 1px solid #efefef;
	}

	.edit_view_cont {
		padding: 10px 0px;
	}

	.edit_area_view {
		width: 100%;
		padding: 7px;
		border: 1px solid #efefef;
		-moz-border-radius: 5px;
		-webkit-border-radius: 5px;
		border-radius: 5px;
		cursor: pointer;
	}

	.tag-list li {
		display: inline-block;
		padding: 1px 10px;
		border: 1px solid #515a6e;
		;
		color: #515a6e;
		;
		text-align: center;
		float: left;
		margin: 5px;
		border-radius: 10px;
		cursor: pointer;
	}

	.tagSelected {
		border: 1px solid #28a5ff !important;
		color: #28a5ff !important;
	}
</style>

<template>
	<pageTopBase :isSave="true" topTitle="分销活动奖励编辑"  @save="gotoSave" class="activity-reward-area">
		<div>
			<div style="margin:10px;">

				<Form :model="formItem" :label-width="100" :rules="ruleValidate" ref="formValidate">
					<FormItem label="活动名称" prop="activity_name">
						<Input v-model="formItem.activity_name" placeholder="" style="width:200px"></Input>
					</FormItem>

					<FormItem label="活动时间" prop="activity_time">
						<DatePicker type="datetimerange" v-model="formItem.activity_time" format="yyyy-MM-dd HH:mm"
							placeholder="选择活动时间" class="w_250" style="width: 293px;"></DatePicker>
					</FormItem>

					<FormItem label="是否开启" prop="is_enabled">
						<i-switch v-model="formItem.is_enabled" size="large" trueValue="1" falseValue="0">
							<span slot="open">启用</span>
							<span slot="close">关闭</span>
						</i-switch>
					</FormItem>

					<FormItem label="分享活动" prop="is_share">
						<Button type="info"
							@click.native="selectedActivityProduct">选择热门活动/热销商品</Button>{{ this.hotActProCount }}
					</FormItem>

					<FormItem label="分享奖励" prop="share_reward">
						<ul class="rule-rewards" >
							<li class="rule-reward" v-for="(aItem, aIndex) in activityRule" :key="aItem.id">
								<Card>
									<div class="reward-header">
										<Icon class="remove-reward" color="red" size="25" type="ios-close-circle" @click.native="shareRewardRemove(aIndex)"/>
										<!-- <Icon type="md-remove-circle" 
											style="cursor:pointer;color:red;font-size:20px;" /> -->
										分享 <InputNumber v-model="aItem.share_times" :min="0"></InputNumber> 次&nbsp;&nbsp;
										奖励 <Button type="info" @click="handleOpenBonusModal(aItem,aIndex)">选择派券中心活动</Button>&nbsp;
										<span style="color: red;" v-if="aItem.send_coupon_activity">[{{ aItem.send_coupon_activity }}]</span>
									</div>

									<Table width="100%" border :columns="couponColumns" :data="aItem.detail" no-data-text="该活动暂无优惠券">
										<template slot-scope="{ row, index }" slot="qty">
											<div>
												<InputNumber v-model="row.qty" :min="0" @on-change="(val)=>changeInput(aIndex, index, 'qty', val)"></InputNumber>
											</div>
										</template>
									</Table>

									<FormItem label="派券有效期" prop="from_to_date" style="margin: 10px 0;">
										<DatePicker type="datetimerange" v-model="aItem.from_to_date"
											format="yyyy-MM-dd HH:mm:ss" placeholder="选择派券有效期" class="w_250"
											style="width: 350px;"></DatePicker>
									</FormItem>
								</Card>
							</li>
						</ul>
						<div style="margin-top:2rem;">
							<Button type="primary" @click.native="addShareReward">增加分享奖励</Button>
						</div>
					</FormItem>
				</Form>
			</div>

			<!-- <div style="margin:10px;">
				<Button @click="gotoBlack">返回</Button>
				<Button type="primary" @click="gotoSave">保存</Button>
			</div> -->
		</div>

		<!--模板模块-->
		<Modal v-model="activityProductModal" title="选择分享活动" width=850px @on-ok="handleOkArrayShare"
			@on-cancel="handleCancelArray" class="bonus_list" :styles="{top:'50px'}">
			<template>
				<Tabs type="card" v-model="activityTab" @on-click="clearSearch">
					<TabPane v-for="(item, index) in productActivity" :key="item.key" :index="index" :label="item.val">
						<div style="margin-bottom: 10px; text-align: right;">
							<Input v-model="keyword" placeholder="活动标题搜索" @on-clear="searchActivity(item.key)" clearable
								style="width: 150px" />
							<Button type="primary" icon="ios-search" @click="searchActivity(item.key)">搜索</Button>
						</div>

						<div class="tag-list">
							<template v-if="item.key == 'hot_product'">
								<li v-for="it in hotProduct" :key="it.key"
								@click="checkTag(item.key, it.id, $event)" :data-tagid="it.id"
								:class="{'tagSelected': it.selected}">{{ it.activity_title }}</li>
							</template>
							<template v-if="item.key == 'hot_activity'">
								<li v-for="act in hotActivity"
								@click="checkTag(item.key, act.id, $event)" :data-tagid="act.id" :key="item.key"
								:class="{'tagSelected': act.selected}">{{ act.activity_title }}</li>
							</template>
						</div>
					</TabPane>
				</Tabs>
			</template>
		</Modal>
		<!--分销活动-->
		<!-- <Modal v-model="bonusModal" title="分销分享活动" width=50 @on-ok="handleOkArray" @on-cancel="handleCancelArray"
			class="bonus_list" :styles="{top:'20px'}">
			<div class="bonus_table">
				<Input v-model="bonusStr" clearable @on-clear="searchBonus" style="width:100px;"></Input>
				<Button type="primary" icon="ios-search" @click.native="searchBonus">搜索</Button>
				<Table style="margin: 10px auto;" :loading="tableLoading" :columns="bonusColumns" :data="bonusListArray"
					ref="selection" border stripe
					@on-select-cancel="(selection, row)=>{bonusSelectChange(selection, row, 'cancel')}"
					@on-select="(selection, row)=>{bonusSelectChange(selection, row, 'select')}">
					<template slot="action" slot-scope="{ row }">
						<Button @click="chooseCouponAct(row)"
							:type="row.id == temBonusIds ? 'primary' : 'default'">{{row.id == temBonusIds ? '已选中': '选择'}}</Button>
					</template>
				</Table>
			</div>
			<div style="margin: 10px;overflow: hidden">
				<div style="float: right;">
					<Page :total="bonusPageTotal" :page-size="bonusPageSize" :current="1" @on-change="changePageBounus"
						show-total></Page>
				</div>
			</div>
		</Modal> -->


	</pageTopBase>
</template>
<script>
	import Cookies from 'js-cookie';
	import util from '@/libs/util.js';
	import pageTopBase from "@/views/my-components/page-top-base/index.vue";
	export default {
		components:{
			pageTopBase
		},
		data() {
			const checkDate = (rule, value, callback) => {
				if (this.formItem.activity_time[0] == '') {
					callback(new Error('请选择活动时间'));
				} else {
					callback();
				}
			};
			return {
				spinShow: false,
				uploadModal: false,
				uploadModaltwo: false,
				file: '',
				message_file: '',
				message: {},
				haveStaff: '',
				keyword: '',
				formItem: {
					id: '0',
					activity_name: '',
					activity_time: [],
					is_enabled: "0"
				},
				//分享热门活动和热销商品
				activityProductModal: false,
				productActivity: [{
						'key': 'hot_product',
						'val': '热销商品'
					},
					{
						'key': 'hot_activity',
						'val': '热门活动'
					}
				],
				//分享活动标签
				hotActivity: [],
				hotProduct: [],
				hotActivityTemp: [],
				hotProductTemp: [],
				hotActivitySelect: [],
				hotProductSelect: [],
				hotActProCount: '',


				activityRule: [], //分享奖励
				tplMessage: {
					content_demo_list_show: {
						name: '',
						value: ''
					}
				},
				tplMessageLeng: 0,
				ruleValidate: {
					activity_name: [{
						required: true,
						message: '活动名称不能为空！',
						trigger: 'blur'
					}],
					activity_time: [{
							required: true,
							type: 'array',
							min: 2,
							message: '请选择活动时间',
							trigger: 'blur'
						},
						{
							required: true,
							validator: checkDate,
							trigger: 'blur'
						},
						{
							required: true,
							validator: checkDate,
							trigger: 'change'
						}
					]
				},

				data: [],
				tableHeight: 500,
				tableLoading: false,
				pageTotal: 0,
				pageSize: 20,
				// 已选优惠券信息
				bonusStr: '',
				bonusIds: '', //已选优惠券
				temBonusIds: '', //临时优惠券id
				currentIndex: '', //目前下标
				bonusModal: false,
				selectedBonus: {},
				bonusList: {},
				bonusListArray: [],
				bonusPageTotal: 0,
				bonusPageSize: 15,
				bonusColumns: [{
						title: '活动名称',
						key: 'act_name',
						width: 'center'
					}, {
						title: '活动状态',
						key: 'enabled',
						align: 'center'
					},
					{
						title: '操作',
						slot: 'action',
						align: 'center'
					}
				],
				activityTab: 0,
				editId: 0,
				couponColumns: [
					{
						title: "优惠券名称",
						key: "type_name",
						align: 'left'
					},
					{
						title: "派发数量",
						slot: "qty",
						align: 'center'
					}
				]
			}
			
		},
		methods: {
			initParams(){
				let query = this.$route.query || {};
				this.editId = query.id || 0;
			},
			//分享活动
			selectedActivityProduct() {
				this.activityProductModal = true;
				//获取分销活动管理数据
				let req = this.activityTab == 0 ? 'distributionActivityGoodList' : 'distributionActivityList';
				this.$ajax.post(this.$api[req]).then((response)=>{
					let res = response.data || {};
					if(res.code){
						let data = res.data || {};
						let items = data.items || [];
						this.hotProduct = [];
						this.hotActivity = [];
						console.log("hotProductSelect", this.hotProductSelect);
						console.log("hotActivitySelect", this.hotActivitySelect);
						if(this.activityTab == 0){
							for (let i = 0; i < items.length; i++) {
								let id = items[i].id ? items[i].id + '' : '0';
								items[i]['selected'] = this.hotProductSelect.includes(id) ? true : false;
								this.hotProduct.push(items[i]);
							}
						} else {
							for (let j = 0; j < items.length; j++) {
								let id = items[j].id ? items[j].id + '' : '0';
								items[j]['selected'] = this.hotActivitySelect.includes(id) ? true : false;
								this.hotActivity.push(items[j]);
							}
						}
						this.hotProductTemp = this.hotProduct;
						this.hotActivityTemp = this.hotActivity;
					}
					
				})
			},
			checkTag(key, tagTitleId, event) {
				//选中选择标签
				var tag_id = event.srcElement.dataset.tagid, //标签id
					tag_name = event.currentTarget.innerHTML; //标签名称
				var tag_data = key == 'hot_activity' ? this.hotActivity : this.hotProduct;
				var ind = key == 'hot_activity' ? 1 : 0; //热销商品：0，热门活动：1
				for (var k in tag_data) {
					if (tag_data[k].id == tag_id) {
						var selectVal = tag_data[k]['selected'];
						if (ind == 1) {
							this.hotActivity[k]['selected'] = !selectVal;
							if (selectVal == false) {
								if (!this.hotActivitySelect.includes(tag_id)) this.hotActivitySelect.push(tag_id); //不存在，添加
							} else {
								//存在，删除已存在的标签
								if (this.hotActivitySelect.includes(tag_id)) {
									var temp = [];
									for (var i = 0; i < this.hotActivitySelect.length; i++) {
										if (this.hotActivitySelect[i] != tag_id) {
											temp.push(this.hotActivitySelect[i]);
										}
									}
									this.hotActivitySelect = temp;
								}
							}
						} else {
							this.hotProduct[k]['selected'] = !selectVal;
							var hotProductSelectTemp = this.hotProductSelect;
							if (selectVal == false) {
								if (!this.hotProductSelect.includes(tag_id)) this.hotProductSelect.push(tag_id); //不存在，添加
							} else {
								//存在，删除已存在的标签
								if (this.hotProductSelect.includes(tag_id)) {
									var temp = [];
									for (var i = 0; i < this.hotProductSelect.length; i++) {
										if (this.hotProductSelect[i] != tag_id) {
											temp.push(this.hotProductSelect[i]);
										}
									}
									this.hotProductSelect = temp;
								}
							}
						}
					}
				}
			},
			changeInput(ruleIndex, couponIndex, type, val){
				this.$set(this.activityRule[ruleIndex].detail[couponIndex], type, val);
			},
			handleOpenBonusModal(item, index) {
				// //打开优惠券弹层 send_coupon_activity_id
				// this.currentIndex = index;
				// this.bonusModal = true;
				// this.bonusIds = item.send_coupon_activity_id; //已选优惠券
				// this.temBonusIds = this.bonusIds;
				// //获取优惠券信息
				// this.changePageBounus(1, item.send_coupon_activity_id);
				// this.currentIndex = index;
				this.bonusIds = item.send_coupon_activity_id; //已选优惠券
				// this.temBonusIds = this.bonusIds;
				console.log("bonusIds", this.bonusIds);
				this.$selectModule({
					mode: "dist-coupon",
					type: "radio",
					data: [{
						id: item.send_coupon_activity_id,
						name: item.send_coupon_activity
					}],
					getList:(data)=>{
						console.log("dist-coupon", data);
						let info = data[0] || {};
						this.getAwardDetails(info.id, index);
					}
				})
			},
			getAwardDetails(id, index){
				this.$ajax.post(this.$api.distributionActivityAwardDetails, {
					temBonusIds: id
				}).then((response)=>{
					console.log("getAwardDetails", response)
					let res = response.data || {};
					if(res.code){
						let data = res.data || {};
						this.activityRule[index]['detail'] = data.data;
						this.activityRule[index]['send_coupon_activity_id'] = data.send_coupon_activity_id;
						this.activityRule[index]['send_coupon_activity'] = data.send_coupon_activity;
					}
				})
			},
			handleCancelArray() {
				this.$refs.selection.selectAll(false)
				this.bonusModal = false
			},
			handleOkArrayShare() {
				var count = this.hotActivitySelect.length + this.hotProductSelect.length;
				this.hotActProCount = ' 已选择：' + count + '个';
			},
			// 添加奖项
			addShareReward() {
				this.activityRule.push({
					id: 0,
					qty: '0',
					share_times: 0,
					type_name: '',
					detail: []
				});
			},
			// 删除奖项
			shareRewardRemove(index) {
				this.$delete(this.activityRule, index);
				return false;
			},
			//清除搜索关键字
			clearSearch(name) {
				this.keyword = '';
				this.selectedActivityProduct();
				// if (name == 0) {
				// 	this.hotProduct = this.hotProductTemp;
				// } else {
				// 	this.hotActivity = this.hotActivityTemp;
				// }
			},
			//分享活动商品搜索
			searchActivity(type) {
				if (this.keyword) {
					var searchData = [];
					var tempData = [];
					if (type == 'hot_product') {
						tempData = this.hotProduct;
						this.hotProductTemp = tempData;
					} else {
						tempData = this.hotActivity;
						this.hotActivityTemp = tempData;
					}

					for (var i = 0; i < tempData.length; i++) {
						if (tempData[i].activity_title.search(this.keyword) != -1) {
							searchData.push(tempData[i]);
						}
					}

					if (type == 'hot_product') {
						this.hotProduct = searchData;
					} else {
						this.hotActivity = searchData;
					}
				} else {
					if (type == 'hot_product') {
						this.hotProduct = this.hotProductTemp;
					} else {
						this.hotActivity = this.hotActivityTemp;
					}
				}

			},
			getlist() {
				this.spinShow = true;
				if(!this.editId || this.editId == 0) return;
				this.$ajax.post(this.$api.distributionActivityAwardInfo, {
					id: this.editId
				}).then((response)=>{
					let res = response.data || {};
					if(res.code){
						let data = res.data || {};
						let activtyRules = data.activity_rule;
						this.hotActivitySelect = data.hotActivitySelect;
						this.hotProductSelect = data.hotProductSelect;
						this.hotActProCount = ' 已选择：' + (data.hotActivitySelect.length + data.hotProductSelect.length) +
							'个';
						if (activtyRules.length) {
							for (let i = 0, len = activtyRules.length; i < len; i++) {
								activtyRules[i]['share_times'] = parseInt(activtyRules[i]['share_times']);
								let details = activtyRules[i]['detail'] || [];
								if (details.length) {
									for (let j = 0; j < details.length; j++) {
										activtyRules[i]['detail'][j]['qty'] = parseInt(details[j]['qty']);
									}
								}
							}
						}
						this.activityRule = activtyRules; //规格数据
						if (data.activity.activity_name != undefined) {
							this.formItem = data.activity; //表单数据
							this.formItem.is_enabled = data.activity.is_enabled == 1 ? '1' : '0';
							this.formItem.activity_time = [data.activity.from_time, data.activity.to_time];
						}
					}
				})
				// util.ajax.post(util.apiHost + '/staffDistribution/editActivityReward', {
				// 		id: this.$route.params.id,
				// 	})
					// .then((response) => {
					// 	var res = response.data.data;
					// 	var activtyRules = res.activity_rule;
					// 	this.hotActivitySelect = res.hotActivitySelect;
					// 	this.hotProductSelect = res.hotProductSelect;
					// 	this.hotActProCount = ' 已选择：' + (res.hotActivitySelect.length + res.hotProductSelect.length) +
					// 		'个';

					// 	if (activtyRules.length) {
					// 		for (var i = 0, len = activtyRules.length; i < len; i++) {
					// 			activtyRules[i]['share_times'] = parseInt(activtyRules[i]['share_times']);
					// 			var details = activtyRules[i]['detail'];
					// 			if (details.length) {
					// 				for (var j = 0; j < details.length; j++) {
					// 					activtyRules[i]['detail'][j]['qty'] = parseInt(details[j]['qty']);
					// 				}
					// 			}
					// 		}
					// 	}
					// 	this.activityRule = activtyRules; //规格数据
					// 	if (res.activity.activity_name != undefined) {
					// 		this.formItem = res.activity; //表单数据
					// 		this.formItem.is_enabled = res.activity.is_enabled == 1 ? '1' : '0';
					// 		this.formItem.activity_time = [res.activity.from_time, res.activity.to_time];
					// 	}
					// 	this.spinShow = false;
					// });
			},
			gotoSave() {
				this.$refs['formValidate'].validate((valid) => {
					if (valid) {
						//share_times
						if (this.activityRule.length <= 0) {
							this.$Message.error('分享奖励必填！');
							return false;
						} else {
							for (var i = 0; i < this.activityRule.length; i++) {
								if (this.activityRule[i].share_times == 0) {
									this.$Message.error('分享次数不能为0！');
									return false;
								}
							}
						}
						this.$store.commit("setLoading", true);
						let req = this.editId > 0 ? 'distributionActivityAwardEdit': 'distributionActivityAwardAdd';
						this.$ajax.post(this.$api[req],{
							id: this.editId,
							data: this.formItem,
							hotActivitySelect: this.hotActivitySelect,
							hotProductSelect: this.hotProductSelect,
							activityRule: this.activityRule
						})
						// util.ajax.post(util.apiHost + '/staffDistribution/staffActivitySave', {
						// 		id: this.$route.params.id,
						// 		data: this.formItem,
						// 		hotActivitySelect: this.hotActivitySelect,
						// 		hotProductSelect: this.hotProductSelect,
						// 		activityRule: this.activityRule
						// 	})
							.then((response) => {
								var res = response.data;
								this.spinShow = false;
								if (res.code) {
									this.$Message.info(res.message);
									this.$router.go(-1);
								} else {
									this.$Message.error(res.message);
								}
							}).finally(()=>{
								this.$store.commit("setLoading", false);
							})
					} else {
						this.$Message.error('请完善必要信息');
					}
				})

			},
			showMessage(type) {
				if (this.formItem.push_kind == 1 || type == 1) {
					this.uploadModal = true;
				}
				if (this.formItem.push_kind == 0) {
					this.message_file = '';
				}
			},
			showMessageTwo() {
				this.uploadModaltwo = true;
			},
			changeTpl(value) {
				this.tplMessage = this.message[value];
				this.tplMessageLeng = this.tplMessage.content_demo_list_show.length;
			},
			// chooseCouponAct(row) {
			// 	//切换优惠券ids
			// 	this.temBonusIds = row.id;
			// }
		},
		mounted() {
			this.initParams();
			this.getlist();
		}
	}
</script>
