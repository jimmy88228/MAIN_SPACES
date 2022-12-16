import WxApi from "../../../../common/support/tools/wx-api-promise.js";
let app = getApp();
const MAX_TEXT_NUM = 300;
Page(app.BP({

    data: {
        brand_info: {},
        goodsImgUrl: '',
        startScore: [true, true, true, true, true],
        shippingText : {
            "packageLevel":"非常好",
            "shippingLevel":"非常好",
            "mannerLevel":"非常好",
            "storeLevel":"非常好",
            "staffLevel":"非常好",
            "staffMannerLevel":"非常好",
        },
        score: 4, // 用以记录星星个数~以便显示对应的星级说明文字
        scoreTextList: ['非常差', '差', '一般', '好', '非常好'],
        imgList: [],
        imgPathList: [], // 图片上传后返回的路径列表
        commentContent: '',
        isStoreOrder: false,
        maxTextNum:MAX_TEXT_NUM,
        currentTextNum:0,
    },
    initScoreTextList: ['非常好','非常差', '差', '一般', '好', '非常好'],

    onLoad: function(options) {
        this.options = options;
        let start_icon_active = this.data.brand_info.icon_url + "micro_mall/comment/start_icon_active.png";
        let start_icon = this.data.brand_info.icon_url + "micro_mall/comment/start_icon.png";
        let empty_url = this.data.brand_info.icon_url + "micro_mall/default.jpg";
        let camera_icon = this.data.brand_info.icon_url + "micro_mall/comment/comment_edit/camera_icon.png";

        let comment_like = this.data.brand_info.default_icon_url + "comment_like.png";
        let comment_unlike = this.data.brand_info.default_icon_url + "comment_unlike.png";
        let comment_camera = this.data.brand_info.default_icon_url + "comment_camera.png";
        let comment_shipping = this.data.brand_info.default_icon_url + "comment_shipping.png";
        let comment_edit = this.data.brand_info.default_icon_url + "comment_edit.png";
        this.setData({
            // 'goods_id': options.goods_id,
            // // 如果是店铺订单则将order_id置为0~提交店铺订单评论数据这个参数接口最后实际不会用到
            // 'order_id': options.order_id,
            // 'goods_sn': options.goods_sn || '',
            "start_icon_active": start_icon_active,
            "start_icon": start_icon, 
            'isStoreOrder': options.type == 'store',
            empty_url: empty_url,
            // goodsImg: this.options.goods_img,
            camera_icon: camera_icon,
            comment_like,
            comment_unlike,
            comment_camera,
            comment_shipping,
            comment_edit, 
        });  
        getStorageFnc.call(this,'init').then(res=>{
            console.log("需要加载")
            getOrderCommentDetail.call(this)
        }).catch(e=>{
            getOrderCommentDetail.call(this,'storage').then(res=>{
                getStorageFnc.call(this);
            });
        });
        getGoodsDefaultImage.call(this, this.options);
    },
    // onShow() {
    // },
    // onReady(){
    // },
    addImg: function() {
        let that = this;
        let brand_info = this.data.brand_info;
        const imgList = this.data.imgList || [];
        WxApi.chooseImage({
            count: 9 - (imgList.length || 0), // 默认
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        }).then(res => {
            let tempFilePaths = res.tempFilePaths;
            this.setData({
                imgList: [...imgList, ...tempFilePaths]
            });
            console.log('choose',this.data.imgList,res)
            try{
                console.log(tempFilePaths[0])
                console.log(tempFilePaths[1])
            }catch(e){}
        })
    },

    removeImg: function(e) {
        const index = +e.target.dataset.index;
        let imgList = this.data.imgList;
        imgList.splice(index, 1);

        this.setData({
            imgList: imgList
        });
    },

    handleScoreGoods: function(e) {
        const clickIndex = +e.target.dataset.index;
        let startScore = this.data.startScore;
        for (let index = 0, len = startScore.length; index < len; index++) {
            if (index > clickIndex) {
                startScore[index] = false;
            } else {
                startScore[index] = true;
            }
        }
        this.setData({
            score: clickIndex,
            startScore: startScore
        });
    },
    handleScore: function(e) {
        if (this.data.hasCommentLogistics) {
            return
        }
        const commentType = e.target.dataset.commenttype;
        const clickIndex = e.target.dataset.index;
        let startScore = this.data[commentType];
        for (let index = 0, len = startScore.length; index < len; index++) {
            if (index > clickIndex) {
                startScore[index] = false;
            } else {
                startScore[index] = true;
            }
        }
        let shippingText = this.data.shippingText||{};
        shippingText[commentType] = this.data.scoreTextList[clickIndex];
        this.setData({
            [commentType]: startScore,
            shippingText
        });
    },
    handleContentInput: function(e) {
        // this.setData({
        //     commentContent: e.detail.value
        // })
        let dataset = e.currentTarget.dataset || {};
        let value = e.detail.value;
        let num = value.length || 0;
        let type = dataset.type || '';
        this.setData({
            commentContent:value,
            currentTextNum: num < MAX_TEXT_NUM ? num : MAX_TEXT_NUM,
        })
    },
    // 发布
    handleCommitData: function() { 
        let imgList = [].concat(this.data.imgList);
        if (this.data.commentContent.length < 10) {
            app.SMH.showToast({
                title: '字数不少于10个'
            });
            return;
        }
        if(this.lock)return;
        let that = this;
        this.dialog = this.dialog || this.selectComponent('#dialog');
        this.dialog.setTitle("提示");
        this.dialog.setCentent("确定要提交发布吗");
        this.dialog.setTwoBtn(
          {
            name: "取消",
            tap: function () {
                that.dialog.dismiss(); 
            }
          },
          {
            name: "确定",
            tap: function () { 
                that.dialog.dismiss();
                app.SMH.showToast({
                    "title": "正在提交...",
                })
                try{
                    that.lock = true;
                    that.multiImgUpload(imgList); //评价商品（先上传图片）
                    shippingCommitFnc.call(that); //评价订单物流
                }catch(e){
                    that.lock = false;
                }
            }
          }
        )
        this.dialog.show();
    },
    culateLevel: function(list) {
        return list.filter(item => {
            return item === true
        }).length
    },
    multiImgUpload(imgList) {
        const that = this;
        let brand_info = this.data.brand_info;
        let brand_name = app.Conf.BRAND_CODE;
        let time = new Date().getTime();
        let domain_name = app.Conf.UPLOAD_DOMIN;
        let req_type = "goods";
        let req_id = new Date().getTime();
        let c_req_type = "comment";
        let operate_name = "admin";
        let remark = "";
        let img_code = "";
        let suffix = "";
        let sign_key = "123456";
        if (imgList.length > 0) {
            let filePath = imgList.pop();
            console.log('提交',filePath);
            WxApi.getImageInfo({
                src: filePath
            }).then(res => {
                suffix = res.type;
                let signStr = "brand_name=" + brand_name + "&time=" + time + "&domain_name=" + domain_name + "&req_type=" + req_type + "&req_id=" + req_id + "&c_req_type=" + c_req_type + "&operate_name=" + operate_name + "&remark=" + remark + "&img_code=" + img_code + "&suffix=" + suffix + "&image_data=" + filePath;
                img_code = app.md5.hexMD5(app.md5.hexMD5(signStr) + sign_key);
                console.log('上传前',signStr,'\n',img_code)
                app.SMH.showToast({
                    "title": "正在提交...",
                })
                //上传
                wx.uploadFile({
                    url: brand_info.uploadImgUrl,
                    filePath: filePath,
                    name: 'upload_file',
                    formData: {
                        brand_name: app.Conf.BRAND_CODE,
                        time: new Date().getTime(),
                        domain_name: app.Conf.UPLOAD_DOMIN,
                        req_type: "goods",
                        req_id: new Date().getTime(),
                        c_req_type: "comment",
                        operate_name: "admin",
                        remark: "",
                        img_code: img_code,
                        suffix: suffix
                    },
                    header: {
                        // 'content-type': 'multipart/form-data',
                        'content-type': 'application/json'
                    },
                    success: function(res) {
                        console.log('upload res',res);
                        let data = {};
                        try{
                            data = JSON.parse(res.data);
                        }catch(e){
                            console.log('catch',e);
                        }
                        let file_path = data.data && data.data.file_path || "";
                        let imgPathList = that.data.imgPathList;
                        const key = `img${imgPathList.length + 1}_path`;
                        imgPathList.push({
                            'key': key,
                            'value': file_path
                        });
                        that.setData({
                            imgPathList: imgPathList
                        });
                        that.multiImgUpload(imgList)
                    },
                    fail: function(res) {
                        console.log('upload fail',res) 
                    }
                })

            })
        } else { // 触发最后的提交
            that.handleImgPathList();
            that.commitData();
            return;
        }
    },

    handleImgPathList: function() {
        let imgPathList = this.data.imgPathList;
        if (imgPathList.length < 9) {
            for (let index = imgPathList.length; index < 9; index++) {
                const key = `img${index + 1}_path`;
                imgPathList.push({
                    'key': key,
                    'value': ''
                });
            }
        }
        this.setData({
            imgPathList: imgPathList
        });
    },


    //提交
    commitData: function() {
        let options = this.options;
        let comment_level = this.data.startScore.filter((item) => item === true).length;
        let comment_content = this.data.commentContent;
        let imgPathList = this.data.imgPathList;
        let isStoreOrder = this.data.isStoreOrder;
        let reqData = {
            'comment_level': comment_level,
            'comment_content': comment_content,
            "is_show": 1,
            "is_anonymous": 1, 
        }
        if (isStoreOrder) {
            //店铺评论
            Object.assign(reqData, {
                "order_sn": options.order_sn || "",
                "goods_sn": options.goods_sn || "",
                "brandCode": app.Conf.BRAND_CODE || ""
            })
        } else {
            //微商城评论
            Object.assign(reqData, {
                'order_id': options.order_id || "",
                'goods_id': options.goods_id || ""
            })
        }
        imgPathList.forEach((item) => {
            reqData[item.key] = item.value || ""
        });
        console.log('结果',reqData,"---",isStoreOrder);
        let requestF = isStoreOrder ? app.GoodsApi["commentOfflineOrderGoods"] : app.CL_GoodsApi["commentOnlineOrderGoods"]
        return requestF({
            data: reqData,
            other: {
                isShowLoad: true
            }
        }).then(e => {
            if (e.code == "1") {
                if(this.commited){
                    setStorageFnc.call(this,"remove");
                    this.commitResult || (this.commitResult = e.data);
                    let time = 3000 , name = (e.data == 1) || (this.commitResult == 1) ? "评价成功，奖励请前往个人中心查看" : "发布成功";
                    app.SMH.showToast({
                        title:name,
                        duration:time
                    })
                    setTimeout(()=>{
                        wx.navigateBack();
                    },time)
                }
                this.commited = true;
                return Promise.resolve(e);
            }
            return Promise.reject(e);
        }).catch(e=>{
            this.lock = false;
            this.commited = true;
            app.SMH.showToast({
                "title": e && e.msg || "提交失败"
            })
        })
    },
    buildLevel: function(level) {
        return [true, true, true, true, true].map((item, index) => {
            if (index >= level && level > 0) {
                return false;
            } else {
                return true;
            }
        })
    },
    nav_init(e){
        let initMsg = e&&e.detail||{};
        let detail_top = initMsg.initHeight + initMsg.initTop;
        this.setData({
            detail_top:detail_top||0,
            showNav:true
        }) 
        console.log('initMsg',initMsg,detail_top)
    },
    nav_tap(e){
        showModal.call(this);
    },
}))
//获取图片
function getGoodsDefaultImage(options = {}) {
    let isStoreOrder = this.data.isStoreOrder;
    let requestF = isStoreOrder ? app.GoodsApi["getGoodsDefaultImage"] : app.CL_GoodsApi["getGoodsDefaultImage"]
    let params = isStoreOrder
    ? {goodsId: options.goods_id, brandCode: app.Conf.BRAND_CODE}
    : {goodsId: options.goods_id}
    return requestF({
        params,
        other: {
            isShowLoad: true
        }
    }).then(e => {
        if (e.code == "1") {
            let data = e.data;
            this.setData({
                goodsImgUrl: data
            })
            return Promise.resolve(e);
        }
        return Promise.reject();
    })
}
function getOrderCommentDetail(type="") {
    let options = this.options||{};
    let isStoreOrder = this.data.isStoreOrder;
    let requestF = isStoreOrder ? app.GoodsApi["getOfflineOrderCommentDetail"] : app.CL_GoodsApi["getOnlineOrderCommentDetail"];
    let reqData = {};
    if(isStoreOrder == 1){
        reqData = {
            orderSn: options.order_sn,
            brandCode: app.Conf.BRAND_CODE
        }
    }else{
        reqData = {
            orderId: options.order_id,
            // brandCode: app.Conf.BRAND_CODE
        }
    }
    return requestF({
        params: reqData,
        other: {
            isShowLoad: true
        }
    }).then(e => {
        if (e.code == "1") {
            let data = e.data||{};
            let orderCommentInfo = data.orderCommentInfo;
            let isStoreOrder = this.data.isStoreOrder;
            let setData = {}; 
            let hasCommentLogistics = isStoreOrder? (
                orderCommentInfo.store_level +
                orderCommentInfo.staff_level +
                orderCommentInfo.manner_level
            )>0 : (
                orderCommentInfo.package_level +
                orderCommentInfo.shipping_level +
                orderCommentInfo.manner_level
            )>0;
            if(!type || hasCommentLogistics){
                let shippingText = this.data.shippingText||{};
                if(isStoreOrder){
                    shippingText.storeLevel = this.initScoreTextList[orderCommentInfo.store_level];
                    shippingText.staffLevel = this.initScoreTextList[orderCommentInfo.staff_level];
                    shippingText.staffMannerLevel = this.initScoreTextList[orderCommentInfo.manner_level];
                    setData = {
                        storeLevel: this.buildLevel(orderCommentInfo.store_level),
                        staffLevel: this.buildLevel(orderCommentInfo.staff_level),
                        staffMannerLevel: this.buildLevel(orderCommentInfo.manner_level),
                        shippingText,
                    }
                }else{
                    shippingText.packageLevel = this.initScoreTextList[orderCommentInfo.package_level];
                    shippingText.shippingLevel = this.initScoreTextList[orderCommentInfo.shipping_level];
                    shippingText.mannerLevel = this.initScoreTextList[orderCommentInfo.manner_level];
                    setData = {
                        packageLevel: this.buildLevel(orderCommentInfo.package_level),
                        shippingLevel: this.buildLevel(orderCommentInfo.shipping_level),
                        mannerLevel: this.buildLevel(orderCommentInfo.manner_level),
                        shippingText,
                    }
                }
            }
            let pointBenefit = data.pointBenefit||{};
            let bonusBenefits = data.bonusBenefits||[];
            let sortNum = 0;
            if(pointBenefit.point){
                sortNum +=1;
            }
            if(bonusBenefits.length>0){
                bonusBenefits.forEach(item=>{
                    item.discountStr = app.NH.getDiscount(item.discount);
                    item.moneyStr = parseFloat(item.money); 
                })
                sortNum+=1;
            }  
            this.setData({
                ...setData,
                sortNum,
                pointBenefit,
                bonusBenefits,
                hasCommentLogistics
            });
            console.log('物流评价')
            console.log(this.data.packageLevel)
            console.log(this.data.shippingLevel)
            console.log(this.data.mannerLevel)
            return Promise.resolve(e);
        }
        return Promise.reject();
    })
}

