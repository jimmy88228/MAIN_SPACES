<style lang="less">
	@import "../styles/marketing_info.css";
</style>
<template>
	<Modal v-model="showModal" width="980">
		<div slot="header">
			<div class="flex f-align-center m-bottom-10 ">
				<div class="space-nowrap fw-bold fs-18">节点设置-会员筛选</div>
				<!-- <Input style="width:250px" v-model="config.tip"/> -->
			</div>
		</div>
		<p class="">
		<div class="filter_lists">
			<vue-scroll ref="vue-scroll" :ops="scrollOptions">
				<div class="filter_list">
				<div class="filter_stay">
					<div class="_filter_stay first_filter_stay">
						<div class="item_switch">
							<i-switch size="large" true-value="and" :false-value="falseValue"
								v-model="screenData.relation">
								<span slot="open">且</span>
								<span slot="close">或</span>
							</i-switch>
						</div>
						<!--新增的基础信息条件组-->
						<div class="filter_item first_filter_item" v-for="(lItem, lIndex) in screenData.list" :key="lIndex">
							<!--增加的模块-->
							<div class="basic_filter" v-for="(iItem, iIndex) in lItem" :key="iIndex">
								<div>
									<h4 class="inline_b">{{ iItem.exclusion_condition == 'and' ? '会员基础信息' : '排除条件'}}
									</h4>
								</div>
								<a href="javascript:;" class="del_filter_point btn_file"
									@click="removeScreen(lIndex, iIndex)"
									v-if="(iItem.exclusion_condition == 'and' && lIndex != 0) || iItem.exclusion_condition != 'and'">
									<Icon type="md-close-circle" color="#2D8CF0" />
								</a>
								<div class="filter_stay ">
									<div class="_filter_stay">
										<div class="item_switch filter_item_switch">
											<i-switch class="" size="large" :true-value="trueValue"
												:false-value="falseValue" v-model="iItem.inner_condition">
												<span slot="open">且</span>
												<span slot="close">或</span>
											</i-switch>
										</div>
										<div class="filter_select_screen">
											<!--增加的筛选模块-->
											<div class="select_item" v-for="(item, index) in iItem.screenList"
												:key="index">
												<Select class="select_screen" transfer :value="item.label"
													@on-change="(val)=>changeSelect(val, lIndex, iIndex, index)"
													style="width:200px;">
													<Option value="">--请选择--</Option>
													<Option v-for="(sItem, sIndex) in screenSelect" :key="sIndex"
														:value="sItem.key" :disabled="setSelectDisabled(iItem.screenList, sItem.key)">{{ sItem.name }}</Option>
												</Select>
												<div class="inline_b select_set_list">
													<!--性别-->
													<div class="select_set sex_select_set"
														v-if="item.label == 'userSex_val'">
														<RadioGroup v-model="item.val">
															<Radio :label="1">
																<span>男</span>
															</Radio>
															<Radio :label="2">
																<span>女</span>
															</Radio>
														</RadioGroup>
													</div>
													<!--绑定微信-->
													<div class="select_set bind_wx_select_set"
														v-else-if="item.label == 'userBindWX'">
														<RadioGroup v-model="item.val">
															<Radio :label="1">已绑定</Radio>
															<Radio :label="0">未绑定</Radio>
														</RadioGroup>
													</div>
													<!--绑定手机-->
													<div class="select_set phone_select_set"
														v-else-if="item.label == 'userBindTel_val'">
														<RadioGroup v-model="item.val">
															<Radio :label="1">已绑定</Radio>
															<Radio :label="0">未绑定</Radio>
														</RadioGroup>
													</div>
													<!--注册门店-->
													<div class="select_set store_select_set"
														v-else-if="item.label == 'store_id'">
														<a href="javascript:;" class="show_datalist"
															@click="setRegisterStore(lIndex, iIndex, index, item.val)">
															{{getNumStr(item.label, item.val)}}
														</a>
													</div>
													<!--注册时间-->
													<div class="select_set time_select_set"
														v-else-if="item.label == 'register_val'">
														<dateSelect class="inline-b space-nowrap" :customDate="item.val"
															@sT="(date)=>{handleStart(date, lIndex, iIndex, index)}"
															@eT="(date)=>{handleEnd(date, lIndex, iIndex, index)}" @ />
													</div>
													<!--指定标签-->
													<div class="select_set label_select_set"
														v-else-if="item.label == 'userTag_id'">
														<a href="javascript:;" class="show_datalist"
															@click="setTags(lIndex, iIndex, index, item.val)">
															{{getNumStr(item.label, item.val)}}
														</a>
													</div>
													<!--最近消费时间-->
													<div class="select_set last_pay_select_set"
														v-else-if="item.label == 'lastPay_val'">
														<dateSelect class="inline-b space-nowrap" :customDate="item.val"
															@sT="(date)=>{handleStart(date, lIndex, iIndex, index)}"
															@eT="(date)=>{handleEnd(date, lIndex, iIndex, index)}" />
													</div>
													<!--登录时间-->
													<div class="select_set login_select_set"
														v-else-if="item.label == 'lastLogin_val'">
														<dateSelect class="inline-b space-nowrap" :customDate="item.val"
															@sT="(date)=>{handleStart(date, lIndex, iIndex, index)}"
															@eT="(date)=>{handleEnd(date, lIndex, iIndex, index)}" />
													</div>
													<!--购买指定商品-->
													<div class="select_set goods_select_set"
														v-else-if="item.label == 'buyGoods_id'">
														<a href="javascript:;" class="show_datalist"
															@click="setGoods(lIndex, iIndex, index, item.val)">
															{{getNumStr(item.label, item.val)}}
														</a>
													</div>
													<!--查看优惠券-->
													<div class="select_set coupon_select_set"
														v-else-if="item.label == 'coupon'">
														<a href="javascript:;" class="show_datalist"
															@click="setCoupon(lIndex, iIndex, index, item.val)">{{getNumStr(item.label, item.val)}}</a>
													</div>
													<!--领取优惠券-->
													<div class="select_set get_coupon_select_set"
														v-else-if="item.label == 'couponGet_id'">
														<a href="javascript:;" class="show_datalist"
															@click="setCoupon(lIndex, iIndex, index, item.val)">{{getNumStr(item.label, item.val)}}</a>
													</div>
													<!--使用优惠券-->
													<div class="select_set check_coupon_select_set"
														v-else-if="item.label == 'couponUse_id'">
														<a href="javascript:;" class="show_datalist"
															@click="setCoupon(lIndex, iIndex, index, item.val)">{{getNumStr(item.label, item.val)}}</a>
													</div>
													<div class="select_set rfm_select_set"
														v-else-if="item.label == 'rfm_id'">
														<a href="javascript:;" class="show_datalist"
															@click="setRFM(lIndex, iIndex, index, item.val)">
															{{item.val ? '查看设置' : '点击设置'}}
														</a>
													</div>
													<div class="select_set isSubscribe_select_set"
														v-else-if="item.label == 'isSubscribe_val'">
														<RadioGroup v-model="item.val">
															<Radio :label="1">已关注</Radio>
															<Radio :label="0">未关注</Radio>
														</RadioGroup>
													</div>
													<div class="select_set isApplet_select_set"
														v-else-if="item.label == 'isApplet_val'">
														<RadioGroup v-model="item.val">
															<Radio :label="1">小程序会员</Radio>
															<Radio :label="0">非小程序会员</Radio>
														</RadioGroup>
													</div>
													<div class="select_set profile_select_set"
														v-else-if="item.label == 'profile_val'">
														<RadioGroup v-model="item.val">
															<Radio :label="1">已完善</Radio>
															<Radio :label="0">未完善</Radio>
														</RadioGroup>
													</div>
													<div class="select_set isErpRegister_select_set"
														v-else-if="item.label == 'isErpRegister_val'">
														<RadioGroup v-model="item.val">
															<Radio :label="1">是</Radio>
															<Radio :label="0">否</Radio>
														</RadioGroup>
													</div>
													<!--指定会员分组-->
													<div class="select_set userGroup_select_set"
														v-else-if="item.label == 'userGroup_id'">
														<a href="javascript:;" class="show_datalist"
															@click="setGroup(lIndex, iIndex, index, item.val)">{{getNumStr(item.label, item.val)}}</a>
													</div>
													<div class="select_set userRank_select_set"
														v-else-if="item.label == 'rank_ids'">
														<a href="javascript:;" class="show_datalist"
															@click="setLevel(lIndex, iIndex, index, item.val)">{{getNumStr(item.label, item.val)}}</a>
													</div>
												</div>
												<a href="javascript:;" class="del_filter_point btn_file"
													v-if="iItem.screenList.length > 1"
													@click="removeScreen(lIndex, iIndex, index)">
													<Icon type="md-close-circle" color="#2D8CF0" />
												</a>
											</div>
											<!--增加的筛选模块-->
										</div>
									</div>

									<div class="add_filter_link add_basic_select flex f-align-center"
										@click="addScreenSelect(lIndex, iIndex)">
										<Icon type="ios-add-circle" color="#2F8CEE" size="20" />
										<span class="add_filter_txt">添加筛选条件,系统将筛选符合条件的会员</span>
									</div>
								</div>
							</div>
							<div class="add_filter_link add_basic_area flex f-align-center"
								@click="addScreenArea(lIndex)">
								<Icon type="ios-add-circle" color="#2F8CEE" size="20" />
								<span class="add_filter_txt">添加排除条件,系统将排除符合条件的会员</span>
							</div>
						</div>
					</div>
				</div>
				<div class="filter_operate">
					<Button type="primary" class="add_new_filter add_new_basic_filter"
						@click="addScreenGroup()">新增基础信息条件组</Button>
				</div>
			</div>
			</vue-scroll>
		</div>
		</div>

		</p>
		<div slot="footer">
			<Button type="default" @click="showModal = false">取消</Button>
			<Button type="primary" @click="saveSetting">确定</Button>
		</div>
	</Modal>
