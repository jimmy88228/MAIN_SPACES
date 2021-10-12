<template>
	<pageTopBase :isSave="marketInfo.status != 1" @save="saveMarket" class="marketing-page span-parent">
		<Card class="market-card" :dis-hover="false">
			<Divider custom orientation="left">智能营销方案</Divider>
			<div class="market-tip">请注意：智慧营销方案在生效后，将按设定的时间自动运行。</div>
			<div class="market-tip">在运算量较大的情况下，智慧营销方案的执行将需要较长时间。</div>
		</Card>
		<Card class="market-card" :dis-hover="false">
			<div class="market-operate">
				<Form ref="marketForm" inline :label-width="100" :rules="ruleValidate" :model="marketInfo">
					<div class="flex f-just-between">
						<div>
							<FormItem label="方案名称" prop="plan_name">
								<Input placeholder="请输入文案名称，12字以内" :disabled="marketInfo.status == 1 ? true : false"
									v-model="marketInfo.plan_name" />
							</FormItem>
							<FormItem label="方案备注" prop="remark">
								<Input placeholder="请输入方案备注，50字以内" :disabled="marketInfo.status == 1 ? true : false" style="width:250px;"
									v-model="marketInfo.remark" />
							</FormItem>
						</div>
					</div>
				</Form>
			</div>
			<div class="label-view">
				<div class="label-view-area" v-if="marketInfo.status != 1">
					<div>可选流程组件</div>
					<ul class="label-list" >
						<li v-for="(item, index) in labelList" class="label-item" :key="index" :draggable="true"
							@dragstart.stop="dragStart($event, item)" @dragend.stop="dragEnd($event, item)"
							v-if="item.type != 0">
							<div class="item-cont">
								<img :src="item.img" class="item-img" />
								<span class="item-name">{{ item.name }}</span>
								<div class="item-mark"></div>
							</div>

						</li>
					</ul>
				</div>
				<Card class="label-operate">
					<Tabs class="periods-tab" v-show="periods.length > 0 && createType == 'multi'" v-model="currPeriodsId" @on-click="changeTab">
							<TabPane :label="item.create_time" v-for="(item, index) in periods" :name="item.identityid" :key="item.identityid"></TabPane>
					</Tabs>
					<div id="loopBodyArea" class="loop_body_area">
						<loopBody 
						id="loopBody" 
						class="loop_body" 
						:labelList="labelList" 
						:tagsData="tagsData" 
						level=""
						:periodsId="currPeriodsId"
						:marketStatus="marketInfo.status"
						@createBranch="createBranch" 
						@checkSaveMsg="checkSaveMsg" 
						@removeBranch="removeBranch"
						@labelEnter="labelEnter" 
						@labelOut="labelOut"></loopBody>
						<div id="line_view" class="line_view" v-html="lineViewHtml"></div>
					</div>
				</Card>
				<div class="drag_tip">
					<p>*请拖动组件到右侧来添加步骤</p>
					<p>双击编辑节点内容</p>
				</div>
			</div>
		</Card>
		<!--开始-->
		<startSave ref="startSave" :createType="createType" @saveMsg="saveMsg"></startSave>
		<!--会员筛选-->
		<screenSave ref="screenSave" :createType="createType" @saveMsg="saveMsg"></screenSave>
		<!--延时-->
		<delaySave ref="delaySave" :createType="createType" @saveMsg="saveMsg"></delaySave>
		<!--消息 图文 小程序卡片-->
		<imageTextSave ref="imageTextSave" :createType="createType" @saveMsg="saveMsg"></imageTextSave>
		<!--企微消息-->
		<qiweiMsgSave ref="qiweiMsgSave" :createType="createType" @saveMsg="saveMsg"></qiweiMsgSave>
	</pageTopBase>
