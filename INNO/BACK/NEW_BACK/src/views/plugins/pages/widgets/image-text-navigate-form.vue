<style lang="less">
.image-text-nav-form{
	padding: 5px;
	
	.image-box{
		width: 75px;
		height:75px;
		line-height:75px;
		border: 1px solid #eee;
	    border-radius: 5px;
	    text-align: center;
	    background: center center no-repeat;
	    background-size: 100% auto;
	    margin-right:5px;
	    position: relative;
	}
	
	.item-list{
		border-radius: 5px;
		margin-bottom:12px;
		margin-right:10px;
		position: relative;
		padding:5px;
		background: #fff;
		box-shadow: 0 0 4px 0 rgba(10,42,97,.2);
		
		.close{
			position: absolute;
			right:-10px;
			top:-10px;
			font-size: 10px;
			cursor: pointer;
			display:none;
			color:red;
			font-size: 22px;
		}
		.handle_ad{
			position: absolute;
			right:25px;
			top:-10px;
			font-size: 10px;
			cursor: move;
			display:none;
			color: #2d8cf0;
			font-size: 22px;
		}
		&:hover{
			.close, .handle_ad{
				display: block;
			}
		}
	}
	.ghost {
		opacity: 0.5;
		background: #eee;
	}
	.link-to .link-tags{
		max-width: 115px;
	}
	.ivu-radio-group-button.ivu-radio-group-small .ivu-radio-wrapper{
		font-size:12px;
	}
}
</style>

<template>
	<div class="image-text-nav-form">
		<titleBar>图文导航组件 设置</titleBar>
		
		<Form ref="formValidate" :model="formItem" :rules="ruleValidate" label-position="top">
			<FormItem label="导航类型" prop="type">
				<RadioGroup v-model="formItem.type" size="small" type="button">
			        <Radio label="imageText">图文导航</Radio>
			        <Radio label="text">文字导航</Radio>
			    </RadioGroup>
			</FormItem>	
			
			<template v-if="formItem.type == 'imageText' ">
				<FormItem label="一列展示图片数量">
					<RadioGroup v-model="formItem.row">
						<Radio :label="1">1张</Radio>
						<Radio :label="2">2张</Radio>
						<Radio :label="3">3张</Radio>
						<Radio :label="4">4张</Radio>
						<Radio :label="5">5张</Radio>
					</RadioGroup>
				</FormItem>
				<FormItem label="只在一行内展示，多出部分左右滑动">
					<i-switch v-model="formItem.open_slide" size="large">
						<span slot="open">启用</span>
						<span slot="close">关闭</span>
					</i-switch>
				</FormItem>
				<FormItem label="ICON模式">
					<i-switch v-model="formItem.open_icon" size="large">
						<span slot="open">启用</span>
						<span slot="close">关闭</span>
					</i-switch>
				</FormItem>	
				<FormItem v-if="formItem.open_icon == true " label="ICON形状">
					<RadioGroup v-model="formItem.icon_shape">
						<Radio label="square">方形</Radio>
						<Radio label="circle">圆型</Radio>
					</RadioGroup>
				</FormItem>
				<FormItem label="图片间距（有背景色的情况下，间距效果会更佳）">
					<Slider v-model="formItem.gutter" :min="0" :max="30" 
					show-input style="margin:0 30px 0 10px;"></Slider>
				</FormItem>
			</template>
			
			<FormItem label="文字颜色( 默认随系统主题色 )">
				<ColorPicker v-model="formItem.textColor" style="margin-left:150px;" />
			</FormItem>	

			<FormItem label="图文列表">
				<draggable
					ghost-class="ghost"
					:list="formItem.items"
					:group="{name:'imageList'}"
					handle=".handle_ad"
					v-bind="dragOptions"
					@start="dragStart"
					@end="dragEnd"
					@change="dragChange">
					
					<div v-for="(item,index) in formItem.items" :name="index" :key="index" class="item-list">
						<Icon type="ios-close-circle" class="close" title="移除" @click="removeItem(index)" />
						<Icon type="md-apps" class="handle_ad" title="拖拽排序" />
						
						<Row :gutter="16">
							<Col span="6">
								<div class="image-box" 
								:style="'background-image: url('+item.image+');'"></div>
								<div style="text-align: center;"><a @click="selectImage(index)">更换图片</a></div>
							</Col>
							<Col span="18">
								<div>
									标题
									<Input v-model="item.title" size="small" placeholder="图片名称" style="width:160px;margin-left:10px;" />
								</div>
								<div>
									链接
									<!--添加链接组件-->
									<linkTo style="margin-left:9px;"
										:itemIndex="index" 
										:selectLink="(typeof(item.link) != 'undefined' ? item.link : {})" 
										@on-selected="onSelectLink">
									</linkTo>
								</div>
								<div>
									标签
									<Input v-model="item.tag" style="width:150px;margin-left:10px;" size="small"></Input>
								</div>
							</Col>
						</Row>
					</div>
				</draggable>
				
				<Button long @click="addItem"><Icon type="md-add" size="18" style="margin-right:5px;"></Icon>添加图文导航</Button>
			
			</FormItem>	
		</Form>
		
		<!--用户图片管理组件-->
		<userImages ref="user-images" @on-return-url="returnImageUrl"></userImages>
	</div>	
