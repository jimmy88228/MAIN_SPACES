<template>
	<div>
		<Modal v-model="isShowApplet" :width="320" class-name="applet-list-modal">
			<div slot="header" class="model-header"><Icon type="ios-help-circle" color="#2F8CEE" size="20"/>&nbsp;{{title}}</div>
			<div>
				<Select v-model="appletInfo.appid" @on-change="changeApplet">
					<Option v-for="(item, index) in appletList" :value="item.appid" :key="item.appid">{{item.appname}}</Option>
				</Select>
			</div>
			<div slot="footer">
				<Button type="primary" @click="goShowCode">查看</Button>
			</div>
		</Modal>
		<Modal v-model="isShowCode" :width="320" class-name="applet-code-modal" >
			<Spin size="large" fix v-if="spinShow"></Spin>
			<div slot="header" class="model-header" @click="goShowApplet"><Icon type="ios-arrow-back" size="20" />&nbsp;&nbsp;{{codeTitle}}</div>
			<div class="code-view-cont">
				<Tabs value="xcxCode">
					<TabPane label="小程序码" name="xcxCode">
						<div class="code-view">
							<img :src="codeUrl" v-if="codeUrl" id="xcxImage" style="width: 100%">
						</div>
						<div class="code-tip">
							<p v-html="codeTip"></p>
							<p>小程序：{{appletInfo.appname}}</p>
						</div>
						<Button type="default" long @click="downLoadImg">下载</Button>
					</TabPane>
					<TabPane label="小程序路径" name="xcxPath" style="position: relative;">
						<div class="code-url-view  flex f-just-center f-align-center">
							<p id="activity-url" style="width:100%;">{{viewPath}}</p>
						</div>
						<Button id="copyBtn" class="copy-btn" type="default" long @click="copyText">复制</Button>
					</TabPane>
				</Tabs>
			</div>
			<div slot="footer">
				<Button type="primary">确定</Button>
			</div>
		</Modal>
	</div>
</template>
<script>
	export default{
		props: {
			title: {
				type: String,
				default(){
					return "选择小程序"
				}
			},
			codeTitle: {
				type: String,
				default(){
					return "小程序二维码"
				}
			},
			codeTip: {
				type: String,
				default(){
					return ""
				}
			}
		},
		data(){
			return {
				isShowApplet: false,
				isShowCode: false,
				appletList: [],
				appletInfo: {
					appid: 0,
					appname: ''
				},
				path: "pages/micro_mall/index/index",
				params: {},
				codeUrl: "",
				spinShow: false
			}
		},
		computed:{
			viewPath(){
				let path = this.path || "";
				let params = this.params || {};
				let pathParams = "";
				for(let i in params){
					pathParams = pathParams ? pathParams + "&" + i + "=" + params[i] : "?" + i + "=" + params[i];
				}
				return path + pathParams;
			}
		},
		methods:{
			showModal({ path, params}){
				if(path) this.path = path;
				if(params) this.params = params;
				this.getAppletList().then(()=>{
					this.checkOnlyCode();
				})
			},
			checkOnlyCode(){
				if(this.appletList.length > 0){
					this.appletInfo = this.appletList[0] || {appid: 0, appname: ''};
					this.getCodeData();
				} else {
					this.goShowApplet();
				}
			},
			changeApplet(data){
				for(let i = 0; i < this.appletInfo.length; i++){
					let appid = this.appletInfo[i].appid;
					if(appid == data){
						this.appletInfo = this.appletInfo[i];
						break;
					}
				}
			},
			getAppletList(){
				let appletList = (this.$store.state.app && this.$store.state.app.appletList) || [];
				if(appletList.length > 0) { 
					this.appletList = appletList;
					return new Promise((rs, rj)=>{
						rs(this.appletList);
					})
				}
				return this.$ajax.post(this.$api.getAppletList).then(e=>{
					let res = e.data || {};
					if(res.code){
						this.appletList = res.data || [];
						this.$store.commit("setAppletList", this.appletList);
						return this.appletList;
					}
				})
			},
			getCodeData(){
				if(!this.appletInfo.appid) { this.$Message.warning("请选择小程序"); return;}
				this.goShowCode();
				this.spinShow = true;
				return this.$ajax.post(this.$api.getAppletQrcode,{
					appid: this.appletInfo.appid,
					path: this.path,
					userToken: "",
					brandCode: "",
					scene: this.params && JSON.stringify(this.params),
					opKind: "",
					extent_id: "", // 如果都不是store staff goods 可以用这个id
					creatType: 3,
					width: 750
				}).then(e=>{
					let res = e.data || {};
					if(res.code){
						this.codeUrl = res.data.data;
					}
				}).finally(()=>{
					this.spinShow = false;
				})
			},
			goShowCode(){
				this.isShowCode = true;
				this.isShowApplet = false;
			},
			goShowApplet(){
				this.isShowCode = false;
				this.isShowApplet = true;
			},
			downLoadImg(){
				var img = document.getElementById('xcxImage');
				var url = img.src;
				var a = document.createElement('a');
				var event = new MouseEvent('click');
				a.download = 'xcxImage';
				a.href = url;
				a.dispatchEvent(event)
			},
			copyText(){
			  var ele = document.getElementById("activity-url");
				function otherEle(element){
					if (document.selection) {
						var range = document.body.createTextRange();
						range.moveToElementText(element);
						range.select();
					}else{
						window.getSelection().removeAllRanges();
						var range = document.createRange();
						range.selectNode(element);
						window.getSelection().addRange(range);
					}
				}
				if(ele.select){
					ele.select();
				}else{
					otherEle(ele);
				}
				document.execCommand('Copy');
				window.getSelection().removeAllRanges();
			  this.$Message.warning("已复制好，可贴粘。");
			}
		}
	}
</script>
<style lang="less">
	.applet-list-modal{
		.model-header{
			font-size: 16px;
		}
	}
	.applet-code-modal{
		.model-header{
			cursor: pointer;
			font-size:16px;
		}
		.ivu-modal-body{
			padding-top:0px;
		}
		.code-view-cont{
			width:100%;
			.ivu-tabs-nav{
				width:100%;
				text-align: center;
				.ivu-tabs-tab{
					width:50%;
					box-sizing: border-box;
					margin: 0px;
				}
			}
			.code-view{
				text-align:center;
				width: 260px;
				min-height: 260px;
				margin:0 auto;
			}
			.code-url-view{
				width: 100%;
				height:100%;
				padding-bottom: 35px;
			}
			.copy-btn{
				position:absolute;
				left:0px;
				bottom:0px;
			}
			.code-tip{
				padding: 10px 0px;
				text-align:center;
			}
		}
	}
</style>