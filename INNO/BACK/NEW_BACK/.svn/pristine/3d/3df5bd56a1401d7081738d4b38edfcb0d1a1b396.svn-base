<style lang="less">
	
</style>

<template>
	<div>
		<Card>
			<Tabs :value="tabsName" :animated="false" name="weixin-tab" type="card" @on-click="onTabsClick">

				<TabPane name="mini" label="小程序授权" tab="weixin-tab">
					<!--微信小程序组件-->
					<weixinMini ref="weixin-mini"></weixinMini>
				</TabPane>
				
			</Tabs>
		</Card>
	</div>
</template>	

<script>
import weixinMini from './weapp-mini';

/**
 * 微信对接管理主入口
 */
export default {
    components: {
		weixinMini,
    },
    data () {
        return {
			data:{},
			
			tabsName: '',
        }
	},
	methods: {
    	// 初始化方法
        init () {
        	var tname = this.$route.hash.replace('#','');
        	if( ['mini'].indexOf( tname ) !== -1 ){
        		this.tabsName = tname;
        	}
			else{
				this.tabsName = 'mini';
			}

			this.initData();
        },
		// 初始化数据
		initData(){
			
			// ajax 请求获取初始化数据，然后动态更新下面数据源
			this.$ajax.post( this.$api.weixinInitSetting, {
				
			})
			.then( (response) => {
				var res = response.data;
				
				if( res.code ){
			        // 初始化设置
					this.data = res.data;
					this.onTabsClick( this.tabsName );
				}
			});
		},
        // 点击tabs 触发的动作
        onTabsClick( name ){
			this.$router.push('/plugins/weapp#'+name );
			
			this.$refs['weixin-mini' ].init( this.data );
        },
   	},
   	mounted () {
        this.init();
    },
}
</script>