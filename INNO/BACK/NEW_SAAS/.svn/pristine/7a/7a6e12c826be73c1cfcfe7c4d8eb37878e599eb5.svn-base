<template>
	<Modal title="小程序选择" footer-hide width="320" v-model="showM" class="appletModal">
		<Spin size="large" fix v-if="spinShow"></Spin>
		<Select v-model="appletInfo.appid">
			<Option v-for="(item, index) in appletList" :value="item.appid" :key="index">{{item.appname}}</Option>
		</Select>
		<Button type="info" style="margin-top:10px" @click="onOk">确定</Button>
	</Modal>
</template>

<script>
	export default {
		name: "selectWechatApp",
		data(){
			return {
				appletList: [],
				appletInfo: {},
				spinShow: false,
				showCode: false,
				showM: false,
				appletPath: "pages/micro_mall/index/index"
			}
		},
		methods:{
			showModal(row){
				this.appletInfo = row || {};
				this.appletInfo.appid = "";
				this.showM = true;
				this.appletPath = "pages/micro_mall/lottery/lottery";
				this.getAppletList();
			},
			getAppletList(){
				if(this.appletList.length > 0) { 
					return this.appletList;
				}
				return this.$ajax.post(this.$api.getAppletList).then(e=>{
					let res = e.data || {};
					if(res.code){
						this.appletList = res.data || [];
					}
				})
			},
			onOk(){
				this.showM = false;
				this.$emit('on-success', this.appletInfo.appid );
			}
		},
	}
</script>

<style>
</style>
