<style lang="less">
	.appletModal {
		.code-view{
			width: 100%;
			min-height: 318px;
		}
	}
</style>
<template>
	<Modal title="小程序二维码" footer-hide width="320" v-model="showM" class="appletModal">
		<Spin size="large" fix v-if="spinShow"></Spin>
		<Tabs value="xcxCode" v-if="showCode">
			<TabPane label="推广小程序码" name="xcxCode">
				<div class="code-view">
					<img :src="imageViewUrl" v-if="imageViewUrl" id="xcxImage" style="width: 100%">
				</div>
				<Button type="default" long @click="downLoadImg">下载</Button>
			</TabPane>
			<TabPane label="推广小程序路径" name="xcxPath" style="position: relative;">
				<div class="code-view flex f-just-center f-align-center">
					<p id="activity-url" style="width:100%;">{{viewPath}}</p>
				</div>
				<Button id="copyBtn" type="default" long @click="copyText">复制</Button>
			</TabPane>
		</Tabs>
		<div v-else>
			<Select v-model="appletInfo.appid">
				<Option v-for="(item, index) in appletList" :value="item.appid" :key="index">{{item.appname}}</Option>
			</Select>
			<div>&nbsp;</div>
			<Button type="info" @click="appletQrcode">查看小程序二维码</Button>
		</div>
	</Modal>
</template>
<script>
	export default {
		name: "extendApplet",
		props: {
			path: {
				type: String,
				default(){
					return ""
				}
			},
			pathParams: {
				type: Object,
				default(){
					return {}
				}
			}
		},
		data(){
			return {
				appletList: [],
				appletInfo: {},
				spinShow: false,
				showCode: false,
				showM: false,
				imageViewUrl: ""
			}
		},
		computed:{
			viewPath(){
				let path = this.path || "";
				let pathParams = this.pathParams || {};
				let params = "";
				for(let i in pathParams){
					params = params ? params + "&" + i + "=" + pathParams[i] : "?" + i + "=" + pathParams[i];
				}
				return path + params;
			},
			sceneParams(){
				return JSON.stringify(this.pathParams) || ""
			}
		},
		mounted(){},
		methods:{
			showModal(row){
				this.appletInfo.appid = "";
				this.showM = true;
				this.showCode = false;
				this.getAppletList();
			},
			getAppletList(){
				if(this.appletList.length > 0) { return this.appletList }
				return this.$ajax.post(this.$api.getAppletList).then(e=>{
					let res = e.data || {};
					if(res.code){
						this.appletList = res.data || [];
					}
				})
			},
			appletQrcode(){
				let appletInfo = this.appletInfo || {};
				if(!appletInfo.appid) {
					this.$Message.info("请选择查看的小程序");
					return;
				}
				this.spinShow = true;
				return this.$ajax.post(this.$api.getAppletQrcode,{
					appid: appletInfo.appid,
					path: this.path,
					userToken: "",
					brandCode: "",
					scene: this.sceneParams,
					opKind: "",
					extent_id: "", // 如果都不是store staff goods 可以用这个id
					creatType: 3,
					width: 750
				}).then(e=>{
					let res = e.data || {};
					if(res.code){
						this.imageViewUrl = res.data.data;
					}
				}).finally(()=>{
					this.showCode = true;
					this.spinShow = false;
				})
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
		},
		
	}
</script>