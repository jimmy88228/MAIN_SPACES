<style lang="less">
.tab-nav-form{
	padding:5px;
	
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
		.handle_nav{
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
			.close, .handle_nav{
				display: block;
			}
		}
	}
	.ghost {
		opacity: 0.5;
		background: #eee;
	}
}
</style>

<template>
	<div class="tab-nav-form">
		<titleBar>Tab页面组件 设置</titleBar>

		<Form ref="formValidate" :model="formItem" :rules="ruleValidate" label-position="top">
			<FormItem label="Tab所在位置" prop="type">
				<RadioGroup v-model="formItem.type" size="small" type="button">
				    <Radio label="top">顶部</Radio>
				    <Radio label="left">左侧</Radio>
				</RadioGroup>
			</FormItem>
			<FormItem v-if=" formItem.type == 'top' " label="顶部导航样式(左侧导航不使用)" prop="type">
				<RadioGroup v-model="formItem.navType" size="small" type="button">
				    <Radio label="word">文字导航</Radio>
				    <Radio label="image">图片导航</Radio>
				</RadioGroup>
			</FormItem>
			<FormItem v-if="formItem.pageList.length > 0 " label="切换当前Tab ( 仅用于预览效果 )" prop="type">
				<RadioGroup v-model="formItem.currTab">
				    <Radio v-for="(citem,cindex) in formItem.pageList" :key="cindex"
					:label="'Tab'+cindex">{{ citem.tab_name != '' ? citem.tab_name : 'Tab-'+cindex }}</Radio>
				</RadioGroup>
			</FormItem>
			<FormItem label="关联页面列表 ( 注意: 会自动剔除 Tab导航类型的页面 )">
				<draggable
					ghost-class="ghost"
					:list="formItem.pageList"
					:group="{name:'pageList'}"
					handle=".handle_nav"
					v-bind="dragOptions"
					@start="dragStart"
					@end="dragEnd"
					@change="dragChange">

					<div v-for="(item,index) in formItem.pageList" :name="index" :key="index" class="item-list"
					@click.stop="cardClick(index)">
						<Icon type="ios-close-circle" class="close" title="移除" @click.stop="removePage(index)" />
						<Icon type="md-apps" class="handle_nav" title="拖拽排序" />

						<Row :gutter="0">
							<Col span="6">
								<i-switch v-model="item.is_enable" size="large" style="margin-top:22px;">
									<span slot="open">显示</span>
									<span slot="close">隐藏</span>
								</i-switch>
							</Col>
							<Col span="18" style="line-height: 2.5;">
								<div>
									Tab名称：<Input v-model="item.tab_name" size="small" placeholder="请输入Tab名称" style="width:160px;margin-left:10px;" />
								</div>
								<div>
									Tab备注：<Input v-model="item.label_name" size="small" placeholder="请输入Tab备注" style="width:160px;margin-left:10px;" />
								</div>
								<div v-show=" formItem.navType == 'image' ">
									图片导航：
									<div class="image-box" :style="'background-image: url('+item.nav_image+');'"
									@click="selectSingleImage(index)"></div>
								</div>
								<div class="clamp">
									微页面：{{item.page_name != '' ? item.page_name : "ID:"+item.page_id }}
								</div>
								<div>
									<Button size="small" @click="goEditPage(item)">编辑当前微页面</Button>
								</div>
							</Col>
						</Row>
					</div>
				</draggable>
				
				<div style="text-align: center;">
					<Button :loading="loading" @click="onAddPage">创建空白页面到tab</Button>
					<Button @click="onSelectPage">添加现有页面到tab</Button>
				</div>
			</FormItem>
		</Form>

		<!--选择微页面-->
		<goodsPageSelect ref="page-select" @on-ok="onPageSelected"></goodsPageSelect>
		
		<!--用户图片管理组件-->
		<userImages ref="user-images" @on-return-url="returnImageUrl"></userImages>
	</div>
</template>

<script>
/**
 * 顶部导航小工具
 */
import titleBar from '@/views/my-components/title-bar/title-bar';
import draggable from "vuedraggable";
import goodsPageSelect from '@/views/my-components/goods-page-select/goods-page-select';
import userImages from '@/views/my-components/user-images/user-images';

