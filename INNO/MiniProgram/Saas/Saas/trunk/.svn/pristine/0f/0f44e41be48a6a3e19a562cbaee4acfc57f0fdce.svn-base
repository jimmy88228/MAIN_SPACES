import Utils from "../../../../common/support/utils/utils";
import iterateeTime from "../iteratee_time.js";
import AudioCol from "../audio-config.js";
import WxGH from "../../../../common/helper/handle/wxGroupHandle";
const app = getApp();
const FruitTime = 8;
const TurntableTime = 6;
let pageObj = {};
let Original = []; //存储原始的奖品数据
let globalOptions = {};
const initDeg = 30;
Component(app.BTAB({
    properties: {
        activityType: {
            type: Number,
            value: 0,
            observer(nV, oV) {
                if (nV === 1) {
                    turntableFunc.call(this);
                } else if (nV === 2) {
                    fruitMachineFunc.call(this);
                } else if (nV === 3) {
                    zodiacFunc.call(this);
                } else if (nV === 4) {
                    couponFunc.call(this);
                } else if (nV === 5) {
                    goldeneggFunc.call(this);
                } else if (nV === 6) {
                    shakeFunc.call(this);
                }
                loadAudio.call(this, nV);
            }
        },
        activityId: {
            type: Number,
            value: 0,
            observer(nV, oV) {
                globalOptions = {
                    activityId: nV
                };
            }
        },
        prizeList: {
            type: Array,
            value: [],
            observer(nV, oV) {
                Original = [...nV];
                if (this.data.activityType === 1) {
                    // 大转盘重新渲染数据顺序
                    let _prizeList = [...nV].reverse();
                    for (let i = 0; i < 2; i++) {
                        let last = _prizeList.pop();
                        _prizeList.unshift(last);
                    }
                    _prizeList = _prizeList.slice(0, 3).concat(_prizeList.slice(3).reverse());
                    this.setData({
                        _prizeList
                    });
                } else {
                    this.setData({
                        _prizeList: nV
                    });
                }
            }
        },
        joinTimes: {
            type: Number,
            value: 0,
            observer(nV, oV) {
                this.setData({
                    _joinTimes: nV
                });
            }
        },
        // 弹窗是否关闭 true为关闭
        isClosed: {
            type: Boolean,
            value: false,
            observer(nV, oV) {
                this.setData({
                    _isClosed: nV
                });
                if (nV) {
                    // 在弹出框之前先调起遮罩层，防止不同位置多次点击
                    cancelBg.call(this);
                    if (this.data.activityType == 5) {
                        this.setData({
                            eggCurr: -1,
                            isAnimateHammer: true,
                            eggHammerCurr: 1
                        });
                    } else if (this.data.activityType == 3) {
                        this.setData({
                            isActive: false
                        });
                        setTimeout(() => {
                            // 重新排序
                            zodiacFunc.call(this);
                            app.EB.call("zodiac", this);
                        }, 800);
                    }
                }
            }
        },
        activityBindMobile: {  //活动是否需要绑定手机
            type: Number,
            value: -1,
            observer(nV, oV) {
                this.setData({
                    _activityBindMobile: !!nV
                });
            }
        },
        bindMobile: {  //登录之后，且没有手机号，且活动设置了需要绑定手机号才可以参与，返回1
            type: Number,
            value: -1,
            observer(nV, oV) {
                this.setData({
                    _bindMobile: !!nV
                });
            }
        },
        isLogin: {
            type: Boolean,
            value: false
        },
        activityStatus: { //活动状态，1正常，2未开启，3未开始，4已过期
            type: Number,
            value: 1
        }
    },
    data: {
        iconUrl: app.Conf.ICON_URL,
        _isClosed: false,
        isCouponStart: true,
        eggList: [],
        eggCurr: -1,
        eggHammerCurr: 1,
        isAnimateHammer: true,
        _prizeList: [],
        friutCurr: -1,
        _joinTimes: 0,
        turntableTime: 0,
        allDeg: 360,
        durationTurn: 0.4,
        addDeg: initDeg,
        isShake: false,
        preventBg: false,
        hasDeg: 0,
        showPanel: false,
        isActive: false,
        isLoop: false,
        isWaitLottery: false,
        fruitPosition: [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 2, y: 0 },
            { x: 2, y: 1 },
            { x: 2, y: 2 },
            { x: 1, y: 2 },
            { x: 0, y: 2 },
            { x: 0, y: 1 }
        ],
        isRegAction: false,
        disabled:false,
    },
    attached() {
        this.initDeg = initDeg;
        this.loading = false;
        // 存在两部分数据请求，一是业务逻辑上的，二是音频文件上的
        this.loadMainData = false;
        this.loadAudioData = false;
        this.indexRecord = 0;
        this.isShaking = false;
        this.watingData = false; 
        this.theDeg = 0;
        this.audioCtx1 = {};
        this.audioCtx2 = {};
        pageObj = this;
        wx.showLoading({
            title: '加载文件中...'
        });
        console.log(this.data,"activity info");
    },
    methods: {
        processStart() {
            console.log('process ---- start');
        },
        processErr(err) {
            console.log('process ---- err');
            console.log(err);
        },
        processEnd() {
            console.log('process ---- end');
        },
        resultStart() {
            console.log('result ---- start');
        },
        resultErr(err) {
            console.log('result ---- err');
            console.log(err);
        },
        resultEnd() {
            console.log('result ---- end');
        },
        loadData() {
            this.loadMainData = true;
            if (checkLoad.call(this)) {
                this.setData({
                    isActive: true
                });
            }
        }, 
        onShow(){
            this.isShaking = false;
        },
        onHide(){
             //     friutCurr: -1,
            this.isShaking = true;
        },
        onUnload(){
            this.isShaking = true;
            wx.offAccelerometerChange();
            if (this.audioCtx1.havedPlay) {
                audioRun(this.audioCtx1,'stop')
                audioRun(this.audioCtx1,'destroy')
            } else {
                audioRun(this.audioCtx1,'pause')
            }
            if (this.audioCtx2.havedPlay) {
                audioRun(this.audioCtx2,'stop');
                audioRun(this.audioCtx2,'destroy');
            } else {
                audioRun(this.audioCtx2,'pause');
            }
        },
        //大转盘
        turntableStart() {
            if(this.data.disabled)return; 
            setBg.call(this,'turntableStart');
            allowJoin.call(this, () => {
                getLotteryResult.call(this).then(res => {
                    audioRun(this.audioCtx1,'play')
                    audioRun(this.audioCtx1,'seek',0)
                    let result = iterateeTime.call(this, TurntableTime, res.prizeId, Original);
                    console.log('resultresult',result && Array.from && Array.from(result))
                    let [totalTime, loopTime] = [0, 0];
                    for (let info of result) {
                        totalTime += 40;
                        if (info) {
                            setTimeout(() => {
                                if (info.currentIndex === 0) {
                                    this.setData({
                                        turntableTime: loopTime++
                                    });
                                }
                                // isEnded终止的项
                                if (info.isEnded) {
                                    this.setData({
                                        addDeg: 360 + (info.currentIndex - this.indexRecord) * 60 , //最后需要转的角度 (360deg+需要转的deg-上一次的deg)
                                        // addDeg: (TurntableTime - this.indexRecord + info.currentIndex) * 60 + 360,
                                        durationTurn: 1.5
                                    });
                                    setTimeout(() => {
                                        if (this.audioCtx1.havedPlay) {
                                            audioRun(this.audioCtx1,'stop')
                                        } else {
                                            audioRun(this.audioCtx1,'pause')
                                        }
                                    }, 1200);

                                    this.indexRecord = info.currentIndex;
                                    setTimeout(() => {
                                        audioRun(this.audioCtx2,'play')
                                        this.lotteryStart(res);
                                        this.theDeg += this.data.turntableTime * this.data.allDeg + this.data.addDeg;
                                        this.setData({
                                            turntableTime: 0,
                                            allDeg: 360,
                                            addDeg: 0,
                                            durationTurn: 0.4,
                                            hasDeg: this.theDeg
                                        });
                                        console.log('jimmy',this.data.turntableTime , this.data.allDeg , this.data.addDeg , this.data.hasDeg)
                                        cancelBg.call(this);
                                    }, 1500);
                                };
                            }, totalTime);
                        }
                    }
                });
            });
        },
        //水果机
        fruitStart() {
            if(this.data.disabled)return;
            setBg.call(this,'fruitStart');
            allowJoin.call(this, () => {
                getLotteryResult.call(this).then(res => {
                    let result = iterateeTime.call(this, FruitTime, res.prizeId, this.data._prizeList, this.indexRecord);
                    let totalTime = 0;
                    for (let info of result) {
                        totalTime += info.duration;
                        if (info) {
                            setTimeout(() => {
                                this.setData({
                                    friutCurr: info.currentIndex
                                });
                                if (info.isPaused) {
                                    audioRun(this.audioCtx1,'pause')
                                }
                                audioRun(this.audioCtx1,'play')
                                if (info.isEnded) {
                                    audioRun(this.audioCtx1,'pause')
                                    audioRun(this.audioCtx2,'play') 
                                    this.indexRecord = info.currentIndex;
                                    setTimeout(() => {
                                        cancelBg.call(this);
                                        this.lotteryStart(res);
                                    }, 400);
                                };
                            }, totalTime);
                        }
                    }
                });
            });
        },
        //生肖开始
        zodiacStart(e) {
            if(this.data.disabled)return;
            setBg.call(this,'zodiacStart');
            let curIndex = e.currentTarget.dataset.index;
            allowJoin.call(this, () => {
                getLotteryResult.call(this).then(res => {
                    zodiacReset.call(this, e);
                    this.setData({
                        zodiacName: res.prizeName
                    });
                    setTimeout(() => {
                        this.setData({
                            [`zodiacList[${curIndex}].isSelected`]: false
                        });
                        audioRun(this.audioCtx2,'play');
                        cancelBg.call(this);
                        this.lotteryStart(res);
                    }, 1000);
                });
            });
        },
        //生肖结束
        zodiacEnd(e) {
            allowJoin.call(this, () => {
                zodiacReset.call(this, e);
            });
        }, 
        //一点领券
        couponStart(e) {
            this.clientY = e.changedTouches[0].clientY;
        },
        //一点领券
        couponEnd(e) {
            let endClientY = e && e.changedTouches[0].clientY || this.recordEnd;
            this.clientY = this.clientY ? this.clientY : this.recordStart;
            if(this.data.disabled)return;
            if (endClientY == this.clientY) {
                setBg.call(this,'couponEnd'); 
                allowJoin.call(this, () => {
                    this.setData({
                        isCouponStart: false
                    });
                    audioRun(this.audioCtx1,'play');
                    audioRun(this.audioCtx1,'seek',0);
                    getLotteryResult.call(this).then(res => {
                        setTimeout(() => {
                            if (this.audioCtx1.havedPlay) {
                                audioRun(this.audioCtx1,'stop');

                            } else {
                                audioRun(this.audioCtx1,'pause');
                            }
                            audioRun(this.audioCtx2,'play');
                            cancelBg.call(this);
                            this.lotteryStart(res);
                            this.setData({
                                isCouponStart: true
                            });
                        }, 400);
                    });
                });
            }
        },
        //砸金蛋
        eggStart(e) {
            if(this.data.disabled)return;
            setBg.call(this,'eggStart');
            let curIndex = e.currentTarget.dataset.index;
            allowJoin.call(this, () => {
                getLotteryResult.call(this).then(res => {
                    this.setData({
                        eggHammerCurr: curIndex
                    });
                    setTimeout(() => {
                        audioRun(this.audioCtx1,'play')
                        audioRun(this.audioCtx1,'seek',0)
                        this.setData({
                            eggCurr: curIndex,
                            isAnimateHammer: false
                        });
                        setTimeout(() => {
                            if (this.audioCtx1.havedPlay) {
                                audioRun(this.audioCtx1,'stop')
                            } else {
                                audioRun(this.audioCtx1,'pause')
                            }
                            audioRun(this.audioCtx2,'play');
                            cancelBg.call(this);
                            this.lotteryStart(res);
                        }, 300);
                    }, 350);
                });
            });
        },
        //摇一摇
        shakeStart() {
            let axisX = 0.3;
            let axisY = 0.3;
            let axisZ = 0;
            let shakeLimit = 2000;
            let limitPoint = 1;
            let hasMore = true;
            let calculateTime = 0;
            let startPlay = false;
            this.timeRecord = null;
            this.timeRecordColl = [];
            // 保证只play一次
            this.stopShaking = false;
            let shakeTime = null;
            wx.onAccelerometerChange(res => {
                if (this.isShaking || this.watingData) {
                    return;
                }
                if((res.x > axisX && res.y > axisY) || (res.y > axisY && res.z > axisZ) || (res.x > axisX && res.z > axisZ)){//检测左右摇，上下摇 
                    console.log('检测左右摇，上下摇',res,calculateTime)
                    if(!this.data._isClosed || !hasMore) { return; };
                    //播放声音
                    if (this.audioCtx1.havedPlay) {
                        this.audioCtx1.loop = true;
                    } else {
                        this.setData({
                            isLoop: true
                        });
                    }
                    if (!startPlay) {
                        startPlay = true;
                        audioRun(this.audioCtx1,'play')
                    }
                    this.setData({
                        isShake: true
                    })
                    //检测条件不满足
                    if (!this.data.isLogin || this.data._bindMobile) {
                        app.SMH.showToast({
                            "title": this.data._bindMobile ? "请绑定手机~" : "请授权登录"
                        });
                        if (this.audioCtx1.havedPlay) {
                            this.audioCtx1.loop = false;
                            audioRun(this.audioCtx1,'stop')
                            startPlay = false;
                        } else {
                            audioRun(this.audioCtx1,'pause')
                        }
                        // this.stopShaking = false;
                        return;
                    }
                    //
                    calculateTime++;
                    shakeTime = setTimeout(()=>{//在shakeLimit时间内，达不到摇度
                        if(hasMore){
                            console.log('在shakeLimit时间内，达不到摇度')
                            app.SMH.showToast({
                                "title": "请大力摇哦~"
                            });
                            console.log("请大力摇哦");
                        };
                        // calculateTime = 0;
                        if (this.audioCtx1.havedPlay) {
                            this.audioCtx1.loop = false;
                            audioRun(this.audioCtx1,'stop')
                            startPlay = false;
                        } else {
                            audioRun(this.audioCtx1,'pause')
                        }
                        this.setData({
                            isShake: false
                        })
                    },shakeLimit)
                }else{
                  // console.log(res)
                }
                if(calculateTime >= limitPoint){
                    console.log('摇一摇完成',calculateTime,hasMore)
                    if(hasMore && this.data._isClosed){
                        hasMore = false;
                        if(shakeTime){
                            clearTimeout(shakeTime);
                            shakeTime = null;
                        }
                        console.log("中奖");
                        allowJoin.call(this, () => {
                            getLotteryResult.call(this).then(res => {
                                calculateTime = 0;
                                setTimeout(() => {
                                    console.log("中奖回调",hasMore)
                                    hasMore = true;
                                    this.setData({
                                        isShake: false
                                    })
                                    audioRun(this.audioCtx2,'play') 
                                    this.isShaking = false;
                                    cancelBg.call(this);
                                    this.lotteryStart(res);
                                }, 350);
                                return res;
                            }).catch(()=>{ 
                              setTimeout(() => {
                                calculateTime = 0;
                                this.isShaking = false;
                                hasMore = true;
                                cancelBg.call(this);
                                this.setData({
                                  isShake: false
                                })
                              }, 350);
                            });
                        });
                    }
                    if (this.audioCtx1.havedPlay) {
                        this.audioCtx1.loop = false;
                        audioRun(this.audioCtx1,'stop')
                        startPlay = false;
                    } else {
                        audioRun(this.audioCtx1,'pause')
                    }
                    // this.stopShaking = true;
                    this.isShaking = true;
                } 
            });
        },
        // 共用
        lotteryStart(res) {
            console.log('tri lotteryStart')
            this.triggerEvent('lotteryStart', res);
            this.setData({
                disabled : false
            })
        },
        recordCouponStart(e) {
            // 记录授权时候得到的位置
            this.recordStart = e.changedTouches[0].clientY;
        },
        recordCouponEnd(e) {
            // 记录授权时候得到的位置
            this.recordEnd = e.changedTouches[0].clientY;
        },
        getUserInfo(e) {
            if(this.data.disabled)return;
            this.setData({
                isRegAction: false,
            }); 
            console.log('reload')
            this.triggerEvent("reload");
            let type = e.currentTarget.dataset.type;
            this.lotteryStatusId = app.EB.listen("lotteryStatus", () => {
                if (type == 1) {
                    this.turntableStart();
                } else if (type == 2) {
                    this.fruitStart();
                } else if (type == 3) {
                    this.zodiacStart(e);
                } else if (type == 4) {
                    this.couponEnd();
                } else if (type == 5) {
                    this.eggStart(e);
                } else if (type == 6) {
                    // 更新授权状态
                    shakeFunc.call(this);
                }
            });
        },
        setSign() {
            // 授权进入的
            this.setData({
                isRegAction: true
            });
        }
    }
}))

