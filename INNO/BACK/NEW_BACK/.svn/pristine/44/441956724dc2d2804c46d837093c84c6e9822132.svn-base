<style lang="less">
@import "./main.less";

/*导入自定义的图标(icon在这里作为全局导入，其它地方就不用再引入了)*/
@import "../styles/myIcon.less";
</style>

<template>
	<div class="main" :class="$store.state.app.badminTheme != '' ? $store.state.app.badminTheme : badminTheme">
		<div class="sidebar-menu-con" :style="{width: hideList ? '60px' : '180px', overflow:'auto'}">
			<shrinkable-menu :shrink="shrink" @on-change="handleSubmenuChange" :theme="menuTheme" :before-push="beforePush"
			 :open-names="openedSubmenuArr" :menu-list="menuList">
				<div slot="top" class="logo-con">
					<template v-if="maxLogo!=false">
						<div :title="brandName" class="logo-bg" :style="{'background-image':'url('+maxLogo+')'}"></div>
						<div v-show="!hideList" class="brandTxt0">{{brandName}}</div>
					</template>
					<template v-else>
						<div class="brandTxt">{{brandName}}</div>
					</template>
				</div>
			</shrinkable-menu>
		</div>
		<div class="main-header-con" :style="{paddingLeft: hideList ? '60px' : '180px'}">
			<div class="main-header flex f-just-between">
				<div class="header-middle-con flex f-align-center">
					<Icon v-show="!hideList" class="ionmy ion-my-hide-list list-btn" @click="onChangeList"></Icon>
					<Icon v-show="hideList" class="ionmy ion-my-show-list list-btn" @click="onChangeList"></Icon>
					
					<div class="flex f-align-center pointer product-service-pointer" @click="showProductService">
						<Icon type="ios-list" size="26"/><p>产品及服务</p>
					</div>
					
					<div class="main-breadcrumb">
						<breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
					</div>
				</div>

				<div class="header-avator-con flex f-align-center">
					<!--客服组件-->
					<customerServiceTip v-if="customerServiceEnable"></customerServiceTip>

					<!--全屏组件-->
					<full-screen v-model="isFullScreen" @on-change="fullscreenChange"></full-screen>

					<!--锁屏-->
					<lock-screen></lock-screen>

					<message-tip v-model="mesCount"></message-tip>

					<div class="message-con">
						<Tooltip content="帮助和服务" placement="bottom">
							<Icon type="ios-help-circle-outline" :color="faqColor" :size="20" class="faqIcon" :style="faqStyle" @click="showFaqSider"></Icon>
						</Tooltip>
					</div>

					<!--用户头像-->
					<div class="user-dropdown-menu-con">
						<Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
							<Dropdown transfer trigger="click" @on-click="onUserDropdown">
								<a href="javascript:void(0)">
									<span class="main-user-name" :title="userName">{{ userName }}</span>
									<Icon type="md-arrow-dropdown"></Icon>
								</a>
								<DropdownMenu slot="list">
									<DropdownItem name="ownSpace">账号设置</DropdownItem>
									<DropdownItem name="layoutSetting">布局设置</DropdownItem>
									<DropdownItem name="helpCenter">帮助中心</DropdownItem>
									<!--<DropdownItem name="releaseNotes">历史更新</DropdownItem>-->
									<DropdownItem name="loginout" divided>退出登录</DropdownItem>
								</DropdownMenu>
							</Dropdown>
							<Tooltip :content="userTypeTip" placement="bottom">
								<Avatar :src="avatarFormat" style="background: #619fe7;"></Avatar>
							</Tooltip>
						</Row>
					</div>
				</div>
			</div>
			
			<!--页面标签栏-->
			<div class="tags-con" v-if="$store.state.app.openPageTags">
				<tags-page-opened :pageTagsList="pageTagsList"></tags-page-opened>
			</div>
		</div>
		<div class="single-page-con" :style="{left: hideList ? '60px' : '180px', top: $store.state.app.openPageTags == true ? '92px' : '55px' }">
			<div class="single-main-box">
				
				<!--主内容框-->
				<div class="single-page-box" :style="{width: singlePageWidth+'px'}">
					<div class="single-page" ref="singlePage">
						<transition name="fadex" mode="out-in" :duration="{enter:400,leave:200}">
							<keep-alive :include="cachePage">
								<router-view></router-view>
							</keep-alive>
						</transition>
					</div>
				</div>

				<!--faq侧栏-->
				<transition name="faqx" mode="out-in">
					<div v-show="showFaqBox" class="faq-side-box" :style="{width: faqSiderWidth+'px'}">
						<div class="faq-side">
							<!--faq模块-->
							<adminFaqBox ref="admin-faq-box" @on-hide="hideFaqSider"></adminFaqBox>
						</div>
					</div>
				</transition>
			</div>
		</div>

		<!--单点注销的js加载点-->
		<div id="logoutssojs"></div>

		<!--登录框-->
		<Modal v-model="modalLogin" class="login-box" width="350" :mask-closable="false" :closable="false" footer-hide>
			<loginBox :isLoginBox="true" @login-success="loginBoxSuccess"></loginBox>
		</Modal>

		<!--客服 websocket 组件-->
		<kefuWebsocket ref="kefu-websocket"></kefuWebsocket>

		<!--用户图片管理组件(提供给ueditor 的自定义图片按钮使用)-->
		<userImages ref="user-images" @on-return-url="returnImageUrl"></userImages>
		
		<!--全局布局设置-->
		<layoutSetting ref="layout-setting"></layoutSetting>
		
		<!--产品&服务-->
		<productService ref="product-service"></productService>
		
		<!--加载提示-->
		<Spin size="large" fix v-if="spinShow"></Spin>
	</div>
