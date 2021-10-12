<style lang="less">
	.drag-view-modal{
		.drag-list{
			position:relative;
			width:100%;
			height: calc(100vh - 300px);
			.drag-item{
				display: inline-block;
				margin: 6px;
				border:1px solid #dcdee2;
				border-radius: 6px;
				box-shadow: 0px 0px 5px #ccc;
				position:relative;
				cursor: move;
				.drag-item-icon{
					overflow: hidden;
					width: 100px;
					height: 100px;
					background-size:100% auto;
					background-repeat: no-repeat;
					background-position: center center;
				}
				.drag-item-txt{
					padding:4px;
					background-color:#EFEFEF;
					font-size:12px;
				}
				.drag-index{
					position:absolute;
					top:0px;
					left: 0px;
					padding: 2px 5px;
					color:#2D8CF0;
				}
			}
		}
		
	}
</style>

<template>
	<div class="drag-view-area">
		<Modal v-model="isShowModal" :loading="modalLoading" title="拖拽排序" :width="960" :styles="{top:'20px'}" class-name="drag-view-modal"
		 @on-ok="onOk" @on-cancel="onCancel">
			<div class="drag-list">
				<vue-scroll ref="vue-scroll" :ops="scrollOptions">
					<draggable ghost-class="ghost" :list="dragData" v-bind="dragOptions" >
					<div class="drag-item" :title="item[txtKey]" v-for="(item, index) in dragData" :name="item.id" :key="item.id">
						<span class="drag-index">{{index + 1}}</span>
						<div class="drag-item-icon" :style="{'background-image': 'url(' + item[imgKey] + ')'}"></div>
						<p class="drag-item-txt clamp">{{item[txtKey]}}</p>
					</div>
					</draggable>
				</vue-scroll>
			</div>
		</Modal>
	</div>
</template>

<script>
	import draggable from "vuedraggable";
	export default {
		name: 'goodsSelect',
		components: {
			draggable
		},
		data() {
			return {
				isShowModal: false,
				dragData: [],
				modalLoading: false,
				imgKey: "",
				txtKey: "",
				// 虚拟滚动条
				scrollOptions: {
					mode: 'native',
					bar: {
						keepShow: false,
						background: '#c8c8c8',
						size: '3px'
					},
					// 滚动轨道
					rail: {
						size: '3px'
					},
					scrollPanel: {
						scrollingX: false
					}
				}
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
			showModal({dragData, imgKey, txtKey}){
				this.isShowModal = true;
				if(dragData.length > 0){
					this.dragData = dragData || [];
					this.imgKey = imgKey;
					this.txtKey = txtKey;
				}
			},
			onOk(){
				this.$emit("success", { dragData: this.dragData });
			},
			onCancel(){
				this.$emit("fail");
			}
		},
		mounted() {
			
		}
	}
</script>
