import WxApi from "../../../../../helper/wx-api-helper.js";

const app = getApp();
Page(app.BP({
    data: {
        select_label: [],
        select_relative: [],
        select_recommend: [],
        select_title: '',
        select_pictures: '',
        select_video: '',
        imgPathList: [],
        showLoading:false,
        hiddenFirst:false,
        select_type:'img',
        publicOk:false
    },
    mvCheck: false,
    select_pictures: [],
    select_video: [],
    select_title: '',
    select_content: '',
    select_classify: '',
    button_loading:false,
    button_loading_publish:false,
    onLoad: function(options) {
        // this.options = options; 
        this.pubFirst = this.selectComponent('#pubFirstId');
        this.pubFirst.onLoadFn();  
        let bg_color = this.data.brand_info.style.bg_color;
        let l_border_color = app.getColor(bg_color, 10, -18, -9, 0.3);
        let l_font_color = app.getColor(bg_color, 10, -18, -9, 1);
        let grass_relative = this.data.brand_info.icon_url + "micro_mall/seed_grass/grass_relative.png";
        let grass_recommend = this.data.brand_info.icon_url + "micro_mall/seed_grass/grass_recommend.png";
        let grass_label = this.data.brand_info.icon_url + "micro_mall/seed_grass/grass_label.png";
        let rightbutton = this.data.brand_info.icon_url + "micro_mall/rightbutton.png";
        this.setData({
            grass_relative: grass_recommend,
            grass_recommend: grass_recommend,
            grass_label: grass_label,
            l_font_color: l_font_color,
            l_border_color: l_border_color,
            rightbutton: rightbutton,
 
        })
    },
    onReady() {
        this.initVideo();
    },
    onShow() { 
        if (this.videoContext) {
            this.videoContext.pause();
        }
        let select_label = [];
        let select_relative = [];
        let select_recommend = [];
        select_label = app.globalData.select_label ? JSON.parse(JSON.stringify(app.globalData.select_label)) : [];
        select_relative = app.globalData.select_relative ? JSON.parse(JSON.stringify(app.globalData.select_relative)) : [];
        select_recommend = app.globalData.select_recommend ? JSON.parse(JSON.stringify(app.globalData.select_recommend)) : [];
        this.setData({
            select_label: select_label,
            select_relative: select_relative,
            select_recommend: select_recommend,
        })
    },
    handle_publish_next(e){
        if(this.button_loading){
            return
        }
        loadingCheck.call(this);
        console.log('下一步',e);
        console.log('全局globalData', app.globalData)
        this.select_pictures = JSON.parse(JSON.stringify(app.globalData.select_pictures || []));
        this.select_video = JSON.parse(JSON.stringify(app.globalData.select_video || []));
        this.select_classify = JSON.parse(JSON.stringify(app.globalData.select_classify || []));
        this.select_content = JSON.parse(JSON.stringify(app.globalData.select_content || ''));
        this.select_title = JSON.parse(JSON.stringify(app.globalData.select_title || ''));
        let select_pictures = app.globalData.select_pictures && app.globalData.select_pictures instanceof Array ? app.globalData.select_pictures[0] : '';
        let select_video = app.globalData.select_video && app.globalData.select_video instanceof Array ? app.globalData.select_video[0] : ''; 
        this.setData({
            hiddenFirst : !this.data.hiddenFirst,
            select_type:e.detail||'img', 
            select_title: this.select_title,
            select_pictures: select_pictures || '',
            select_video: select_video || '', 
        }) 
    },
    handle_publish_back() {
        console.log('上一步');
        this.setData({
            hiddenFirst: !this.data.hiddenFirst
        })
    },
    handle_select(e) {
        let dataset = e.currentTarget.dataset || {};
        let type = dataset.type || ''
        if (type == 'recommend' || type == 'label' || type == 'relative') {
            wx.navigateTo({
                url: type == 'recommend' ? `/pages/micro_mall/seeding_grass/publish/add_products/add_products?type=recommend` : type == 'label' ? `/pages/micro_mall/seeding_grass/publish/add_details/add_details?type=label` : type == 'relative' ? `/pages/micro_mall/seeding_grass/publish/add_products/add_products?type=relative` : '',
            })
        }
    },
    handle_publish() {
        if (this.button_loading_publish){
            console.log('阻止了')
        }
        if (this.data.select_type == 'img' && !this.button_loading_publish) {
            this.button_loading_publish = true;
            this.multiImgUpload(this.select_pictures)
        } else if (this.data.select_type == 'MV' && !this.button_loading_publish) {
            this.button_loading_publish = true;
            this.multiImgUpload(this.select_video)
        }
    },

    multiImgUpload(imgList) {
        const that = this;
        let brand_info = this.data.brand_info;
        let brand_name = app.Conf.BRAND_CODE;
        let time = new Date().getTime();
        let domain_name = app.Conf.UPLOAD_DOMIN;
        let req_type = "grass"; //grass
        let req_id = new Date().getTime();
        let c_req_type = this.data.select_type || 'img'; //MV/img
        let operate_name = "admin";
        let remark = "";
        let img_code = "";
        let suffix = "";
        let sign_key = "123456";
        if (imgList.length > 0) {
            let filePath = imgList.pop();
            // console.log('=======获取POP：', filePath);
            let obj = {};
            obj = {
                brand_info,
                brand_name,
                time,
                domain_name,
                req_type,
                req_id,
                c_req_type,
                operate_name,
                remark,
                img_code,
                suffix,
                sign_key,
                filePath,
                imgList
            };
            infoCheckFn.call(that, obj, that)
        } else { // 触发最后的提交
            console.log('循环结束：', this.data.imgPathList);
            // that.handleImgPathList();
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
        let imgPathList = this.data.imgPathList;

        let media_arr = arrMap.call(this, imgPathList, 'value');
        let select_title = this.select_title || '';
        let select_content = this.select_content || '';
        let select_classify = arrMap.call(this, this.select_classify, 'id') || '';
        let select_label = arrMap.call(this, this.data.select_label, 'id') || '';
        let select_relative = arrMap.call(this, this.data.select_relative, 'id') || '';
        let select_recommend = arrMap.call(this, this.data.select_recommend, 'id') || '';

        let reqData = {
            "media_type": this.data.select_type == 'img' ? 0 : 1,
            "brandCode": app.Conf.BRAND_CODE,
            "userToken": app.LM.userToken,
            "media_url": media_arr,
            "title": select_title,
            "content": select_content,
            "catIds": select_classify,
            "labels_Ids": select_label,
            "related_goodsIds": select_relative,
            "recomment_goodsIds": select_recommend,
        }
        console.log('数据', reqData);
        let reqUrl = 'grass_Publish';
        return app.GrassApi[reqUrl]({
            data: reqData,
            other: {
                isShowLoad: false
            }
        }).then(e => { 
            if (e.code == "1") {
                this.setData({
                    publicOk:true
                })
                app.SMH.showToast({
                    "title": '发布成功'
                })
                init.call(this);
                return Promise.resolve(e);
            }
            return Promise.reject(e);
        }).catch((e) => {
            console.log('catch', e);
            this.button_loading_publish = false;
            this.setData({
                showLoading:false
            })
            app.SMH.showToast({
                "title": e.msg || "提交失败"
            })
        })
    },
    initVideo() {
        this.videoContext = wx.createVideoContext('videoId');
    },
    videoFull: function(e) {
        var fullScreen = e.detail.fullScreen;
        if (fullScreen) {
            this.videoContext.play();
        } else {
            this.videoContext.pause(); //暂停
        }
    },
    _noFn(){},
}))

function infoCheckFn(obj, that) {
    if (obj.c_req_type == 'img') {
        WxApi.getImageInfo({
            src: obj.filePath.trim() 
        }).then(res => {
            infoMapFn.call(that, obj, that, res.type);
        }).catch((e) => {
            infoMapFn.call(that, obj, that, 'jpg');
        })
    } else if (obj.c_req_type == 'MV') {
        infoMapFn.call(that, obj, that, 'mp4')
    }
}


function infoMapFn(obj, that, suffixInit) {
    let suffix = suffixInit;
    let signStr = "brand_name=" + obj.brand_name + "&time=" + obj.time + "&domain_name=" + obj.domain_name + "&req_type=" + obj.req_type + "&req_id=" + obj.req_id + "&c_req_type=" + obj.c_req_type + "&operate_name=" + obj.operate_name + "&remark=" + obj.remark + "&img_code=" + obj.img_code + "&suffix=" + suffix + "&image_data=" + obj.filePath;
    let img_code = app.md5.hexMD5(app.md5.hexMD5(signStr) + obj.sign_key);
  
    let urlSend = suffixInit == 'mp4' ? obj.brand_info.uploadMvUrl : obj.brand_info.uploadImgUrl
    if (suffixInit == 'mp4'){
        this.setData({
            showLoading: true
        })
    }else{
        if (!this.data.showLoading){
            this.setData({
                showLoading: true
            })
        }
        // app.SMH.showToast({
        //     "title": "正在提交...",
        // })
    }
    //上传
    console.log('服务器地址', urlSend)
    urlSend = changeHttp.call(this, urlSend);
    console.log('file路径', obj.filePath)
    wx.uploadFile({
        url: urlSend,
        filePath: obj.filePath.trim(),
        name: 'upload_file',
        formData: {
            brand_name: app.Conf.BRAND_CODE,
            time: new Date().getTime(),
            domain_name: app.Conf.UPLOAD_DOMIN,
            req_type: "grass", //grass
            req_id: new Date().getTime(),
            c_req_type: obj.c_req_type, //MV/img
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
            try{
                let data = {};
                data = JSON.parse(res.data);
                let file_path = data.data.file_path;
                let imgPathList = that.data.imgPathList;
                const key = `img${imgPathList.length + 1}_path`;
                imgPathList.push({
                    'key': key,
                    'value': file_path
                });
                that.setData({
                    imgPathList: imgPathList
                });
                that.multiImgUpload(obj.imgList);
            }catch(e){
                console.log(e);
                that.multiImgUpload(obj.imgList);
            }
        },
        fail: function(res) {
            that.multiImgUpload(obj.imgList)
        }
    })
}


function arrMap(arr = [], type = 'id') {
    let arrTemp = [];
    arr.forEach((item) => {
        arrTemp.push(item[type] || "")
    });
    let arrReturn = arrTemp.join(",") || '';
    return arrReturn
}

function init() { //初始化发布流程数据
    app.globalData.select_pictures = [];
    app.globalData.select_video = [];
    app.globalData.select_classify = [];
    app.globalData.select_label = [];
    app.globalData.select_recommend = [];
    app.globalData.select_relative = [];
    app.globalData.select_title = '';
    app.globalData.select_content = '';
    let _timer = setTimeout(() => {
        clearTimeout(_timer);
        wx.redirectTo({
            url: '/pages/micro_mall/seeding_grass/my_publish/my_publish',
        })
    }, 500)
} 

function loadingCheck(){
    if (!this.button_loading){
        this.button_loading = true;
        this.buttonLoadId = setTimeout(()=>{
            clearTimeout(this.buttonLoadId);
            this.button_loading = false;
        },500)
    }
}
 

//
function changeHttp(link) {
  if (link.indexOf("http://") == "-1" && link.indexOf("https://") == "-1") {
    link = "https://" + link;
  } else if (link.indexOf("https://") == "-1") {
    link = link.replace('http://', 'https://');
  }
  return link;
}