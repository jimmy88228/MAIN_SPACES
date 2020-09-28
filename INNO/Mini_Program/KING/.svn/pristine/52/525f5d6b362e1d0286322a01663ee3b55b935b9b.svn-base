// pages/micro_mall/collageGroup/activity_goods_detail.js
let WxParse = require("../../../wxParse/wxParse.js");
import MyDate from '../../../support/utils/date-util.js';
import{
    CountDown
} from "../../../helper/manager/timer-manager.js";
import StrH from "../../../helper/handle/strHandle.js"
const app = getApp();
const PAGE_TYPE = "COLLAGE_GOODS";
Page(app.BP({

    /**
     * 页面的初始数据
     */
    data: {
        isLogin: app.LM.isLogin,
        product_num: 1,
        limit_buys: 1,
        color_list: {},
        size_list: {},
        spe_color_list: [],
        spe_size_list: [],
        activity_price: {},
        attr_info: {},
        select_style: {
            color: {},
            color_id: 0,
            size_id: 0,
            size: {},
            price: {}, //
        },
        count_down: {},
        goods_info: {
          min_sale_price:"--",
        },
        color_gallery: [],
        Multicolor: {
            c_switch: false
        },
        //
        join_id: 0,
        join_count: 0,
        select_join_index: 0,
        group_list: [],
        group_times:{},
        sys_info: {},
        //动画参数
        show_style_pop: false,
        style_pop_animate: false,
        show_join_pop: false,
        join_pop_animate: false,
        show_join_list_pop: false,
        join_list_pop_animate: false,

    },
    countDown: {},
    group_page: 1,
    g_more: true,
    activity_id: 0,
    finish: [],
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.options = options;
        let bInfo = this.data.brand_info || {};
        let detail_share = bInfo.icon_url + "micro_mall/detail_share.png";
        let isCollect_img = bInfo.icon_url + "micro_mall/isCollect.png";
        let noCollect = bInfo.icon_url + "micro_mall/noCollect.png";
        let rightbutton = bInfo.icon_url + "micro_mall/rightbutton.png";
        let Home = bInfo.icon_url + "micro_mall/tabBar/main/getHomes.png";
        let rule_img = bInfo.icon_url + "micro_mall/rule.png";
        let pt_color = bInfo.style.pt_color;
        this.setData({
            pt_color: pt_color,
            detail_share: detail_share,
            isCollect_img: isCollect_img,
            noCollect: noCollect,
            rightbutton: rightbutton,
            Home: Home,
            rule_img: rule_img,
        })
        this.modal = this.selectComponent("#custom_modal");
    },
    onShow: function() {
      let options = this.options || {};
      if (options.scene) {
        app.SHP.getParams(["activity_id", "staffCode"]).then((params) => {
          this.options = {
            ...this.options,
            ...params
          }
          onShowEvent.call(this, this.options);
        })
      } else {
        onShowEvent.call(this, this.options);
      }
    },
    onHide: function() {
        // WxParse.wxParse('article', 'html', '', this, 0);
        console.log('this.countDown',this.countDown)
        unListen.call(this);
        for (let item in this.countDown) {
            if (this.countDown[item]) {
                stopCountDown.call(this, this.countDown[item].countDown);
            }
        }
    },
    onUnload: function() {
        // WxParse.wxParse('article', 'html', '', this, 0);
        unListen.call(this);
        for (let item in this.countDown) {
            if (this.countDown[item]) {
                stopCountDown.call(this, this.countDown[item].countDown);
            }
        }
    },
    preView(e) {
      let dataset = e.currentTarget.dataset || {};
      let color_list = this.data.color_list || {};
      let select_style = this.data.select_style || {};
      let urls = color_list[select_style.color_id];
      let imgs = [];
      for (let i = 0; i < urls.length; i++) {
        imgs.push(urls[i].img_url)
      }
      wx.previewImage({
        current: dataset.url,
        urls: imgs,
      })
    },
    onShareAppMessage: function() {
        let goods_info = this.data.goods_info;
        let color_gallery = this.data.color_gallery;
        let select_style = this.data.select_style;
        let select_color_id = select_style.color_id;
        let img_url = color_gallery[select_color_id].img_url;
        if (this.options.activity_id){
          this.addActionLog("goods_share", "GROUP_BUY", {
            activity_id: this.options.activity_id,
            goods_id: goods_info.goods_id
          })
        }
        return {
            shareType : app.ShareType[PAGE_TYPE] || app.ShareType.NORMAL,
            path: 'pages/micro_mall/collageGroup/activity_goods_detail?activity_id=' + this.options.activity_id,
            title: goods_info.share_title || goods_info.activity_name,
            imageUrl: goods_info.share_image || img_url
        };

    },
    getPageParam() {

    },
    getActivityDetail() {
        let options = this.options;
        console.log("options",this.options);
        this.activity_id = options.activity_id || 0;
        let that = this;
        this.setData({
            join_id: options.useractivityid ? options.useractivityid : 0
        })
        let goodsId = 0,activityId = 0;
        getCollageGroupActivityDetail.call(this).then(res => {
            getGoodsServices.call(this)
            goodsId = res.data && res.data.goods_id;
            this.addPageLog(null,this.route,{
              activity_id: this.activity_id,
              goods_id: goodsId
            })
            return Promise.resolve(res);
        }).then(e => {
          let staffInfo = app.LM.staffInfo || {};
          if (staffInfo.isStaffDstbData) {
            return Promise.resolve(staffInfo);
          } else {
            return app.LM.checkIfStaffDstbEvent()
          }
        }).then(staffInfo => {
          if (staffInfo.isStaffDstbData) {
            this.commission = this.commission || this.selectComponent("#commission");
            return this.commission.getCommission("COLLAGEGROUP", goodsId, this.activity_id);
          }
        }).catch(e => { });
    },
    getGroupList() {
        var that = this;
        var options = this.options;
        getCollageGroupJoinList.call(this);
    },
    /**
     * 多色切换
     */
    MultiColorSwitch() {
        var Multicolor = this.data.Multicolor;
        Multicolor.c_switch = !Multicolor.c_switch;
        this.setData({
            Multicolor: Multicolor
        })
    },
    /**
     * 切换多色
     */
    changeGoodsMultiColor(e) {
        var color_id = e.currentTarget.dataset.color_id;
        var select_style = this.data.select_style;
        select_style.color_id = color_id;
        select_style.color = {};
        select_style.size_id = 0;
        select_style.size = {};
        this.setData({
            select_style: select_style
        })
    },
    /**
     * 立即开团
     */
    openCollage(e) {
        //清除带团长进来的情况
        this.setData({
            join_id: 0
        })
        this.checkLogin(e);
    },
    chooseShareType(data) {
      let color_gallery = this.data.color_gallery;
      let goods_info = this.data.goods_info;
      let select_style = this.data.select_style;
      let detail = data.detail;
      // goods_info.opKind = "user_share_pin";
      goods_info.max_price = goods_info.max_sale_price;
      goods_info.min_price = goods_info.min_sale_price;
      goods_info.price = goods_info.min_price;
      goods_info.market_price = goods_info.min_market_price;
      this.shareImg = this.shareImg || this.selectComponent("#shareImg");
      let opKind = app.OpKind[PAGE_TYPE] || app.OpKind.NORMAL;
      let shareType = app.ShareType[PAGE_TYPE] || app.ShareType.NORMAL;
      let allData = {
        info:{
          opKind: opKind,
          imgUrl: color_gallery[select_style.color_id].img_url,
          goodsInfo: goods_info,
        },
        scene: {
          "shareType": shareType,
          "activity_id": goods_info.activity_id,
          'staffCode': detail.shareId == 3 ? detail.staffInfo.staffCode : ""
        },
        draw:{
          template:"goods"
        }
      }
      this.staffInfo = detail.staffInfo
      this.setData({
        allData: allData
      })
      this.shareImg.show();
    },
    checkIfStaffDstbCallBack(data) {
      let detail = data.detail;
      this.staffInfo = detail.staffInfo
    },
    /**
     * ---------分销
     */
    getShare() {
      this.shareModule = this.shareModule || this.selectComponent("#shareModule");
      app.LM.getUserTokenAsync(true).then(e => {
        if (app.LM.isLogin) {
          this.shareModule.checkIfStaffDstb();
          this.setData({
            isLogin: true
          })
        }
      })

    },
    /**
     * 授权登录
     */
    checkLogin(e) {
        // console.log('checkLogin')
        this.switchStylePop("join_pop");
        this.getGoodsStyle(e);
    },
    /**
     * 获取尺码
     */
    getGoodsStyle(e) {
        //
        // this.switchStylePop('style_pop', true);
        setAnim.call(this,'show');
        getCollageGroupGoodsDetail.call(this,e);
    },
    /**
     * 页面弹框
     */
    onTap(e){
        let dataset = e.currentTarget.dataset||{};
        let type = dataset||"";
        if(type=="popshow"){
            setAnim.call(this,'show');
        }else if(type == "pophide"){
            setAnim.call(this,'hide');
        }
    },
    switchStylePop(e, show) {
        var key = '',
            that = this;
        var show_pop, pop_animate;
        if (e.currentTarget) {
            key = e.currentTarget.dataset.key;
        } else {
            key = e;
        }
        show_pop = "show_" + key;
        pop_animate = key + "_animate";
        if (show) {
            this.setData({
                [show_pop]: true,
                [pop_animate]: true,
                noScroll: true
            })
        } else {
            this.setData({
                [pop_animate]: false,
                noScroll: false
            })
            let _timer = setTimeout(function() {
                clearTimeout(_timer);
                that.setData({
                    [show_pop]: false
                })
            }, 350)
        }
    },
    /**
     * 选择颜色
     */
    colorSelect(e, color_id) {
        console.log('选择颜色', color_id)
        let this_color_id
        if (e.currentTarget) {
            this_color_id = e.currentTarget.dataset.color_id;
        }
        let select_style = this.data.select_style;
        let spe_color_list = this.data.spe_color_list;
        let this_size_list = [];
        if (!this_color_id) {
            this_color_id = color_id;
        }

        select_style.size_id = 0;
        select_style.size = {};
        select_style.color_id = this_color_id;
        for (let i in spe_color_list) {
            if (this_color_id == spe_color_list[i].color_id) {
                select_style.color = spe_color_list[i];
                this_size_list = spe_color_list[i].sizeList;
                this_size_list.map((item,index)=>{
                  item.size_n = StrH.ellipsisStr(item.size_name);
                })
                break;
            }
        }
        this.setData({
            select_style: select_style,
            spe_size_list: this_size_list
        })
        // console.log('--', this.data.spe_size_list, this.data.select_style)
    },
    /**
     * 选择尺码
     */
    sizeSelect(e) {
        console.log('选择尺码')
        var this_size_id = e.currentTarget.dataset.size_id;
        var select_style = this.data.select_style;
        var spe_size_list = this.data.spe_size_list;
        select_style.size_id = this_size_id;
        for (let i in spe_size_list) {
            if (this_size_id == spe_size_list[i].size_id) {
                select_style.size = spe_size_list[i];
                break;
            }
        }
        this.setData({
            select_style: select_style
        })
        console.log(select_style)
    },
    joinPopData(e) {
        var index = e.currentTarget.dataset.index;
        this.setData({
            select_join_index: index
        })
        //弹框动画
        this.switchStylePop("join_list_pop");
        this.switchStylePop("join_pop", true);
    },
    joinListPopData(e) {
        //弹框动画
        this.switchStylePop("join_list_pop", true);
    },
    //参与拼团
    joinCollage(e) {
        var that = this;
        var select_join_index = this.data.select_join_index;
        var group_list = this.data.group_list;
        var join_id = group_list[select_join_index].user_activity_id;
        this.setData({
            join_id: join_id
        })
        //检测授权
        this.checkLogin(e);

    },
    reduceGoodsNum() {
        let product_num = this.data.product_num;
        if (product_num == 1) return;
        product_num = product_num - 1;
        this.setData({
            product_num: product_num
        })
    },
    addGoodsNum() {
        let product_num = this.data.product_num;
        let limit_buys = this.data.limit_buys;
        if (limit_buys == product_num) return;
        checkProductNumber.call(this, product_num + 1);
    },
    /**
     * 
     */
    buyActivityGoods() {
        var select_style = this.data.select_style;
        console.log('select_style', select_style)
        var attr_info = this.data.attr_info;
        var attr_count = attr_info.attr_count;
        var warn = "";
        if(!this.hasGoodsNumber){
            warn = "暂无库存";
        }else if (!select_style.color_id || !select_style.color.is_enabled) {
            warn = "请选择颜色！"
        } else if (!select_style.size_id && attr_count > 1) {
            warn = "请选择尺码！"
        }
        if (warn) {
            app.SMH.showToast({
                title: warn
            })
            return
        }
        var goods_info = this.data.goods_info;
        var join_id = this.data.join_id;
        var product_num = this.data.product_num;
        var attr_info = this.data.attr_info;
        var product_id = select_style.size.product_id;
        if (attr_info.attr_count <= 1) {
            product_id = select_style.color.product_id;
        }
        let _timer = setTimeout(() => {
            clearTimeout(_timer);
            // this.switchStylePop('style_pop');
            setAnim.call(this);
            wx.navigateTo({
                url: 'collage_buy_detail?activityId=' + goods_info.activity_id + '&userActivityId=' + join_id + '&goodsId=' + goods_info.goods_id + '&productId=' + product_id + '&productNum=' + product_num
            })
        }, 200)

    },
    /**
     * 登录操作
     */
    getUserInfo(e) {
      this.openCollage(this)
    },

    // 服务
    handleService: function(e) {
        this.server = this.selectComponent('#service')
        this.server.show();
        this.server.getGoodsServiceData(this.data.goodsServices);
    },
    collectEvent: function() {
        var that = this;
        // var goods_id = this.data.goods_id;
        let options = this.options;
        var isCollect = this.data.isCollect;
        var act = "",
            reqData = {};
        if (isCollect == 1) {
            act = "delFavGoodsLog";
            reqData = {
                "goodsId": options.goods_id,
                "logId": 0,
                "userToken": app.LM.userToken,
                "brandCode": app.Conf.BRAND_CODE
            }
        } else {
            act = "addFavGoodsLog";
            reqData = {
                "goodsId": options.goods_id,
                "userToken": app.LM.userToken,
                "brandCode": app.Conf.BRAND_CODE
            }
        }
        return app.GoodsApi[act]({
            data: reqData,
            other: {
                isShowLoad: true
            }
        }).then(e => {
            if (e.code == "1") {
                let txt;
                if (isCollect == 1) {
                    txt = "已取消收藏";
                    this.setData({
                        isCollect: 0
                    })
                } else {
                    txt = "已收藏";
                    this.setData({
                        isCollect: 1
                    })
                }
                app.SMH.showToast({
                    title: txt,
                })

            }
        })
    },
    go_home: function(e) {
        wx.switchTab({
            url: '/pages/micro_mall/index/index'
        })
    }
}))
//
function onShowEvent(){
  this.getActivityDetail()
  this.getGroupList();
  getColor.call(this);
}
//设置颜色
function getColor() {
    let brand_info = this.data.brand_info;
    if (brand_info.style && brand_info.style.bg_color) {
        let bg_color = brand_info.style.bg_color;
        let l_bg_color = app.getColor(bg_color, 28, 31, 30, 1);
        brand_info.style.l_bg_color = l_bg_color;
        this.setData({
            brand_info: brand_info
        })
    }
}
//活动详情
function getCollageGroupActivityDetail() {
    return app.CollageApi.getCollageGroupActivityDetail({
        params: {
            activityId: this.activity_id,
            brandCode: app.Conf.BRAND_CODE
        },
        other: {
            isShowLoad: true
        }
    }).then(e => {
        if (e.code == "1") {
            let data = e.data;
            let color_list = {};
            let color_gallery = {};
            let goods_gallery = data.lst_imgurl;
            for (let i in goods_gallery) {
                let g_gallery = goods_gallery[i]
                let color_id = g_gallery.color_id;
                if (!color_gallery[color_id]) {
                    color_gallery[color_id] = g_gallery;
                }
                if (!color_list[color_id]) {
                    color_list[color_id] = []
                    color_list[color_id][0] = g_gallery
                } else {
                    color_list[color_id].push(g_gallery);
                }
            }

            let goods_info = data;
            let select_style = this.data.select_style;
            let article = goods_info.goods_desc;
            let that = this;
            let startTime = data.server_time, endTime = data.end_time;
            this.countDown[goods_info.goods_id] = {
                countDown: ""
            };
            //倒计时1 
            if (this.finish.length == 0 || this.finish.indexOf(goods_info.goods_id) == -1) {
                startCountDown.call(this, this.countDown[goods_info.goods_id].countDown, startTime, endTime, goods_info.goods_id, function(){
                    getCollageGroupActivityDetail.call(that);
                });
            }
            goods_info.isEnd = MyDate.parse(startTime) > MyDate.parse(endTime) ? true : false
            if (!this.first) {
                WxParse.wxParse('article', 'html', article, that, 0);
                this.first = true;
            }
            console.log("goods_info",goods_info);
            select_style.color_id = goods_info.def_color;
            if(goods_info.is_show_sale_number == 1){
              let sale_number = parseFloat(goods_info.sale_number) || 0;
              let ex_number_str = sale_number;
              if (sale_number > 10000) {
                ex_number_str = parseFloat(sale_number / 10000) + "万";
              }
              if (sale_number > 100000) {
                ex_number_str = parseFloat(sale_number / 10000) + "万+";
              }
              goods_info.sale_number_str = ex_number_str
            }
            console.log('color_listcolor_list',color_list,select_style)
            this.setData({
                goods_info: goods_info,
                color_gallery: color_gallery,
                color_list: color_list,
                select_style: select_style,
                limit_buys: goods_info.limit_buys
            })
            return Promise.resolve(e);
        }
        app.SMH.showToast({
          title: e.msg
        })
        return Promise.reject(e);
    })

}
//拼团参与情况
function getCollageGroupJoinList() {
    return app.CollageApi.getCollageGroupJoinList({
        params: {
            activityId: this.activity_id,
            userToken: app.LM.userToken,
            pageIndex: this.group_page,
            pageSize: app.Conf.PAGE_SIZE,
            brandCode: app.Conf.BRAND_CODE
        },
        other: {
            isShowLoad: true
        }
    }).then(e => {
        if (e.code == "1") {
            let data = e.data || {};
            let list = data.list || []
            if (list.length < app.Conf.PAGE_SIZE) {
                this.g_more = false;
            } else {
                this.g_more = true;
            }
            if (list.length == 0) return;
            let group_list = this.data.group_list;
            if (list) {
                if (this.group_page > 1) {
                    group_list = list;
                } else {
                    group_list = group_list.concat(list);
                }
            } else {
                group_list = [];
            }
            this.setData({
                join_count: data.total_count ? data.total_count : 0,
                group_list: group_list
            })
            var join_id = this.data.join_id;
            var select_join_index = 0;

            // Timer.on(funsction(){
            //   console.log("111");
            // })
            if (group_list && group_list.length != 0) {
              this.server_time = data.server_time;
              let maxEndTime = "";
              let that = this;
              for (let i  = 0; i < group_list.length; i++) {
                let endTime = group_list[i].end_time;
                if (!maxEndTime || MyDate.parse(maxEndTime) < MyDate.parse(endTime)){
                  maxEndTime = endTime;
                }
                let user_activity_id = group_list[i].user_activity_id;
                if (user_activity_id == join_id) {
                    select_join_index = i;
                }
              }
              this.countDown["groupCountDown"] = { countDown: ""}
              startCountDown.call(this, this.countDown["groupCountDown"].countDown, this.server_time, maxEndTime, "groupCountDown", function () {
                    getCollageGroupJoinList.call(that)
                });
            }
            this.setData({
                select_join_index: select_join_index
            })
            if (join_id) {
                this.switchStylePop("join_pop", true);
            }
            this.group_page++;
            return Promise.resolve(e);
        }
        return Promise.reject(e);
    })

}

