import WxApi from "../../../../common/helper/wx-api-helper";
import WindowBehaviors from "../../../../components/ui/cps/window/window-behaviors";
const app = getApp();

Component(
  app.BTAB({
    behaviors: [WindowBehaviors],
    properties: {},
    data: {
      boxStyle: "opacity: 0;transition: all 300ms ease-in-out;",
      iconUrl: app.Conf.ICON_URL,
      goodsService:[],
      path: "",
    }, 
    pageLifetimes: {
      hide(){
        this.dismiss()
      }
    },
    detached() {
    },
    methods: {
      onAttached() { 
        let server_close = this.data.brand_info.icon_url + "micro_mall/server_close.png"; 
        this.setData({
          boxStyle: "opacity: 1;transition: all 300ms ease-in-out;",
          server_close: server_close
        });
      },
      onDetached() {
        this.setData({
          boxStyle: "opacity: 0;transition: all 300ms ease-in-out;",
          path: "",
        });
        return 300;
      },
      activate() {
        const pages = getCurrentPages();
        let curPage = pages[pages.length - 1] || {};
        let shareData = curPage.onShareAppMessage && curPage.onShareAppMessage({from: "shortLink", target: {id: "shareShortLink", dataset: {}}}); // 拿到跟 "分享给好友"生成的 一模一样的链接；传值没有特别意义，只是为了兼容一些用到onShareAppMessage的res 地方
        let {title, path} = shareData || {};
        if (path && typeof path == 'string') {
          path[0] === "/" && (path = path.substring(1));
          app.UserApi.getWechatSchemeShort({
            data: {
              "userToken": app.LM.userToken,
              "brandCode": app.Conf.BRAND_CODE,
              "linkType": 1,
              "path": path,
              "title": title || "",
            }, other: { isShowLoad: true }
          }).then((res) => {
            if (res.code == 1 && res.data){
              WxApi.setClipboardData({data: res.data})
                .then(() => {
                  WxApi.hideToast()
                })
                .catch(e => {
                  app.SMH.showToast("复制短链接失败")
                  console.log("复制短链接失败: ", e)
                })
                .finally(() => {
                  this.setData({path: res.data}, this.show)
                })
            } else {
              app.SMH.showToast({title: res.msg || "生成短链接失败"})
            }
          }).catch(e => {
            app.SMH.showToast({title: "生成短链接失败"});
            console.log("生成短链接失败: ", e)
          })
        }
      }
    }
  })
);