function turntableFunc() {
    let panBox = this.data.brand_info.icon_url + "micro_mall/lottery/pan-box.png";
    let panBoxStay = this.data.brand_info.icon_url + "micro_mall/lottery/pan-box_stay.png";
    let pointer = this.data.brand_info.icon_url + "micro_mall/lottery/pointer.png";
    this.setData({
        panBox,
        panBoxStay,
        pointer
    });
}

function fruitMachineFunc() {
    let fruitBg = this.data.brand_info.icon_url + "micro_mall/lottery/sgj-box.png";
    let fruitStart = this.data.brand_info.icon_url + "micro_mall/lottery/lottery_start.png";
    let friutItem = this.data.brand_info.icon_url + "micro_mall/lottery/sg_bg.png";
    let friutItemActive = this.data.brand_info.icon_url + "micro_mall/lottery/sg_bg_active.png";
    this.setData({
        fruitBg,
        fruitStart,
        friutItem,
        friutItemActive
    });
}

function zodiacFunc() {
    // 找不到规律，就简单粗暴写时间间隔
    const time = {
        1: 0,
        2: 0.1,
        3: 0.2,
        4: 0.3,
        5: 0,
        6: 0.1,
        7: 0.2,
        8: 0.3,
        9: 0,
        10: 0.1,
        11: 0.2,
        12: 0.3
    };
    app.EB.listen("zodiac", () => {
        console.log('zodiac call 回调');
        if(this.initPlay){
            audioRun(this.audioCtx1,'play')
        }
        this.initPlay = true;
        audioRun(this.audioCtx1,'seek',1.5)
        let zodiacList = [];
        let zodiacReverse = this.data.brand_info.icon_url + "micro_mall/lottery/fan-fan.png";
        let res_zodiacList = [];
        for (let i = 1; i <= 12; i++) {
            let path = this.data.brand_info.icon_url + `micro_mall/lottery/fan-${i}.png`;
            zodiacList.push({
                isSelected: false,
                path: path,
                times: 0
            });
        }

        // 调用洗牌算法
        res_zodiacList = zodiacList.shuffle();
        for (let i = 1; i <= 12; i++) {
            res_zodiacList[i - 1].times = time[i];
        }
        this.setData({
            zodiacList,
            zodiacReverse
        });
        // 加setTimeout为了和动画达到同步效果
        setTimeout(() => {
            this.loadAudioData = true;
            if (checkLoad.call(this)) {
                this.setData({
                    isActive: true
                });
            }
        }, 600);
    });
}

