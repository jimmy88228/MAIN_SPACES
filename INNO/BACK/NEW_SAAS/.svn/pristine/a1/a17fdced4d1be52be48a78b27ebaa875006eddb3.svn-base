<style lang="less">
.editor-text-view{
	padding:15px;

	.name{
		position: relative;
	}
	.desc{
		padding-top:10px;
		word-break: break-all;
	}

	.empty{
		text-align: center;
		padding:50px 20px;
		color:#515a6e;
	}
}
</style>

<template>
	<div class="editor-text-view">

		<div v-if="typeof(info.name) != 'undefined' && info.name != '' " :style="boxStyle">
			<div class="name" :style="nameStyle">
				<template v-if="info.showMore">
					<Row type="flex" justify="center" align="top">
						<Col :span="24">{{info.name}}</Col>
					</Row>
					<span :style="showMoreStyle">
						<template v-if="info.showMoreStyle == 'style1' || info.showMoreStyle == 'style2' ">
							{{info.showMoreText != '' ? info.showMoreText : '查看更多'}}
						</template>
						<template v-if="info.showMoreStyle == 'style2' || info.showMoreStyle == 'style3' ">
							<Icon type="ios-arrow-forward" size="14" />
						</template>
					</span>
				</template>
				<template v-else>
					{{info.name}}
				</template>
			</div>
			<div v-if=" info.desc != '' " class="desc" :style="descStyle">{{info.desc}}</div>
		</div>

		<!--空白的情况-->
		<div v-else class="empty">
			<Icon type="ios-list-box-outline" size="60" color="#2d8cf0"></Icon>
			<div>请点击在右侧编辑</div>
		</div>
	</div>
</template>

<script>
	/**
	 * 标题文本渲染组件
	 */
	export default {
		name: 'textView',
		components: {

		},
		props: {
			currIndex: {
				type: [Number, String],
				default: 0
			},
			// 是否使用用在 tab 导航页面内
			inTab: {
				type: Boolean,
				default: false,
			}
		},
		data() {
			return {
				info: {},
				dataList: []
			}
		},
		computed: {
			// 整体样式
			boxStyle() {
				return {
					'text-align': this.info.textAlign
				};
			},
			// 标题样式
			nameStyle() {
				return {
					'font-size': this.info.nameFontSize + 'px',
					color: this.info.textColor,
				};
			},
			// 内容样式
			descStyle() {
				return {
					'font-size': this.info.descFontSize + 'px',
					color: this.info.textColor,
				};
			},
			showMoreStyle() {
				let mstyle = {};
				switch (this.info.showMoreStyle) {
					case 'style1':
						mstyle = {
							'font-size': '12px'
						};
						break;

					case 'style2':
						mstyle = {
							'font-size': '12px'
						};
						break;

					case 'style3':
						mstyle = {

						};
						break;
				}
				if (this.info.textColor != '') {
					mstyle['color'] = this.info.textColor;
				}

				mstyle['position'] = "absolute";
				mstyle['right'] = "0";
				mstyle['top'] = "0";
				return mstyle;
			}
		},
		methods: {
			init() {
				this.dataList = this.inTab ? this.$store.state.app.tabPageCompList : this.$store.state.app.pageCompList;
				this.info = this.dataList[this.currIndex].setting;
			}
		},
		mounted() {
			this.init();
		}
	}
</script>
