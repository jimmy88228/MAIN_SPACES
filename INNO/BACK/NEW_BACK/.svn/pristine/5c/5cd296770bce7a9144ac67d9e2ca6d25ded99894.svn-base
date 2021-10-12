<template>
	<div class="main-view">
		<div class="label-node" v-for="(item, index) in loopData" :key="item._level">
			<div class="label-item" :class="['label' + item._level]" :tagType="item.tagType"
				@mouseenter="switchOperate('enter', index)" @mouseleave="switchOperate('out', index)">
				<div class="label-info"
					@dblclick="checkSaveMsg(item.tagType, item._level, item.chart_setting, item.name)">
					<template v-if="item.tagType || item.tagType === 0">
						<img :src="labelList[item.tagType].img" />
						<Poptip word-wrap width="200" placement="bottom">
								<div slot="content">
									<Input v-model="item.name" @on-blur="(e)=>editName(e, index)"/>
								</div>
								<p class="label-name">
									{{ item.name || labelList[item.tagType].name }}
									<Icon type="ios-create" size="16" color="#2F8CEE"/>
								</p>
						</Poptip>
						
					</template>
					<template v-else>
						<img :src="labelList['default'].img" />
					</template>
					<div class="operNum-area" v-if="(item.tagType != 0 && item.tagType != 8) && marketStatus != 0 && (item.oper && item.oper[periodsId])"> <!--开始结束标签不显示-->
						<p class="operNum">{{item.oper[periodsId].num}}</p>
					</div>
				</div>
				<div class="info_operate">
					<div class="branch_operate" v-if="item.tagType != 0" :class="[item.showOperate]">
						<a class="del_branch" @click="removeBranch(item._level)" v-if="(item._level != '0_0')">
							<Icon type="ios-close-circle-outline" />
						</a>
						<a class="add_branch" v-if="isShowOperate(item)" @click="switchBranch('show',index)">
							<Icon type="ios-add-circle-outline" />
						</a>
					</div>
					<div class="create_branch flex f-align-center" :class="[item.showCreate]">
						<div class="branch_type">
							<a class="y_branch" v-if="checkBranch(item, 'yes')"
								@click="creatBranch('yes', item._level)">是分支</a>
							<a class="n_branch" v-if="checkBranch(item, 'no')"
								@click="creatBranch('no', item._level)">否分支</a>
						</div>
						<div class="close_create_branch">
							<a class="close_operate" @click="switchBranch('close',index)">
								<Icon type="ios-close-circle-outline" />
							</a>
						</div>
					</div>
				</div>
			</div>
			<div class="label-children">
				<template v-if="item.children && item.children.length > 0">
					<loopBody 
					:labelList="labelList" 
					:tagsData="item.children" 
					:level="item._level" 
					:periodsId="periodsId"
					:marketStatus="marketStatus"
					v-bind="$attrs"
						v-on="$listeners"></loopBody>
				</template>
			</div>
		</div>
	</div>
</template>

<script>
	import loopBody from "./loopBody";
	export default {
		name: "loopBody",
		props: {
			labelList: {
				type: Object,
				default () {
					return {}
				}
			},
			tagsData: {
				type: Array,
				default () {
					return []
				}
			},
			level: {
				type: String,
				default () {
					return ""
				}
			},
			marketStatus: {
				type: String | Number,
				default () {
					return 0
				}
			},
			periodsId: {
				type: String | Number,
				default(){
					return 0
				}
			}
		},
		components: {
			loopBody
		},
		data() {
			return {
				space: 50,
				posJson: {},
				loopData: []
			};
		},
		computed: {},
		watch: {
			tagsData: {
				handler: function(list) {
					let data = []
					for (let i = 0; i < list.length; i++) {
						let item = list[i];
						let canShowAdd = false;
						data.push({
							_level: (this.level + "") == "" ? i + "" : this.level + "_" + i,
							showCreate: "",
							showOperate: "",
							...list[i]
						})
					}
					this.loopData = data;
				},
				deep: true,
				immediate: true,
			}
		},
		methods: {
			isShowOperate(row) {
				if (row.tagType && row.tagType != 100 && row.tagType != 8) {
					if (row.tagType == 1 && row.children && row.children.length < 2) {
						return true;
					} else if (row.tagType != 1 && row.children && row.children.length < 1) {
						return true;
					}
				}
				return false
			},
			checkBranch(data, type) {
				let child = data.children || [];
				if (child.length > 1) return false;
				else if (child.length == 0) return true;
				else {
					if (data.tagType == 1) {
						if (child[0].type == type) return false;
						else return true;
					} else {
						return false
					}
				}
			},
			checkSaveMsg(tagType, level, setting, name) {
				name = name || this.labelList[tagType].name;
				this.$emit("checkSaveMsg", {
					tagType: tagType,
					level: level,
					setting: setting,
					name: name
				});
			},
			creatBranch(type, level) {
				this.$emit("createBranch", {
					type: type,
					level: level
				});
			},
			removeBranch(level) {
				this.$emit("removeBranch", {
					level: level
				});
			},
			switchOperate(type, index) {
				let editData = this.loopData[index] || {};
				if (type == "enter") {
					editData.showOperate = "show";
					this.$emit("labelEnter", {
						level: editData._level
					});
				} else {
					editData.showOperate = "";
					editData.showCreate = "";
					this.$emit("labelOut", {
						level: editData._level
					});
				}
				this.$set(this.loopData, index, editData);
			},
			switchBranch(type, index) {
				let editData = this.loopData[index] || {};
				if (editData.tagType == 1) { // 判断是否为会员筛选标签
					editData.showCreate = type == "show" ? 'show' : '';
					this.$set(this.loopData, index, editData);
				} else {
					this.creatBranch("", editData._level);
				}
			},
			editName(e, index){
				let val = e.target.value || "";
				this.tagsData[index].name = val;
				this.tagsData[index].screen_name = val;
			}
		},
		mounted() {},
		created() {}
	};