function zodiacReset(e) {
    let curIndex = e.currentTarget.dataset.index;
    this.setData({
        zodiacList: this.data.zodiacList.map((item, index) => {
            return Object.assign(item, {
                isSelected: (curIndex === index) ? !item.isSelected : false
            });
        })
    });
}

function couponFunc() {
    let clickStart = this.data.brand_info.icon_url + "micro_mall/lottery/click-start.png";
    let clickEnd = this.data.brand_info.icon_url + "micro_mall/lottery/click-end.png";
    this.setData({
        clickStart,
        clickEnd
    });
}

function goldeneggFunc() {
    let egg = this.data.brand_info.icon_url + "micro_mall/lottery/egg.png";
    let brokenEgg = this.data.brand_info.icon_url + "micro_mall/lottery/broken_egg.png";
    let ribbon = this.data.brand_info.icon_url + "micro_mall/lottery/ribbon.png";
    let hammer = this.data.brand_info.icon_url + "micro_mall/lottery/hammer.png";
    let eggList = [];
    for (let i = 0; i < 3; i++) {
        eggList.push({
            egg,
            brokenEgg,
            ribbon,
            left: i * 240,
            top: i == 1 ? 200 : 100
        });
    }
    this.setData({
        eggList,
        hammer
    });
}

function shakeFunc() {
    let shakeImg = this.data.brand_info.icon_url + "micro_mall/lottery/cycle.png";
    this.setData({
        shakeImg
    });
    // 没有授权或者需要活动需要绑定手机且用户没有手机绑定
    // if (!this.data.isLogin || this.data._bindMobile) return;
    this.shakeStart();
}

