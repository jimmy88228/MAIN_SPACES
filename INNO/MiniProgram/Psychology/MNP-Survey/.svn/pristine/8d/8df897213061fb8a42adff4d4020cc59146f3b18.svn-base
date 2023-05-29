<template>
	<view class="container">
		<global-com></global-com>
		
		<u-cell-group v-if="dataList.length > 0" class="u-p-t-20">
			<u-cell-item 
			v-for="(item,index) in dataList" :key="index" 
			center
			:title="item.fb_content"
			@click="viewInfo(item)">
				<view slot="label">
					<u-tag :text="statusList[ item.fb_status ]['name']" 
					:type="statusList[ item.fb_status ]['color']" 
					shape="circle" size="mini"/>
					<text style="margin-left:10rpx;">{{item.created_at_format}}</text>
				</view>
			</u-cell-item>
		</u-cell-group>
		
		<u-loadmore 
		style="margin-top:20rpx;"
		v-show="dataList.length != 0 || loadStatus != 'nomore' " 
		:status="loadStatus" 
		font-size="24">
		</u-loadmore>
		
		<view v-if="dataList.length == 0 && loadStatus == 'nomore' " :style="{height: pageHeight +'px'}">
			<u-empty text="暂无反馈内容" mode="list"></u-empty>
		</view>
		
		<!--底部工具条-->
		<view class="bottom-box">
			<u-button type="primary" style="width:100%;" @click="addFeedback">反馈问题</u-button>
		</view>
	</view>
</template>

<script>
export default {
	components: {
	},
	data() {
		return {
			showLoading: false,
			dataList:[],
			statusList: [],
			pageHeight: 500,
			content_type: 3,
			
			loadStatus: 'loading',
		}
	},
	// #ifndef MP
	// 非小程序 才出发导航栏的按钮事件
	onNavigationBarButtonTap(e) {
		const index = e.index;
		if (index === 0) {
			this.addFeedback();
		}
	},
	// #endif
	// 下拉刷新事件
	onPullDownRefresh(){
		this.loadData( true );
	},
	onLoad( options ) {
		this.content_type = typeof(options.content_type) != 'undefined' ? options.content_type : 3;
		this.init();
	},
	onShow(){
		this.loadData( true );
	},
	methods:{
		init(){
			// 计算屏幕高度
			var system = uni.getSystemInfoSync();
			this.pageHeight = system.windowHeight - 100;
			
			this.loadData( true );
		},	
		loadData( isRefresh = false ){
			this.showLoading = true;
			this.$u.post( this.$api.feedBackList, {

			})
			.then( (response) => {
				this.showLoading = false;
				var res = response.data;
				if( res.code ){
					if( isRefresh ){
						this.dataList = res.data.items;
						uni.stopPullDownRefresh();
					}
					else{
						// 追加到数组后面
						for(var i in res.data.items ){
							this.dataList.push( res.data.items[i] );
						}
						
						if( this.dataList.length == 0 ){
							uni.navigateTo({
								url:'/pages/my/setting/feedback-form?content_type='+ this.content_type ,
							})
						}
					}
					this.loadStatus = res.data.loadStatus;
					this.statusList = res.data.statusList;
				}
				else{
					this.$u.toast( res.message );
				}
			});
		},
		// 跳转去添加反馈
		addFeedback(){
			uni.navigateTo({
				url: '/pages/my/setting/feedback-form?content_type='+ this.content_type,
			});
		},
		// 查看详情
		viewInfo( item ){
			uni.navigateTo({
				url: '/pages/my/setting/feedback-info?id='+item.id, 
			});
		}
	},
}
</script>

<style lang="scss">
page,.container{
	background: #fff;
}
.bottom-box{
	width: 100%;
	min-height: 100upx;
	padding: 0 1%;
	background-color: $page-color-base;
	display: flex;
	position: fixed;
	z-index: 20;
	bottom:0;
	transition: all .15s linear;
	
}	
</style>