function getCollageGroupGoodsDetail(d) {
    var goods_info = this.data.goods_info;
    var join_id = this.data.join_id;
    var select_style = this.data.select_style;
    return app.CollageApi.getCollageGroupGoodsDetail({
        params: {
            activityId: this.activity_id,
            userToken: app.LM.userToken,
            userActivityId: join_id,
            goodsId: goods_info.goods_id,
            colorId: select_style.color_id,
            sizeId: select_style.size_id,
            brandCode: app.Conf.BRAND_CODE
        },
        other: {
            isShowLoad: true
        }
    }).then(e => {
        if (e.code == "1") {
            var data = e.data;
            var colorList = data.colorList;
            var select_style = this.data.select_style;
            var spe_size_list = [];
            var attr_info = data;
            colorList.map((item,index)=>{
              item.color_n = StrH.ellipsisStr(item.color_name)
              if (item.goods_number > 0 && !this.hasGoodsNumber){
                this.hasGoodsNumber = true
              }
            })
            this.setData({
                attr_info: attr_info,
                spe_color_list: colorList,
                select_style: select_style,
            })
            
            //匹配颜色尺码
            if (select_style.color_id) {
                this.colorSelect(d, select_style.color_id);
            } else {
                spe_size_list = colorList[0].sizeList;
                spe_size_list.map((item,index)=>{
                  item.size_n = StrH.ellipsisStr(item.size_name);
                })
                this.setData({
                    spe_size_list: spe_size_list
                })
            }
            console.log("select_style",select_style)
            // console.log('spe_size_list',spe_size_list)
            return Promise.resolve(e);
        }
        return Promise.reject(e);
    })

}