// 共用
function getLotteryResult() {
    if(this.loading){return Promise.reject()};
    this.loading = true;
    return app.LotteryApi.getLotteryResult({
        data: {
            userToken: app.LM.userToken,
            brandCode: app.Conf.BRAND_CODE,
            activityId: globalOptions.activityId || 0,
            wxGroupId:  WxGH.groupId || 0
        },
        other: {
            isShowLoad: true
        }
    }).then(res => {
        // cancelWaitingBg.call(this);
        if (res.code == 1) {
            let data = res.data;
            return Promise.resolve(data);
        } else {
            app.SMH.showToast({
                "title": res.msg
            });
            // cancelBg.call(this);
            return Promise.reject(res);
        }
    }).catch(e=>{ 
        cancelBg.call(this);
        return Promise.reject(e);
    }).finally(() => {
        this.setData({
            preventBg: false, 
        });
        cancelWaitingBg.call(this);
        this.loading = false;
    });
}

let controlClick = Utils.debounce(fn => {
    fn();
}, 400);

function checkBindPhone() {
    return app.UserApi.checkUserBindPhone({
        params: {
            brandCode: app.Conf.BRAND_CODE,
            userToken: app.LM.userToken
        },
        other: {
            isShowLoad: true
        }
    }).then(e => {
        if (e.code == "1") {
            let data = e.data;
            if (data == 1) {
                console.log(e);
            }
            return Promise.resolve(data);
        }
        return Promise.reject();
    })
}

