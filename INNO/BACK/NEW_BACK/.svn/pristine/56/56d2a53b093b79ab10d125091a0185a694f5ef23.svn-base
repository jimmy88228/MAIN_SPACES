<style lang="less">

</style>

<template>
	<Card>
		<div slot="title">
			<Icon type="md-pricetag" size="24"/>
			客服会话标签管理
		</div>
		<!--标签列表-->
		<tagsList ref="tags-list" :tagsType="tagsType" @on-add-success="init"></tagsList>
		
		<!--加载提示-->
		<Spin size="large" fix v-if="spinShow"></Spin>
	</Card>
</template>

<script>
import tagsList from '@/views/my-components/tags-select/tags-list';
	
/**
 * 客服标签管理
 */
export default {
	name:"csTagsList",
    components: {
		tagsList,
	},
	data () {
	    return {
			spinShow: false,
			
			tagsType: 'csSessionTags',
			
			// 是否支持多选
			multi:0,
		}
	},
	methods: {
		init(){
			// ajax 请求获取初始化数据，
			this.$ajax.post( this.$api.tagsList, {
				isInit: 1,
				type: this.tagsType,
			})
			.then( (response) => {
				var res = response.data;
				this.spinShow = false;
				
				if( res.code ){
					// 初始化用户素材列表的组件
					this.$refs['tags-list'].initData( res, this.multi, [], [] );
				}
				else{
					this.$Message.error('获取列表失败');
				}
			});
		}
	},
	mounted () {
		this.init();
	},
}
</script>