<style lang="less">
.cs-reply-box{
	.txt{
		cursor: pointer;
		font-size: 13px;
	}
	.content-box{
		width:380px;
	}
}	
</style>

<template>
	<div class="cs-reply-box">
		<Poptip v-model="showPoptip" placement="top-end">
			<span class="txt">快速回复</span>
			
			<div slot="content">
				<Tabs v-if="info != null && info.quickReply != null && info.quickReply != '' " class="content-box" size="small" :animated="false">
					<TabPane v-for="(cat,ci) in info.quickReply" :key="ci" :label="cat.name">
						<CellGroup :style="{height:'150px'}">
							<vue-scroll ref="vue-scroll" :ops="scrollOptions">
								<Cell v-for="(item, index) in cat.children" :key="index" 
								:title="item" 
								@click.native="quickSend(item)"/>
							</vue-scroll>
						</CellGroup>
					</TabPane>
				</Tabs>
				<span v-else>未设置快速回复语</span>
			</div>	
		</Poptip>	
	</div>
</template>	

<script>
/**
 * 聊天快速回复 组件
 */
export default {
	name:"csQuickReply",
    components: {
	},
	props:{
		// admin info
		info:{
			type:Object,
			default:()=>{}
		},
	},
	data () {
	    return {
			showPoptip:false,
			
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
		quickSend( val ){
			this.$emit('on-send', val);
			this.showPoptip = false;
		}
	}	
}
</script>