function shippingCommitFnc(){
    if(this.data.hasCommentLogistics){
        this.commited = true;
        return
    }
    let isStoreOrder = this.data.isStoreOrder;
    // 店铺、微商城评论
    let requsetF = isStoreOrder ? app.GoodsApi["commentOfflineOrder"] : app.CL_GoodsApi["commentOnlineOrder"]
    let data = {
        "brandCode": app.Conf.BRAND_CODE
    } , otherData = {}
    if(isStoreOrder){
        otherData = {
            "orderSn": this.options.order_sn,
            "store_level": this.culateLevel(this.data.storeLevel),
            "staff_level": this.culateLevel(this.data.staffLevel),
            "manner_level": this.culateLevel(this.data.staffMannerLevel),
        }
    }else{
        otherData = {
            "orderId": this.options.order_id,
            "package_level": this.culateLevel(this.data.packageLevel),
            "shipping_level": this.culateLevel(this.data.shippingLevel),
            "manner_level": this.culateLevel(this.data.mannerLevel)
        }
    }
    data = {
        ...data,
        ...otherData
    }
    return requsetF({
        data: isStoreOrder ? data : otherData,
        other: {
            isShowLoad: true
        }
    }).then(e => {
        if (e.code == "1") {
            this.setData({
                hasCommentLogistics: true
            });
            if(this.commited){
                setStorageFnc.call(this,"remove");
                this.commitResult || (this.commitResult = e.data);
                let time = 3000 , name = (e.data == 1) || (this.commitResult == 1) ? "评价成功，奖励请前往个人中心查看" : "发布成功";
                app.SMH.showToast({
                    title:name,
                    duration:time
                })
                setTimeout(()=>{
                    wx.navigateBack();
                },time)
            }
            this.commited = true;
            return Promise.resolve(e);
        }
        return Promise.reject();
    }).catch(e=>{
        this.lock = false;
    })
}