function getGoodsServices(options = {}) {
    return app.GoodsApi.getGoodsServices({
        params: {
            goodsId: this.data.goods_info.goods_id || options.goods_id,
            brandCode: app.Conf.BRAND_CODE
        },
        other: {
            isShowLoad: true
        }
    }).then(e => {
        if (e.code == "1") {
            let data = e.data;
            this.setData({
                goodsServices: data
            })
            return Promise.resolve();
        }
        return Promise.reject();
    })
}

//检测数量
function checkProductNumber(productNum) {
    let goods_info = this.data.goods_info;
    let select_style = this.data.select_style;
    let product_id = select_style.size.product_id;
    let attr_info = this.data.attr_info;
    if (attr_info.attr_count <= 1) {
        product_id = select_style.color.product_id;
    }
    let options = this.options;
    let warn = "";
    if(!this.hasGoodsNumber){
      warn = "暂无库存";
    } else if (!product_id){
      warn = "请选择完整的规格";
    }
    if(warn){
      app.SMH.showToast({
        "title": warn
      })
      return;
    }
    return app.CollageApi.checkProductNumber({
        params: {
            activityId: options.activity_id,
            goodsId: goods_info.goods_id,
            productId: product_id,
            productNum: productNum,
            brandCode: app.Conf.BRAND_CODE
        },
        other: {
            isShowLoad: true
        }
    }).then(e => {
        if (e.code == 1) {
            let limit_buys = goods_info.limit_buys;
            if (limit_buys == productNum) {
                limit_buys = productNum
            } else {
                limit_buys = productNum + 1;
            }
            this.setData({
                product_num: productNum,
                limit_buys: limit_buys
            })
        } else {
            this.setData({
                limit_buys: productNum
            })
        }
    })
}

