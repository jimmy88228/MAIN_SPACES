const app = getApp();
import DateUtil from "../../../../common/support/utils/date-util.js"
import DrawTemplate from '../../goods/popup/help/template.js';

Page(app.BP({ 
  data: {
    searchText:"",
    isLogin:app.LM.isLogin,
    btnText:{
      '1':"待生效",
      '2':"待开始",
      '3':"进行中",
      '4':"已结束",
    },
    isStaff:false,
    allData:{},
  }, 
  pageIndex:1,
  pageSize:10,
  hasMore:true,
  loading:false, 
  onShow() {
    this._checkUserLogin().then(()=>{
      app.LM.checkIfStore().then(res=>{
        this.storeInfo = app.LM.storeInfo||{};
        this.setData({isStaff:!!(this.storeInfo.staff_id||0)})
      })
      this.recorverData();
    })
  }, 
  onHide() {

  },
  onShareAppMessage(e) {
    let from = e.from||"";
    if(from == 'button'){
      // let shareDesc = this.curAct.shareDesc ? `(${this.curAct.shareDesc})` : "";
      let cardNum = app.LM.userInfo && app.LM.userInfo.cardNum||"";
      let url = this.curAct.linkUrl||"";
      url = url + `${url.indexOf('?') == -1 ? '?' : '&'}wa_openid=${cardNum}&guideId=${this.storeInfo&&this.storeInfo.staff_id||""}`;
      return {
        isCustom:true,
        title:this.curAct.shareTitle||"" ,
        imageUrl:this.curAct.shareThumbnail||"",
        path:`/pages/micro_mall/web/webForSF/SF?link_url=${encodeURIComponent(url)}&type=simple&fromType=huiyou&isCheckLogin=1`
      }
    }
  },
  recorverData(){
    let tempIndex = this.pageIndex;
    let tempSize = this.pageSize;
    this.pageSize = Math.max((this.pageIndex-1),1) * this.pageSize;
    return this.loadData().finally(()=>{
      this.pageIndex = tempIndex;
      this.pageSize = tempSize;
    })
  },
  refresh(){
    this.pageIndex = 1;
    this.hasMore = true;
    this.loadData();
  },
  loadData(){
    if(this.loading)return
    this.loading = true;
    return app.RunApi.go('UserApi','getHuiYouActivityList',{
      storeId:0,
      pageIndex:this.pageIndex,
      pageSize:this.pageSize,
      searchText:this.data.searchText||""
    }).then(res=>{
      if(res.code == 1){
        let data = res.data||{};
        let list = data.list||[];
        this.hasMore = this.pageIndex * this.pageSize < data.totalCount;
        this.pageIndex += 1;
        list = list.map(item=>({
          ...item,
          showTime: `${DateUtil.format(DateUtil.parse(item.begin),'yyyy.MM.dd')}~${DateUtil.format(DateUtil.parse(item.end),'yyyy.MM.dd')}`
        }))
        this.setData({
          list
        })
        return res;
      }
    }).finally(()=>{
      this.loading = false;
    })
  },
  loginCallBack(){
    this.onShow();
  },
  onTap(e){
    console.log('onTap',e)
    let {url} = this.getDataset(e); 
    if(!url)return;
    let cardNum = app.LM.userInfo && app.LM.userInfo.cardNum||"";
    url = url + `${url.indexOf('?') == -1 ? '?' : '&'}wa_openid=${cardNum}&guideId=${this.storeInfo&&this.storeInfo.staff_id||""}`;
    let jumpUrl = `/pages/micro_mall/web/webForSF/SF?link_url=${encodeURIComponent(url)}&type=simple&fromType=huiyou&isCheckLogin=1`;
    console.log('jumpUrl',jumpUrl)
    this.jumpAction(jumpUrl);
  },
  share(e){
    this.curAct = this.getDataset(e,'item')||{};
    this.shareModule = this.shareModule || this.selectComponent('#shareModule');
    this.shareModule.showNormal();
  },
  chooseShareType(e){
    console.log('choose',e);
    let shareId = e.detail.shareId || 0;
    if(shareId == 2){ 
      let cardNum = app.LM.userInfo && app.LM.userInfo.cardNum||"";
      let url = this.curAct.linkUrl||"";
      url = url + `${url.indexOf('?') == -1 ? '?' : '&'}wa_openid=${cardNum}&guideId=${this.storeInfo&&this.storeInfo.staff_id||""}`;

      this.shareImg = this.shareImg || this.selectComponent('#shareImg');
      initTemplate.call(this); 
      let allData = {
        info: { 
          opKind: app.OpKind["NORMAL"],
          channel: this.storeInfo.store_code||"",
          path:"pages/micro_mall/web/webForSF/SF"
        },
        scene: {
          link_url:encodeURIComponent(url),
          shareType: app.ShareType["NORMAL"],
          staffCode:app.LM.staffInfo && app.LM.staffInfo.staffCode || "",
          type:"simple",
          fromType:"huiyou",
          isCheckLogin:1,
        },
        draw: {
          diy: true,
          drawArr: this.drawArr, 
          baseInfo: {
            canvasW: 600,
            canvasH: 600,
            background: '#fff',
            codeDiy: true
          }
        }
      }
      this.setData({
        allData: allData
      },()=>{this.shareImg&&this.shareImg.show();});
    }
  },
}))



function initTemplate() {
  if (this.drawArr && this.drawArr.length > 0) { return }
  let canvasW = 600;
  let canvasH = 600;
  // let codeW = 300;
  // let baseBottomLine = canvasH - 111;
  this.drawArr = this.drawArr || [];

  let bg = DrawTemplate.initData('image', 0, 0, canvasW, canvasH);
  // bg.url = `https://dj-cdn.g2work.com/1683713362950.campaign-share.png?imageMogr2/crop/!750x600a0a0`;
  bg.type = 'code';
  bg.mode = 'widthFix';
  this.drawArr.push(bg);
  // baseBottomLine -= codeW;
  // let code = DrawTemplate.initData('image', canvasW - 66 - codeW, baseBottomLine, codeW, codeW);
  // code.url = this.selfStaffUser;
  // this.drawArr.push(code);
}