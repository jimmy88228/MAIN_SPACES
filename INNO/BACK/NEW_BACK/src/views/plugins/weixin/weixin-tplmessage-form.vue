<style lang="less">
</style>

<template>
	<div>
		<Modal
		    v-model="modalShow"
		    :title="modalTitle"
		    :loading="modalLoading"
		    :width="700"
		    @on-ok="modalOk">
		    <Form ref="formValidate" :model="formItem" :label-width="100">
		    	<Row>
			        <Col span="11">
			        	<div v-if="formItem.isSetSms">
				        	<FormItem label="启用短信通知" prop="deviceSn">
					            <i-switch v-model="formItem.enableSms" size="large" disabled>
					                <span slot="open">启用</span>
					                <span slot="close">关闭</span>
					            </i-switch>
                      (功能暂未开放)
					        </FormItem>

					        <Divider />

					        <span>自定义短信模板：</span>
				        	<Input
				        		v-model="formItem.smsTemplate"
				        		id="smsTxt"
				        		:rows="3" type="textarea"
				        		placeholder="请按样例，编辑短信模板...">
				        	</Input>
				        	可用变量：
				        	<ButtonGroup size="small" style="margin:5px 0 10px 0;">
						        <Button v-for="(tag,code) in formItem.smsTags" :name="code" :key="code" @click="insertTag(tag)">{{tag}}</Button>
						    </ButtonGroup>

						    <Divider />

				        	<p>消息样例：</p>
				        	<br />
					        <p v-html="formItem.smsDemo"></p>
				        </div>
				        <div v-else>
				        	<span style="color:red">短信模板未配置，暂时不能使用！</span>
				        </div>

			        </Col>
			        <Col span="2">
			        	<div style="height:350px;border-left:1px solid #eee;margin-left: 28px;" class=""></div>
			        </Col>
			        <Col span="11">
			        	<div v-if="formItem.isSetWeixin">
				        	<FormItem label="启用微信通知" prop="deviceSn">
					            <i-switch v-model="formItem.enableWeixin" size="large">
					                <span slot="open">启用</span>
					                <span slot="close">关闭</span>
					            </i-switch>
					        </FormItem>

					        <Divider />

					        <p>消息样例：</p>
					        <br />
					        <p v-html="formItem.weixinDemo"></p>

							<template v-if="0">
							<Divider />
							<!--暂时不开放-->
							<FormItem label="跳转到">
								<RadioGroup v-model="formItem.weixinUrlType">
									<Radio label="WEIXIN">公众号</Radio>
									<Radio label="WEAPP">小程序</Radio>
								</RadioGroup>
							</FormItem>
							<FormItem label="跳转地址">
								<Input v-model="formItem.weixinUrl" placeholder="请输入地址...." />
								<div>请输入完整的url地址或小程序路由地址</div>
							</FormItem>	
							</template>
				        </div>
				        <div v-else>
				        	<span style="color:red">微信模板未配置，暂时不能使用！</span>
				        </div>
			        </Col>
			    </Row>
		    </Form>
		</Modal>
	</div>
</template>

<script>
export default {
	name: 'tplmessageForm',
    components: {
    },
    data () {
    	return {
			tplList:[],

			formItem:{
				code:'',
				isSetSms:true,
				isSetWeixin:true,
				enableSms:false,
				enableWeixin:false,
				smsDemo:'',
				smsTags:'',
				smsTemplate:'',
				weixinDemo:'',
				weixinUrlType: '',
				weixinUrl: '',
			},

			// modal 框
			modalShow:false,
			modalTitle:'推送消息设置',
			modalLoading:true,
		}
	},
	methods: {
		// 编辑消息
		openModal( code, tplList ){
			this.modalShow = true;
			this.tplList = tplList;

			this.formItem.code = code;
			this.formItem.isSetSms = (this.tplList[code].child.sms.template == '' ? false:true);
			this.formItem.isSetWeixin = (this.tplList[code].child.weixin.template == '' ? false:true);
			this.formItem.enableSms = this.tplList[code].child.sms.enable;
			this.formItem.enableWeixin = this.tplList[code].child.weixin.enable;
			this.formItem.smsDemo = this.tplList[code].child.sms.demo;
			this.formItem.smsTemplate = (this.tplList[code].child.sms.templateContent == '' ? this.formItem.smsDemo : this.tplList[code].child.sms.templateContent );
			this.formItem.weixinDemo = this.tplList[code].child.weixin.demo;
			this.formItem.smsTags = this.tplList[code].child.sms.template;
			this.formItem.weixinUrlType = this.tplList[code].child.weixin.urlType;
			this.formItem.weixinUrl = this.tplList[code].child.weixin.url;
		},
		// 保存设置
		modalOk(){
			this.$refs['formValidate'].validate((valid) => {
		        if (valid) {
		        	this.modalLoading = true;

		        	this.$ajax.post( this.$api.weixinTplmessageEdit, {
		        		code: this.formItem.code,
		   				enableSms: (this.formItem.enableSms==true ? 1 : 0),
		   				smsTemplate: this.formItem.smsTemplate,
		   				enableWeixin: (this.formItem.enableWeixin==true ? 1 : 0),
						weixinUrlType: this.formItem.weixinUrlType,
						weixinUrl: this.formItem.weixinUrl,
		        	})
		    		.then( (response) => {
		    			var res = response.data;

		    			if( res.code ){
		    				var code = this.formItem.code;
		    				this.$set( this.tplList[code].child.sms, 'enable', this.formItem.enableSms );
		    				this.$set( this.tplList[code].child.weixin, 'enable', this.formItem.enableWeixin );

		    				this.modalShow = false;
		                    this.$Message.success(res.message);
		    			}
		    			else{

			                this.modalShow = true;
			                this.modalLoading = false;

			                setTimeout(() => {
			                    this.modalLoading = true;
			                }, 50);
		    			}

					});
				}
		    });
		},
		// 插入变量到模板
		insertTag( tag ) {

			var myField = document.querySelector('#smsTxt textarea');
			// 先判断是否已经有这个标签
			if( myField.value.indexOf( tag ) !== -1 ){
				this.$Notice.success({
		            title: '提示',
		            desc: '此变量已经存在，请勿重复添加！',
		        });
			}
			else{
		    	if (document.selection) {
		            myField.focus();
		            sel = document.selection.createRange();
		            sel.text = tag;
		            myField.focus();
		    	}
		    	else if(myField.selectionStart || myField.selectionStart == '0') {
		            var startPos = myField.selectionStart;
		            var endPos = myField.selectionEnd;
		            var cursorPos = endPos;
		            myField.value = myField.value.substring(0, startPos)
		                                      + tag
		                                      + myField.value.substring(endPos, myField.value.length);
		            cursorPos += tag.length;
		            myField.focus();
		            myField.selectionStart = cursorPos;
		            myField.selectionEnd = cursorPos;
		    	}
		    	else {
		            myField.value += tag;
		            myField.focus();
		    	}
		    	// 把内容同步到vue 变量
		    	this.formItem.smsTemplate = myField.value;
			}
		},
	},
}
</script>
