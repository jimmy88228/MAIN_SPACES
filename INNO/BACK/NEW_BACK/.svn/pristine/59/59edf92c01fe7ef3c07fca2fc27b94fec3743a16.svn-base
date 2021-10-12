<style lang="less">
	.qiwei-msg-area {
		.add-points {
			justify-content: space-around;
			text-align:center;
			.add-point {
				width:75px;
				padding: 5px;
				border: 1px solid #efefef;
				text-align: center;
				cursor: pointer;
				font-size:12px;
			}
		}
		.module-list-view{
			height:calc(100vh - 400px);
			overflow-y: auto;
			position:relative;
		}
		.module-list{
			padding: 20px;
			box-sizing: border-box;
			.module-item-label{
				margin-bottom: 10px;
				font-weight:bold;
			}
			.module-item{
				padding:10px;
				padding-bottom:0px;
				border:1px solid #dcdee2;
				border-radius: 10px;
				position:relative;
				margin-bottom:10px;
				.module-close{
					position: absolute;
					top:0px;
					right:0px;
					transform: translate(40%, -40%);
					z-index:10;
					cursor: pointer;
					opacity: 0;
					transition: opacity .35s;
				}
				.video-wrapper{
					display:inline-block;
					position:relative;
					.video-close{
						position:absolute;
						top:0px;
						right:0px;
						transform: translate(50%, -50%);
					}
				}
			}
			.module-item:hover .module-close{
				opacity: 1;
			}
		}
	}
</style>

