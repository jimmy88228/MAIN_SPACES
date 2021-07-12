<style lang="less">
	.editor-main{
  min-width: 1100px;
  width:100%;

  .main-box{
    .body-box{
      background-color: #F0F0F0;
      flex:1 1 0%;
    }
  }
  .ivu-card-body{
    padding: 0;
  }
}
</style>

<template>
	<Card class="editor-main">
		<template v-if="pageType != 'goods' ">
			<div slot="title" class="icard-header">
				<template v-if="pageType == 'page' ">
					<Tooltip content="返回" placement="bottom-start">
						<Icon type="ios-arrow-dropleft" @click="goBack" class="card-back" />
					</Tooltip>
				</template>
				<template v-else>
					<Icon type="ios-document" @click="goBack" style="cursor: pointer;" size="28" />
				</template>
				{{title}} <span v-if="data.info != null "> {{data.info.page_name}}</span>

				<template v-if="pageType == 'userCenter' || pageType =='goodsCat' ">
					<span style="margin-left:40px;">
						切换小程序：
						<Select v-model="data.appId" style="width:150px;" size="small" @on-change="onAppIdChange">
							<Option v-for="item in data.appList" :value="item.appid" :key="item.value">{{ item.appname }}</Option>
						</Select>
					</span>
				</template>
			</div>
			<div slot="extra">
				<Button type="primary" @click="onPageSave">保存</Button>
			</div>
		</template>

		<Row type="flex">
			<Col :style="{width:'180px', height: leftSiderHeight - (pageType == 'goods' ? 70 : 0 ) +'px'}">
			<div class="left-box">
				<!--左侧菜单-->
				<editorLeftMenu ref="editor-left-menu" :height="leftSiderHeight" :pageType="pageType"></editorLeftMenu>
			</div>
			</Col>
			<Col style="flex:1 1 0%;">
			<Row type="flex" class="main-box">

				<!--主内容框-->
				<Col class="body-box">
				<editorBody ref="editor-body" :height="leftSiderHeight" :pageType="pageType"></editorBody>
				</Col>

				<!--右侧栏-->
				<Col class="right-side" :style="{width: rightSiderWidth + 'px'}">
				<!--右模块-->
				<editorRightSide ref="editor-right-side" :height="leftSiderHeight" :pageType="pageType" :canWeixin="canWeixin">
				</editorRightSide>
				</Col>
			</Row>
			</Col>
		</Row>

		<!--用户图片管理组件-->
		<userImages ref="user-images" @on-return-url="returnImageUrl"></userImages>

		<!--加载提示-->
		<Spin size="large" fix v-if="spinShow"></Spin>
	</Card>
</template>

