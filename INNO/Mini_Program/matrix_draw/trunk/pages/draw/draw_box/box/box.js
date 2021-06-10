// pages/draw/draw_box/box/box.js
const app = getApp();
// import ImgLoader from "./img_loader/img_loader";
// import LIST from "../../lottery-config.js";
import MyDate from '../../../../common/support/utils/date-util.js';

Component({
    properties: {
        activityId: {
            type: String,
            default: ""
        }
    },
    pageLifetimes: {

    },
    data: {
        actInfo: {},
    },
    attached() {
        this.actInfo = {};
    },
    methods: {
        _onShow() {
            this.draw_acts = this.draw_acts || this.selectComponent("#draw_acts");
            // this.setData({
            //     activityId: this.data.activityId
            // });
            loadData.call(this).then(() => {
                this.draw_acts._onShow(this.actInfo);
            });
            // lotteryWinningRecord.call(this);
        }, 
    }
})



function loadData(isShowLoad = true) {
    return app.LotteryApi.get_LotteryActivitDetail({
        params: {
            activityId: this.data.activityId || 0,
        },
        extraData: {
            isShowLoad: isShowLoad
        }
    }).then(res => {
        console.log('loadData',res)
        if (res.code == 1) {
            let data = res.data || {};
            this.actInfo = data;

            // let tips = [];
            // if (data.canJoinTimes > 0) {
            //     tips.push({
            //         type: "joinTimes",
            //         value: "还剩" + data.canJoinTimes + "次机会"
            //     });
            // }
            // if (data.joinIntegral > 0) {
            //     tips.push({
            //         type: "integral",
            //         value: "每次消耗" + data.joinIntegral + "积分"
            //     });
            // }
            // this.setData({
            //     actInfo:data,
            //     activityTypeName: data.activityTypeName,
            //     activityTypeCode: data.activityTypeCode || '',
            //     activityDescription: data.activityDescription,
            //     isShowWinnings: data.isShowWinnings || false,
            //     showWinningsRecords: data.showWinningsRecords || 0,
            //     joinIntegral: data.joinIntegral || 0,
            //     actBgImg: data.actBgImg,
            //     shareTitle: data.shareTitle,
            //     shareImg: data.shareImg,
            //     pushImg: data.pushImg,
            //     canJoinTimes: data.canJoinTimes || 0,
            //     tips,
            //     activityNeedBindMobile: data.activityNeedBindMobile || 0, //活动是否需要绑定手机
            //     isNeedBindMobile: !!data.isNeedBindMobile, //登录之后，且没有手机号，且活动设置了需要绑定手机号才可以参与，返回1
            //     activityStatus: data.activityStatus || 0,
            //     isShowJoinTime: data.isShowJoinTime || false,
            //     joinTime: data.joinTime || 0,
            //     prizeList: data.prizeList || [],
            //     activityType: LIST.lottery[data.activityTypeCode]
            // });
            // this.preloadImgs(isShowLoad);
            //   this.setData({
            //       isHided: false
            //   });
            // this.draw_acts.loadData();
            return Promise.resolve(data);
        } else {
            return Promise.reject(res);
        }
    });
}

function lotteryWinningRecord(isShowLoad = true) {
    return app.LotteryApi.lotteryWinningRecord({
        params: {
            brandCode: app.Conf.BRAND_CODE,
            activityId: this.data.activityId || 0
        },
        extraData: {
            isShowLoad: isShowLoad
        }
    }).then(res => {
        let data = res.data;
        if (res.code == 1) {
            this.setData({
                winningRecordList: data.map(item => {
                    return Object.assign(item, {
                        createTime: MyDate.format(MyDate.parse((String(item.createTime).replace(/\-/gmi, "/"))), "yyyy-MM-dd")
                    });
                }) || []
            });
            wx.setNavigationBarTitle({
                title: this.data.activityTypeName || '活动'
            });
            let length = this.data.showWinningsRecords;
            if (this.data.isShowWinnings && length > 0) {
                this.setData({
                    winningRecordList: this.data.winningRecordList.slice(0, length)
                });
            }
        }
    }).finally(() => {
        console.log('lotteryWinningRecord')
        console.log('lotteryStatus EB', this.lotterySign)
        if (this.lotterySign) {
            this.lotterySign = false;
            app.EB.call("lotteryStatus");
        }
    });
} 