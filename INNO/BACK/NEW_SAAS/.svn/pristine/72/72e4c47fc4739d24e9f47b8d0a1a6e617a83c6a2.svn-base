<style lang="less">
	
</style>

<template>
	<div>
		<Card>
			<div slot="title">
				微信支付设置
			</div>
			
			<Tabs :value="tabsName" :animated="false" type="card">
				<TabPane name="basic" label="基本设置">
					<weixinPayBasic ref="weixin-pay-basic"></weixinPayBasic>
				</TabPane>
				
				<TabPane name="refund" label="支付证书设置">
					<weixinPayRefund ref="weixin-pay-refund"></weixinPayRefund>
				</TabPane>
			</Tabs>	
		</Card>	
		
		<!--加载提示-->
		<Spin size="large" fix v-if="spinShow"></Spin>
	</div>
</template>

<script>
import util from '@/libs/util.js';
import weixinPayBasic from './weixin-pay-basic';
import weixinPayRefund from './weixin-pay-refund';

export default {
    components: {
		weixinPayBasic,
		weixinPayRefund,
	},
	data () {
	    return {
			tabsName: 'basic',
			
			data:{},
			spinShow: false,
		}
	},
	methods: {
		init(){
			this.spinShow = true;
			
			// ajax 请求获取初始化数据，然后动态更新下面数据源
			util.ajax.post( util.apiUrl.weixinPaySettingInit, {
				
			})
			.then( (response) => {
				this.spinShow = false;
				var res = response.data;
				
				if( res.code ){
			        // 初始化设置
					this.data = res.data;
			        
					this.$refs['weixin-pay-basic'].init( this.data );
					this.$refs['weixin-pay-refund'].init( this.data );
				}
			});
		}
	},
	mounted () {
		this.init();
	},
}
</script>	