const allowJoin = function(fn) {
    
    if (this.data.activityStatus != 1) {
        cancelBg.call(this);
        cancelWaitingBg.call(this);
        if (this.data.activityStatus == 2) {
            app.SMH.showToast({
                "title": "活动未开启"
            });
            return;
        } else if (this.data.activityStatus == 3) {
            app.SMH.showToast({
                "title": "活动未开始"
            });
            return;
        } else {
            app.SMH.showToast({
                "title": "活动已过期"
            });
            return;
        }
    } 
    controlClick.call(this, () => {
        fn && typeof(fn) == 'function' && fn();
    });

    // if (false && this.data._joinTimes === 0) {
    //     wx.vibrateShort({
    //         type: "heavy",
    //         complete: ()=>{
    //             wx.nextTick(()=>{
    //                 app.SMH.showToast({
    //                     "title": "今日抽奖次数用完了"
    //                 });
    //             })
    //             cancelBg.call(this);
    //             cancelWaitingBg.call(this);
    //             this.setData({
    //                 disabled:false,
    //                 isShake:false
    //             })
    //         }
    //     })
    //     return;
    // }  
    // 要求绑定手机
    // if (this.data._isBindMobile) {
    //     setWaitingBg.call(this).then(() => {
    //         checkBindPhone.call(this).then(res => {
    //             if (!!res.data) {
    //                 controlClick.call(this, () => {
    //                     fn();
    //                 });
    //             } else {
    //                 app.SMH.showToast({
    //                     "title": "绑定手机才可参与哦~"
    //                 });
    //             }
    //         });
    //     });
    //     cancelBg.call(this);
    //     return;
    // } 
}