</script>
<style lang="less" scoped>
	.label-node {
		position: relative;
		min-width: 60px;
		min-height: 240px;

		.label-item {
			position: absolute;
			top: 50%;
			left: 0px;
			width: 60px;
			height: 60px;
			transform: translateY(-50%);
			text-align: center;
			background-color: #fff;

			.label-info {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				font-size: 0px;
				img {
					width: 40px;
					height: 40px;
					display: block;
					cursor: pointer;
				}
				.ivu-poptip-title{display: none;}
				.ivu-poptip-popper{top:70px !important;}
				.label-name {
					position: absolute;
					left: 50%;
					bottom: -10px;
					transform: translate(-50%, 100%);
					// width:100%;
					white-space: nowrap;
					font-size: 12px;
					background-color: #fff;
					cursor: pointer;
				}
				.operNum-area{
					position:absolute;
					top:-10px;
					left:50%;
					transform: translate(-50%, -100%);
					background-color:#2FA3FD;
					color:#fff;
					border-radius: 100px;
					white-space: nowrap;
					padding:0px 7px;
				}
				.operNum-area::after{
					content: "";
					display: block;
					background-color:#2FA3FD;
					position:absolute;
					left:50%;
					bottom:0px;
					transform: translate(-50%, 30%) rotate(45deg);
					border: 6px solid #2FA3FD;
					border-top: transparent;
					border-right: transparent;
				}
			}

			//创建
			.info_operate {
				position: absolute;
				top: 0px;
				right: 0px;
				width: 6em;
				height: 100%;
				transform: translateX(100%);
				-ms-transform: translateX(100%);
				-moz-transform: translateX(100%);
				-webkit-transform: translateX(100%);
				-o-transform: translateX(100%);
				overflow: hidden;

				.branch_operate {
					position: absolute;
					/* height: 100%; */
					top: 50%;
					left: 0px;
					background: #fff;
					transform: translateY(-50%);
					-ms-transform: translateY(-50%);
					-moz-transform: translateY(-50%);
					-webkit-transform: translateY(-50%);
					-o-transform: translateY(-50%);
					transition: all .4s;
					-moz-transition: all .4s;
					-webkit-transition: all .4s;
					-o-transition: all .4s;
					opacity: 0;

					a {
						display: block;
						width: 17px;
						height: 17px;
						/*border:1px solid #696969;*/
						-moz-border-radius: 100%;
						-webkit-border-radius: 100%;
						border-radius: 100%;
						line-height: 17px;
						text-align: center;
						margin: 7px;
						text-indent: -4em;
						overflow: hidden;
					}

					.del_branch {
						background: url(/static/images/marketing/del_branch.png) no-repeat center center;
						background-size: 100% auto;
					}

					.add_branch {
						background: url(/static/images/marketing/add_branch.png) no-repeat center center;
						background-size: 100% auto;
					}
				}

				.branch_operate.show {
					transform: translateY(-50%);
					-ms-transform: translateY(-50%);
					-moz-transform: translateY(-50%);
					-webkit-transform: translateY(-50%);
					-o-transform: translateY(-50%);
					opacity: 1;
				}

				.create_branch {
					width: 6em;
					height: 64px;
					position: absolute;
					top: 0px;
					left: 0px;
					text-align: center;
					background: #fff;
					transform: translateX(-100%);
					-ms-transform: translateX(-100%);
					-moz-transform: translateX(-100%);
					-webkit-transform: translateX(-100%);
					-o-transform: translateX(-100%);
					transition: all .4s;
					-moz-transition: all .4s;
					-webkit-transition: all .4s;
					-o-transition: all .4s;
					opacity: 0;

					.branch_type {
						a {
							display: block;
							width: 100%;
							text-align: center;
							line-height: 24px;
							// margin: 4px 0px;
						}
					}

					.close_create_branch {
						padding-left: 5px;

						.close_operate {
							display: inline-block;
							width: 17px;
							height: 17px;
							-moz-border-radius: 100%;
							-webkit-border-radius: 100%;
							border-radius: 100%;
							line-height: 17px;
							text-align: center;
							background: url(/static/images/marketing/del_branch.png) no-repeat center center;
							background-size: 100% auto;
							text-indent: -4em;
							overflow: hidden;
						}
					}
				}

				.create_branch.show {
					transform: translateX(0);
					-ms-transform: translateX(0);
					-moz-transform: translateX(0);
					-webkit-transform: translateX(0);
					-o-transform: translateX(0);
					opacity: 1;
				}
			}

		}

		.label-item[index=0] {
			color: #fff;

			.info_operate {
				display: none;
			}
		}

		.label-children {
			position: relative;
			left: 150px;
			display: inline-block;
		}
	}
</style>
