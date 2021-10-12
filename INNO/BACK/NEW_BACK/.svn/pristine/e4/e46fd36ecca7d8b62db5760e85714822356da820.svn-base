<style lang="less">
.limitTimeSale-form-goods-item{
	padding:10px;

	.goods-box{
		width: 70px;
		height:70px;
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
			color: #19be6b;
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

	.ivu-collapse-content>.ivu-collapse-content-box{
		padding:0;
	}
	.ivu-collapse-item:last-child>.ivu-collapse-content{
		padding:10px;
	}
}
</style>

<template>
	<div class="limitTimeSale-form-goods-item">

		<Collapse v-model="panelVal">
			<Panel name="1">
				<div style="width: 245px;display:inline-block;">
					<div class="flex f-just-between">
						<p>指定商品</p>
						<a @click.stop="showDragView" v-show="formItem.goodsList && formItem.goodsList.length > 0"><Icon type="logo-buffer" size="16"/>&nbsp;便捷排序</a>
					</div>
				</div>
				<div slot="content">
					<draggable ghost-class="ghost" :list="formItem.goodsList" :group="{name:'goodsList'}" handle=".handle_goods"
					 v-bind="dragOptions" @start="dragStart" @end="dragEnd" @change="dragChange">

						<div v-for="(item,index) in formItem.goodsList" :name="index" :key="index" class="goods-item-list">
							<Icon type="ios-close-circle-outline" class="close" title="移除" @click.stop="removeGoods(index)" />
							<Icon type="md-apps" class="handle_goods" title="拖拽排序" />

							<Row :gutter="10">
								<Col span="7">
								<div class="goods-box" :style="'background-image:url('+item.goods_thumb+');'"></div>
								</Col>
								<Col span="17" style="line-height: 2;">
								<div class="goods-name clamp">
									{{item.goods_sn!=null && item.goods_sn!='' ? '['+item.goods_sn+']' : ''}} {{item.name}}
								</div>
								<div>
									<span>￥{{item.min_price}} - {{item.max_price}}</span>
								</div>
								<div>
									标签 <Input v-model="item.tag" style="width:120px;" size="small"></Input>
								</div>
								</Col>
							</Row>
						</div>
					</draggable>

					<Button size="small" type="info" icon="md-add" long @click="onSelectGoods">添加指定商品</Button>
				</div>
			</Panel>
		</Collapse>

		<!--绑定微商品的选择器-->
		<goodsSelect ref="goods-select" @on-ok="onGoodsSelectOk"></goodsSelect>
	</div>
</template>

<script>
	import draggable from "vuedraggable";
	import goodsSelect from '@/views/my-components/goods-select/goods-select';

	export default {
		name: 'secKillGoodsItemForm',
		components: {
			draggable,
			goodsSelect,
		},
		props: {
			currIndex: {
				type: [Number, String],
				default: 0,
			},
			groupIndex: {
				type: [Number, String],
				default: 0,
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
		data() {
			return {
				formItem: {
					goodsList: [],
				},
				panelVal: '1',
				drag: false,
			}
		},
		methods: {
			init() {
				// 双向绑定store 的数据
				let dataList = this.$store.state.app.pageCompList;
				this.formItem = dataList[this.currIndex].setting.activityGroup[this.groupIndex];

				if (typeof(this.formItem.goodsList) == 'undefined') {
					this.$set(this.formItem, 'goodsList', []);
				}
				if (this.formItem.goodsList.length == 0) {
					// 如果是首次创建，弹出商品选择框
					this.onSelectGoods();
				}
			},
			// 移除商品
			removeGoods(index) {
				this.$Modal.confirm({
					title: '操作提示',
					content: '确定移除商品关联项吗？',
					okText: '确定',
					cancelText: '取消',
					onOk: () => {
						this.$delete(this.formItem.goodsList, index);
					},
				});
			},
			// 选择商品
			onSelectGoods() {
				this.$refs['goods-select'].openModal([], 'multi', this.formItem.activity_id );
			},
			// 商品选择的，回调
			onGoodsSelectOk(obj) {
				var arrGoodsIds = [];
				for (var i in this.formItem.goodsList) {
					arrGoodsIds.push(this.formItem.goodsList[i].id);
				}
				
				obj.forEach((item)=>{
					if ( arrGoodsIds.indexOf( item.id) == -1 ) {
						this.formItem.goodsList.push({
							id: item.id,
							goods_thumb: item.goods_thumb2,
							name: item.name,
							max_price: item.max_price,
							min_price: item.min_price,
							goods_sn: item.goods_sn,
							tag: '',
						});
					}
				});
			},
			showDragView(){
				let goodsList = JSON.parse(JSON.stringify(this.formItem.goodsList)) || [];
				this.$UIModule({
					mode: "drag-view",
					options: {
						dragData: goodsList,
						imgKey: 'goods_thumb',
						txtKey: 'id'
					},
					success:(data)=>{
						console.log("拖拽后", data);
						this.$set(this.formItem, 'goodsList', data.dragData || [])
					}
				})
			},
			dragChange() {

			},
			// 拖动开始
			dragStart(e) {
				this.drag = true;
			},
			// 拖动结束
			dragEnd(e) {
				this.drag = false;
			},
		},
		watch: {
			'currIndex'(to) {
				this.init();
			},
			'groupIndex'(to) {
				this.init();
			},
			'formItem.goodsList'(to) {
				this.$emit('on-change', {
					data: this.formItem.goodsList,
					groupIndex: this.groupIndex,
				});
			}
		},
		mounted() {
			this.init();
		},
	}
</script>