function setStorageFnc(type=""){
    let options = this.options||{};
    if(type == "remove"){
        let storage = app.StorageH.get("COMMENT_DATA",{}) || {};
        let id = '' + options.order_id + '_' + options.goods_id ;
        if(storage[id]){
            delete storage[id];
            app.StorageH.set("COMMENT_DATA",storage);
        }
        return
    }
    let storage = app.StorageH.get("COMMENT_DATA",{}) || {};
    let id = '' + options.order_id + '_' + options.goods_id ;
    storage[id] = storage[id] || {};
    let data = storage[id];
    data.startScore = this.data.startScore||[];
    data.score = this.data.score||0;
    data.commentContent = this.data.commentContent||"";
    data.currentTextNum = this.data.currentTextNum||0;
    data.imgList = this.data.imgList||[];
    if(this.data.isStoreOrder){
        data.storeLevel = this.data.storeLevel||[];
        data.staffLevel = this.data.staffLevel||[];
        data.staffMannerLevel = this.data.staffMannerLevel||[];
    }else{
        data.packageLevel = this.data.packageLevel||[];
        data.shippingLevel = this.data.shippingLevel||[];
        data.mannerLevel = this.data.mannerLevel||[];
    }
    data.shippingText = this.data.shippingText||{};
    console.log('storage',storage);
    app.StorageH.set("COMMENT_DATA",storage);
}