</template>
<script>
	import dateSelect from "@/views/my-components/date-select/index";
	export default {
		name: "screenSave",
		props: ["createType"],
		components: {
			dateSelect
		},
		data() {
			return {
				config: {},
				formSearch: {
					searchq: "",
				},
				showModal: false,
				trueValue: "and",
				falseValue: "or",
				screenSelect: [{
						key: "userSex_val",
						name: "性别"
					},
					// {
					// 	key:"userBindTel_val",
					// 	name:"绑定微信",
					// },
					{
						key: "userBindTel_val",
						name: "手机会员",
					},
					{
						key: "store_id",
						name: "注册门店",
						type: "JSON"
					},
					{
						key: "register_val",
						name: "注册时间",
					},
					{
						key: "userTag_id",
						name: "指定标签",
						type: "JSON"
					},
					{
						key: "lastPay_val",
						name: "最近消费时间",
					},
					{
						key: "lastLogin_val",
						name: "最近登录时间",
					},
					{
						key: "buyGoods_id",
						name: "购买指定商品",
					},
					// {
					// 	key:"coupon",
					// 	name:"查看指定优惠券",
					// },
					{
						key: "couponGet_id",
						name: "领取指定优惠券",
						type: "JSON"
					},
					{
						key: "couponUse_id",
						name: "使用指定优惠券",
						type: "JSON"
					},
					{
						key: "rfm_id",
						name: "设置RFM条件",
						type: "JSON"
					},
					{
						key: "isSubscribe_val",
						name: "关注公众号",
					},
					{
						key: "isApplet_val",
						name: "小程序会员",
					},
					{
						key: "profile_val",
						name: "完善资料",
					},
					{
						key: "isErpRegister_val",
						name: "店铺开卡",
					},
					{
						key: "userGroup_id",
						name: "指定会员分组",
						type: "JSON"
					},
					{
						key: "rank_ids",
						name: "会员等级",
						type: "JSON"
					},

					// {
					// 	key:"access-dcwq",
					// 	name:"查看指定问卷报名",
					// },
					// {
					// 	key:"event-dcwqResponse",
					// 	name:"反馈指定问卷报名",
					// },
				],
				screenData: {},
				tempScreenData: {
					relation: "and",
					list: [
						[{
							exclusion_condition: "and",
							inner_condition: "and",
							screenList: [{
								label: "",
								val: ""
							}]
						}]
					]
				},
				// 虚拟滚动条
				scrollOptions: {
					mode: 'native',
					bar: {
						keepShow: false,
						background: '#c8c8c8',
						size: '3px'
					},
					// 滚动轨道
					rail: {
						size: '3px'
					},
					scrollPanel: {
						scrollingX: false
					}
				}
			}
		},
		mounted() {

		},
		methods: {
			show(config, setting) {
				this.showModal = true;
				this.config = config || {};
				if(setting.relation == 'a'){
					setting.relation = 'and'
				}
				if (setting.list) {
					this.screenData = setting;
				} else {
					this.screenData = JSON.parse(JSON.stringify(this.tempScreenData));
				}
			},
			setSelectDisabled(selectItem, key){
				if(!key) return false;
				for(let i = 0; i < selectItem.length; i++){
					if(selectItem[i].label == key){
						return true;
						break;
					}
				}
				return false;
			},
			handleStart() {},
			handleEnd() {},
			setRegisterStore(lIndex, iIndex, index, val = {}) {
				let vals = [];
				for (let i in val) {
					vals.push({
						id: i
					})
				}
				let screenData = this.screenData || [];
				this.$selectModule({
					mode: 'store',
					type: 'checkbox',
					data: vals,
					getList: (data) => {
						let ids = {};
						for (let i = 0; i < data.length; i++) {
							ids[data[i].id] = data[i].id
						}
						try {
							screenData.list[lIndex][iIndex].screenList[index].val = ids;
						} catch (error) {

						}
					}
				});
			},
			setTags(lIndex, iIndex, index, val = "") {
				let vals = []
				for (let i in val) {
					let items = val[i].split(",") || [];
					for (let j = 0; j < items.length; j++) {
						vals.push({
							id: i + "" + items[j],
							tabType: i
						})
					}
				}
				let screenData = this.screenData || [];
				this.$selectContent({
					mode: 'labels',
					type: 'checkbox',
					reqConfig: 'labels',
					modeStyle: 'tab',
					data: vals,
					getList: (data) => {
						let ids = {};
						for (let i = 0; i < data.length; i++) {
							let tabType = data[i].tabType || "";
							let id = data[i].id;
							id = id.replace(new RegExp(tabType, 'gm'), '');
							ids[tabType] = ids[tabType] ? (ids[tabType] + ',' + id) : id
						}
						try {
							screenData.list[lIndex][iIndex].screenList[index].val = ids;
						} catch (error) {

						}
					}
				});
			},
			setGoods(lIndex, iIndex, index, val = "") {
				let vals = [];
				for (let i in val) {
					vals.push({
						id: val[i]
					})
				}
				let screenData = this.screenData || [];
				this.$selectContent({
					mode: 'goods',
					type: 'checkbox',
					data: vals,
					getList: (data) => {
						let ids = {};
						for (let i = 0; i < data.length; i++) {
							ids[data[i].id] = data[i].id
						}
						try {
							screenData.list[lIndex][iIndex].screenList[index].val = ids;
						} catch (error) {

						}
					}
				});
			},
			setCoupon(lIndex, iIndex, index, val = "") {
				let vals = [];
				for (let i in val) {
					vals.push({
						id: val[i]
					})
				}
				let screenData = this.screenData || [];
				this.$selectContent({
					mode: 'coupon',
					type: 'checkbox',
					data: vals,
					getList: (data) => {
						let ids = {};
						for (let i = 0; i < data.length; i++) {
							ids[data[i].id] = data[i].id
						}
						try {
							screenData.list[lIndex][iIndex].screenList[index].val = ids;
						} catch (error) {

						}
					}
				});
			},
			setRFM(lIndex, iIndex, index, val = "") {
				let vals = [];
				for (let i in val) {
					vals.push({
						id: val[i]
					})
				}
				let screenData = this.screenData || [];
				this.$selectContent({
					mode: 'RFM',
					type: 'checkbox',
					data: vals,
					getList: (data) => {
						let ids = {};
						for (let i = 0; i < data.length; i++) {
							ids[data[i].id] = data[i].id
						}
						try {
							screenData.list[lIndex][iIndex].screenList[index].val = ids;
						} catch (error) {

						}
					}
				});
			},
			setGroup(lIndex, iIndex, index, val = "") {
				let vals = []
				for (let i in val) {
					let items = val[i].split(",") || [];
					let key = "user" + i;
					for (let j = 0; j < items.length; j++) {
						if (val[i] && items.length > 0) {
							vals.push({
								id: key + "" + items[j],
								tabType: key
							})
						}

					}
				}
				let screenData = this.screenData || [];
				this.$selectContent({
					mode: 'userGroup',
					type: 'checkbox',
					modeStyle: 'tab',
					data: vals,
					getList: (data) => {
						let ids = {};
						for (let i = 0; i < data.length; i++) {
							let tabType = data[i].tabType || "";
							let id = data[i].id;
							id = id.replace(new RegExp(tabType, 'gm'), '');
							let _key = tabType.replace(new RegExp('user', 'gm'), '')
							ids[_key] = ids[_key] ? (ids[_key] + ',' + id) : id
						}
						try {
							screenData.list[lIndex][iIndex].screenList[index].val = ids;
						} catch (error) {

						}
					}
				});
			},
			setLevel(lIndex, iIndex, index, val = "") {
				let vals = [];
				let screenData = this.screenData || [];
				for (let i in val) {
					vals.push({
						id: val[i]
					})
				}
				this.$selectContent({
					mode: 'userRank',
					type: 'checkbox',
					data: vals,
					getList: (data) => {
						let ids = {};
						for (let i = 0; i < data.length; i++) {
							ids[data[i].id] = data[i].id
						}
						try {
							screenData.list[lIndex][iIndex].screenList[index].val = ids;
						} catch (error) {

						}
					}
				});
			},
			addScreenSelect(pIndex, index) {
				let screenData = this.screenData || {};
				let area = (screenData.list && screenData.list[pIndex]) || [];
				let screenList = (area[index] && area[index].screenList) || [];
				screenList.push({
					label: "",
					val: ""
				})
			},
			addScreenArea(pIndex) {
				let screenData = this.screenData || {};
				let area = (screenData.list && screenData.list[pIndex]) || [];
				let isBase = "notin";
				if (area.length == 0) {
					isBase = "and";
				}
				area.push({
					inner_condition: "and",
					exclusion_condition: isBase,
					screenList: [{
						label: "",
						val: ""
					}]
				})
				this.$nextTick(()=>{
					this.$refs["vue-scroll"].scrollTo({ y: "100%" },500);
				})
				
			},
			addScreenGroup() {
				let screenData = this.screenData || {};
				screenData.list.push(
					[{
						inner_condition: "and",
						exclusion_condition: "and",
						screenList: [{
							label: "",
							val: ""
						}]
					}]
				)
				this.$nextTick(()=>{
					this.$refs["vue-scroll"].scrollTo({ y: "100%" },500);
				})
			},
			removeScreen(lIndex, iIndex, index) {
				let screenData = this.screenData || {};
				let lItem = null,iItem = null,item = null;
				if (lIndex || lIndex == 0) {
					lItem = screenData.list[lIndex];
				}
				if (iIndex || iIndex == 0) {
					iItem = lItem[iIndex];
				} else {
					screenData.list.splice(lIndex, 1);
					return;
				}
				if (index || index == 0) {
					iItem.screenList.splice(index, 1);
				} else {
					lItem.splice(iIndex, 1);
					if(lItem.length == 0){//子项为空, 清空父项
						screenData.list.splice(lIndex, 1);
					}
					return;
				}
			},
			changeSelect(val, lIndex, iIndex, index) {
				let screenData = this.screenData || {};
				let screenList = screenData.list[lIndex][iIndex].screenList
				let _val = "";
				if (val == "register_val" || val == "lastPay_val" || val == "lastLogin_val") {
					_val = [];
				}
				this.$set(screenList, index, {
					label: val,
					val: _val
				})
			},
			handleStart(date, lIndex, iIndex, index) {
				let screenData = this.screenData || {};
				let screenList = screenData.list[lIndex][iIndex].screenList || {};
				let screenItem = screenList[index] || {};
				if (screenItem.val instanceof Array) {
					screenItem.val[0] = date
				} else {
					screenItem.val = [date]
				}
				this.$set(screenList, index, screenItem);
			},
			handleEnd(date, lIndex, iIndex, index) {
				let screenData = this.screenData || {};
				let screenList = screenData.list[lIndex][iIndex].screenList || {};
				let screenItem = screenList[index] || {};
				if (screenItem.val instanceof Array) {
					screenItem.val[1] = date
				} else {
					screenItem.val = ["", date]
				}
				this.$set(screenList, index, screenItem);
			},
			isShowKey(key, val) {
				if (!key || !val || val == -1) {
					return false;
				}
				return true
			},
			getNumStr(type, data) {
				if (!type) return "";
				let num = 0, resultStr = "";
				if (type == "userTag_id") {
					for (let i in data) {
						num += data[i].split(",").length;
					}
				} else {
					for (let i in data) {
						num++;
					}
				}
				switch (type) {
					case "store_id":
						resultStr = num > 0 ? `已选择${num}个门店` : `点击设置注册门店条件`;
						break;
					case "userTag_id":
						resultStr = num > 0 ? `已选择${num}个标签` : `点击设置指定标签`;
						break;
					case "rank_ids":
						resultStr = num > 0 ? `查看设置` : `点击设置会员等级`;
						break;
					case "buyGoods_id":
						resultStr = num > 0 ? `已选择${num}个商品` : `点击设置购买指定商品条件`;
						break;
					case "couponGet_id":
						resultStr = num > 0 ? `已领取${num}张优惠券` : `点击选择指定优惠券`;
						break;
					case "couponUse_id":
						resultStr = num > 0 ? `已使用${num}张优惠券` : `点击选择指定优惠券`;
						break;
					case "rfm_id":
						resultStr = num > 0 ? `查看设置` : `点击设置RFM条件`;
						break;
					case "userGroup_id":
						resultStr = num > 0 ? `已选择${num}个分组` : `点击设置分组`;
						break;
				}
				return resultStr
			},
			getScreenSelectJson() {
				let screenSelect = this.screenSelect || [];
				let screenSelectJson = {};
				for (let i = 0; i < screenSelect.length; i++) {
					let key = screenSelect[i].key;
					screenSelectJson[key] = screenSelect[i];
				}
				this.screenSelectJson = screenSelectJson;
				return screenSelectJson;
			},
			checkSave(screenData) {
				let screenSelectJson = this.getScreenSelectJson();
				let list = screenData.list || [];
				for (let i = 0; i < list.length; i++) {
					let items = list[i];
					for (let j = 0; j < items.length; j++) {
						let screenList = items[j].screenList || [];
						for (let k = 0; k < screenList.length; k++) {
							if (!screenList[k].label) {
								this.$Message.error("请选择会员基础的条件");
								return false;
							} else if (!screenList[k].val && screenList[k].val != 0) {
								this.$Message.error("请完善" + screenSelectJson[screenList[k].label].name + "选项的值");
								return false;
							}
						}
					}
				}
				return true;
			},
			saveSetting() {
				let screenData = this.screenData;
				if (this.checkSave(screenData)) {
					this.showModal = false;
					let _params = this.installSetting(screenData);
					this.$emit("saveMsg", {
						setting: screenData,
						_params: _params,
						...this.config,
					})
				}
			},
			installSetting(screenData = {}) {
				let list = screenData.list || [];
				let arr = JSON.parse(JSON.stringify(list));
				let json = {};
				for (let j = 0; j < list.length; j++) {
					let jItems = list[j] || [];
					for (let k = 0; k < jItems.length; k++) {
						let kItems = jItems[k].screenList || [];
						json['exclusion_condition'] = jItems[k].exclusion_condition;
						json['inner_condition'] = jItems[k].inner_condition;
						for (let l = 0; l < kItems.length; l++) {
							json[kItems[l].label] = kItems[l].val && JSON.stringify(kItems[l].val);
							let _item = this.installParams(kItems[l]);
							json = {
								...json,
								..._item
							}
						}
						for (let n = 0; n < this.screenSelect.length; n++) {
							let _key = this.screenSelect[n].key || "";
							let _type = this.screenSelect[n].type || "";
							if (!json[_key]) {
								json[_key] = "";
								let _item = this.installParams({
									label: _key,
									val: ""
								});
								json = {
									...json,
									..._item
								}
							}
						}
						arr[j][k] = json;
						json = {};
					}
				}
				return {
					relation: screenData.relation,
					list: arr
				};
			},
			installParams(item) {
				let label = item.label || "";
				let val = item.val;
				let result = {}
				if (label) {
					switch (label) {
						case "register_val":
							result = {
								register_sTime: val && val[0],
								register_eTime: val && val[1]
							}
							break;
						case "lastPay_val":
							result = {
								lastPay_sTime: val && val[0],
								lastPay_eTime: val && val[1]
							}
							break;
						case "lastLogin_val":
							result = {
								lastLogin_sTime: val && val[0],
								lastLogin_eTime: val && val[1]
							}
							break;
					}
				}
				return result;
			}
		}
	}
</script>
