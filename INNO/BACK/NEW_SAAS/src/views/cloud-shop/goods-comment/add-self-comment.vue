<template>
	<Modal
			width="700"
			v-model="showM"
			title="添加自主评价">
			<div>
				<Tabs :value="tabAction" @on-click="changeTab" name="editComment">
						<TabPane label="微商城" name="wapTab" tab="editComment">
							<addSelfConmentForm ref="applet-comment-form" type="wapTab"></addSelfConmentForm>
						</TabPane>
						<!-- <TabPane label="店铺" name="storeTab" tab="editComment">
							<addSelfConmentForm ref="store-comment-form" type="storeTab"></addSelfConmentForm>
						</TabPane> -->
				</Tabs>
			</div>
			<div slot="footer">
					<Button type="default" @click="showM = false">取消</Button>
					<Button type="primary" @click="onConfirm">确定</Button>
			</div>
	</Modal>
</template>
<script>
	import addSelfConmentForm from "./add-self-conment-form.vue";
	export default {
		components: {
			addSelfConmentForm
		},
		data(){
			return {
				showM: false,
				tabAction: "wapTab",
			}
		},
		methods:{
			showModule(){
				this.showM = true;
				this.changeTab("wapTab");
			},
			changeTab(name){
				this.tabAction = name;
				if(name == "wapTab") {
					this.$refs["applet-comment-form"].loadData();
				} else if(name == "storeTab"){
					this.$refs["store-comment-form"].loadData();
				}
			},
			onConfirm(){
				let name = this.tabAction;
				if(name == "wapTab") {
					this.$refs["applet-comment-form"].checkForm().then(()=>{
						this.showM = false;
					})
				} else if(name == "storeTab"){
					this.$refs["store-comment-form"].checkForm().then(()=>{
						this.showM = false;
					});
				}
			}
		}
		
	}
</script>
<style>
	
</style>