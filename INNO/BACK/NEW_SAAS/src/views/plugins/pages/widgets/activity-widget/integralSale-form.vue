<style lang="less">
.integral-sale-form{
	padding:5px;
	
	.goods-box{
		width: 80px;
		height:80px;
		line-height:85px;
		border: 1px solid #eee;
	    border-radius: 5px;
	    text-align: center;
	    cursor: pointer;
	    background: center center no-repeat;
	    background-size: 100% auto;
	    margin-right:5px;
	    position: relative;
	}
	
	.goods-item-list{
		border-radius: 5px;
		margin-bottom:12px;
		margin-right:10px;
		position: relative;
		padding:5px;
		background: #fff;
		box-shadow: 0 0 4px 0 rgba(10,42,97,.2);
		
		.goods-name{
			max-width:290px;
		}
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
		.handle_goods{
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
			.close, .handle_goods{
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
	<div class="integral-sale-form">
		<titleBar>积分兑换 设置</titleBar>

		<Form ref="formValidate" :model="formItem" :rules="ruleValidate" label-position="top">
	
			<FormItem label="列表样式">
				<RadioGroup v-model="formItem.layout">
					<Radio label="one">一行一个</Radio>
					<Radio label="two">一行两个</Radio>
					<Radio label="three">一行三个</Radio>
					<Radio label="bigSmall">一大两小</Radio>
					<Radio label="list">列表形式</Radio>
				</RadioGroup>
			</FormItem>

			<FormItem 
			v-if="formItem.layout == 'one' || formItem.layout == 'two' || formItem.layout == 'three' " 
			label="只在一行内展示，多出部分左右滑动">
				<i-switch v-model="formItem.open_slide" size="large">
					<span slot="open">启用</span>
					<span slot="close">关闭</span>
				</i-switch>
			</FormItem>	
			<FormItem label="图片间距（有背景色的情况下，间距效果会更佳）">
				<Slider v-model="formItem.gutter" :min="0" :max="30" show-input style="margin:0 30px 0 10px;"></Slider>
			</FormItem>
			<FormItem label="标签(用于统计)">
				<Input v-model="formItem.tag" style="width:180px;"></Input>
			</FormItem>
			
			<div style="background-color: #eee;padding:5px 5px 0 5px;border-radius: 4px;">
				<FormItem label="显示模式">
					<RadioGroup v-model="formItem.activity_model" size="small" type="button">
						<Radio label="auto">自动获取</Radio>
						<Radio label="manual">手动添加</Radio>
					</RadioGroup>
				</FormItem>
				
				<FormItem v-if="formItem.activity_model == 'auto' " label="自动获取的商品数量( 最大30 )">
					<InputNumber v-model="formItem.show_num" :max="30" :min="1" size="small"></InputNumber>
				</FormItem>
				
				<FormItem v-if="formItem.activity_model == 'manual' " label="">
					<draggable
						ghost-class="ghost"
						:list="formItem.goodsList"
						:group="{name:'goodsList'}"
						handle=".handle_goods"
						v-bind="dragOptions"
						@start="dragStart"
						@end="dragEnd"
						@change="dragChange">
						
						<div v-for="(item,index) in formItem.goodsList" :name="index" :key="index" class="goods-item-list">
							<Icon type="ios-close-circle" class="close" title="移除" @click.stop="removeGoods(index)" />
							<Icon type="md-apps" class="handle_goods" title="拖拽排序" />
							
							<Row :gutter="16">
								<Col span="6">
									<div class="goods-box" :style="'background-image:url('+item.img_url_thumb+');'" ></div>
								</Col>
								<Col span="18" style="line-height: 2;">
									<div class="goods-name clamp">
										{{item.name}}
									</div>
									<div>
										<span style="text-decoration: line-through;font-size:12px;color:#ddd;">￥{{item.market_price}}</span>
										<span>￥{{item.sale_price}} + {{item.integral}} 积分</span> 
									</div>
									<!--
									<div>
										<span style="font-size:12px;">{{item.start_time}} - {{item.end_time}}</span>
									</div>-->
								</Col>
							</Row>
						</div>
					</draggable>
					
					<Button long @click="onSelectGoods">
						<Icon type="md-add" size="18" style="margin-right:5px;"></Icon>
						选择积分商城商品
					</Button>
				</FormItem>
			</div>
		</Form>
		
		<!--统一内容显示开关-->
		<activityContentSwitchForm :currIndex="currIndex"></activityContentSwitchForm>
		
		<!--统一活动头-->
		<activityHeaderForm :currIndex="currIndex" headerTitle="积分商城"></activityHeaderForm>
		
		<!--积分商品的选择器-->
		<integralGoodsSelect ref="goods-select" :topType="2" @on-ok="onGoodsSelectOk"></integralGoodsSelect>
	</div>
</template>

<script>
/**
 * 积分兑换组件
 */
import titleBar from '@/views/my-components/title-bar/title-bar';
import draggable from "vuedraggable";
import integralGoodsSelect from '@/views/my-components/integral-goods-select/integral-goods-select';
import activityHeaderForm from './activity-header-form';
import activityContentSwitchForm from './activity-content-switch-form.vue';

export default {
	name: 'integralSaleForm',
	components:{
		draggable,
		titleBar,
		integralGoodsSelect,
		activityHeaderForm,
		activityContentSwitchForm
	},
	props:{
		currIndex:{
			type: [Number,String],
			default: 0,
		}
	},
	data() {
		return {
			formItem:{
				activity_model: 'auto',
				show_num: 10,
				layout: 'two',
				open_slide: false,
				gutter: 0,
				goodsList:[],
				tag: '',
			},

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
			// 双向绑定store 的数据
			this.dataList = this.$store.state.app.pageCompList;
			this.formItem = this.dataList[ this.currIndex ].setting;

			if( typeof( this.formItem.activity_model ) == 'undefined' ){
				this.$set(this.formItem, 'activity_model', 'auto');
				this.$set(this.formItem, 'show_num', 10);
				
				this.$set( this.formItem, 'layout', 'two');
				this.$set( this.formItem, 'open_slide', false );
				this.$set( this.formItem, 'gutter', 0 );
				this.$set( this.formItem, 'goodsList', []);
				this.$set( this.formItem, 'tag', '' );
			}
		},
		// 打开积分商品选择器
		onSelectGoods(){
			this.$refs['goods-select'].openModal( [] , 'multi' );
		},
		// 选中商品的回调
		onGoodsSelectOk( obj ){console.log(obj);
			var arrGoodsIds = [];
			for(var i in this.formItem.goodsList ){
				arrGoodsIds.push( this.formItem.goodsList[i].id );
			}
			
			for( var i in obj ){
				if( arrGoodsIds.indexOf(obj[i].id) == -1 ){
					this.formItem.goodsList.push({
						id: obj[i].id,
						goods_id: obj[i].goods_id,
						img_url_thumb: obj[i].picture,
						name: obj[i].name,
						goods_name: obj[i].goods_name,
						sale_price: obj[i].get_mk_product[0].sale_price,
						market_price: obj[i].get_mk_product[0].market_price,
						integral: obj[i].get_mk_product[0].integral,
						start_time: obj[i].start_time,
						end_time: obj[i].end_time,
					});
				}
			}
		},
		// 移除商品
		removeGoods(index){
			this.$Modal.confirm({
				title: '操作提示',
				content: '确定移除关联商品项吗？',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					this.$delete( this.formItem.goodsList, index );
				},
			});
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