export default {
	name: 'tabNavigateForm',
	components:{
		titleBar,
		draggable,
		goodsPageSelect,
		userImages,
	},
	props:{
		currIndex:{
			type: [Number,String],
			default: 0,
		}
	},
    data() {
        return {
			loading: false,
			formItem:{
				currTab: 'name0',
				pageList:[],
			},

			pageInfo: {},
			dataList:[],

			// 表单数据规则
			ruleValidate:{},

			drag: false,
		}
	},
	computed: {
		dragOptions() {
			return {
				animation: 200,
				group: "description",
				disabled: false,
				ghostClass: "ghost",
			};
		}
	},
	methods: {
		init(){
			// 获取当前页面的信息
			this.pageInfo = this.$store.state.app.pageInfo;

			// 双向绑定store 的数据
			this.dataList = this.$store.state.app.pageCompList;
			this.formItem = this.dataList[ this.currIndex ].setting;

			if( typeof( this.formItem.pageList ) == 'undefined' ){
				this.$set( this.formItem, 'currTab', 'Tab0');
				this.$set( this.formItem, 'navType', 'word');
				this.$set( this.formItem, 'pageList', []);
			}
			
			// 清空
			this.$store.commit('setEditPageByTabNavigate', '');
		},
		// 移除页面
		removePage(index){
			this.$Modal.confirm({
				title: '操作提示',
				content: '确定移除页面关联项吗？',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					this.$delete( this.formItem.pageList, index );
				},
			});
		},
		// 添加空白页面到tab
		onAddPage(){
			this.$Modal.confirm({
				title: '操作提示',
				content: '确定创建空白页面吗？',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					this.loading = true;
					// 创建空白页面
					this.$ajax.post( this.$api.goodsPageAdd, {
						template_code: 'emptyPage',
						app_id: this.$util.cache.get('page_app_id'),
					})
					.then((response) => {
						this.loading = false;
						let res = response.data;
						if (res.code) {
							this.loading = false;

							this.formItem.pageList.push({
								page_id: res.data.page_id,
								page_name: res.data.page_name,
								tab_name: '新建标签',
								label_name: '',
								nav_image: '',
								is_enable: true,
							});
						} 
					})
					.catch(()=>{
						this.loading = false;
					});
				},
			});
		},
		// 选择页面
		onSelectPage(){
			this.$refs['page-select'].openModal([] , 'multi' );
		},
		// 页面选择的，回调
		onPageSelected( obj ){
			var arrPageIds = [];
			for(var i in this.formItem.pageList ){
				arrPageIds.push( this.formItem.pageList[i].page_id );
			}

			for( var i in obj ){
				// 组件是不能包含当前页面的
				if( arrPageIds.indexOf(obj[i].id) == -1
					&& obj[i].template_code != 'tabNavigatePage'
				){
					this.formItem.pageList.push({
						page_id: obj[i].page_id,
						page_name: obj[i].page_name,
						tab_name: '',
						label_name: '',
						nav_image: '',
						is_enable: true,
					});
				}
        else{
          this.$Message.info('已经过滤不合法页面！');
        }
			}
		},
		// card 点击事件
		cardClick(index){
			this.formItem.currTab = 'Tab'+index;
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
		goEditPage( item ){
			this.$Modal.confirm({
				title: '操作提示',
				content: "确定跳转去编辑选中的微页面吗？<br />请确定已经保存了当前页面！！！",
				okText: '确定',
				cancelText: '取消',
				onOk: () => {

					this.$store.commit('setEditPageByTabNavigate', item.page_id );
				},
			});
		},
		// 选择图片（单选）
		selectSingleImage(index) {
			this.currImageIndex = index;
			this.$refs['user-images'].showModal({
				name: 'single-image',
				multi: 0,
				selectedImages: [],
			});
		},
		// 图片选择组件的回调
		returnImageUrl(obj) {
			// 单张图片的切换
			this.$set(this.formItem.pageList[this.currImageIndex], 'nav_image', obj.val);
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
