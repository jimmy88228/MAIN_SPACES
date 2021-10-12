<style lang="less">
.cs-search-content{
	.ivu-input-icon-clear{
		right:50px;
	}
	.search-item{
		width:380px;
		border-bottom: 1px solid #eee;
		&:hover{
			.content-item{
				color:#2b85e4;
				b{
					color:#ed4014;
				}
			}
		}
		.content-body{
			max-width: 300px;
		}
	}
}
</style>

<template>
	<div class="cs-search-content">
		<Input clearable search enter-button placeholder="搜索聊天内容..."
		v-model="searchq"
		style="width:170px"
		@on-search="searchContent" 
		@keydown.native.enter.prevent ="searchContent"/>
		
		<Dropdown trigger="custom" :visible="showDrop" 
		style="display:contents"
		@on-clickoutside="hideDrop"
		@on-click="onSelecteItem">
			<DropdownMenu slot="list">
				<div :style="{height: height +'px'}">
					<vue-scroll ref="vue-scroll" :ops="scrollOptions">
						<DropdownItem v-for="(item,index) in list" :key="index" 
						:name="item.id"
						class="search-item">
							<template v-if="item.get_user_info !=null">
								<Row type="flex" :gutter="5">
									<Col style="width:40px;">
										<Avatar :src="item.get_user_info.wx_avatar" shape="square"></Avatar>
									</Col>
									<Col style="flex:1 1 0%;">
										<div class="clamp2 content-body">
											<span class="content-item" v-html="item.content_search"></span>
										</div>
										<div style="font-size: 12px;">
											{{item.get_user_info.wx_nick_name}}
											<span style="margin-left: 10px;">{{item.created_at_format}}</span>
										</div>
									</Col>
								</Row>
							</template>
							<template v-else-if="item.get_worker_info != null">
								<Row type="flex" :gutter="5">
									<Col style="flex:1 1 0%;text-align: right;">
										<div class="clamp2 content-body">
											<span class="content-item" v-html="item.content_search"></span>
										</div>
										<div style="font-size: 12px;">
											<span style="margin-right: 10px;">{{item.created_at_format}}</span>
											{{item.get_worker_info.nick_name}}
										</div>
									</Col>
									<Col style="width:40px;">
										<Avatar :src="item.get_worker_info.avatar_format" shape="square"></Avatar>
									</Col>
								</Row>
							</template>
						</DropdownItem>
					</vue-scroll>
				</div>
			</DropdownMenu>
		</Dropdown>
		
		<!--加载提示-->
		<Spin size="large" fix v-if="spinShow" @click="spinShow=false"></Spin>
	</div>
</template>

<script>
/**
 * 聊天窗口 组件
 */
export default {
	name:"csSearchContent",
	props:{
		sessInfo:{
			type:Object,
			default:()=>{}
		},
		height:{
			type:Number,
			default:300,
		}
	},
	data () {
	    return {
			// 搜索内容
			searchq:'',
			showDrop: false,
			list:[],
			
			spinShow:false,
			
			// 虚拟滚动条
			scrollOptions:{
				mode: 'native',
				bar:{
					keepShow: true,
					background: '#c8c8c8',
					size:'3px',
				},
				// 滚动轨道
				rail:{
					size:'3px',
				},
				scrollPanel:{
					scrollingX:false,
				}
			},
		}
	},
	methods: {
		// 搜索聊天内容
		searchContent(){
			this.spinShow = true;
			// ajax 请求获取数据
			this.$ajax.post( this.$api.csUserContentSearch, {
				user_id: this.sessInfo.user_id,
				searchq: this.searchq,
			})
			.then( (response) => {
				this.spinShow = false;
				var res = response.data;
				if( res.code ){
					this.showDrop = true;
					this.list = res.data;
				}
			});
		},
		hideDrop(){
			this.showDrop = false;
		},
		// 选中某项
		onSelecteItem( content_id ){
			this.showDrop = false;
			
			this.spinShow = true;
			// ajax 请求获取数据
			this.$ajax.post( this.$api.csUserContextSearch, {
				user_id: this.sessInfo.user_id,
				content_id: content_id,
			})
			.then( (response) => {
				this.spinShow = false;
				var res = response.data;
				if( res.code ){
					// 获取内容成功后，返回给父级
					this.$emit('on-search', {content_id:content_id, list: res.data });
				}
			});
		}
	}	
}
</script>