</template>	

<script>
/**
 * 图文导航组件
 */
import draggable from 'vuedraggable';
import linkTo from '@/views/my-components/link-to/link-to';
import titleBar from '@/views/my-components/title-bar/title-bar';
import userImages from '@/views/my-components/user-images/user-images';

export default {
	name: 'imageTextNavigateForm',
	components:{
		draggable,
		linkTo,
		titleBar,
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
				items: [],
				row: 5,
				textColor: '',
				type: 'imageText',
				gutter: 0,
				open_slide: true,
				open_icon: true,
				icon_shape: 'square',
			},
			
			// 表单数据规则
			ruleValidate:{},
			
			dataList:[],
			currImageIndex: 0,
			drag: false,
        }
    },
    computed: {
		dragOptions() {
			return {
				animation: 200,
				group: 'description',
				disabled: false,
				ghostClass: 'ghost'
			};
		}
	},
	methods: {
		init(){
			// 双向绑定store 的数据
			this.dataList = this.$store.state.app.pageCompList;
			this.formItem = this.dataList[ this.currIndex ].setting;
			
			// 对缺省内容的初始化
			if( typeof( this.formItem.items ) == 'undefined'){
				this.$set( this.formItem, 'items', [
					{title:'导航一',image:'',tag: '', link:{}},
					{title:'导航二',image:'',tag: '', link:{}},
					{title:'导航三',image:'',tag: '', link:{}},
					{title:'导航四',image:'',tag: '', link:{}},
					{title:'导航五',image:'',tag: '', link:{}},
				]);
				this.$set( this.formItem, 'type', 'imageText');
				this.$set( this.formItem, 'row', 5);
				this.$set( this.formItem, 'open_slide', true );
				this.$set( this.formItem, 'gutter', 0 );
				this.$set( this.formItem, 'textColor', '');
				this.$set( this.formItem, 'open_icon', true);
				this.$set( this.formItem, 'icon_shape', 'square');
			}
		},
		// 链接到 选中后的回调
		onSelectLink( index, selectedLink ){
			this.$set( this.formItem.items[ index ], 'link', selectedLink );
		},
		// 添加项
		addItem(){
			this.formItem.items.push({title:'导航',image:'',tag: '', link:{}});
		},
		// 移除项
		removeItem(index){
			this.$Modal.confirm({
				title: '操作提示',
				content: '确定移除图文项吗？',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					this.$delete( this.formItem.items, index );
					
					if( this.formItem.items.length <= 5 ){
						// 动态计算row
						this.formItem.row = this.formItem.items.length;
					}
				},
			});
		},
		// 选择图片（单选）
		selectImage( index ){
			this.currImageIndex = index;
			this.$refs['user-images'].showModal( {
				name:'images', 
				multi:0, 
				selectedImages: [], 
			});
		},
		// 图片选择组件的回调
		returnImageUrl( obj ){
			this.formItem.items[ this.currImageIndex ].image = obj.val;
		},
		dragChange(){
			
		},
		// 拖动开始
		dragStart( e ){
			this.drag = true;
		},
		// 拖动结束
		dragEnd( e ){
			this.drag = false;
		},
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