<template>
	<div class="">
		<Modal v-model="showM" :width="880" :styles="{top:'100px'}" class="image-text qiwei-msg-area">
			<div slot="header">
				<div class="flex f-align-center m-bottom-10 ">
					<div class="space-nowrap fw-bold fs-18">节点设置-企微消息</div>
					<!-- <Input style="width:250px" v-model="config.tip" /> -->
				</div>
			</div>
			<div class="p-left-15 m-bottom-15 model-tip">
				<div>1、素材来自微信公众号后台，在创建群发，请到微信公众号后台设置到群发素材。</div>
			</div>
			<div class="module-list-view">
				<vue-scroll ref="vue-scroll" :ops="scrollOptions">
					<Form class="module-list" ref="settingForm" :model="formData">
						<div class="module-item" v-for="(item, index) in  formData.setting" :key="index">
							<Icon size="25" color="#0DA9F2" class="module-close" type="ios-close-circle" v-if="!(item._type && index == 0)" @click="removeModule(index)"/>
							<div class="module-item-label">{{getName(item._type)}}</div>
							<template v-if="item._type == 'TEXT'">
								<FormItem :prop="'setting.' + index + '.content'" :rules="ruleValidate.content">
									<Input type="textarea" placeholder="请输入发送内容" v-model="item.content" :show-word-limit="true" :maxlength="240"/>
								</FormItem>
							</template>
							<template v-else-if="item._type == 'IMAGE'">
								<FormItem :prop="'setting.' + index + '.pic_url'" :rules="ruleValidate.pic_url">
									<image-edit class="lable-img-edit" :img="item.pic_url" @selectImg="openImagesModal(index, 'pic_url')"
										@delImg="item.pic_url = ''">
										<p class="strong_tips">图片尺寸最佳是900*383，格式为 jpg 或 png，图片大小控制在200KB</p>
										<Input v-model="item.pic_url" v-show="false" />
									</image-edit>
								</FormItem>
							</template>
							<template v-else-if="item._type == 'VIDEO'">
								<FormItem :prop="'setting.' + index + '.pic_url'" :rules="ruleValidate.pic_url">
									<div v-if="item.pic_url" class="video-wrapper">
										<video :src="item.pic_url" controls="controls" width="200" height="112">
											您的浏览器不支持 video 标签。
										</video>
										<Icon size="25" color="#0DA9F2" class="module-close" type="ios-close-circle" @click="item.pic_url = ''"/>
									</div>
									<div v-else class="image-box" @click="chooseVideoModal(index, 'pic_url', item.pic_url, 'video')">
										<Icon type="md-add" size="35"></Icon>
									</div>
									<Input v-model="item.pic_url" v-show="false" />
									<div class="strong_tips">视频大小不能超过100M,建议使用mp4格式</div>
								</FormItem>
							</template>
							<!-- <template v-if="item._type == 'NEWS'">
								<div class="paper-view">
									<Icon type="md-close-circle" size="25" class="remove-paper" />
									<div class="paper-cont flex">
										<span class="paper-tip">图文</span>
										<p>图文名称</p>
									</div>
									<div class="paper-link flex f-just-between">
										<span>阅读全文</span>
										<span>&gt;</span>
									</div>
								</div>
								<div v-else>
									<div class="paper-choose">
										<span class="choose-add">+</span>
										<p>选择图文</p>
									</div>
								</div>
							</template> -->
							<template v-if="item._type == 'WEB'">
								<FormItem label="标题" :prop="'setting.' + index + '.title'" :label-width="100" :rules="ruleValidate.title">
									<Input type="text" class="basic_input" v-model="item.title" placeholder="请输入网页标题" /> <span class="strong_tips"> 最多只能输入25个字</span>
								</FormItem>
								<FormItem label="描述" :prop="'setting.' + index + '.desc'" :label-width="100" :rules="ruleValidate.desc">
									<Input type="text" class="basic_input" v-model="item.desc" placeholder="请输入网页描述" /> <span class="strong_tips"> 最多只能输入50个字</span>
								</FormItem>
								<FormItem label="地址" :prop="'setting.' + index + '.urlPath'" :label-width="100" :rules="ruleValidate.urlPath">
									<Input type="text" class="basic_input" v-model="item.urlPath" placeholder="请输入网页地址" /> <span class="strong_tips"> 带http:/https:开头</span>
								</FormItem>
								<FormItem label="图片" :prop="'setting.' + index + '.pic_url'" :label-width="100" :rules="ruleValidate.pic_url">
									<image-edit :img="item.pic_url" @selectImg="openImagesModal(index, 'pic_url')" @delImg="item.pic_url = ''">
										<p class="strong_tips">*小于1M的图片，JPG/PNG格式只能上传一张</p>
									</image-edit>
									<Input v-model="item.pic_url" v-show="false" />
								</FormItem>
							</template>
							<template v-if="item._type == 'MINIPROGRAMPAGE'">
								<FormItem label="APPID" :prop="'setting.' + index + '.appid'" :label-width="100" :rules="ruleValidate.appid">
									<Input type="text" class="basic_input" v-model="item.appid" placeholder="请输入小程序APPID" />
								</FormItem>
								<FormItem label="小程序路径" :prop="'setting.' + index + '.urlPath'" :label-width="100" :rules="ruleValidate.urlPath">
									<Input type="text" class="basic_input" v-model="item.urlPath" placeholder="请输入小程序路径" />
								</FormItem>
								<FormItem label="标题" :prop="'setting.' + index + '.title'" :label-width="100" :rules="ruleValidate.title">
									<Input type="text" class="basic_input" v-model="item.title" placeholder="请输入小程序标题,10字以内" /><span class="strong_tips">最多只能输入10个字</span>
								</FormItem>
								<FormItem label="图片" :prop="'setting.' + index + '.pic_url'" :label-width="100" :rules="ruleValidate.pic_url">
									<image-edit :img="item.pic_url" @selectImg="openImagesModal(index, 'pic_url')" @delImg="item.pic_url = ''">
										<p class="strong_tips">*小于1M的图片，JPG/PNG格式只能上传一张</p>
									</image-edit>
									<Input v-model="item.pic_url" v-show="false" />
								</FormItem>
							</template>
						</div>
					</Form>
				</vue-scroll>
				<Spin v-if="showSpin" fix></Spin>
			</div>
			<!-- <Tabs type="card" @on-click="changeTab" :value="currTabs">
				<TabPane v-for="(item, index) in tabs" :key="index" :name="item.name" :label="item.label" v-if="setTab(item.name)">
					<template v-if="item.name == 'TEXT'">
						<Input type="textarea" v-model="setting.content"/>
					</template>
					<template v-else-if="item.name == 'IMAGE'">
						<image-edit class="lable-img-edit" :img="setting.img_url" @selectImg="openImagesModal" @delImg="setting.img_url = ''">
						  <p class="strong_tips">图片尺寸最佳是900*383，格式为 jpg 或 png，图片大小控制在200KB</p>
						</image-edit>
					</template>
					<template v-if="item.name == 'IMAGE-TEXT'">
						<div v-if="false" class="paper-view">
						  <Icon type="md-close-circle" size="25"  class="remove-paper"/>
						  <div class="paper-cont flex">
							<span class="paper-tip">图文</span>
							<p>图文名称</p>
						  </div>
						  <div class="paper-link flex f-just-between">
							<span>阅读全文</span>
							<span>&gt;</span>
						  </div>
						</div>
						<div v-else>
						  <div class="paper-choose">
							<span class="choose-add">+</span>
							<p >选择图文</p>
						  </div>
						</div>
					</template>
					<template v-if="item.name == 'APPLET'">
						<Form :label-width="100" style="width:80%;">
						  <FormItem label="自定义跳转" class="" prop="">
							<Input type="text" v-model="setting.card_url" placeholder="请输入小程序路径"/>
						  </FormItem>
						  <FormItem label="标题" class="" prop="">
							<Input type="text" v-model="setting.card_title" placeholder="请输入节点名称，10字以内"/>
						  </FormItem>
						  <FormItem label="图片" class="" prop="">
							<image-edit :img="setting.img_url">
							  <p class="strong_tips">*小于1M的图片，JPG/PNG格式只能上传一张</p>
							</image-edit>
						  </FormItem>
						</Form>
					</template>
				</TabPane>
			  </Tabs> -->
			<div>
				<Poptip word-wrap width="450" trigger="hover" placement="top-start">
					<div slot="content" class="flex add-points">
						<template v-if="formData.setting.length < 9">
							<div class="f-shrink0 add-point" v-for="(item, index) in tabs" :key="item.name" @click="showSpin ? '' : addModule(item.name)">
								<Icon size="23" :type="item.icon" />
								<p>{{item.label}}</p>
							</div>
						</template>
						<template v-else>
							<div style="height:53px;line-height:53px;">不可添加超过9个</div>
						</template>
					</div>
					<a class="">+<span v-for="(item, index) in tabs" :key="item.name"><template v-if="index != 0">/</template>{{item.label}}</span></a>
				</Poptip>
			</div>
			<div slot="footer">
				<Button type="default" @click="showM = false">取消</Button>&nbsp;&nbsp;
				<Button type="primary" @click="saveSetting">确定</Button>
			</div>
		</Modal>
	</div>
