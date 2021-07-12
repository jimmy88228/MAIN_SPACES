<style lang="less">
	@import '../styles/menu.less';
</style>

<template>
	<div class="main-menu">
		<div v-if="true" class="tab-menus" :style="menuTabStyles">
			<!--一级菜单-->
			<div class="menu-tabs" :style="menuTabStyles">
				<vue-scroll ref="vue-scroll" :ops="scrollOptions">
					<ul>
						<li v-for="(item,index) in menuList" :name="item.name" :key="index" :class="(currentMenuIndex == index ? 'curr':'')"
						 @click="goMenuTabs(index)">
							<Icon :type="item.icon" :size="iconSize" :class="item.iconClass"></Icon>
							<div class="tabs-text">{{ itemTitle(item) }}</div>
						</li>
					</ul>
				</vue-scroll>
			</div>

			<Menu ref="sideMenu" width="auto" 
			:active-name="$route.name" 
			:open-names="menuOpenNames" 
			:theme="menuTheme"
			accordion 
			@on-select="changeMenu">

				<template v-for="(item,index) in menuList">
					<li v-show="showSubmenu(index)" :style="menuTabStyles">
						<vue-scroll :ops="scrollOptions">
							<ul>
								<template v-for="(group,gindex) in item.children">
									<!--二级菜单-->
									<submenu :key="group.name" :name="(index+'|'+gindex)" :itm="(index+'|'+gindex)">
										<template slot="title">
											<Icon :type="group.icon" :size="iconSize"></Icon>
											<span class="layout-text">{{ group.title }}</span>
										</template>

										<MenuItem v-for="(child,kindex) in group.children" :name="child.name" :key="child.name" :itm="(index+'|'+gindex+'|'+kindex)"
										 :style="child.menuHidden== true?'display:none':''">
											<Icon :type="child.icon" size="18" color="#aaa" style="position: absolute;z-index:10;left:12px;"></Icon>
											<Icon></Icon>
											<span class="layout-text">{{ itemTitle(child) }}</span>
										</MenuItem>
									</submenu>
								</template>
							</ul>
						</vue-scroll>
					</li>
				</template>
			</Menu>
		</div>

		<div v-else class="tree-menus">
			<!-- // 显示三级菜单的例子(这里不启用) -->
		</div>
	</div>
</template>

<script>
	import util from '@/libs/util.js';

	export default {
		name: 'sidebarMenu',
		components: {},
		props: {
			menuList: [Array, Object],
			iconSize: Number,
			menuTheme: {
				type: String,
				default: 'dark'
			},
			openNames: {
				type: Array
			}
		},
		data() {
			return {
				currentMenuIndex: 0, // 一级菜单
				isMenuChange: -1,
				initSubmenu: 0, // 初始化的二级菜单
				subsubMenu: 0, // 初始化的三级菜单
				menuTabStyles: {},
				isMenuJump: false, // 表示菜单触发的路由跳转
				
				// 选中打开的菜单
				menuOpenNames: [],
				arrMenu:[],
				
				// 标识一级菜单是手动触发的
				menu1Click: false,

				// 虚拟滚动条
				scrollOptions: {
					mode: 'native',
					bar: {
						keepShow: false,
						background: '#c8c8c8',
						size: '3px',
					},
					// 滚动轨道
					rail: {
						size: '3px',
					},
					scrollPanel: {
						scrollingX: false,
					}
				},
			}
		},
		computed: {

		},
		methods: {
			init() {
				this.setMenuHeight();

				if (util.cache.get('mainFrameData') != null) {
					// 读取cookie 里面的缓存数据
					var mData = util.cache.get('mainFrameData');
					if (mData != null) {
						var res = JSON.parse(mData);
						if (typeof(res.data) != 'undefined') {
							this.arrMenu = res.data.adminMenuList;
							this.initMenu();
						}
					}
				}
			},
			setMenuHeight() {
				// 计算菜单的高度
				var menuHight = document.body.clientHeight - 56 + 1;
				this.menuTabStyles = {
					height: menuHight + 'px',
				};
			},
			// 初始化菜单
			initMenu() {
				for (var i in this.arrMenu) {
					for (var g in this.arrMenu[i].children) {
						for (var k in this.arrMenu[i].children[g].children) {
							if ( this.arrMenu[i].children[g].children[k].name == this.$route.name ) {
								this.currentMenuIndex = i;
								this.initSubmenu = g;
								this.subsubMenu = k;
							}
						}
					}
				}
			},
			// 菜单点击触发
			changeMenu(active) {
				this.$emit('on-change', active);
				
				this.isMenuJump = true;
				setTimeout(()=>{
					this.isMenuJump = false;
				}, 200);
			},
			// 显示菜单名称
			itemTitle(item) {
				if (typeof item.title === 'object') {
					return this.$t(item.title.i18n);
				} else {
					return item.title;
				}
			},
			// 切换二级菜单
			goMenuTabs(index) {
				this.menu1Click = true;
				this.currentMenuIndex = index;
				this.$store.commit('setMenu1click', (new Date()).valueOf());
			},
			// 显示二级菜单
			showSubmenu(index) {

				if (index == this.currentMenuIndex) {

					// 触发二级菜单
					window.setTimeout(() => {
						// 初始化菜单的时候触发
						if (this.initSubmenu) {
							this.menuOpenNames = [this.currentMenuIndex + '|' + this.initSubmenu];

							this.$nextTick(() => {
								this.$refs['sideMenu'].updateActiveName();
							});
							this.initSubmenu = 0;
						} 
						// 非初始化的时候触发
						else {

							if (this.isMenuChange != this.currentMenuIndex && this.menu1Click == true) {
								this.menu1Click = false;
								this.menuOpenNames = [this.currentMenuIndex + '|0'];
								
								this.$nextTick(() => {
									this.$refs['sideMenu'].updateActiveName();
								});
								
								this.isMenuChange = this.currentMenuIndex;
							}
						}

					}, 100);

					return true;
				} else {
					return false;
				}
			},
		},
		watch: {
			// 监测路由的变化
			'$route' (to) {
				// 如果不是菜单直接触发的路由变化，那么要刷新菜单当前位置
				if( this.isMenuJump == false ){
					this.initMenu();
				}
			},
			// 监听菜单是否已经初始化完毕
			'$store.state.app.initMenu'(to) {
				if (to == true) {
					// 这里异步是防止cook 未写完就去读
					window.setTimeout(() => {
						this.init();
					}, 500);
				}
			},
			// 监听菜单高度的变化
			'$store.state.app.resetMenuHeight'(to) {
				window.setTimeout(() => {
					this.setMenuHeight();
				}, 500);
			},
			'$store.state.app.winResize'(to) {
				window.setTimeout(() => {
					this.setMenuHeight();
				}, 500);
			}
		},
		updated() {
			this.$nextTick(() => {
				if (this.$refs.sideMenu) {
					this.$refs.sideMenu.updateOpened();
				}
			});
		},
		mounted() {
			this.init();
		},
	};
</script>