function setBg(type) { 
    let extra = {};
    (type != 'handleAudio') && (extra.disabled = true);
    // 立即弹出遮罩层
    this.setData({
        preventBg: true,
        ...extra
    });
    console.log('增加屏蔽',type);
}

function cancelBg(type) {
    let extra = {};
    (type != 'handleAudio' && type != 'downLoadAudio') && (extra.disabled = false);
    this.setData({
        preventBg: false,
        ...extra
    });
    console.log('释放屏蔽',type);
}
// 两种类型的请求动画
// 大转盘，水果机，生肖：抽奖动画的执行需要等待请求返回的数据 -- 过渡动画在抽奖动画前
// 一点就送，砸金蛋，摇一摇：动画的执行不需要等待请求返回的数据 -- 过渡动画在抽奖动画后
function setWaitingBg() {
    this.setData({
        isWaitLottery: true
    });
    let p = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 600);
    });
    return p;
}

function cancelWaitingBg() {
    this.setData({
        isWaitLottery: false
    });
}

function loadAudio(activityType) {
    let isAutoPlay = false;
    // 加载完页面 生肖开始播放
    if (activityType == 3) isAutoPlay = true;
    handleAudio.call(this, AudioCol[activityType][0], 0, isAutoPlay);
    handleAudio.call(this, AudioCol[activityType][1], 1);
}
/* 
    @param priUrl string 音频地址
    @param index number 音频所在索引值(命名关联)
    @param isAutoPlay boolean 进入页面是否自动播放
 */
