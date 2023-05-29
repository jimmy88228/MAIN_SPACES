// var DateDown = require("../../../common/helper/utils/DateDown.js");
import {
    CountDown
} from "../../../common/manager/timer-manager.js";
import MyDate from "../../../common/support/utils/date-util.js";
import StrH from "../../../common/helper/handle/strHandle.js"; 
var app = getApp();
Page(app.BP({
    data: {
        brand_info: {},
        seckill_data: [],
        issue: {},
        titImg: {},
        is_begin: false,
        goodsTagList:[],
        count_down: {
            day: 0,
            hour: 0,
            min: 0,
            sec: 0
        },
        //
        sys_info: {},
    },
    page: 0,
    hasMore: true,
    is_loading: false,
    onLoad: function(options) {
        app.sysTemConfig('goods_image_size').then(res => {
            this.setData({
                goods_image_size: res.Value
            })
        });
        this.issue_id = options.issue_id || 0;
        checkSalesVolume.call(this);
        loadData.call(this);
        productsList.call(this);
    },
    onReady() {},
    onReachBottom: function() {
        productsList.call(this);
    },
    onUnload() {
        stopCountDown.call(this)
    },
    getKeywork(e){
        let value = e.detail.value;
        this.keyWord = value;
    },
    handleFilterSearch(){
        this.page = 0;
        this.hasMore = true;
        productsList.call(this);
    },
    onShareAppMessage: function () {
        let issue = this.data.issue || {};
        let img_domain = this.data.img_domain;
      return {
        isCustom: true,
        title: "限时特惠",
        imageUrl: img_domain + issue.pic_path,
        path: `pages/micro_mall/activity/goods_seckill?issue_id=${this.issue_id}`
      }
    },
    setDateDown: function(n_time, s_time, e_time) {
        if (MyDate.parse(n_time) > MyDate.parse(s_time) && MyDate.parse(n_time) < MyDate.parse(e_time)) { //活动开始
            startCountDown.call(this, n_time, e_time)
        } else if (MyDate.parse(s_time) > MyDate.parse(n_time)) { //活动还没有开始
            startCountDown.call(this, n_time, s_time)
        }
    },
}))

function loadData() {
    return app.GoodsApi.seckillGetGoodsList({
        params: {
            issueId: this.issue_id || 0,
            brandCode: app.Conf.BRAND_CODE,

        },
        other: {
            isShowLoad: true
        }
    }).then(res => {
        if (res.code == 1) {
            var data = res.data && res.data[0] || {};

            var is_begin, now_time, issue;
            now_time = data.server_time;
            is_begin = data.status == 1 ? true : false;
            issue = data;
            this.setData({
                is_begin: is_begin,
                issue: data
            });
            if (JSON.stringify(issue) != "{}") {
                this.setDateDown(now_time, issue.stime, issue.etime);
            }
        }
        return res
    })
}

function productsList() {
    if (!this.is_loading && this.hasMore) {
        this.is_loading = true;
        let page = this.page + 1;
        return app.GoodsApi.getSumaryALLGoodsList({
            params: {
                functype: 'SK',
                cate_Id: this.issue_id || 0,
                strWhere: this.keyWord || "",
                pageSize: app.Conf.PAGE_SIZE,
                pageIndex: page,
                sort_field: "goods_id",
                sort_by: "asc", //asc/desc
                userToken: app.LM.userToken,
                goods_brand_ids:"",
                brandCode: app.Conf.BRAND_CODE
            },
            other: {
                isShowLoad: true
            }
        }).then(res => {
            if (res.code == 1) {
                const data = res.data || {};
                const list = data && data.goods_list || [];
                let tagList = data && data.goodsTagList||[];
                list.forEach(item => {
                    item.zekou = (parseFloat(item.price) / parseFloat(item.market_price)) * 100 < 1 ? (parseFloat(item.price) / parseFloat(item.market_price) * 100).toFixed(2) + '%' : (parseInt(parseFloat(item.price) / parseFloat(item.market_price) * 100) || '') + '%'
                    item.scoreStr = StrH.numberCarryBit(item.salesVolume);
                })
                if(page != 1){
                    
                    this.setData({
                        img_domain: data.img_domain,
                        seckill_data: [...this.data.seckill_data, ...list],
                        goodsTagList: [...this.data.goodsTagList, ...tagList]
                    });
                }else{
                    this.setData({
                        img_domain: data.img_domain,
                        seckill_data: list,
                        goodsTagList: tagList
                    })
                }
                if (this.data.seckill_data.length <= 0) {
                    this.page = page;
                    this.setData({
                        has_no_data: true
                    })
                }
                let src1, src2;
                let _this = this;
                tagList.map((item, index) => {
                    let urlTemp = item.pic_path; 
                    wx.getImageInfo({
                        'src': urlTemp,
                        success(res) {
                            item.width = res.width;
                            src1 = `goodsTagList[${index}].width`,
                                _this.setData({
                                    [src1]: item.width,
                                });
                            console.log('goodsTagList', _this.data.goodsTagList)
                        },
                        fail(res) {
                            console.log('图片获取失败', res)
                        }
                    })
                })
                this.hasMore = data.allCount > app.Conf.PAGE_SIZE * this.page;
                this.page += 1;
                let _timer = setTimeout(()=>{
                    clearTimeout(_timer);
                    console.log('goodsTagList', _this.data.goodsTagList)
                },1500)
            }
            return res
        }).finally(() => {
            this.is_loading = false;
        })
    } else {
        app.SMH.showToast({
            "title": "已经到底啦！"
        })
    }
}
/**
 * 倒计时
 */
function startCountDown(startTime, endTime) {
    // console.log(startTime, endTime,"secking")
    if (!this.countDown) {
        stopCountDown.call(this);
        this.countDown = new CountDown(MyDate.parse(startTime));
    }
    this.countDown.setTarget(MyDate.parse(endTime));
    setTime.call(this, this.countDown);
    if (!this.countDown.isRunning) {
        this.countDown.start(e => {
            if (e.value <= 0) {
                stopCountDown.call(this);
                loadData.call(this);
                productsList.call(this);
            }
            setTime.call(this, e);
        });
    }
}

function stopCountDown() {
    if (this.countDown) {
        this.countDown.stop();
    }
}

function setTime(e) {
    let day = Math.floor(e.value / (60 * 60 * 24 * 1000));
    //   console.log("结束的时间")
    // console.log(e)
    // console.log(e.format(day > 0 ? "dd天HH:mm:ss" : "HH:mm:ss"))
    this.setData({
        time: e.format(day > 0 ? "dd天HH:mm:ss" : "HH:mm:ss")
        // time: e.format(day > 0 ? "dd天 HH小时mm分钟ss秒" : "HH小时mm分钟ss秒")
    });
}

function checkSalesVolume(){
    app.sysTemConfig("is_show_goods_sales_volume").then(data=>{
      this.setData({
        showSalesVolume: data.Value||0
      })
    })
}