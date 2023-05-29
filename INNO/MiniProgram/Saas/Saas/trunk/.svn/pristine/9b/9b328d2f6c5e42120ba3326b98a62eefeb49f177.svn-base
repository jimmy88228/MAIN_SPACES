// pages/micro_mall/collageGroup/activity_goods_detail.js
let WxParse = require("../../../components/thirdParty/wxParse/wxParse.js");
import MyDate from '../../../common/support/utils/date-util.js';
import {
    CountDown
} from "../../../common/manager/timer-manager.js";
import StrH from "../../../common/helper/handle/strHandle.js"
import AllStaffApply from "../../../common/helper/all-staff-apply"// pages/micro_mall/collageGroup/activity_goods_detail.js
import stringUtil from '../../../common/support/utils/string-util.js';
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
        //配送方式  0可全部，1仅限门店，2仅限快递配送（selectIndex一一对应）
        selectShipInfo: {
            selectIndex: 2
        },
        count_down: {},
        goods_info: {
            min_sale_price: "--",
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
        group_times: {},
        sys_info: {},
        //动画参数
        show_style_pop: false,
        style_pop_animate: false,
        show_join_pop: false,
        join_pop_animate: false,
        show_join_list_pop: false,
        join_list_pop_animate: false,
        swiper_current: 0,
        outsideComponents: { // 该页面的最外层容器的组件对象-解决层级问题用
            agreementPop: { confirmIsGetInfoBtn: true },
            getCouponsPop: {}
        }
    },
    countDown: {},
    group_page: 1,
    g_more: true,
    activity_id: 0,
    finish: [],
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.options = options;
        let bInfo = this.data.brand_info || {};
        let detail_share = bInfo.icon_url + "micro_mall/detail_share.png";
        let isCollect_img = bInfo.icon_url + "micro_mall/isCollect.png";
        let noCollect = bInfo.icon_url + "micro_mall/noCollect.png";
        let ls_icon2 = bInfo.icon_url + "micro_mall/return_active.png";
        let ls_icon1 = bInfo.icon_url + "micro_mall/return.png";
        let rightbutton = bInfo.icon_url + "micro_mall/rightbutton.png";
        let Home = bInfo.icon_url + "micro_mall/tabBar/main/getHomes.png";
        let rule_img = bInfo.icon_url + "micro_mall/rule.png";
        let pt_color = bInfo.style.pt_color;
        this.setData({
            pt_color: pt_color,
            detail_share: detail_share,
            isCollect_img: isCollect_img,
            noCollect: noCollect,
            ls_icon2: ls_icon2,
            ls_icon1: ls_icon1,
            rightbutton: rightbutton,
            Home: Home,
            rule_img: rule_img,
        })
        this.modal = this.selectComponent("#custom_modal");
        onLoadEvent.call(this);
    },
    onShow: function () {
        getShipStore.call(this);
    },
    onHide: function () {
        // WxParse.wxParse('article', 'html', '', this, 0);
        console.log('this.countDown', this.countDown)
        unListen.call(this);
        for (let item in this.countDown) {
            if (this.countDown[item]) {
                stopCountDown.call(this, this.countDown[item].countDown);
            }
        }
    },
    onUnload: function () {
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
    onShareAppMessage: function () {
        let goods_info = this.data.goods_info;
        let color_gallery = this.data.color_gallery;
        let select_style = this.data.select_style;
        let select_color_id = select_style.color_id;
        let img_url = color_gallery[select_color_id].img_url;
        if (this.options.activity_id) {
            this.addActionLog("goods_share", "GROUP_BUY", {
                activity_id: this.options.activity_id,
                goods_id: goods_info.goods_id
            })
        }
        return {
            shareType: app.ShareType[PAGE_TYPE] || app.ShareType.NORMAL,
            path: 'pages/micro_mall/collageGroup/activity_goods_detail?activity_id=' + this.options.activity_id,
            title: goods_info.share_title || goods_info.activity_name,
            imageUrl: goods_info.share_image || img_url
        };

    },
    getPageParam() {

    },
    getActivityDetail() {
        let options = this.options;
        console.log("options", this.options);
        this.activity_id = options.activity_id || 0;
        let that = this;
        this.setData({
            join_id: options.useractivityid ? options.useractivityid : 0
        })
        let goodsId = 0, activityId = 0;
        return getCollageGroupActivityDetail.call(this).then(res => {
            getGoodsServices.call(this)
            goodsId = res.data && res.data.goods_id;
            this.addPageLog(null, this.route, {
                activity_id: this.activity_id,
                goods_id: goodsId
            })
            return Promise.resolve(res);
        })
            .then(e => {
                this.commission = this.commission || this.selectComponent("#commission");
                return this.commission.getCommission("COLLAGEGROUP", goodsId, this.activity_id);
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
    changeSwiper: function (e) {
        var swiper_current = e.detail.current;
        this.setData({
            swiper_current: swiper_current
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
        this.checkAndOpenStylePop(e)
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
            info: {
                opKind: opKind,
                imgUrl: color_gallery[select_style.color_id].img_url,
                goodsInfo: goods_info,
            },
            scene: {
                "shareType": shareType,
                "activity_id": goods_info.activity_id,
                'staffCode': detail.shareId == 3 ? detail.staffInfo.staffCode : ""
            },
            draw: {
                template: "goods"
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
    checkAndOpenStylePop(e) {
        let dataset = e.currentTarget.dataset || {};
        let {operateType = "openGroup"} = dataset;
        this.checkLogin()
            .then(() => this.checkIfHadLimit(operateType))
            .then(() => this.openStylePop(e))
            .catch(err => {
                console.log("checkAndOpenStylePop: reject -> ", err);
                app.SMH.showToast({
                    title: err && err.msg || err || "打开商品弹框失败"
                })
            })
    },
    checkLogin() { // 检查是否登录
        // console.log('checkLogin')
        if (app.LM.isLogin) return Promise.resolve(true);
        else return app.LM.getUserTokenAsync(true).then(() => {
            if (app.LM.isLogin) refreshPage.call(this)
            return Promise.reject();
        })
    },

    checkIfHadLimit(operateType) {
        return new Promise((rs, rj) => {
            let goods_info = this.data.goods_info || {};
            if (operateType === "joinGroup" && goods_info.limit_new_user == 1 && goods_info.is_new_user != 1) return rj("此活动只有新用户才可以参与")
            return rs()
        })
    },

    openStylePop(e) {
        this.switchStylePop("join_pop");
        this.getGoodsStyle(e);
    },
    /**
     * 获取尺码
     */
    getGoodsStyle(e) {
        //
        // this.switchStylePop('style_pop', true);
        setAnim.call(this, 'show');
        getCollageGroupGoodsDetail.call(this, e);
    },
    /**
     * 页面弹框
     */
    onTap(e) {
        let dataset = e.currentTarget.dataset || {};
        let type = dataset || "";
        if (type == "popshow") {
            setAnim.call(this, 'show');

        } else if (type == "pophide") {
            setAnim.call(this, 'hide');
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
            let _timer = setTimeout(function () {
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
    colorSelect(e = {}, color_id) {
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
                this_size_list.map((item, index) => {
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
    shipSelect(e) {
        let selectShipInfo = JSON.parse(JSON.stringify(this.data.selectShipInfo || {}));
        let { selectIndex, id } = selectShipInfo;
        let dataset = e.currentTarget.dataset || {};
        // 这里看看是否要改
        if (selectIndex != dataset.index) {
            this.setData({
                "selectShipInfo.selectIndex": dataset.index || 0
            }, () => {
                console.log(id);
                ((dataset.index == 1 && id) || (dataset.index == 2)) && getCollageGroupGoodsDetail.call(this, e)
            })
        }
    },
    selectStore() {
        let { selectShipInfo = {}, select_style = {}, product_num = 1 } = this.data;
        let store_id = selectShipInfo.id || 0;
        let pId = (select_style.size && select_style.size.product_id) || (select_style.color && select_style.color.product_id) || 0;
        let warn = userNotFinishSelectSpecsReason.call(this);
        if (warn) return app.SMH.showToast({ title: warn })
        wx.navigateTo({
          url: `/pages/micro_mall/stores/store_nav?type=selectByGoods&select_store_id=${store_id}&loc_f=0&pId=${pId}&goodsNum=${product_num}`,
        })
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
        this.checkAndOpenStylePop(e)
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
        let { select_style, goods_info, join_id, product_num, attr_info, selectShipInfo } = this.data;
        console.log('select_style', select_style)
        let warn = userNotFinishSelectSpecsReason.call(this);
        if (goods_info.self_get != 2 && selectShipInfo.selectIndex == 1 && !selectShipInfo.id) warn = "请选择自提店铺";
        else if (!this.hasGoodsNumber) warn = "暂无库存";
        if (warn) return app.SMH.showToast({ title: warn })
        let product_id = select_style.size.product_id;
        if (attr_info.attr_count <= 1) {
            product_id = select_style.color.product_id;
        }
        let store_id = selectShipInfo.selectIndex == 1 && selectShipInfo.id || 0;
        let _timer = setTimeout(() => {
            clearTimeout(_timer);
            // this.switchStylePop('style_pop');
            setAnim.call(this);
            wx.navigateTo({
                url: 'collage_buy_detail?activityId=' + goods_info.activity_id + '&userActivityId=' + join_id + '&goodsId=' + goods_info.goods_id + '&productId=' + product_id + '&productNum=' + product_num + '&store_id=' + store_id
            })
        }, 200)
    },

    // 服务
    handleService: function (e) {
        this.server = this.selectComponent('#service')
        this.server.show();
        this.server.getGoodsServiceData(this.data.goodsServices);
    },
    collectEvent: function () {
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
    go_home: function (e) {
        wx.switchTab({
            url: '/pages/micro_mall/index/index'
        })
    }
}))
function onLoadEvent() {
    let options = this.options || {};
    if (options.scene) {
        app.SHP.getParams(["activity_id", "staffCode"]).then((params) => {
            this.options = {
                ...this.options,
                ...params
            }
            loadedEvent.call(this, this.options);
        })
    } else {
        loadedEvent.call(this, this.options);
    }
}
//
function loadedEvent() {
    this.getActivityDetail().then(() => {this.getGroupList()})
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
// onShow->处理储存的"已选择的自提门店"
function getShipStore() {
    let select_store = app.StorageH.get("select_store") || {};
    if (select_store.id) {
        // 暂时注释，看下怎样改
        const store_id = this.data.selectShipInfo && this.data.selectShipInfo.id || -1;
        select_store.selectIndex = this.data.selectShipInfo.selectIndex
        this.setData({
            selectShipInfo: select_store
        })
        //不是仅限门店自提，从没选择到选择门店，刚好处于选择规则的状态
        if (select_store.id != store_id && this.style_select_show && this.data.goods_info.self_get != 2) {
            getCollageGroupGoodsDetail.call(this);
        }
    }
}
//活动详情
function getCollageGroupActivityDetail() {
    return app.CollageApi.getCollageGroupActivityDetail({
        params: {
            activityId: this.activity_id,
            userActivityId: this.data.join_id || 0,
            userToken: app.LM.userToken || "",
            brandCode: app.Conf.BRAND_CODE,
        },
        other: {
            isShowLoad: true
        }
    }).then(e => {
        if (e.code == "1") {
            let data = e.data;
            AllStaffApply.checkAllStaffApply(this, { goods_id: data.goods_id || 0, relatedId: data.activity_id || 0, goodsType: "COLLAGEGROUP" });
            let color_list = {};
            let color_gallery = {};
            let goods_gallery = data.lst_imgurl;
            let joinUserActivityInfo = data.joinUserActivityInfo || {};
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
            initCountDownData.call(this, data)
            //倒计时1 
            // if (this.finish.length == 0 || this.finish.indexOf(goods_info.goods_id) == -1) {
            //     startCountDown.call(this, this.countDown[goods_info.goods_id].countDown, startTime, endTime, goods_info.goods_id, function(){
            //         getCollageGroupActivityDetail.call(that);
            //     });
            // }
            goods_info.isEnd = MyDate.parse(startTime) > MyDate.parse(endTime) ? true : false
            if (!this.first) {
                WxParse.wxParse('article', 'html', article, that, 0);
                this.first = true;
            }
            console.log("goods_info", goods_info);
            select_style.color_id = goods_info.def_color;
            if (goods_info.is_show_sale_number == 1) {
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
            // 判断是否支持自提，如果不支持，则去掉data中的已选择门店
            goods_info.self_get == 2 && this.setData({ selectShipInfo: { selectIndex: 2 } })
            console.log('color_listcolor_list', color_list, select_style)
            this.joinUserActivityInfo = joinUserActivityInfo;
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
    this.pageSize = this.pageSize || app.Conf.PAGE_SIZE;
    return app.CollageApi.getCollageGroupJoinList({
        params: {
            activityId: this.activity_id,
            userToken: app.LM.userToken,
            pageIndex: this.group_page,
            pageSize: this.pageSize,
            brandCode: app.Conf.BRAND_CODE
        },
        other: {
            isShowLoad: true
        }
    }).then(e => {
        if (e.code == "1") {
            let data = e.data || {};
            let list = data.list || [];
            if (list.length < this.pageSize) {
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

            // 修复当该团不在前20个而产生的bug，暂时这样快速处理，日后再详细修改 start
            let joinUserActivityInfo = this.joinUserActivityInfo;
            if (joinUserActivityInfo && joinUserActivityInfo.activity_id) {
              let notExist = group_list.length === 0 ? true : group_list.every(item => item && item.activity_id != joinUserActivityInfo.activity_id);
              if (notExist) {
                group_list.push(joinUserActivityInfo);
                this.pageSize++
              }
              this.joinUserActivityInfo = null;
            }
            // end

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
                for (let i = 0; i < group_list.length; i++) {
                    let endTime = group_list[i].end_time;
                    if (!maxEndTime || MyDate.parse(maxEndTime) < MyDate.parse(endTime)) {
                        maxEndTime = endTime;
                    }
                    let user_activity_id = group_list[i].user_activity_id;
                    if (user_activity_id == join_id) {
                        select_join_index = i;
                    }
                }
                this.countDown["groupCountDown"] = { countDown: "" }
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
    let { goods_info, join_id, select_style, selectShipInfo = {} } = this.data
    let params = {
        userToken: app.LM.userToken,
        goodsId: goods_info.goods_id,
        brandCode: app.Conf.BRAND_CODE,
        activityId: this.activity_id
    }
    let reqFunc;
    if (selectShipInfo.id && selectShipInfo.selectIndex == 1) { // 门店自提
        reqFunc = app.CollageApi.getSumaryGoodsProductInfoByShippingStore;
        params.storeId = selectShipInfo.id
    }
    else { // 快递配送
        reqFunc = app.CollageApi.getCollageGroupGoodsDetail;
        params.userActivityId = join_id;
        params.colorId = select_style.color_id;
        params.sizeId = select_style.size_id;
    }
    return reqFunc({
        params,
        other: {
            isShowLoad: true
        }
    }).then(e => {
        if (e.code == "1") {
            let data;
            if (selectShipInfo.id && selectShipInfo.selectIndex == 1) { // 门店自提 只需用到返回的规格数量
                data = this.data.attr_info;
                data.colorList = data.colorList || [];
                let productNumObj = {};
                (e.data && e.data.ListGoodsProductInfo || []).forEach(item => { productNumObj[item.product_id] = item.product_number });
                for (let i = 0; i < data.colorList.length; i++) {
                    let colorSpecList = data.colorList[i] || {};
                    for (let j = 0; j < colorSpecList.sizeList.length; j++) {
                        let sizeSpecList = colorSpecList.sizeList[j] || {};
                        if (productNumObj[sizeSpecList.product_id] === undefined) {
                            delete colorSpecList[j];
                            j--
                        }else sizeSpecList.product_num = productNumObj[sizeSpecList.product_id];
                        }
                    }
            } else { // 快递配送接口 返回完整的结果
                data = e.data;
            }
            var colorList = data.colorList;
            var select_style = this.data.select_style;
            var spe_size_list = [];
            var attr_info = data;
            colorList.map((item,index)=>{
                item.color_n = StrH.ellipsisStr(item.color_name)
                if (item.goods_number > 0 && !this.hasGoodsNumber) {
                    this.hasGoodsNumber = true
                }
            })
            this.setData({
                attr_info: attr_info,
                spe_color_list: colorList,
                select_style: select_style,
            })

            //匹配颜色尺码
            if (select_style.color_id || select_style.size_id) {
                const color_id = select_style.color_id,
                    size_id = select_style.size_id;
                color_id && this.colorSelect(d, color_id);
                size_id && this.sizeSelect({ currentTarget: { dataset: { size_id: size_id } } })
            } else {
                spe_size_list = colorList[0].sizeList;
                spe_size_list.map((item, index) => {
                    item.size_n = StrH.ellipsisStr(item.size_name);
                })
                this.setData({
                    spe_size_list: spe_size_list
                })
            }
            if (goods_info.self_get == 1) { // 如果店铺只支持门店自提，则自动帮选中门店自提
                this.shipSelect({ currentTarget: { dataset: { index: 1 } } })
            }

            console.log("select_style", select_style)
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


// 检测用户是否未完成选择规格
// "" -> 已完成；"{{原因}}" -> 未完成
function userNotFinishSelectSpecsReason() {
    let { select_style = {}, attr_info = {} } = this.data,
        { color_name_title = "颜色", size_name_title = "尺码", attr_count } = attr_info;
    let warn = "";
    if (!select_style.color_id || !select_style.color.is_enabled) {
        warn = `请选择${color_name_title}！`
    } else if (!select_style.size_id && attr_count > 1) {
        warn = `请选择${size_name_title}！`
    }
    return warn
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
    let warn = userNotFinishSelectSpecsReason.call(this);
    if (!this.hasGoodsNumber) warn = "暂无库存";
    if (warn) return app.SMH.showToast({ title: warn })

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
            app.SMH.showToast({
                title: e.msg
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
                typeof (callback) == 'function' && callback();
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
    if (label == "groupCountDown") {
        let group_list = this.data.group_list || [];
        let group_times = this.data.group_times || {};
        for (let i = 0; i < group_list.length; i++) {
            let gItem = group_list[i];
            let user_activity_id = gItem.user_activity_id;
            let endTime = gItem.end_time;
            value = Math.max(0, MyDate.parse(endTime).getTime() - nowTime);
            if (value > 0) {
                let timeV = getTimeVal(value);
                group_times[user_activity_id] = timeV;
            } else {
                delete group_times[user_activity_id]
            }
        }
        this.setData({
            group_times: group_times
        })
    } else {
        let timeV = getTimeVal(value);
        let src = `count_down.${label}`
        this.setData({
            [src]: timeV
        });
    }
}
function getTimeVal(value) {
    let day = Math.floor(value / (60 * 60 * 24 * 1000));
    let hour = parseInt(value % (60 * 60 * 24 * 1000) / (1000 * 60 * 60));
    let min = parseInt((value % (1000 * 60 * 60)) / (1000 * 60));
    let sec = parseInt((value % (1000 * 60)) / 1000);
    day = day < 10 ? "0" + day : day;
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

function unListen() {
    app.EB.unListen("SceneParamsChange", this.sceneParamsChangeId);
}

function setAnim(type) {
    this.specPop = this.specPop || this.selectComponent('#specPop');
    if (type == "show") {
        this.style_select_show = true
        this.specPop.setShow();
    } else {
        this.style_select_show = false
        this.specPop.setHide();
    }
}

function initCountDownData(data) {
    if (!data) return;
    let result = {};
    result.stime = data.from_time || "";
    result.etime = data.end_time || "";
    result.serverTime = data.server_time || "";
    result.acName = "拼团";
    result.type = "collage"
    this.actCountDownId || (this.actCountDownId = this.selectComponent('#actCountDownId'));
    let cbData = this.actCountDownId.initData(result, () => {
        getCollageGroupActivityDetail.call(this);
    });
    this.setData({
        disabledTip: cbData && cbData.state != 2 && cbData.disabledTip || ""
    })
}

function refreshPage() {
    let path = "/pages/micro_mall/collageGroup/activity_goods_detail";
    let options = this.options || {};
    let url = stringUtil.addUrlParams(path, options);
    wx.redirectTo({ url })
}