</template>

<script>
	import imageEdit from '@/views/my-components/image-edit/image-edit'
	export default {
		name: 'qiweiMsgSave',
		components: {
			imageEdit
		},
		data() {
			return {
				showM: false,
				showSpin: false,
				config: {},
				formData: {
					setting: [],
				},
				ruleValidate: {
					content: [{required: true, message: '发送内容不能为空', trigger: 'blur'}],
					pic_url: [{required: true, message: '请选择上传图/视频', trigger: 'change'}],
					title: [{required: true, message: '请填写标题', trigger: 'blur'}],
					desc: [{required: true, message: '请填写描述', trigger: 'blur'}],
					urlPath: [{required: true, message: '请填写路径地址', trigger: 'blur'}],
					appid: [{required: true, message: '请填写小程序APPID', trigger: 'blur'}]
				},
				tabs: [{
						name: "TEXT",
						label: "文本信息",
						icon: "md-list-box"
					},
					{
						name: "IMAGE",
						label: "图片信息",
						icon: "md-image"
					},
					{
						name: "VIDEO",
						label: "视频",
						icon: "md-videocam"
					},
					{
						name: "WEB",
						label: "网页链接",
						icon: "md-desktop"
					},
					{
						name: "MINIPROGRAMPAGE",
						label: "小程序卡片",
						icon: "md-compass"
					}
				],
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
		mounted() {},
		methods: {
			showModal(config = {}, setting) {
				this.showM = true;
				this.config = config || {};
				this.tip = config.tip || "";
				this.settingHandle(setting, config);
			},
			getName(type){
				if(!type) return "";
				let tabs = this.tabs || [];
				for(let i = 0; i < tabs.length; i++){
					if(tabs[i].name == type){
						return tabs[i].label;
						break;
					}
				}
				return "";
			},
			settingHandle(setting, config) {
				console.log("config", config);
				console.log("before setting", setting);
				if(!(setting instanceof Array)){
					setting = [{
						_type: 'TEXT',
						msg_type: 'text',
						content: ''
					}] 
				};
				for(let i = 0; i < setting.length; i++){
					let msg_type = setting[i].msg_type || "";
					if(msg_type){
						setting[i]._type = msg_type.toLocaleUpperCase();
					}
				}
				this.formData.setting = setting;
			},
			chooseVideoModal(index, name, url, type){
				this.$selectMaterial({
				  type: type,
				  selectedData: url,
				  getList:(item)=> {
				    this.$set(this.formData.setting[index], name, item.src);
				  }
				});
			},
			openImagesModal(index, key) {
				this.$selectMaterial({
					type: 'image',
					selectedData: this.formData.setting[index][key],
					getList: (item) => {
						console.log("图片", item)
						this.$set(this.formData.setting[index], key, item.src);
					}
				});
			},
			addModule(name){
				let item = {};
				switch(name){
					case "TEXT":
						item.content = "";
						break;
					case "IMAGE":
						item.local_pic_url = "";
						item.media_id = "";
						item.pic_url = "";
						break;
					case "VIDEO":
						item.local_pic_url = "";
						item.media_id = "";
						item.pic_url = "";
						break;
					case "WEB":
						item.local_pic_url = "";
						item.media_id = "";
						item.pic_url = "";
						item.desc = "";
						item.title = "";
						item.urlPath = "";
						break;
					case "NEWS":
						
						break;
					case "MINIPROGRAMPAGE":
						item.local_pic_url = "";
						item.media_id = "";
						item.pic_url = "";
						item.desc = "";
						item.title = "";
						item.urlPath = "";
						item.appid = "";
						break;
				}
				item.msg_type = name.toLocaleLowerCase();
				item._type = name;
				this.formData.setting.push(item);
				console.log("setting", this.formData.setting);
				this.$nextTick(()=>{
					this.$refs["vue-scroll"].scrollTo({
						y: "100%"
					},500)
				})
			},
			removeModule(index){
				this.formData.setting.splice(index, 1);
			},
			saveSetting() {
				this.$refs["settingForm"].validate((valid)=>{
					if(valid){
						console.log("this.formData", this.formData);
						this.showSpin = true;
						this.$ajax.post(this.$api.OnceMarketingSendQwMsq,{
							setting: this.formData.setting || []
						}).finally(()=>{
							this.showM = false;
							this.showSpin = false;
							this.$emit("saveMsg", {
								setting: this.formData.setting,
								...this.config
							})
						})
					} else {
						this.$Message.warning("请完善信息");
					}
				})
				
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
	}
</style>
