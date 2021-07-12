import { otherRouter, appRouter } from '@/router/router';
import Util from '@/libs/util';
import Cookies from 'js-cookie';
import Vue from 'vue';

const app = {
  state: {
    cachePage: [],
    lang: '',
    isFullScreen: false,
    openedSubmenuArr: [], // 要展开的菜单数组
    menuTheme: 'dark', // 主题
    themeColor: '',
    pageOpenedList: [{
      title: '首页',
      path: '',
      name: 'home_index'
    }],
    currentPageName: '',
    currentPath: [
      {
        title: '首页',
        path: '',
        name: 'home_index'
      }
    ], // 面包屑数组
    menuList: [],
    routers: [
      otherRouter,
      ...appRouter
    ],
    tagsList: [...otherRouter.children],
	openPageTags: false,
	badminTheme: '',
    messageCount: 0,
    messageItemCount: {},
    initMenu: false,
    // 一级菜单的点击事件
    menu1click: 0,
    
    // 是否有权限创建商品
    canCreateGoods: false,
    // 商品类页面组件列表
    goodsPageComponents: [],
    // 品牌的 logo 和 名称
    logoBrandName: {},
    // 重新设置菜单高度
    resetMenuHeight: false,
    // onresize 事件
    winResize: 0,
    // 接收到 websocket 消息
    wsMessage: {},
    // 发送ws 消息
    sendWsMessage: '',
    // 打开视频通话框1(传入的是room_id)
    videoMeetingBox: 0,
    // 微页面添加的组件
    pageCompList: [],
    // 内嵌在tab 里面的微页面组件
    tabPageCompList:[],
    // 内嵌tab 里面请求编辑页面
    editPageByTabNavigate: '',
    // 微页面信息
    pageInfo: { name: '', page_desc: '' },
    // 编辑器
    pageEditorSetting: {},
    // ueditor 插入的图片类型
    ueditorImageType: '',

    // 微信已接入客服会话的消息
    csSession:{},
    // 微信待接入客服会话消息
    waitingSession:{},
    // 已接入的客服会话
    joinedSession:{},
    // 选中的csSession 用户基本信息
    selectedCsSession:{},
    // 选中的客服图片
    csImageSelected: '',
    // 客服websocket 状态
    csWebsocketStatus: 0,
    // 顶部工具条的提示消息数
    kefuCount: 0,
    // 客服已读触发的动作，用时间戳来触发动作
    csIsRead: 0,
    csMaskCode: 0,
    csHideHistory: 0,
    csUpdateUserContent: '',

    pageCompItemChange: false,
    loadedCkeditor: false,
    newGoodsId: 0,
    dontCache: ['text-editor', 'artical-publish'], // 在这里定义你不想要缓存的页面的name属性值(参见路由配置router.js)
    singlePageW: 0,
    loading: false
  },
  mutations: {
    setLoading (state, bool) {
      state.loading = bool;
    },
    setTagsList (state, list) {
      state.tagsList.push(...list);
    },
    updateMenulist (state) {
      const accessCode = parseInt(Cookies.get('access'));
      const menuList = [];
      appRouter.forEach((item, index) => {
        if (item.access !== undefined) {
          if (Util.showThisRoute(item.access, accessCode)) {
            if (item.children.length === 1) {
              menuList.push(item);
            } else {
              const len = menuList.push(item);
              let childrenArr = [];
              childrenArr = item.children.filter(child => {
                if (child.access !== undefined) {
                  if (child.access === accessCode) {
                    return child;
                  }
                } else {
                  return child;
                }
              });
              menuList[len - 1].children = childrenArr;
            }
          }
        } else if (typeof (item.children) !== 'undefined') {
          if (item.children.length === 1) {
            menuList.push(item);
          } else {
            const len = menuList.push(item);
            let childrenArr = [];
            childrenArr = item.children.filter(child => {
              if (child.access !== undefined) {
                if (Util.showThisRoute(child.access, accessCode)) {
                  return child;
                }
              } else {
                return child;
              }
            });
            const handledItem = JSON.parse(JSON.stringify(menuList[len - 1]));
            handledItem.children = childrenArr;
            menuList.splice(len - 1, 1, handledItem);
          }
        }
      });
      state.menuList = menuList;
    },
    changeMenuTheme (state, theme) {
      state.menuTheme = theme;
    },
    getSinglePageW(state, w) {
      state.singlePageW = w;
    },
    changeMainTheme (state, mainTheme) {
      state.themeColor = mainTheme;
    },
    addOpenSubmenu (state, name) {
      let hasThisName = false;
      let isEmpty = false;
      if (name.length === 0) {
        isEmpty = true;
      }
      if (state.openedSubmenuArr.indexOf(name) > -1) {
        hasThisName = true;
      }
      if (!hasThisName && !isEmpty) {
        state.openedSubmenuArr.push(name);
      }
    },
    closePage (state, name) {
      state.cachePage.forEach((item, index) => {
        if (item === name) {
          state.cachePage.splice(index, 1);
        }
      });
    },
    initCachepage (state) {
      if (window.localStorage.cachePage) {
        state.cachePage = JSON.parse(window.localStorage.cachePage);
      }
    },
    removeTag (state, name) {
      state.pageOpenedList.map((item, index) => {
        if (item.name === name) {
          state.pageOpenedList.splice(index, 1);
        }
      });
    },
    pageOpenedList (state, get) {
      const openedPage = state.pageOpenedList[get.index];
      if (get.argu) {
        openedPage.argu = get.argu;
      }
      if (get.query) {
        openedPage.query = get.query;
      }
      state.pageOpenedList.splice(get.index, 1, openedPage);
      window.localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
    },
    clearAllTags (state) {
      state.pageOpenedList.splice(1);
      state.cachePage.length = 0;
      window.localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
    },
    clearOtherTags (state, vm) {
      const currentName = vm.$route.name;
      let currentIndex = 0;
      state.pageOpenedList.forEach((item, index) => {
        if (item.name === currentName) {
          currentIndex = index;
        }
      });
      if (currentIndex === 0) {
        state.pageOpenedList.splice(1);
      } else {
        state.pageOpenedList.splice(currentIndex + 1);
        state.pageOpenedList.splice(1, currentIndex - 1);
      }
      const newCachepage = state.cachePage.filter(item => {
        return item === currentName;
      });
      state.cachePage = newCachepage;
      window.localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
    },
    setOpenedList (state) {
      state.pageOpenedList = window.localStorage.pageOpenedList ? JSON.parse(window.localStorage.pageOpenedList) : [otherRouter.children[0]];
    },
    setCurrentPath (state, pathArr) {
      state.currentPath = pathArr;
    },
    setCurrentPageName (state, name) {
      state.currentPageName = name;
    },
	setOpenPageTags(state, val){
		state.openPageTags = val;
	},
	setBadminTheme(state, val){
		state.badminTheme = val;
	},
    setAvator (state, path) {
      window.localStorage.avatorImgPath = path;
    },
    switchLang (state, lang) {
      state.lang = lang;
      Vue.config.lang = lang;
    },
    clearOpenedSubmenu (state) {
      state.openedSubmenuArr.length = 0;
    },
    setMessageCount (state, count) {
      state.messageCount = count;
    },
    setMessageItemCount (state, val) {
        state.messageItemCount = val;
    },
    increateTag (state, tagObj) {
      if (!Util.oneOf(tagObj.name, state.dontCache)) {
        state.cachePage.push(tagObj.name);
        window.localStorage.cachePage = JSON.stringify(state.cachePage);
      }
      state.pageOpenedList.push(tagObj);
      window.localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
    },
    // 缓存页面，val 是页面的 组件 name；强制刷新的情况下，会解除一次缓存
    setCachePage(state, val ){
    	if( state.cachePage.indexOf( val ) === -1 ){
    		state.cachePage.push( val );
    	}
    },
    // 是否初始完毕菜单
    setInitMenu (state, val) {
        	state.initMenu = val;
    },
    // 是否有权限创建商品
    setCanCreateGoods (state, val) {
        	state.canCreateGoods = val;
    },
    // 后台logo 和品牌名称
    setLogoBrandName (state, val) {
        	state.logoBrandName = val;
    },
    // 监听菜单高度的变化
    setResetMenuHeight (state, val) {
        	state.resetMenuHeight = val;
    },
    // 监听 resize
    setWinResize (state, val) {
        	state.winResize = val;
    },
    // 商品类页面组件列表
    setGoodsPageComponents (state, val) {
        	state.goodsPageComponents = val;
    },
    // 设置 websocket 消息
    setWsMessage (state, val) {
        	state.wsMessage = val;
    },
    // 发送ws 消息
    setSendWsMessage (state, val) {
        	state.sendWsMessage = val;
    },
    // 打开视频通话框
    setVideoMeetingBox (state, val) {
        	state.videoMeetingBox = val;
    },
    // 微页面添加的页面组件
    setPageCompList (state, val) {
      state.pageCompList = val;
    },
    // 内嵌在tab的微页面组件
    setTabPageCompList(state, val){
      state.tabPageCompList = val;
    },
    // 内嵌tab 里面请求编辑页面
    setEditPageByTabNavigate(state, val){
      state.editPageByTabNavigate = val;
    },
    // 微页面添加的页面基本信息
    setPageInfo (state, val) {
      state.pageInfo = val;
    },
    // 微页面添加的页面组件 子项变化
    setPageCompItemChange (state, val) {
      state.pageCompItemChange = val;
    },
    // 微页面编辑器参数
    setPageEditorSetting (state, val){
      state.pageEditorSetting = val;
    },
    // 加载完ckeditor
    setLoadedCkeditor (state, val) {
      state.loadedCkeditor = val;
    },
    // 设置新建商品的ID
    setNewGoodsId (state, val) {
      state.newGoodsId = val;
    },
    // ueditor 自定义插入图片的类型
    setUeditorImageType(state, val){
    	state.ueditorImageType = val;
    },

    // 微信客服，收到已经接入会话消息
    setCsSession(state, val){
    	state.csSession = val;
    },
    // 微信客服，待接入
    setWaitingSession(state, val){
    	state.waitingSession = val;
    },
    // 微信客服，已接入
    setJoinedSession(state, val){
    	state.joinedSession = val;
    },
    // 客服选中的当前会话用户基本信息
    setSelectedCsSession(state, val){
    	state.selectedCsSession = val;
    },
    // 选中的客服图片
    setCsImageSelected(state, val){
    	state.csImageSelected = val;
    },
    // 设置客服的ws状态
    setCsWebsocketStatus(state, val){
    	state.csWebsocketStatus = val;
    },
    // 顶部工具条的消息提示
    setKefuCount(state, val){
      state.kefuCount = val;
    },
    // 客服已读动作触发
    setCsIsRead(state, val){
      state.csIsRead = val;
    },
    // 发送区的遮罩层code
    setCsMaskCode(state, val){
      state.csMaskCode = val;
    },
    // 关闭客服历史列表
    setCsHideHistory(state, val){
      state.csHideHistory = val;
    },
    // 更新客服用户的内容
    setCsUpdateUserContent(state, val){
      state.csUpdateUserContent = val;
    },
    // 一级菜单的点击事件
    setMenu1click(state, val){
      state.menu1click = val;
    }
  }
};

export default app;