</template>
<script>
	import util from '@/libs/util.js';
	import loopBody from "./component/loopBody";
	import startSave from "./component/startSave";
	import screenSave from "./component/screenSave";
	import delaySave from "./component/delaySave";
	import labelView from "./mixins/label-view.js";
	import imageTextSave from "./component/imageTextSave";
	import qiweiMsgSave from "./component/qiweiMsgSave";
	import UImixin from "./mixins/UI-mixins.js";
	import pageTopBase from "@/views/my-components/page-top-base/index.vue";
	export default {
		name: "",
		mixins: [labelView, UImixin],
		components: {
			loopBody,
			startSave,
			screenSave,
			delaySave,
			imageTextSave,
			qiweiMsgSave,
			pageTopBase
		},
		data() {
			return {
				createType: "", // multi = 周期
				marketInfo: {
					status: "0"
				},
				periods: [],
				currPeriodsId: 0,
				ruleValidate: {
					plan_name: {
						required: true,
						message: '请完善方案名称',
						trigger: 'blur'
					},
					remark: {
						required: true,
						message: '请完善方案备注',
						trigger: 'blur'
					}
				},
				tagsList: [],
				tagsData: [{
					tagType: 0,
					type: "",
					id: 0,
					parent_id: -1,
					screen_name: "开始",
					children: [{
						tagType: 1,
						type: "",
						id: 1,
						parent_id: 0,
						screen_name: "会员筛选",
						children: []
					}]
				}],
				loopBodyArea: null,
				loopBody: null,
				nTop: 0,
				nLeft: 0,
				lineView: null,
				lineViewHtml: "",
				dragItem: null,
				isDraging: false,
				id: 0
			}
		},
		mounted() {
			this.init();
		},
		methods: {
			checkSaveMsg(detail) {
				let tagType = detail.tagType + "";
				let setting = detail.setting || {};
				let name = detail.name;
				let level = detail.level;
				let vals = [],
					eidtItem = null;
				let config = {
					level: level,
					tip: name,
					type: tagType
				};
				eidtItem = this.getLevel(level);
				switch (tagType) {
					case "0":
						this.$refs["startSave"].show(config, setting);
						break;
					case "1":
						this.$refs["screenSave"].show(config, setting);
						break;
					case "2":
						this.$refs["delaySave"].show(config, setting);
						break;
					case "4":
					case "5":
						for (let i in setting) {
							vals.push({
								id: 'manual' + setting[i],
								tabType: 'manual'
							})
						}
						this.$selectContent({
							mode: 'labels',
							type: 'checkbox',
							modeStyle: 'tab',
							showTab: 'manual',
							reqConfig: 'labels',
							data: vals,
							getList: (data) => {
								let ids = [];
								for (let i = 0; i < data.length; i++) {
									let tabType = data[i].tabType || "";
									let id = data[i].id;
									id = id.replace(new RegExp(tabType, 'gm'), '');
									ids.push(id);
								}
								this.$set(eidtItem, "chart_setting", ids)
							}
						});
						break;
					case "3":
						vals = getDataIdByKey(setting);
						this.$selectContent({
							mode: 'coupon',
							type: 'checkbox',
							data: vals,
							getList: (data) => {
								data = data || [];
								let ids = {}
								for (let i = 0; i < data.length; i++) {
									ids[data[i].id] = data[i].id;
								}
								this.$set(eidtItem, "chart_setting", ids);
							}
						});
						break;
					case "13":
						vals = getDataIdByKey(setting);
						this.$selectContent({
							mode: 'redPacket',
							type: 'checkbox',
							data: vals,
							getList: (data) => {
								data = data || [];
								let ids = {}
								for (let i = 0; i < data.length; i++) {
									ids[data[i].id] = data[i].id;
								}
								this.$set(eidtItem, "chart_setting", ids);
							}
						});
						break;
					case "6":
						this.$refs["imageTextSave"].showModal({
							...config,
							hideTab: ['MINIPROGRAMPAGE']
						}, setting);
						break;
					case "11":
						this.$refs["imageTextSave"].showModal({
							...config,
							hideTab: ['IMAGE', 'NEWS', 'MINIPROGRAMPAGE']
						}, setting);
						break;
					case "12":
						this.$refs["imageTextSave"].showModal(config, setting);
						break;
					case "14":
						this.$refs["qiweiMsgSave"].showModal(config, setting);
						break;
				}
			},
			saveMsg(detail) {
				let level = detail.level;
				let setting = detail.setting;
				let eidtItem = this.getLevel(level);
				let _params = detail._params || {};
				this.$set(eidtItem, "chart_setting", setting);
				this.$set(eidtItem, "_params", _params);
			},
			
			// 初始化方法
			init() {
				let query = this.$route.query || {};
				this.createType = query.type || "";
				this.id = query.id;
				this.getMarketInfo().finally(() => {
					this.setNode();
				})
			},
			changeTab(name){
				
			},
			getMarketInfo() {
				if (!this.id) return Promise.resolve();
				this.showSpin = true;
				let req = this.createType == 'multi' ? 'CycleMarketingInfo' : 'OnceMarketingInfo'
				return this.$ajax.post(this.$api[req], {
					id: this.id
				}).then(e => {
					let res = e.data || {};
					if (res.code) {
						let data = res.data || {};
						this.marketInfo = data.info || {};
						this.periods = data.periods || [];
						this.currPeriodsId = (this.periods[0] && this.periods[0].identityid) || 0;
						this.tagsList = data.list_arr || [];
						this.tagsDataHandle(this.tagsList);
						return Promise.resolve();
					}
					return Promise.reject();
				}).finally(() => {
					this.showSpin = false
				})
			},
			tagsDataHandle(list) {
				this.tagsData = this.tagsListLoop(list, 0, [], '-1') || [];
				console.log("tagsData", this.tagsData);
			},
			tagsListLoop(list, p_id, result, _p_id) {
				for (let i in list) {
					let parent_id = list[i].parent_id || 0;
					let branch_type = (list[i].branch_type == "yes_branch") ? "yes" : (list[i].branch_type ==
						"no_branch") ? "no" : "";
					if (parent_id == p_id) {
						let _id = i;
						result.push({
							...list[i],
							tagType: list[i].chart_type,
							type: branch_type,
							id: _id,
							parent_id: _p_id
						});
						result[(result.length - 1)].children = [];
						this.tagsListLoop(list, list[i].id, result[(result.length - 1)].children, _id);
					}
				}
				return result;
			},
			saveMarket() {
				this.$refs["marketForm"].validate((valid) => {
					if (valid) {
						let tagsData = this.tagsData;
						let checkResult = this.checkSaveTagData(tagsData)
						if (checkResult) {
							this.$Message.warning(checkResult);
							return;
						} else {
							this.saveMarketReq(this.marketInfo, this.tagsList);
						}
					} else {
						this.$Message.error('请完善必填信息！');
					}
				})
			},
			checkSaveTagData(data, tagsList = [], hasEnd = false) {
				let checkResult = "";
				let hasAddTag = false;
				for (let i = 0; i < data.length; i++) {
					if (data[i].tagType == 8 && !hasEnd) hasEnd = true;
					if (!data[i].chart_setting && data[i].tagType != 8) {
						checkResult = "请设置" + data[i].screen_name + "节点的参数";
						break;
					} else {
						let addItem = JSON.parse(JSON.stringify(data[i]));
						//减少字段的差异性
						delete addItem.children;
						addItem.branch_type = addItem.type == "yes" ? "yes_branch" : addItem.type == "no" ? "no_branch" : "";
						addItem.chart_type = addItem.tagType;
						if (addItem.tagType == 1) {
							let _params = addItem._params || this.$refs["screenSave"].installSetting(addItem.chart_setting);
							addItem.params = _params;
						} else if(addItem.tagType == 4 || addItem.tagType == 5){
							addItem.params = addItem.chart_setting.join(",");
						} else {
							addItem.params = addItem.chart_setting;
						}
						addItem.label = addItem.tagType;
						tagsList.push(addItem);
						if(!checkResult) {
							if (data[i].children.length > 0){
								checkResult = this.checkSaveTagData(data[i].children, tagsList, hasEnd);
							} else{
								if(!hasEnd){
									checkResult = '分支需要设置结束节点';
									break;
								}
							}
						}
					}
				}
				if (checkResult) {
					return checkResult;
				} else {
					this.tagsList = tagsList;
					return "";
				}
			},
			saveMarketReq(marketInfo, tagsList = []) {
				this.$store.commit("setLoading", true);
				let reqName = this.createType == "multi" ? "CycleMarketingAdd" : "OnceMarketingAdd";
				if(this.id){
					reqName = this.createType == "multi" ? "CycleMarketingEdit" : "OnceMarketingEdit";
				}
				return util.ajax.post(util.apiUrl[reqName], {
					id: this.id,
					...marketInfo,
					item_arr: tagsList
				}).then(e => {
					let res = e.data || {};
					if (res.code) {
						this.$Message.success(res.message);
						this.$router.go(-1);
						return Promise.resolve();
					}
					return Promise.reject();
				}).finally(() => {
					this.$store.commit("setLoading", false);
				})
			}
		}
	}
	//
	function getDataIdByKey(data) {
		var list = []
		if (data instanceof Array) {
			for (let i = 0; i < data.length; i++) {
				list.push({
					id: data[i].id
				})
			}
		} else if (data instanceof Object) {
			for (let i in data) {
				list.push({
					id: i
				})
			}
		}
		return list;
	}