// 新旧共用
function handleAudio(priUrl, index = 0, isAutoPlay = false) {
    // 兼容方法
    // 1.先用最新的音频接口，尝试在静音状态自动播放音频(相当于没有声音 -- 可以解决延迟播放)，如果播放过程中报错，采用旧接口
    // 2.旧接口先下载音频到本地，再使用其路径 
    // 3.不要使用同一个实例切换src,会存在延迟播放问题
    // 4.新旧接口都存在seek方法(部分android不适用)，在较长音频加上，避免音频一段时间为静音状态
    // 5.使用stop方法更好，可以重新播放 - 可解决seek无效问题
    // 6.短时间内播放同一个音频，第二次可能没声音 -- 无解??? -- 通过延长动画时间
    // 7.设置loop=true后，stop+loop=false才能停止音频播放，只有stop播放手机仍然继续播放
    let addOne = index + 1;
    let audioName = `audioCtx${addOne}`;
    let that = this;
    setBg.call(this,'handleAudio');
    this.audioAutoId = setTimeout(() => {
        this.watingData = false; //屏蔽条件取消
        cancelBg.call(this,'handleAudio'); //屏蔽点击取消

        console.log('超时检测完毕',this.audioComplete);
        if(!this.audioComplete){
            downLoadAudio.call(that,that,audioName,priUrl,isAutoPlay) 
        }
    }, 2500);
    this[audioName] = wx.createInnerAudioContext();
    this[audioName].src = priUrl;
    this[audioName].autoplay = true;
    this[audioName].volume = 0;
    this[audioName].play();
    // 等待数据
    this.watingData = true;
    // 标志位，是否已经播放过
    this[audioName].havedPlay = false;
    this[audioName].onPlay(() => {
        that.audioComplete = true;
        // 说明新接口可以使用了
        console.log('onPlay 当前对象',this[audioName])
        console.log(this[audioName]);
        console.log("正常播放音频" + audioName + "," + priUrl);
        if (!this[audioName].havedPlay) {
            clearTimeout(this.audioAutoId);
            cancelBg.call(this,'handleAudio');
            // 初始化状态
            this[audioName].stop();
            this[audioName].autoplay = false;
            this[audioName].volume = 1;
            this[audioName].havedPlay = true;
            this.loadAudioData = true;
            checkLoad.call(this);
            // 生肖开始播放
            if (isAutoPlay) app.EB.call("zodiac", this);
            this.watingData = false;
        }
    });
    this[audioName].onError(err => {
        that.audioComplete = true;
        console.info("报错了: " + audioName + "----" + priUrl);
        console.info(err);
        //加载不成功也执行 
        downLoadAudio.call(that,that,audioName,priUrl,isAutoPlay) 
    });
}