<script>
	/**
	 * 站点页面编辑器，主框架
	 */
	import editorHeader from './editor-header';
	import editorLeftMenu from './editor-left-menu';
	import editorRightSide from './editor-right-side';
	import editorBody from './editor-body';
	import userImages from '@/views/my-components/user-images/user-images';

	export default {
		name: "editorMain",
		components: {
			editorHeader,
			editorLeftMenu,
			editorRightSide,
			editorBody,
			userImages
		},
		props: {
			title: {
				type: String,
				default: '页面设置',
			},
			// 自定义页面的类型
			pageType: {
				type: String,
				default: 'page',
			},
		},
		data() {
			return {
				// 右侧工具栏宽度
				rightSiderWidth: 370,
				leftSiderHeight: 500,

				spinShow: false,
				data: {
					appId: '',
					info: null,
					appList: [],
				},

				pageId: 0,
				goodsId: 0,
				// 是否显示微信设置
				canWeixin: false,

				// 全局登录框
				modalLogin: false,

				// ueditor 命令对象
				ueditorObj: {},
			}
		},
		computed: {

		},
		methods: {
			/**
			 * @desc 初始化方法
			 */
			init() {
				this.$nextTick(() => {

					this.leftSiderHeight = document.body.clientHeight - 140;

					if (this.pageType == 'userCenter') {
						this.data.appId = this.$util.cache.get('page_app_id');
						
						// 初始化个人中心页面
						this.initUserCenter();
					}
					else if(this.pageType == 'goodsCat'){
						this.data.appId = this.$util.cache.get('page_app_id');
						
						// 初始化商品类目页面
						this.initData(0, 0, 'goodsCat');
					}
				});
			},
			initUserCenter() {
				this.spinShow = true;

				// ajax 请求获取数据
				this.$ajax.post(this.$api.goodsPageInfo, {
						page_type: 'userCenter',
						app_id: this.data.appId,
					})
					.then((response) => {
						this.spinShow = false;
						var res = response.data;
						if (res.code) {
							this.data = res.data;

							// 初始化左侧菜单
							this.$refs['editor-left-menu'].initData(this.data.componentsList);
							this.$refs['editor-right-side'].initData(this.data.componentsList);
							this.$refs['editor-body'].initData(this.data.componentsList);

							this.$store.commit('setPageCompList', this.data.info.customer_pages_modules);
							this.$store.commit('setPageInfo', {
								name: this.data.info.name,
								page_desc: this.data.info.page_desc,
							});
							this.$store.commit('setPageEditorSetting', this.data.ueditor);
						}

					});
			},
			// 初始化编辑器数据
			initData(goodsId = 0, pageId = 0, page_type = '') {
				this.goodsId = goodsId;
				this.pageId = pageId;

				if (this.goodsId > 0 || this.pageId > 0 || page_type != '') {
					this.spinShow = true;

					// ajax 请求获取数据
					this.$ajax.post(this.$api.goodsPageInfo, {
							page_id: this.pageId,
							goods_id: this.goodsId,
							app_id: this.data.appId,
							page_type: page_type,
						})
						.then((response) => {
							this.spinShow = false;
							var res = response.data;
							if (res.code) {
								this.data = res.data;
								this.canWeixin = res.data.canWeixin;

								// 初始化左侧菜单
								this.$refs['editor-left-menu'].initData(this.data.componentsList);
								this.$refs['editor-right-side'].initData(this.data.componentsList, this.data.catList);
								this.$refs['editor-body'].initData(this.data.componentsList);

								this.$store.commit('setPageCompList', this.data.info.customer_pages_modules);
								this.$store.commit('setPageInfo', {
									id: this.data.info.page_id,
									page_id: this.data.info.page_id,
									name: this.data.info.name,
									cat_id: this.data.info.cat_id,
									page_desc: this.data.info.page_desc,
									setting: this.data.info.setting,
									wx_share_title: this.data.info.wx_share_title,
									wx_share_desc: this.data.info.wx_share_desc,
									wx_share_image: this.data.info.wx_share_image,
									wx_poster_image: this.data.info.wx_poster_image,
								});
								this.$store.commit('setPageEditorSetting', this.data.ueditor);
							} else {
								// 创建的情况下
								this.$store.commit('setPageCompList', []);
								this.$store.commit('setPageInfo', {
									name: "",
									page_desc: ""
								});
							}
						});
				}
			},
			// 切换小程序 AppID
			onAppIdChange(){
				this.$util.cache.set('page_app_id', this.data.appId);
				
				this.init();
			},
			// 保存事件
			onPageSave() {
				this.spinShow = true;

				// ajax 提交数据
				this.$ajax.post(this.$api.goodsPageEdit, {
						goods_id: this.goodsId,
						page_id: this.pageId,
						page_compList: JSON.stringify(this.$store.state.app.pageCompList), // page_compList 以json 的形式提交
						name: this.$store.state.app.pageInfo.name,
						cat_id: this.$store.state.app.pageInfo.cat_id,
						page_desc: this.$store.state.app.pageInfo.page_desc,
						page_type: this.pageType,
						app_id: (this.data.appId != null ? this.data.appId : ''),
						page_setting: JSON.stringify(this.$store.state.app.pageInfo.setting),
						wx_share_title: this.$store.state.app.pageInfo.wx_share_title,
						wx_share_desc: this.$store.state.app.pageInfo.wx_share_desc,
						wx_share_image: this.$store.state.app.pageInfo.wx_share_image,
						wx_poster_image: this.$store.state.app.pageInfo.wx_poster_image,
					})
					.then((response) => {
						this.spinShow = false;
						var res = response.data;
						if (res.code) {
							this.$Message.success('保存成功！');
						}
					});
			},
			// 回调事件, 往ueditor 插入内容
			returnImageUrl(obj) {
				var content = '';
				for (var i in obj.val) {
					content += '<img src="' + obj.val[i] + '" class="goods-desc-image" style="width:100%" />';
				}
				var me = this.ueditorObj;
				me.focus();
				me.execCommand('inserthtml', content);
			},
			// 返回列表
			goBack() {
				if( this.$route.fullPath == '/plugins/weapp-goods-cat-page' ){
					this.pageType = 'goodsCat';
					this.init();
				}
				else{
					this.$emit('on-close', {});
				}
			},
		},
		watch: {
			// 观察 store 的变化
			'$store.state.app.editPageByTabNavigate'(to) {
				if( to != '' ){
					this.initData(0, to);
					this.pageType = 'page';
				}
			},
		},
		mounted() {
			this.init();
		}
	};
</script>
