<style lang="less">
	.image-hotmap-form{
	.parent-box{
		position: relative;
		width:617px;
		max-height:500px;
		overflow:hidden scroll;

		.poster-img{
			width:100%;
			height:auto;
		}
		.poster-map{
			cursor: move;
			border:1px solid #2d8cf0;
			background: rgba(0,0,0,.5);

			.remark{
				position: absolute;
				width:100%;
				top:42%;
				color:#fff;
				text-align: center;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				font-size:12px;
				padding:0 10px;
			}
			.close{
				font-size:25px;
				position: absolute;
				top:3px;
				right:3px;
				color:#fff;
				cursor: pointer;
			}
		}
	}
}
</style>

<template>
	<div>
		<Modal v-model="modalShow" :title="modalTitle" :loading="modalLoading" :styles="{top:'30px'}" width="647" class="image-hotmap-form">

			<div class="parent-box">
				<img :src="poster" class="poster-img" />

				<draggable-resizable v-for="(item,index) in posterMap" :name="index" :key="index" class="poster-map" :w="item.map_width"
				 :h="item.map_height" :x="item.map_x" :y="item.map_y" @activated="onActivated(index)" @deactivated="onDeactivated(index)"
				 @dragging="onDrag" @resizing="onResize" @dblclick.native="settingUrl(index, item)">
					<p class="remark">
						<span v-if=" typeof(item.link) != 'undefined' && typeof(item.link.name) != 'undefined' && item.link.name != '' ">
							{{item.link.typeName}} {{item.link.name}}
						</span>
						<span v-else>{{item.remark}}</span>
					</p>
					<Icon class="close" type="ios-close-circle-outline" @click="removeMap(index)" title="删除热点"></Icon>
				</draggable-resizable>
			</div>

			<div slot="footer">
				<Button type="success" @click="addMap">添加热点框</Button>
				<Button type="primary" @click="saveMap">保存</Button>
			</div>
		</Modal>

		<!--设置热区链接-->
		<Modal v-model="modalSetting" title="设置链接" @on-ok="onSettingOk">

			<Row>
				<Col span="6">跳转地址：</Col>
				<Col>
				<!--添加链接组件-->
				<linkTo :itemIndex="linkIndex" :selectLink="(typeof(currItem.link) != 'undefined' ? currItem.link : {})"
				 @on-selected="onSelectLink">
				</linkTo>
				</Col>
			</Row>
		</Modal>

	</div>
</template>

<script>
	/**
	 * 图片热点编辑
	 */
	import draggableResizable from 'vue-draggable-resizable-gorkys';
	import linkTo from '@/views/my-components/link-to/link-to';
	import 'vue-draggable-resizable-gorkys/dist/VueDraggableResizable.css';

	export default {
		name: 'imageHotmapForm',
		components: {
			draggableResizable,
			linkTo,
		},
		props: {},
		data() {
			return {
				// 模态框
				modalShow: false,
				modalTitle: '设置图片热点',
				modalLoading: true,

				// url 模态框
				modalSetting: false,

				info: {},
				poster: '',
				posterMap: [],
				posterIndex: 0,

				// 选中的拖动框
				currIndex: -1,
				currItem: {},
				linkIndex: -1,

				// 虚拟滚动条
				scrollOptions: {
					mode: 'native',
					bar: {
						keepShow: false,
						background: '#c8c8c8'
					}
				},

				// 拖动层
				width: 200,
				height: 200,
				x: 50,
				y: 50
				// 图片编辑时候宽度保证是 600，那么xy 就根据这个确定位置大小
			}
		},
		methods: {
			// 初始化
			init() {

			},
			// 提供给父组件使用
			openModal(index, info) {
				this.posterIndex = index;
				this.modalShow = true;
				this.info = info;
				this.poster = this.info.images[index].img;

				// 对热区的初始化，非双向绑定
				this.posterMap = [];
				if (typeof(this.info.images[index].poster_map) !== 'undefined' && this.info.images[index].poster_map.length > 0) {
					for (var i in this.info.images[index].poster_map) {
						this.posterMap.push(this.info.images[index].poster_map[i]);
					}
				}
				if (this.posterMap.length == 0) {
					this.addMap();
				}
			},
			// 保存按钮
			saveMap() {
				// 检查是否添加了热点
				var hasError = false;
				for (var i in this.posterMap) {
					if (typeof(this.posterMap[i].link) === 'undefined') {
						hasError = true;
						break;
					}
				}

				if (hasError) {
					this.$Modal.error({
						title: '错误提示',
						content: '请添加热区链接'
					});
				} else {
					// 把值传递上去父级
					this.$set(this.info.images[this.posterIndex], 'poster_map', this.posterMap);
					this.modalShow = false;
				}
			},
			// 添加热区
			addMap() {
				this.currIndex = -1;
				this.posterMap.push({
					map_x: 30,
					map_y: -230,
					map_width: 100,
					map_height: 100,
					remark: '双击设置链接',
				});

			},
			// 删除选中的拖动框
			removeMap(index) {
				this.$Modal.confirm({
					title: '删除提示',
					content: '确定删除吗？',
					okText: '确定删除',
					cancelText: '取消',
					onOk: () => {
						this.$delete(this.posterMap, index);
						this.currIndex = -1;
					}
				});
			},
			// 选中拖动框事件
			onActivated(index) {
				this.currIndex = index;
			},
			// 点击空白处，结束事件
			onDeactivated(index) {
				this.currIndex = -1;
			},
			onResize(x, y, width, height) {
				if (this.currIndex != -1) {
					this.$set(this.posterMap[this.currIndex], 'map_x', x);
					this.$set(this.posterMap[this.currIndex], 'map_y', y);
					this.$set(this.posterMap[this.currIndex], 'map_width', width);
					this.$set(this.posterMap[this.currIndex], 'map_height', height);
				}
			},
			onDrag(x, y) {
				if (this.currIndex != -1) {
					this.$set(this.posterMap[this.currIndex], 'map_x', x);
					this.$set(this.posterMap[this.currIndex], 'map_y', y);
				}
			},
			// 设置链接
			settingUrl(index, item) {
				this.modalSetting = true;
				this.linkIndex = index;
				this.currItem = item;
			},

			// 链接到 选中后的回调
			onSelectLink(index, selectedLink) {
				this.$set(this.posterMap[index], 'link', selectedLink);
			},
			// 确认保存链接的按钮
			onSettingOk() {
				this.modalSetting = false;
			},
		},
		mounted() {
			this.init();
		}
	}
</script>
