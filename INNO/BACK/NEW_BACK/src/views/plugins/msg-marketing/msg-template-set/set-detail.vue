<template>
	<pageBaseTop class="msg-tempalte-detail">
		<div class="page-divider">
			{{weixin_msg_tpl.tpl_title}}
		</div>
		<div class="flex p-15">
			微信模板&nbsp;
			<i-switch v-model="weixin_msg_tpl.is_open" :true-value="1" :false-value="0" size="large">
				<span slot="open">开启</span>
				<span slot="close">关闭</span>
			</i-switch>
		</div>
		<div class="template-detail">
			<div class="flex template-card-area">
				<div class="template-card">
					<div class="card-content">
						<div class="tem-card-head">{{weixin_msg_tpl.tpl_title || '通知标题'}}</div>
						<div class="tem-card-time">8月8日</div>
						<div class="tem-card-title">{{weixin_msg_tpl.show_header_title}}</div>
						<div class="tem-card-cont" v-html="weixin_msg_tpl.content_demo" style="white-space: pre-line;"></div>
						<!-- <div class="card-c-items">
							<div class="card-c-item flex" v-for="(item, index) in weixin_msg_tpl.content_demo_arr" :key="item.params_name">
								<div class="card-c-label f-shrink0">{{item}}</div>
							</div>
						</div> -->
					</div>
					<div class="flex f-just-between f-align-center card-point">
						<span>{{weixin_msg_tpl.show_footer_title}}</span>
						<Icon type="ios-arrow-forward" />
					</div>
				</div>
				<div class="template-card-edit">
					<Form ref="template-form" :label-width="120" :model="weixin_msg_tpl">
						<div class="template-card-edit-stay">
							<FormItem 
							label="底部描述录入"
							prop="show_footer_title"
							:rules="{required: true, message: '底部描述录入不能为空', trigger: 'blur', type:'string'}"
							>
								<Input type="textarea" class="template-footer-title" v-model="weixin_msg_tpl.show_footer_title" />
							</FormItem>
							<FormItem 
							label="字体颜色"
							prop="tpl_body_color"
							:rules="{required: true, message: '字体颜色不能为空', trigger: 'blur', type: 'string'}"
							>
								<ColorPicker v-model="weixin_msg_tpl.tpl_body_color" />
							</FormItem>
							<FormItem label="链接" 
							prop="tpl_url"
							:rules="{required: weixin_msg_tpl.tpl_url_type == 'LINKURL' ? true : false, message: '链接不能为空', trigger: 'blur', type: 'string'}"
							>
								<Select v-model="weixin_msg_tpl.tpl_url_type" class="m-bottom-5" style="width:200px;">
									<Option value="0">默认链接</Option>
									<Option value="LINKURL">外链</Option>
								</Select>
								<Input type='text' style="width:200px;" placeholder="输入链接地址" v-if="weixin_msg_tpl.tpl_url_type == 'LINKURL'" v-model="weixin_msg_tpl.tpl_url"	/>
							</FormItem>
							<div class="text-r">
								<Button type="primary" @click="saveTemplate">保存</Button>
							</div>
						</div>
						
					</Form>
				</div>
			</div>
		</div>
		<Divider />
		<div>
			<template v-if="(!sms_message.mobile_message_enable) && sms_message.tpl_id">
				<div class="flex p-15">
					短信模板&nbsp;
					<i-switch v-model="sms_message.is_open" :true-value="1" :false-value="0" size="large">
						<span slot="open">开启</span>
						<span slot="close">关闭</span>
					</i-switch>
				</div>
				<div class="p-15" style="max-width:900px;">
					<div>
						<Input class="send-content" placeholder="请输入短信内容" type="textarea" v-model="sms_message.send_content" />
					</div>
					<div class="flex f-just-between p-15">
						<div>
							<Button class="m-right-10" type="primary" @click="addMsgContent('<{' + item + '}>')" v-for="(item, index) in sms_message.tpl_desc" :key="index">{{item}}</Button>
						</div>
						<Button type="primary" @click="saveTemplate">保存</Button>
					</div>
				</div>
			</template>
			<template v-if="!sms_message.tpl_id">
				<div>短信模板不存在</div>
			</template>
		</div>
	</pageBaseTop>
