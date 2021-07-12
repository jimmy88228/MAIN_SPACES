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
      line-height: 1;
		}
	}
}
</style>
	
<template>
	<div class="background-form">
		
		<Divider>组件背景设置</Divider>
		
		<Form ref="formValidate" :model="formItem" label-position="top">
			<FormItem label="是否隐藏模块">
				<i-switch v-model="formItem.is_enable" :true-value="1" :false-value="0">
					<span slot="open">显示</span>
					<span slot="close">隐藏</span>
				</i-switch>
			</FormItem>
			<FormItem label="背景颜色">
				<ColorPicker v-model="formItem.backgroundColor" style="margin-left:150px;"/>
			</FormItem>	
			<FormItem label="背景图片">
				<div class="image-box" 
				:style=" formItem.backgroundImage != '' ? 'background-image: url('+formItem.backgroundImage+');' : '' " 
				@click="selectImage">
					<Icon 
					v-if=" typeof(formItem.backgroundImage) == 'undefined' || formItem.backgroundImage == '' || formItem.backgroundImage == null " 
					type="md-add" 
					size="25" />
					<Icon v-else type="md-close-circle" color="#f00" size="22" class="close" @click.stop="removeImage"/>
				</div>
			</FormItem>
			<FormItem label="背景图片位置">
				<RadioGroup v-model="formItem.backgroundPosition">
					<Radio label="top">顶部对齐</Radio>
					<Radio label="center">居中对齐</Radio>
					<Radio label="bottom">底部对齐</Radio>
				</RadioGroup>
			</FormItem>
      <fieldset class="m-bottom-10" style="padding-left:10px;padding-top:20px;border-color:#d2d2d2;">
				<legend>模块边距</legend>
				<div style="padding-left:5px;">
					<FormItem label="上边距">
						<Slider v-model="formItem.marginTop" 
						:min="0" :max="30" 
						show-input 
						style="margin:0 30px 0 10px;"></Slider>
					</FormItem>
					<FormItem label="下边距">
						<Slider v-model="formItem.marginBottom" 
						:min="0" :max="30" 
						show-input 
						style="margin:0 30px 0 10px;"></Slider>
					</FormItem>
					<FormItem label="左右边距">
						<Slider v-model="formItem.marginLeftRight" 
						:min="0" :max="100" 
						show-input 
						style="margin:0 30px 0 10px;"></Slider>
					</FormItem>
				</div>
			</fieldset>
			<fieldset class="m-bottom-10" style="padding-left:10px;padding-top:20px;border-color:#d2d2d2;">
				<legend>模块填充</legend>
				<div style="padding-left:5px;">
					<FormItem label="上边填充">
						<Slider v-model="formItem.paddingTop" 
						:min="0" :max="100" 
						show-input 
						style="margin:0 30px 0 10px;"></Slider>
					</FormItem>
					<FormItem label="下边填充">
						<Slider v-model="formItem.paddingBottom" 
						:min="0" :max="100" 
						show-input 
						style="margin:0 30px 0 10px;"></Slider>
					</FormItem>
					<FormItem label="左右填充">
						<Slider v-model="formItem.paddingLeftRight" 
						:min="0" :max="100" 
						show-input 
						style="margin:0 30px 0 10px;"></Slider>
					</FormItem>
				</div>
			</fieldset>
			<!-- <FormItem>
				
			</FormItem> -->
		</Form>	
		
		<!--用户图片管理组件-->
		<userImages ref="user-images" @on-return-url="returnImageUrl"></userImages>
	</div>	
</template>

<script>
import userImages from '@/views/my-components/user-images/user-images';
	
/**
 * 组件统一背景设置 - 组件
 */
export default {
	name: 'backgroundForm',
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
				backgroundColor: '',
				backgroundImage: '',
				backgroundPosition: '',
        marginTop: 0,
        marginBottom: 0,
				marginLeftRight: 0,
        paddingLeftRight: 0,
				paddingTop: 0,
				paddingBottom: 0,
				is_enable: 1
			},
		}
	},
	methods: {
		// 初始化
		init(){
			// 双向绑定store 的数据
			this.dataList = this.$store.state.app.pageCompList;
			this.formItem = this.dataList[ this.currIndex ].setting;
			let formItem = this.formItem || {};
			if( typeof( this.formItem.backgroundColor ) == 'undefined' ){
				this.$set(this.formItem, 'backgroundColor', '');
			}
			if( typeof( this.formItem.backgroundImage ) == 'undefined' ){
				this.$set(this.formItem, 'backgroundImage', '');
			}
			if( typeof( this.formItem.backgroundPosition ) == 'undefined' ){
				this.$set(this.formItem, 'backgroundPosition', 'top');
			}
			if( typeof( this.formItem.marginTop ) == 'undefined' ){
				this.$set(this.formItem, 'marginTop', 0);
			}
			if( typeof( this.formItem.marginBottom ) == 'undefined' ){
				this.$set(this.formItem, 'marginBottom', 0);
			}
			if( typeof( this.formItem.marginLeftRight ) == 'undefined' ){
				this.$set(this.formItem, 'marginLeftRight', 0);
			}
			if( typeof( this.formItem.paddingLeftRight ) == 'undefined' ){
				this.$set(this.formItem, 'paddingLeftRight', 0);
			}
			if( typeof( this.formItem.paddingTop ) == 'undefined' ){
				this.$set(this.formItem, 'paddingTop', 0);
			}
			if( typeof( this.formItem.paddingBottom ) == 'undefined' ){
				this.$set(this.formItem, 'paddingBottom', 0);
			}
			console.log("formItem", this.formItem, "-----",this.formItem.is_enable)
			if( typeof( this.formItem.is_enable ) == 'undefined' ){
				this.$set(this.formItem, 'is_enable', 1);
			}
		},
		// 选择图片（单选）
		selectImage(){
			this.$refs['user-images'].showModal( {
				name:'images', 
				multi:0, 
				selectedImages: [ this.formItem.backgroundImage ], 
			});
		},
		// 图片选择组件的回调
		returnImageUrl( obj ){
			this.$set(this.formItem, 'backgroundImage', obj.val );
		},
		// 清除图片
		removeImage(){
			this.$Modal.confirm({
				title: '操作提示',
				content: '确定清除背景图片吗？',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					this.$set( this.formItem, 'backgroundImage', '' );
				},
			});
		}
	},
	watch:{
		'currIndex' (to){
			this.init();
		}
	},
	mounted () {
		this.init();
	},
}
</script>