function getStorageFnc(type=""){
    let p = new Promise((rs,rj)=>{
        let storage = app.StorageH.get("COMMENT_DATA",{}) || {};
        let options = this.options || {};
        let id = '' + options.order_id + '_' + options.goods_id ;
        let data = storage[id]||{};
        console.log('getstorage',storage[id],)
        if(!storage[id]){
            rs();
        }else{
            let setData = {};
            if(type=='init'){
                setData = {
                    startScore : data.startScore || [],
                    score : data.score || 0,
                    commentContent : data.commentContent || "",
                    currentTextNum : data.currentTextNum || 0,
                    imgList : data.imgList||[],
                };
            }else if(!this.data.hasCommentLogistics){
                if(this.data.isStoreOrder){
                    setData = {
                        storeLevel : data.storeLevel||[],
                        staffLevel : data.staffLevel||[],
                        staffMannerLevel : data.staffMannerLevel||[],
                        shippingText : data.shippingText||{},
                    };
                }else{
                    setData = {
                        packageLevel : data.packageLevel||[],
                        shippingLevel : data.shippingLevel||[],
                        mannerLevel : data.mannerLevel||[],
                        shippingText : data.shippingText||{},
                    };
                }
            }
            this.setData({
                ...setData
            })
            rj();
        }
    })
    return p;
}  

function showModal(){
    let len = 0;
    try{
        len = this.data.imgList.length||0;
    }catch(e){};
    if(this.data.commentContent || len>0){
        let that = this;
        this.dialog = this.dialog || this.selectComponent('#dialog');
        // this.dialog.setTouchCancel(false);
        this.dialog.setCentent("是否保存编辑");
        this.dialog.setTwoBtn(
          {
            name: "否",
            tap: function () {
                setStorageFnc.call(that,"remove");
                wx.navigateBack({
                    delta:1
                })
                that.dialog.dismiss();
            }
          },
          {
            name: "是",
            tap: function () {
                setStorageFnc.call(that);
                wx.navigateBack({
                    delta:1
                })
                that.dialog.dismiss();
            }
          }
        )
        this.dialog.show();
    }else{
        wx.navigateBack({
            delta:1
        })
    }
     
} 