function checkLoad() {
    if (this.loadMainData && this.loadAudioData) {
        wx.hideLoading();
    }
    return this.loadMainData && this.loadAudioData;
}

Object.defineProperty(Array.prototype, "shuffle", {
    enumerable: false,
    configurable: true,
    value: function () {
        var input = this;
        for (var i = input.length - 1; i >= 0; i--) {
            var randomIndex = Math.floor(Math.random() * (i + 1));
            var itemAtIndex = input[randomIndex];
            input[randomIndex] = input[i];
            input[i] = itemAtIndex;
        }
        return input;
    }
})

// Fisher–Yates shuffle
// Array.prototype.shuffle = function () {
//     var input = this;
//     for (var i = input.length - 1; i >= 0; i--) {
//         var randomIndex = Math.floor(Math.random() * (i + 1));
//         var itemAtIndex = input[randomIndex];
//         input[randomIndex] = input[i];
//         input[i] = itemAtIndex;
//     }
//     return input;
// }

function downLoadAudio(that,audioName,priUrl,isAutoPlay){
    that.loadAudioData = true;
    checkLoad.call(that);
    // 生肖开始播放
    if (isAutoPlay) app.EB.call("zodiac", that);
    cancelBg.call(that,'downLoadAudio');
    that.watingData = false;
    let downLoadTask = wx.downloadFile({
        url: priUrl,
        success(res) {
            console.info("下载音频sucs",res);
            if (res.statusCode == 200) {
                // 初始化状态
                that[audioName] = wx.createAudioContext(audioName, that);
                that[audioName].setSrc(res.tempFilePath);
            }
        },
        complete(res){
            that.audioComplete = true;
        },
        fail(err) {
            console.info("下载音频出错");
            console.info(err); 
        }
    });
}

function audioRun(data,key,params){
    data[key] && data[key](params);
}