//倒计时
function startCountDown(countDown, startTime, endTime, label, callback) {
    if (!countDown) {
        countDown = new CountDown(MyDate.parse(startTime));
    }
    countDown.setTarget(MyDate.parse(endTime));
    setTime.call(this, countDown, label);
    if (!countDown.isRunning) {
        countDown.start(e => {
            this.countDown[label].countDown = countDown;
            if (e.value <= 0) {
                this.finish.push(label);
                this.group_page = 1;
                stopCountDown.call(this, countDown);
                typeof(callback) == 'function' && callback();
            }
          setTime.call(this, e, label);
        });
    }
}

function stopCountDown(countDown) {
    if (countDown) {
        countDown.stop();
    }
}

function setTime(e, label) {
  let value = e.value || 0;
  let nowTime = e.nowTime || 0;
  if (label == "groupCountDown"){
    let group_list = this.data.group_list || [];
    let group_times = this.data.group_times || {};
    for (let i = 0; i < group_list.length; i++){
      let gItem = group_list[i];
      let user_activity_id = gItem.user_activity_id;
      let endTime = gItem.end_time;
      value = Math.max(0, MyDate.parse(endTime).getTime() - nowTime);
      if (value > 0){
        let timeV = getTimeVal(value);
        group_times[user_activity_id] = timeV;
      }else{
        delete group_times[user_activity_id]
      }
    }
    this.setData({
      group_times: group_times
    })
  }else{
    let timeV = getTimeVal(value);
    let src = `count_down.${label}`
    this.setData({
      [src]: timeV
    });
  }
}
function getTimeVal(value){
  let day = Math.floor(value / (60 * 60 * 24 * 1000));
  let hour = parseInt(value % (60 * 60 * 24 * 1000) / (1000 * 60 * 60));
  let min = parseInt((value % (1000 * 60 * 60)) / (1000 * 60));
  let sec = parseInt((value % (1000 * 60)) / 1000);
  day = day < 10 ? "0"+ day : day;
  hour = hour < 10 ? "0" + hour : hour;
  min = min < 10 ? "0" + min : min;
  sec = sec < 10 ? "0" + sec : sec;
  let count_down = {
    day,
    hour,
    min,
    sec
  }
  return count_down;
}

function unListen(){
  app.EB.unListen("SceneParamsChange", this.sceneParamsChangeId);
}

function setAnim(type){
    this.specPop = this.specPop || this.selectComponent('#specPop') ;
    if(type == "show"){
      this.specPop.setShow(); 
    }else {
      this.specPop.setHide();
    }
  }