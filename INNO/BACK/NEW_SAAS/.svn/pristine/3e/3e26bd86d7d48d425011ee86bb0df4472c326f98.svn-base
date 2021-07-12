<style lang="less">
</style>

<template>
	<div>
		<Modal 
		v-model="showModal"
		title="通用的领券二维码"
		width="550"
		:footer-hide="true">
			<div style="text-align: center;">
				<img :src="info.qrcode" style="width:300px;height:auto;" />
			</div>
			
			<div class="form-footer-button-box">
				<Button type="default" @click="closeModal">关闭</Button>
				<Button type="error" @click="updateQrcode">更新二维码</Button>
			</div>
			
			<!--加载提示-->
			<Spin size="large" fix v-if="spinShow"></Spin>
		</Modal>
	</div>
</template>	

<script>
/**
 * 会员卡的二维码 - 组件
 */
export default {
	name: 'weixinMemberCardQrcode',
    components: {
	},
	props:{
	},
	data() {
		return {
			showModal: false,
			spinShow: false,
			info: {},
		}
	},	
	methods: {
		// 提供给父组件使用
		openModal( info ){

			this.info = info;
			this.showModal = true;
			
			if( this.info.qrcode == '' ){
				this.loadQrcode();
			}
		},
		// 关闭模态框
		closeModal(){
			this.showModal = false;
		},
		loadQrcode(){
			this.spinShow = true;
			this.$ajax.post( this.$api.weixinMemberCardQrcode, {
				id: this.info.id,
			})
			.then( (response) => {
				this.spinShow = false;
				var res = response.data;
				
				if( res.code ){
					this.info.qrcode = res.data;
				}
			});
		},
		// 更新二维码
		updateQrcode(){
			
			this.$Modal.confirm({
			    title: '操作提示',
			    content: '确定更新微信会员卡领卡二维码吗？请确保旧二维码不再使用！！！',
			    okText: '确定',
			    cancelText: '取消',
			    onOk: () => {
					
					// 更新二维码
					this.loadQrcode();
				},
			});	
		}
	},
}	
</script>	