</template>

<script>
	/**
	 * 主框架，登录后的总界面入口都在这里
	 */
	import util from '@/libs/util.js';
	import Cookies from 'js-cookie';

	import shrinkableMenu from './main-components/shrinkable-menu/shrinkable-menu.vue';
	import tagsPageOpened from './main-components/tags-page-opened.vue'; // 页面tabs
	import breadcrumbNav from './main-components/breadcrumb-nav.vue';
	import fullScreen from './main-components/fullscreen.vue';
	import lockScreen from './main-components/lockscreen/lockscreen.vue';
	import messageTip from './main-components/message-tip.vue';
	import layoutSetting from './main-components/layout-setting.vue';
	import adminFaqBox from './my-components/admin-faq/faq-box.vue';
	import loginBox from '@/views/login/login.vue';
	import userImages from '@/views/my-components/user-images/user-images';
	import customerServiceTip from './main-components/customer-service-tip';
	import kefuWebsocket from '@/views/my-components/admin-websocket/kefu-websocket.vue';
	import productService from '@/views/home/components/product-service/index.vue'

	export default {
		components: {
			shrinkableMenu,
			tagsPageOpened,
			breadcrumbNav,
			fullScreen,
			lockScreen,
			messageTip,
			layoutSetting,
			adminFaqBox,
			customerServiceTip,
			kefuWebsocket,
			userImages,
			loginBox,
			productService
		},
		data() {
			return {
				// 管理员菜单数据源
				adminMenuList: [],
				shrink: false,
				userName: '',
				isFullScreen: false,
				hideList: false,
				singlePageWidth: 900,
				showFaqBox: false,

				// 菜单数据
				openedSubmenuArr: this.$store.state.app.openedSubmenuArr,
				maxLogo: '',
				brandName: '',
				avatarFormat: '',
				badminTheme: '',

				// 用户类型
				userTypeTip: '',

				// 缓存的全局配置数据
				resData: {},

				// faq 侧栏
				faqSiderWidth: 200,
				faqColor: '',
				faqStyle: '',

				// 编辑活动页面的按钮
				showPageButtons: false,
				publishDisable: false,
				publishTxt: '发布活动',
				showPagePause: false,
				showPagePlay: false,

				// 全局登录框
				modalLogin: false,

				// 是否启用了客服 组件
				customerServiceEnable: false,

				// ueditor 命令对象
				ueditorObj: {},
				spinShow: false
			};
		},
		computed: {
			menuList() {
				// 这里是初始化菜单
				return this.adminMenuList;
			},
			pageTagsList () {
				return this.$store.state.app.pageOpenedList; // 打开的页面的页面对象
			},
			currentPath() {
				var currPath = this.$store.state.app.currentPath;

				// 对 特定 plugins 第二个面包屑的改写
				if (typeof(currPath[1]) !== 'undefined' && currPath[1].name == 'plugins') {
					currPath[1].path = '/plugins/plugin-list';
				}
				return currPath; // 当前面包屑数组
			},
			avatorPath() {
				// 头像
				return window.localStorage.avatorImgPath;
			},
			cachePage() {
				return this.$store.state.app.cachePage;
			},
			lang() {
				return this.$store.state.app.lang;
			},
			menuTheme() {
				return this.$store.state.app.menuTheme;
			},
			mesCount() {
				return this.$store.state.app.messageCount;
			}
		},
		methods: {
			/**
			 * @desc 初始化方法
			 */
			init() {
				// 设置当前路由
				util.setCurrentPath(this, this.$route.name);

				this.userName = Cookies.get('user');

				this.$store.commit('setInitMenu', false);

				if (util.cache.get('mainFrameData') != null) {
					// 读取cookie 里面的缓存数据
					var res = JSON.parse(util.cache.get('mainFrameData'));
					this.initSet(res);
					this.resData = res;

					// 初始化 faq
					var adminFaqData = this.$util.cache.get('adminFaqData');
					if (adminFaqData != null) {
						this.$refs['admin-faq-box'].initData(adminFaqData);
					}
					this.$store.commit('setInitMenu', true);

					// 设置未读信息总数
					this.$store.commit('setMessageCount', res.data.messageCount);
					this.$store.commit('setMessageItemCount', res.data.messageItem);

					// 是否启用客服，而且当前是客服人员，才会启动客服组件
					this.customerServiceEnable = res.data.customerServiceEnable;
					if (this.customerServiceEnable) {
						this.$refs['kefu-websocket'].init(res.data.customerServiceEnableVoice);
						this.$util.cache.set('customerServiceEnableVoice', res.data.customerServiceEnableVoice);
					}
					//
					let data = res.data || {};
					this.$refs["product-service"].initData(data.adminMenuList || [])

				} else {
					this.spinShow = true;

					// ajax 请求获取初始化数据，然后动态更新下面数据源
					util.ajax.get(util.apiUrl.consoleInit, {
							params: {}
						})
						.then((response) => {
							// 用ajax 返回的参数替换组件的默认数据
							var res = response.data;
							if (res.code) {
								util.cache.set('mainFrameData', JSON.stringify(res));

								// 一些频繁使用的参数，可以独立拆分出来缓存
								util.cache.set('adminSystemName', res.data.consoleName);

								this.initSet(res);
								this.resData = res;

								// 初始化 faq
								this.initFaqData();
								this.$store.commit('setInitMenu', true);

								// 设置未读信息总数
								this.$store.commit('setMessageCount', res.data.messageCount);
								this.$store.commit('setMessageItemCount', res.data.messageItem);

								// 是否启用客服
								this.customerServiceEnable = res.data.customerServiceEnable;
								if (this.customerServiceEnable) {
									this.$refs['kefu-websocket'].init(res.data.customerServiceEnableVoice);
									this.$util.cache.set('customerServiceEnableVoice', res.data.customerServiceEnableVoice);
								}
								//
								let data = res.data || {};
								this.$refs["product-service"].initData(data.adminMenuList || [])
								this.spinShow = false;
							} else {
								this.$Message.error(res.message);
							}
						});
				}

				// faq侧栏初始化
				this.initFaqSider();

				// 显示 活动保存按钮
				this.showPageButtons = (this.$route.fullPath.indexOf('/pages/page-editor') !== -1);

				// 根据窗口的变化，动态计算faq 窗口大小
				window.onresize = () => {
					this.initFaqSider();
					this.$store.commit('setWinResize', (new Date()).valueOf());
				};

				// FAQ 默认是隐藏的
				if (util.cache.get('hideFaqSider') == 2 || util.cache.get('hideFaqSider') == null) {
					this.showFaqSider();
				} else {
					this.hideFaqSider();
				}
			},
			// 加载faq 关联菜单的数据
			initFaqData() {
				// 初始化FAQ
				this.$ajax.post(this.$api.faqInit, {

					})
					.then((response) => {
						var res = response.data;
						// 初始化 faq
						if (res.code) {
							this.$refs['admin-faq-box'].initData(res.data);
							this.$util.cache.set('adminFaqData', res.data);
						}
					});
			},
			// 重新计算faq 侧栏高宽
			initFaqSider() {
				var faqSiderWidth = this.faqSiderWidth;
				var mainFrameWidth = document.body.clientWidth - (this.hideList ? 60 : 180); // 是左侧菜单宽度

				// 重构导航栏
				var singlePageWidth = (mainFrameWidth - faqSiderWidth);
				this.singlePageWidth = singlePageWidth <= 900 ? 900 : singlePageWidth;

				this.$nextTick(() => {
					this.$store.commit('getSinglePageW', this.$refs.singlePage.clientWidth);
				});
			},
			// 隐藏 faq
			hideFaqSider() {
				this.faqSiderWidth = 0;
				this.showFaqBox = false;
				this.initFaqSider();
				this.faqColor = '';
				this.faqStyle = '';
				util.cache.set('hideFaqSider', 1);

				//if (this.$route.name == 'page-editor') {
				// 触发window resize 事件(为了兼容编辑器页面)
				var myEvent = new window.Event('resize');
				window.dispatchEvent(myEvent);
				//}
			},
			// 显示faq
			showFaqSider() {
				this.faqSiderWidth = 200;
				this.showFaqBox = true;
				this.initFaqSider();
				this.faqColor = '#2b85e4';
				this.faqStyle = 'font-weight:bold;';
				util.cache.set('hideFaqSider', 2);

				//if (this.$route.name == 'page-editor') {
				// 触发window resize 事件(为了兼容编辑器页面)
				var myEvent = new window.Event('resize');
				window.dispatchEvent(myEvent);
				//}
			},
			/**
			 * @desc 用初始化数据赋值
			 * @param res
			 */
			initSet(res) {
				window.document.title = res.data.consoleName;
				this.adminMenuList = res.data.adminMenuList;
				if (res.data.nickName != '') {
					// 优先显示昵称
					this.userName = res.data.nickName;
				}

				// 后台logo
				this.maxLogo = res.data.maxLogo;
				this.brandName = res.data.brandName;

				// 头像
				this.avatarFormat = res.data.avatar_format;
				window.localStorage.avatorImgPath = res.data.avatar_format;

				// 主题颜色
				this.badminTheme = res.data.badmin_theme;

				// 用户类型
				this.userTypeTip = res.data.user_type_format;
			},
			onUserDropdown(name) {
				if (name === 'ownSpace') {
					util.openNewPage(this, 'ownspace');
					this.$router.push({
						name: 'ownspace'
					});
				}
				// 帮助中心
				else if (name == 'helpCenter') {
					this.$router.push('/settings/help-center');
				}
				// 布局设置
				else if( name == 'layoutSetting' ){
					this.$refs['layout-setting'].openModal();
				}
				// 历史更新说明
				else if (name == 'releaseNotes') {
					this.$router.push('/settings/release-notes');
				} 
				else if (name === 'loginout') {
					// 退出按钮的触发
					// ajax 发送验证码
					util.ajax.post(util.apiUrl.logout, {

						})
						.then((response) => {
							var res = response.data;
							this.registerButtonLoading = false;

							if (res.code) {
								// 是否开启单点登录
								if (res.sso != '' && res.sso != null) {
									for (var i in res.sso) {
										this.loadScript(res.sso[i], () => {
											if ((i + 1) == res.sso.length) {
												// 模态框提示注册成功
												this.$Message.success(res.message);

												// 加载完最后一个 js 才跳转路由
												this.logoutJump();
											}
										});
									}
								} else {
									// 模态框提示注册成功
									this.$Message.success(res.message);

									// 无单点注销的情况
									this.logoutJump();
								}
							} else {
								// ajax 退出失败，不理会，客户端直接退出
								this.logoutJump();
							}
						});
				}
			},
			// 注销成功的跳转
			logoutJump() {
				// 注销/退出登录
				this.$store.commit('logout', this);
				this.$store.commit('clearOpenedSubmenu');
				this.$util.cache.remove('adminFaqData');

				// 清理掉缓存
				util.cache.remove('mainFrameData');

				// 跳转到登录页面
				this.$router.push('/login');
			},
			handleSubmenuChange(val) {

			},
			beforePush(name) {
				return true;
			},
			fullscreenChange(isFullScreen) {

			},
			// 加载外部js
			loadScript(url, callback) {
				var script = document.createElement('script');
				script.type = 'text/javascript';
				if (typeof(callback) !== 'undefined') {
					if (script.readyState) {
						script.onreadystatechange = function() {
							if (script.readyState == 'loaded' || script.readyState == 'complete') {
								script.onreadystatechange = null;
								callback();
							}
						};
					} else {
						script.onload = function() {
							callback();
						};
					}
				}
				script.src = url;
				document.getElementById('logoutssojs').appendChild(script);
			},

			// 活动页面预览按钮
			pageAction(name) {
				this.$router.push(this.$route.path + '#act-' + name);
			},
			// 登录框的回调
			loginBoxSuccess(obj) {
				this.modalLogin = false;

				// 如果 consoleInit 是初始化失败，这里重新初始化一次
				this.init();
			},
			// 回调事件, 往ueditor 插入内容
			returnImageUrl(obj) {
				var content = '';
				var ueditorImageType = this.$store.state.app.ueditorImageType;
				if (ueditorImageType == 'customerService') {
					// 客服是单选图片
					var tmp = obj.val;
					obj.val = [tmp];
				}

				for (var i in obj.val) {
					switch (ueditorImageType) {
						//客服图片
						case 'customerService':
							//content += '<img src="'+ obj.val[i] +'" class="customer-service-image" style="max-width:250px;max-height:250px" />';
							// 直接出发客服的发送按钮，发送图片
							this.$store.commit('setCsImageSelected', obj.val[i]);
							break;

							// 文章内容的图片
						case 'articleDesc':
							//content += '<img src="'+ obj.val[i] +'" class="article-desc-image" style="max-width:300px;max-height:300px" />';
							content += '<img src="' + obj.val[i] + '" class="goods-desc-image" style="width:100%" />';
							break;

							// 商品描述的图片
						case 'goodsDesc':
							content += '<img src="' + obj.val[i] + '" class="goods-desc-image" style="width:100%" />';
							break;

							// 后台文档的图片
						case 'docDesc':
							// doc 的图片要转成base64
							this.getBase64Image(obj.val[i], content, this.ueditorObj);
							break;

						default:
							content += '<img src="' + obj.val[i] + '" class="default-image" style="width:100%" />';

					}

				}
				if (ueditorImageType != 'docDesc') {
					var me = this.ueditorObj;
					me.focus();
					me.execCommand('inserthtml', content);
				}
			},
			// 通过api接口获取base64字符串
			getBase64Image(imgUrl, content, ueditorObj) {
				this.$ajax.post(this.$api.getImageBase64, {
						image_url: imgUrl,
					})
					.then((response) => {
						var res = response.data;

						if (res.code && res.data != '') {
							// 用js 生成base64 存在跨越问题，所以只能由服务器帮忙生成
							content += '<img class="goods-desc-image" style="width:100%" src="data:image/jpg/png/gif;base64,' + res.data +
								'" />';
							var me = ueditorObj;
							me.focus();
							me.execCommand('inserthtml', content);
						}
					});
			},
			// 菜单列的显示和隐藏
			onChangeList() {
				if (this.hideList) {
					this.hideList = false;
				} else {
					this.hideList = true;
				}

				this.initFaqSider();
			},
			showProductService(){
				this.$refs["product-service"].showModal();
			}
		},
		watch: {
			// 全局的loading,全局滚动情况下使用
			'$store.state.app.loading'(nV) {
				this.spinShow = nV;
			},
			// 监测路由的变化
			'$route'(to) {
				this.$store.commit('setCurrentPageName', to.name);
				const pathArr = util.setCurrentPath(this, to.name);
				if (pathArr.length > 2) {
					this.$store.commit('addOpenSubmenu', pathArr[1].name);
				}

				window.localStorage.currentPageName = to.name;

				// 记录当前路由地址到cookie
				if (Cookies.get('accessToken') != null && ['/logout', '/home'].indexOf(to.fullPath) == -1) {
					Cookies.set('cbURL', to.fullPath, {
						expires: (3600 * 24 * 3)
					});
				}
			},
			// 监听后台品牌logo 和 名称的变化
			'$store.state.app.logoBrandName'(to) {
				// 后台logo
				this.maxLogo = to.logo;
				this.brandName = to.brandName;
			},
			// 监听一级菜单的点击
			'$store.state.app.menu1click'(to) {
				if (this.hideList == true) {
					this.onChangeList();
				}
			},
			lang() {
				// 在切换语言时用于刷新面包屑
				util.setCurrentPath(this, this.$route.name);
			}
		},
		mounted() {
			this.init();
		},
		created() {
			// 显示打开的页面的列表
			this.$store.commit('setOpenedList');
			// 监听http请求错误的事件
			window.addEventListener('httpErrorEvent', evt => {
				// 触发
				if (evt.detail.status == 401) {
					// 弹出登录框方式登录
					this.modalLogin = true;
				} else if (evt.detail.status == 431) {
					// 跳转到企业审核页面
					this.$router.push('/register-result');
				} else if (evt.detail.status == 200) {
					setTimeout(() => {
						this.$Modal.error({
							title: '提示',
							content: evt.detail.message
						});
					}, 300);
				} else {
					/*
					this.$Modal.error({
						title: '请求错误',
						content: evt.detail.status + ', ' + evt.detail.message
					});*/
				}
			});
			// 监听ueditor 发出的事件，
			window.addEventListener('ueditorEvent', evt => {

				this.ueditorObj = evt.detail.obj;

				var isMulti = 1;
				// 对于客服是单选
				this.$store.state.app.currentPath[(this.$store.state.app.currentPath.length - 1)].name == 'cs-session' ? isMulti =
					0 : '';
				this.$refs['user-images'].showModal({
					name: 'images',
					multi: isMulti,
					selectedImages: [],
				});
			});
		},
		destroyed() {
			console.log('销毁')
			// 注销事件的监听
			window.removeEventListener('httpErrorEvent', () => {}, true);
			// 注销ueditor 发出的事件
			window.removeEventListener("ueditorEvent", () => {}, true);
			// 注销 resize
			window.onresize = null;
		}
	};
</script>
