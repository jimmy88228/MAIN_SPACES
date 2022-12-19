import UniApi from "../common/support/tools/uni-api-promise.js";
import LM from "../common/manager/login-manager.js";
import SMH from "../common/helper/show-msg-handler.js";
import IM from "../common/manager/identity-manager.js";
import PM from "../common/helper/params-handler.js";
import PLH from "../common/helper/platform-handler.js";
import STH from "../common/helper/storage-handler";
import Conf from "@/config/config.js";
import linkMap from '../common/manager/link-map.js';
import SIH from '@/common/helper/sys-infos-handler.js';
import stringUtil from '@/common/support/utils/string-util.js'
import utils from '@/common/support/utils.js';

export default {
	data(){
		return {
			staticAddress:Conf.staticConfig,
			isLogin: LM.isLogin,
			clickHoldMap:{},
			options:{},
			authUserInfo: {},
			isMobile: navigator && navigator.userAgent && navigator.userAgent.indexOf('Mobile') != -1,
			brandStyle: Conf.style,
			platform:PLH.Platform,
			isH5:PLH.isH5,
			isMP:PLH.isMP,
			mixShowPage:false,
			navPlace:SIH.navPlace||84,
			isIphoneX:SIH.isIphoneX,
			userType:"",
			// _noScroll:"height:100vh;overflow:hidden;"
		}
	},
	methods: {
		addVisitLog(name, path, options) {},
		addActionLog(name, position, options) {},
		_clickHold(key = "DEF", d = 800) {
			let chm = this.clickHoldMap;
			if (chm[key]) {
					return false;
			} else {
					this.$set(this.clickHoldMap,key,true);
					let timer = setTimeout(() => {
							chm[key] = false;
							delete chm[key];
							clearTimeout(timer);
					}, d);
					return true;
			}
		},
		getDataset(e,type) {
		  let dataset = e && e.currentTarget && e.currentTarget.dataset || {};
		  if(type)return dataset[type]
		  return dataset;
		},
		afterAction(e) {
				let data = this.getDataset(e);
				let action;
				if (data.action && (action = this[data.action])) {
						action(e);
				}
		},
		backAction(url){
			UniApi.navigateBack({
				delta: 1
			}).catch(e=>{
				console.log(e,url,);
				url && this.redirectAction(url);
			});
		},
		jumpAction(e) {
			console.log('jumpAction',e)
			linkMap.searchPage(e, (res)=>{
				let url = typeof(res) == 'object' ? res.url ||  this.getDataset(e).url || '' : res;
				url = url.indexOf('http')>-1 && url.indexOf('http')<=1 && `/pages/web-view/web-view?url=${encodeURIComponent(url)}` || url;
				url && url.slice(0,1) != '/' && (url = '/' + url);
				console.log(url,"url")
				if(!url){
					SMH.showToast({
						title: "敬请期待"
					})
					return;
				}
					UniApi.navigateTo({
						url: url
					}).catch(() => {
						UniApi.reLaunch({
								url: url
						}).catch(()=>{
								SMH.showToast({
									title: "敬请期待"
								})
						});
					});
			})
		},
		redirectAction(e) {
			console.log('redirectAction',e)
			let url = typeof(e) == 'object' ? this.getDataset(e).url || '' : e;
			UniApi.redirectTo({
					url: url
				}).catch(() => {
					UniApi.reLaunch({
							url: url
					});
				});
		},
		reLaunchAction(e) {
			let url = typeof(e) == 'object' ? this.getDataset(e).url || '' : e;
			console.log('url',url)
			UniApi.reLaunch({
					url: url
				});
		},
		setStaticAddress(url){
			let staticName = url;
			staticName && staticName.slice(0, 1) != '/' && (staticName = '/' + staticName);
			return `${this.staticAddress}${staticName}`
		},
		showToast(title="",icon="none",extra={}){
			return UniApi.showToast({
				title,
				icon,
				...extra
			})
		},
		// 注册
		_getTokenRegister(cache=true,params){
			console.log('注册 _getTokenRegister')
			return LM.getTokenRegisterAsync(true,cache,params).then((data)=>{
				if(data.userToken){
					this.isLogin = true;
					if (data.cache == false){
						this.addActionLog("REGISTER", null, null);
					}
					this._setLogin();
					return Promise.resolve(data);
				} else {
					return Promise.reject(data);
				}
			})
		},
		// 登录
		_checkLogin(callback,loading){
			console.log('进来 _checkLogin',this.userType,LM.isLogin)
			return LM.loginAsync(loading||false).then(()=>{
					this._setLogin(callback);
					console.log('_checkLogin then',LM.isLogin)
					return LM.isLogin;
			})
			.catch(e=>{ // 未登录,跳转登录界面
				this._autoJump();
				return Promise.resolve(false)
			})
		},
		_autoJump(scanData){
			let userInfo = IM.userInfo || {};
			let sthRoomInfo = STH.get(Conf.ROOM_KEY)||{};
			console.log('autoJump',userInfo,sthRoomInfo,scanData);
			let roomKey = this.options.roomKey || sthRoomInfo.roomKey || "";
			let mobilePhone = this.options.mobilePhone || sthRoomInfo.mobilePhone || "";
			this.userType = (scanData && scanData.userType) || this.options.userType || userInfo.userType || "client"; //赋值userType
			let targetRoute,jumpType='redirectAction';
			if(!LM.isLogin){
				if(this.userType == 'client' && roomKey && mobilePhone){
					targetRoute = `/pages/counseling/room/client?roomKey=${roomKey}&mobilePhone=${mobilePhone}&userType=client`; 
				}else{ //咨询师+未知身份的人
					let page = getCurrentPages().slice(-1)[0] || {},loginRoute = 'pages/login/login';
					if(page.route != loginRoute){
						targetRoute = `/${loginRoute}?${utils.paramsByJson(scanData && scanData.sceneOption||{})}`;
						// jumpType = 'jumpAction';
					}
				}
				console.log('未登录 跳转',this.userType,targetRoute);
			}else{
				if(scanData && scanData.pagePath){
					targetRoute = `/${scanData.pagePath}?${utils.paramsByJson(scanData.sceneOption)}`;
				} else {
					if(this.userType == 'counselor'){
						targetRoute = `/pages/counseling/person-info/person-info`;
					}else if(this.userType == 'client' && roomKey && mobilePhone){
						targetRoute = `/pages/counseling/room/client?roomKey=${roomKey}&mobilePhone=${mobilePhone}&userType=client`;
					}else{
						targetRoute = '/pages/empty-page/empty-page';
					}
				}
				console.log('已登录 跳转',this.userType,targetRoute);
			}
			targetRoute && this[jumpType] && this[jumpType](targetRoute);
		},
		_setLogin(callback){
			let _page = getCurrentPages().slice(-1)[0] || {};
			if(this.isLogin != LM.isLogin){
				this.isLogin = LM.isLogin;
			}
			if(_page.isLogin != this.isLogin){ // 组件 与 页面
				_page.isLogin = this.isLogin;
			}
			typeof(callback) == "function" && callback(LM.isLogin)
		},
		_bindMobilePhone(loading){
			return LM.bindMobilePhone(loading)
		},
		_getUserInfo(){
			return IM.getAuthUserInfo()
		},
		getRefs(ref){
			this[ref] = this[ref] || (this.$refs[ref] && this.$refs[ref][0]) || this.selectComponent("#" + ref);
			return this[ref] || {};
		},
		_getRefs(ref){
			this[ref + "Dom"] = this[ref + "Dom"] || this.selectComponent("#" + ref) || this.$refs[ref];
			return this[ref + "Dom"] || {};
		},
		_getQuery(id,selectType,pageType="page",cb) {
      return new Promise((rs, rj) => {
				let query = pageType == "page" ? wx.createSelectorQuery() : wx.createSelectorQuery().in(this);
				let idSel = id || '#main';
				if (selectType == 'all') {
						query.selectAll(idSel).boundingClientRect()
				} else {
						query.select(idSel).boundingClientRect();
				}
				query.selectViewport().scrollOffset().exec(
						res => {
							cb && typeof (cb) == 'function' && cb();
							rs(res || {})
						}
				)
      })
    },
		_nameEllipsis(name){
			let result = name;
			if(name && typeof(name) == 'string'){
				let len = name.length;
				if(len>2){
					result = name.slice(0,-2) + '*' + name.slice(-1);
				}else{
					result = name.slice(0,1) + '*'
				}
			}
			return result
		},
		_nameEllipsis(name) {
			return stringUtil.desensitization(name)
		},
		_phoneEllipsis(phone){
			return stringUtil.desensitization(phone,'phone')
		},
		disabledScroll(){return false},
		_noFn(){return},
		noAction(){return},
	},
}

