<style lang="less">
.background-form{
	padding: 10px;
	
	.ivu-color-picker{
		.ivu-select-dropdown{
			z-index: 1000;
		}
	}
	
	.image-box{
		width: 75px;
		height:75px;
		line-height:75px;
		border: 1px solid #eee;
	    border-radius: 5px;
	    text-align: center;
	    cursor: pointer;
	    background: center center no-repeat;
	    background-size: 100% auto;
	    margin-right:5px;
	    position: relative;
		
		.close{
			position: absolute;
			top: -8px;
			right: -8px;
		}
	}
}
</style>
	
<template>
	<div class="background-form">
		<Divider>页面背景设置</Divider>
		
		<Form ref="formValidate" :model="formItem.setting" label-position="top">
			<FormItem label="页面背景颜色( 建议用淡颜色作为页面背景色 )">
				<ColorPicker v-model="formItem.setting.backgroundColor" style="margin-left:150px;"/>
			</FormItem>	
			<FormItem label="背景图片">
				<div class="image-box" 
				:style=" formItem.setting.backgroundImage != '' ? 'background-image: url('+formItem.setting.backgroundImage+');' : '' " 
				@click="selectImage">
					<Icon 
					v-if=" typeof(formItem.setting.backgroundImage) == 'undefined' || formItem.setting.backgroundImage == '' || formItem.setting.backgroundImage == null " 
					type="md-add" 
					size="25" />
					<Icon v-else type="md-close-circle" color="#f00" size="22" class="close" @click.stop="removeImage"/>
				</div>
			</FormItem>
			<FormItem label="背景图片位置">
				<RadioGroup v-model="formItem.setting.backgroundPosition">
					<Radio label="top">顶部对齐</Radio>
					<Radio label="center">居中对齐</Radio>
					<Radio label="bottom">底部对齐</Radio>
				</RadioGroup>
			</FormItem>
			<div style="height:50px;width:100%;"></div>
		</Form>	
		
		<!--用户图片管理组件-->
		<userImages ref="user-images" @on-return-url="returnImageUrl"></userImages>
	</div>	
</template>

<script>
import userImages from '@/views/my-components/user-images/user-images';
	
/**
 * 页面背景设置 
 */
export default {
	name: 'pageSettingBackground',
	components: {
		userImages,
	},
	props:{
		currIndex:{
			type: [Number,String],
			default: 0,
		},
	},
	data () {
	    return {
			formItem:{
				setting:{
					backgroundColor: '',
					backgroundImage: '',
					backgroundPosition: '',
				}
			},
		}
	},
	methods: {
		// 初始化
		init(){
			setTimeout(()=>{
				// 双向绑定store 的数据
				this.formItem = this.$store.state.app.pageInfo;

				if( typeof( this.formItem.setting ) == 'undefined' || this.formItem.setting == '' ){
					this.$set(this.formItem, 'setting', {});
				}
				if(typeof( this.formItem.setting.backgroundColor ) == 'undefined' ){
					this.$set(this.formItem.setting, 'backgroundColor', '');
				}
				if(typeof( this.formItem.setting.backgroundImage ) == 'undefined' ){
					this.$set(this.formItem.setting, 'backgroundImage', '');
				}
				if(typeof( this.formItem.setting.backgroundPosition ) == 'undefined' ){
					this.$set(this.formItem.setting, 'backgroundPosition', 'top');
				}
			}, 5000);
		},
		// 选择图片（单选）
		selectImage(){
			this.$refs['user-images'].showModal( {
				name:'images', 
				multi:0, 
				selectedImages: [ this.formItem.setting.backgroundImage ], 
			});
		},
		// 图片选择组件的回调
		returnImageUrl( obj ){
			this.$set(this.formItem.setting, 'backgroundImage', obj.val );
		},
		// 清除图片
		removeImage(){
			this.$Modal.confirm({
				title: '操作提示',
				content: '确定清除背景图片吗？',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					this.$set( this.formItem.setting, 'backgroundImage', '' );
				},
			});
		}
	},
	watch:{
		
	},
	mounted () {
		this.init();
	},
}
</script>