<style lang="less">
.rich-text-form{
	.editor-box{
		.ivu-form-item-content{
			line-height:1;
		}
	}
}
</style>

<template>
	<div class="rich-text-form">
		<titleBar>富文本 设置</titleBar>

		<Form ref="formValidate" :model="formItem" label-position="top">
			<div class="editor-box">
			<FormItem label="可视化编辑器">
				<template v-if="$route.fullPath.indexOf('store-goods-info') != -1">
					店铺商品暂不支持编辑商品详情
				</template>
				<template v-else>
					<UEditor ref="ueditor" @on-content-change="onContentChange"></UEditor>
					<Spin size="large" fix v-if="spinShow"></Spin>
				</template>
				
			</FormItem>
			</div>
		</Form>
	</div>
</template>

<script>
/**
 * 富文本小工具
 */
import titleBar from '@/views/my-components/title-bar/title-bar';
import UEditor from '@/views/my-components/ueditor/ueditor.vue';

export default {
	name: 'richTextForm',
	components:{
		titleBar,
		UEditor,
	},
	props:{
		currIndex:{
			type: [Number,String],
			default: -1,
		},
	},
    data () {
        return {
			formItem:{
				content: '',
			},

			dataList:[],
			spinShow: false,
			
			// ueditor 配置
			ueditorConfig:{
				initialFrameWidth: 360,
				initialFrameHeight: 400,
				autoFloatEnabled:false, // 取消工具条悬浮
				toolbars:[],  // 工具条配置
			},

        }
    },
    computed: {

	},
	methods: {
		init(){
			// 双向绑定store 的数据
			this.dataList = this.$store.state.app.pageCompList;
			this.formItem = typeof(this.dataList[ this.currIndex ]) != 'undefined' ? this.dataList[ this.currIndex ].setting : {content:''};
			this.ueditorConfig.toolbars = this.$store.state.app.pageEditorSetting.toolbars;

			// 自定义按钮的图片类型
			this.$store.commit('setUeditorImageType', 'goodsDesc');
			
			this.spinShow = true;
      
			var richContent = this.formItem.content;
			// 初始化编辑器（这里一定要停顿几秒再执行下面）
			setTimeout(()=>{
				this.$nextTick(()=>{
					// 配置加载完毕，才初始化 ueditor
					this.$refs['ueditor'].init( this.ueditorConfig );
					
					setTimeout(()=>{
						var ue = this.$refs['ueditor'].getUE();
						ue.setContent( richContent );
						
						// 获取焦点的事件
						ue.addListener('focus',(editor) => {
							if( ue.getContent() == '<p>请点击编辑...</p>' ){
								ue.setContent( '' );
							}
						});
						
						this.spinShow = false;
					},1000);
				});
			}, 2000);
		},
		// 监听内容变化，更新到 store
		onContentChange( content ){
			// 获取编辑器的数据
			//this.$set( this.formItem, 'content',  content );
      this.$set( this.dataList[ this.currIndex ].setting, 'content',  content );
		},
	},
	watch:{
		'currIndex' (to){
			this.init();
		},
    // 观察 组件list 的变化
    '$store.state.app.pageCompList' (to) {
      this.init();
    },
	},
	mounted () {
		this.init();
	},
}
</script>
