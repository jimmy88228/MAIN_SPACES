<template>
	<div>
		<Modal v-model="showM" :width="880" :styles="{top:'100px'}" class="image-text">
			<div slot="header">
				<div class="flex f-align-center m-bottom-10 ">
					<div class="space-nowrap fw-bold fs-18 p-right-15">{{title}}</div>
					<!-- <Input style="width:250px" v-model="config.tip" v-if="isEditTip"/> -->
				</div>
			</div>
			<div class="p-left-15 m-bottom-15 model-tip">
				<div>1、素材来自微信公众号后台，在创建群发，请到微信公众号后台设置到群发素材。</div>
				<div>2、服务号群发消息给个人，一个月最多发送4次，超过次数个人会接收不到。</div>
			</div>
			<Tabs type="card" @on-click="changeTab" :value="currTabs">
				<TabPane v-for="(item, index) in tabs" :key="index" :name="item.name" :label="item.label"
					v-if="setTab(item.name)" :icon="item.icon">
					<Form :ref="item.name + '-form'" :model="setting">
						<template v-if="item.name == 'text'">
							<FormItem class="" prop="content" :rules="{required: true,  message:'请填写文本消息',trigger: 'change'}">
								<Input type="textarea" v-model="setting.content" />
							</FormItem>
						</template>
						<template v-else-if="item.name == 'image'">
							<FormItem class="" prop="img_url" :rules="{required: true, message:'请选择上传图',trigger: 'change'}">
								<div class="upload-img-area" @click="chooseMaterial('image', 'img_url')">
									<img :src="setting.img_url"  v-if="setting.img_url"/>
									<Icon type="md-add" size="30" class="add-img-icon" v-else/>
								</div>
								<Input v-show="false" v-model="setting.img_url" />
							</FormItem>
						</template>
						<template v-if="item.name == 'news'">
							<FormItem class="" prop="news" :rules="{required: true, message:'请选择图文',trigger: 'change'}">
								<div v-if="setting.news" class="paper-view">
									<Icon type="md-close-circle" size="25" class="remove-paper" @click="setting.news = ''"/>
									<div class="paper-cont flex">
										<span class="paper-tip">图文</span>
										<p>图文名称</p>
									</div>
									<div class="paper-link flex f-just-between">
										<span>阅读全文</span>
										<span><Icon type="ios-arrow-forward" /></span>
									</div>
								</div>
								<div v-else>
									<div class="paper-choose" @click="chooseMaterial('news', 'img_url')">
										<span class="choose-add">+</span>
										<p>选择图文</p>
									</div>
								</div>
							</FormItem>
						</template>
						<template v-if="item.name == 'miniprogrampage'">
							<FormItem label="自定义跳转" class="" prop="card_url" :label-width="100" :rules="{required: true, message:'请输入小程序路径',trigger: 'change'}">
								<Input type="text" class="basic_input" v-model="setting.card_url" placeholder="请输入小程序路径" />
							</FormItem>
							<FormItem label="标题" class="" prop="card_title" :label-width="100" :rules="{required: true, message:'请输入小程序标题',trigger: 'change'}">
								<Input type="text" class="basic_input" v-model="setting.card_title" placeholder="请输入节点名称，10字以内" />
							</FormItem>
							<FormItem label="图片" class="" prop="img_url" :label-width="100" :rules="{required: true, message:'请输入小程序卡片图',trigger: 'change'}">
								<div class="upload-img-area" @click="chooseMaterial('image', 'img_url')">
									<img :src="setting.img_url"  v-if="setting.img_url"/>
									<Icon type="md-add" size="30" class="add-img-icon" v-else/>
								</div>
								<Input v-show="false" v-model="setting.img_url" />
							</FormItem>
						</template>
					</Form>
				</TabPane>
			</Tabs>
			<div slot="footer">
				<Button type="default" @click="showM = false">取消</Button>&nbsp;&nbsp;
				<Button type="primary" @click="saveSetting">确定</Button>
			</div>
		</Modal>
	</div>
</template>