</script>
<style lang="less">
	.marketing-page {
		.market-card {
			border-radius: 15px;
			margin-bottom: 15px;
			.ivu-card-head{
				display:none;
			}
		}
		
		.market-tip {
			padding-left: 100px;
			// margin-bottom:10px;
		}

		.market-operate {
			padding-top: 10px;
		}

		.label-view {
			position: relative;
			border-top: 1px solid #efefef;
			-webkit-user-select: none;
			-moz-user-select: none;
			-ms-user-select: none;
			user-select: none;
			background: #f7f7f7;
			padding: 0px 5px;

			.label-view-area {
				position: sticky;
				top: 0px;
				z-index: 10;
				background-color: #f7f7f7;
				padding: 15px;
				margin-left: -5px;
				padding-bottom:0px;
			}

			.label-list {
				margin-top: 10px;
				padding: 10px 0px;

				.label-item {
					display: inline-block;
					margin: 8px 20px;
					margin-right:10px;
					position: relative;

					.item-cont {
						display: flex;
						align-items: center;
						border-radius: 5px;
						// overflow:hidden;
						background-color: #fff;
						box-shadow: 0px 0px 5px #ccc;
						position: relative;
						cursor: move;

						.item-img {
							width: 35px;
							height: 35px;
							display: block;
							margin-left: -20px;
						}

						.item-name {
							padding: 0px 10px;
						}

						.item-mark {
							position: absolute;
							top: 0px;
							right: 0px;
							padding-left: 20px;
							width: 100%;
							height: 100%;
							display: block;
							opacity: 0;
							box-sizing: unset;
							cursor: move !important;
						}
						.item-mark:link {
							cursor: move !important;
						}
					}
				}
			}

			.label-operate {
				min-height: 300px;
				position: relative;
				.ivu-card-head{
					display:none;
				}
				.periods-tab{
					margin-bottom: 30px;
				}
				.loop_body_area {
					display: block;
					width: 100%;
					height: 100%;
					position: relative;
					overflow-x: auto;
				}

				.loop_body {
					position: relative;
					z-index: 2;
				}

				.line_view {
					position: absolute;
					top: 0px;
					left: 0px;
					width: 100%;
					height: 100%;

					.indent {
						width: 30px;
						height: 30px;
						position: absolute;
						margin-top: -15px;
						margin-left: 15px;
					}
					.yes_indent {
						background: url("/static/images/marketing/yes_branch.png") no-repeat center center;
						background-size: 100% auto;
					}
					.no_indent {
						background: url("/static/images/marketing/no_branch.png") no-repeat center center;
						background-size: 100% auto;
					}
				}
			}

			.drag_tip {
				text-align: center;
				padding: 20px 0px;
				font-size: 12px;
			}
		}

	}
</style>
