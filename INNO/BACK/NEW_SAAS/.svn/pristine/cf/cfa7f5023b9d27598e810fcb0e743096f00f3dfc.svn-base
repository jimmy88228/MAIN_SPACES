<style lang="less">

</style>

<template>
	<div>
		<Card>
			<Tabs :value="tabsName" :animated="false" name="weixin-tab" type="card" @on-click="onTabsClick">
				<TabPane name="open" label="公众号授权" tab="weixin-tab">
					<!--微信授权组件-->
					<weixinAuthor ref="weixin-open"></weixinAuthor>
				</TabPane>
				
				<TabPane name="menu" label="微信菜单" tab="weixin-tab">
					<!--微信菜单组件-->
					<weixinMenu ref="weixin-menu"></weixinMenu>
				</TabPane>	
				
				<TabPane name="tpl" label="微信模板消息" tab="weixin-tab">
					<!--微信模板消息组件-->
					<weixinTplmessage ref="weixin-tpl"></weixinTplmessage>
				</TabPane>
				
				<TabPane name="member-card" label="微信会员卡" tab="weixin-tab">
					<!--微信会员卡组件-->
					<weixinMemberCard ref="weixin-member-card"></weixinMemberCard>
				</TabPane>
				
				<TabPane v-if="openWeixinNative" name="native" label="微信原生授权" tab="weixin-tab">
					<!--微信原生授权-->
					<weixinNative ref="weixin-native"></weixinNative>
				</TabPane>
			</Tabs>
		</Card>
	</div>
</template>

<script>
import weixinAuthor from './weixin-author';
import weixinMenu from './weixin-menu';
import weixinTplmessage from './weixin-tplmessage';
import weixinNative from './weixin-native';
import weixinMemberCard from './weixin-member-card';

/**
 * 微信对接管理主入口
 */
export default {
    components: {
		weixinAuthor,
		weixinMenu,
		weixinTplmessage,
		weixinNative,
		weixinMemberCard,
    },
    data () {
        return {
			data:{},
			// 是否开放原生授权
			openWeixinNative: false,
			// 是否开放第三方授权
			isOpenWeixinOauth: false,
			
			tabsName: '',
        }
	},
	methods: {
    	// 初始化方法
        init () {
        	var tname = this.$route.hash.replace('#','');
        	if( ['menu','tpl', 'open', 'member-card', 'native'].indexOf( tname ) !== -1 ){
        		this.tabsName = tname;
        	}
			else{
				this.tabsName = 'open';
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
			        this.openWeixinNative = res.data.openWeixinNative;
					this.isOpenWeixinOauth = res.data.isOpenWeixinOauth;

					this.onTabsClick( this.tabsName );
				}
			});
		},
        // 点击tabs 触发的动作
        onTabsClick( name ){
			this.$router.push('/plugins/weixin#'+name );
			
			if( name == 'native'){
				this.$refs['weixin-native' ].init( this.data );
			}
			else if( name == 'mini' ){
				this.$refs['weixin-mini' ].init( this.data );
			}
			else{
				this.$refs['weixin-' + name ].init();
			}
        },
   	},
   	mounted () {
        this.init();
    },
}
</script>