<script>
	export default {
		name: 'imageText',
		props: {
			isEditTip:{
				type: Boolean,
				default(){
					return true
				}
			},
			title: {
				type: String,
				default(){
					return "节点设置-发消息"
				}
			}
		},
		components: {},
		data() {
			return {
				showM: false,
				config: {},
				setting: {
					content: "",
					image: "",
					img_url: "",
					msg_type: "",
					new: ""
				},
				tabs: [{
						name: "text",
						label: "文本信息",
						icon: "md-list-box"
					},
					{
						name: "image",
						label: "图片信息",
						icon: "md-image"
					},
					{
						name: "news",
						label: "图文信息",
						icon: "ios-list-box"
					},
					{
						name: "miniprogrampage",
						label: "小程序卡片",
						icon: "md-compass"
					}
				],
				currTabs: "",
				tip: ""
			}
		},
		computed: {},
		mounted() {},
		methods: {
			showModal(config = {}, setting) {
				this.showM = true;
				this.config = config || {};
				this.tip = config.tip || "";
				this.settingHandle(setting, config);
			},
			settingHandle(setting, config) {
				if (config.type != 11) {
					if (typeof(setting) == 'string') {
						setting = decodeURIComponent(setting);
						setting = JSON.parse(setting);
					}
				} else {
					if(typeof(setting) == 'string'){
						setting = {
							msg_type: "text",
							content: setting
						}
					}
				}
				if(!setting.msg_type) setting.msg_type = "text";
				this.currTabs = setting.msg_type;
				console.log("setting", setting)
				this.setting = setting;
			},
			chooseMaterial(tabType, key){
				this.$selectModule({
					type: 'radio',
					mode: 'wx-material',
					extraParam: {
						limitSelect: [tabType],
					},
					data: [],
					getList:(item)=>{
						console.log(item);
						let currTabs = this.currTabs || "";
						let info = item[0] || {};
						switch(currTabs){
							case "image":
								this.$set(this.setting, 'image', info.id);
								this.$set(this.setting, 'img_url', info.img);
								break;
							case "miniprogrampage":
								this.$set(this.setting, 'media_id', info.id);
								this.$set(this.setting, 'img_url', info.img);
								break;
							case "news":
								this.$set(this.setting, 'news', info.id);
								break;
						}
						console.log("currTabs", currTabs, "setting", this.setting);
					}
				})
			},
			changeTab(val) {
				this.currTabs = val;
				this.setting.msg_type = val;
			},
			saveSetting() {
				let setting = this.setting || {};
				let msg_type = setting && setting.msg_type;
				let warn = "";
				let formItems = this.$refs[this.currTabs + '-form'];
				let checkForm = formItems instanceof Array ? formItems[0] : formItems;
				checkForm && checkForm.validate((valid)=>{
					console.log("valid", valid);
					console.log("setting", this.setting);
					if(valid){
						this.showM = false;
						this.$emit("saveMsg", {
							setting: this.setting,
							...this.config
						})
					} else {
						this.$Message.warning("请完善信息");
					}
				})
			},
			setTab(key) {
				let hideTab = this.config.hideTab || [];
				if (hideTab instanceof Array) {
					if (key) {
						for (let i = 0; i < hideTab.length; i++) {
							if (hideTab[i] == key) {
								return false;
								break;
							}
						}
					} else {
						return true
					}
				}
				return true
			}
		}
	}
</script>
<style lang="less">
	.image-text {
		.model-tip {
			color: red;
		}

		.ivu-tabs-nav-scroll {
			.ivu-tabs-nav {
				.ivu-tabs-tab {
					border-right-width: 5px;
				}
			}
		}

		.ivu-tabs-tabpane {
			min-height: 300px;

			.lable-img-edit {
				.image-box {
					border: 1px dashed #d2d2d2;
					width: 200px;
					height: 84px;

					.ivu-icon-md-add {
						line-height: 85px;
					}

					.img {
						height: 100%;
					}

					.mask {
						width: 100%;
						height: 100%;
					}

					.img {
						width: 100%;
						display: block;
					}
				}

				.strong_tips {
					padding-top: 10px;
				}
			}

			.paper-view {
				margin: 0px 5px;
				display: inline-block;
				min-width: 300px;
				border: 1px solid #efefef;
				border-radius: 10px;
				position: relative;

				.paper-cont {
					padding: 10px;

					.paper-tip {
						background: #3F8748;
						color: #fff;
						padding: 0px 5px;
						border-radius: 5px;
						margin-right: 10px;
					}
				}

				.paper-link {
					border-top: 1px solid #efefef;
					font-size: 12px;
					padding: 5px;
				}

				.remove-paper {
					position: absolute;
					top: 0px;
					right: 0px;
					transform: translate(40%, -40%);
					cursor: pointer;
				}
			}

			.paper-view:hover {
				box-shadow: 0px 0px 10px #ccc;
			}

			.paper-choose {
				border: 1px dashed #d2d2d2;
				color: #ababab;
				display: table-cell;
				vertical-align: middle;
				text-align: center;
				cursor: pointer;
				width: 200px;
				height: 84px;
				border-radius: 5px;
				.choose-add {
					display: inline-block;
					font-size: 30px;
				}
			}

			.paper-choose:hover {
				border-color: #666;
				color: #666;
			}

			textarea.ivu-input {
				min-height: 200px;
			}
		}
		.upload-img-area{
			position:relative;
			img{
				position:absolute;
				top:50%;
				left:50%;
				transform: translate(-50%, -50%);
				width:100%;
				background-size:100% auto;
				background-repeat: no-repeat;
			}
		}
	}
</style>