</template>
<script>
	import pageBaseTop from "@/views/my-components/page-top-base/index";
	export default{
		name: "",
		components:{
			pageBaseTop,
		},
		data(){
			return {
				weixin_msg_tpl: {
					tpl_body_color: "",
					tpl_url_type: 0,
				},
				sms_message: {}
			}
		},
		methods:{
			initParams(){
				let query = this.$route.query || {};
				this.tplId = query.tpl_id || {};
			},
			loadData(){
				if(!this.tplId) return;
				return this.$ajax.post(this.$api.weixinTemplateInfo,{
					tpl_id: this.tplId
				}).then((response)=>{
					let res = response.data || {};
					if(res.code){
						let data = res.data || {};
						let weixin_msg_tpl = data.weixin_msg_tpl || {};
						weixin_msg_tpl.is_open = parseInt(weixin_msg_tpl.is_open);
						let content_demo = JSON.parse(JSON.stringify(weixin_msg_tpl.content_demo));
						content_demo = content_demo.replace(/\n|\r\n/g, '<br>');
						console.log("weixin_msg_tpl.content_demo", content_demo);
						this.weixin_msg_tpl = weixin_msg_tpl;
						console.log("weixin_msg_tpl", this.weixin_msg_tpl);
						let sms_message = data.sms_message || {};
						sms_message.is_open = parseInt(sms_message.is_open);
						this.sms_message = sms_message;
						
					}
				})
			},
			addMsgContent(content){
				let sms_message = this.sms_message || {};
				let send_content = sms_message.send_content || "";
				send_content = send_content ? (send_content + content) : content;
				this.sms_message.send_content = send_content;
			},
			checkSave(){
				return new Promise((rs, rj)=>{
					let weixin_msg_tpl = this.weixin_msg_tpl || {};
					let sms_message = this.sms_message || {};
					if(weixin_msg_tpl.is_open == 1){
						this.$refs["template-form"].validate((valid) => {
							if(valid){
								if(sms_message.is_open == 1 && !sms_message.send_content){
									rj("请完善短信模板内容");
								} else {
									rs({
										weixin_msg_tpl,
										sms_message
									});
								}
							} else {
								rj("请完善微信模板内容");
							}
						})
					} else if(sms_message.is_open == 1 && !sms_message.send_content){
						rj("请完善短信模板内容");
					} else {
						rs({
							weixin_msg_tpl,
							sms_message
						});
					}
				})
				
			},
			saveTemplate(){
				this.checkSave().then(({weixin_msg_tpl, sms_message})=>{
					return this.$ajax.post(this.$api.weixinTemplateSave,{
						...weixin_msg_tpl,
						mobile_is_open: sms_message.is_open,
						send_content: sms_message.send_content
					}).then((response)=>{
						let res = response.data || {};
						if(res.code){
							this.$Message.success(res.message);
							this.$router.go(-1);
						} else {
							this.$Message.warning(res.message);
						}
					})
				}).catch((msg)=>{
					this.$Message.error(msg);
				})
			}
		},
		mounted(){
			this.initParams();
			this.loadData();
		}
	}
</script>
<style lang="less">
	.msg-tempalte-detail{
		.template-card-area{
			align-items: flex-start;
		}
		.template-card{
			flex-shrink: 0;
			width: 300px;
			box-sizing: border-box;
			border: 1px solid #dcdee2;
			.card-content{
				min-height: 200px;
				padding:20px;
				font-size:13px;
				.card-c-items{
					margin-top:30px;
					.card-c-label{
						color:#D2D2D2;
						width:120px;
					}
				}
				.tem-card-head{
					margin-bottom: 15px;
					font-weight: bold;
					color: #666;
					font-size:16px;
				}
				.tem-card-time{
					margin: 10px 0px;
				}
				.tem-card-title{
					margin-bottom: 10px;
				}
				.tem-card-cont{
					line-height: 30px;
				}
			}
			.card-point{
				border: 1px dashed #FE8337;
				min-height:40px;
				padding:7px 20px;
				cursor: pointer;
				-moz-border-radius: 5px;
				-webkit-border-radius: 5px;
				border-radius: 5px;
			}
		}
		.template-card-edit{
			.template-card-edit-stay{
				width: 400px;
				padding: 20px;
				border: 1px solid #E1E1E1;
				border-radius: 5px;
				background-color:#F6F6F6;
				margin-left:50px;
				.template-footer-title{
					.ivu-input{
						min-height:100px;
					}
				}
			}
			.ivu-form-item{
				// display:flex;
				margin-bottom: 24px;
				.ivu-form-item-label{
					flex-shrink: 0;
				}
			}
		}
		.send-content{
			.ivu-input{
				min-height:100px;
			}
		}
	}
</style>