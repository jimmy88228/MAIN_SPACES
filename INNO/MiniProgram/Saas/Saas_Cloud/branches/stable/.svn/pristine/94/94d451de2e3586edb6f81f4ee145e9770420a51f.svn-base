const app = getApp();
const MAX_TEXT_NUM = 140;
const LEFT_WIDTH = 375;
const MAX_SIZE_NUM = 200;
const MAX_SIZE = 1024 * 1024 * MAX_SIZE_NUM;
Component(app.BTAB({
    options: {
        addGlobalClass: true,
    },

    data: {
        select_classify: [],
        current_pics_arr: [],
        currentSelect: 0,
        video_url: [],
        leftWidth: LEFT_WIDTH,
        delete_hidden: false,
        currentTextNum: 0,
        maxTextNum: MAX_TEXT_NUM,
    },
    button_loading: false,  
    methods: { 
        handle_input(e) { 
            // console.log(e)
            let dataset = e.currentTarget.dataset || {};
            let value = e.detail.value;
            let num = value.length || 0;
            let type = dataset.type || '';
            if (type) {
                this.setData({
                    [`${type}`]: value,
                    // currentTextNum: num < MAX_TEXT_NUM ? num : MAX_TEXT_NUM,
                    // restTextNum: (MAX_TEXT_NUM - num) >= 0 ? MAX_TEXT_NUM - num : 0
                })
            }
            if (type =='textarea_value'){
                this.setData({
                    currentTextNum: num < MAX_TEXT_NUM ? num : MAX_TEXT_NUM,
                })
            }
        },
        jump(e) {
            if (this.button_loading) {
                return  
            }
            loadingCheck.call(this)
            let dataset = e.currentTarget.dataset || {};
            let url = dataset.url;
            if (dataset.type != 'classify') {
                let checkMsg = saveFn.call(this, true);
                if (checkMsg) {
                    app.SMH.showToast({
                        title: checkMsg || '抱歉,信息未完整'
                    })
                    return
                }
            }
            if (dataset.type) {
                url = url + `?type=${dataset.type}`
                if (dataset.type == 'img' || dataset.type == 'MV') {
                    let _timer = setTimeout(() => {
                        clearTimeout(_timer);
                        this.triggerEvent('publish_next', dataset.type)
                    }, 200)
                    return
                }
            }
            wx.navigateTo({
                url: url,
            })




        },
        handleSwitch(e) {
            let that = this;
            let dataset = e.currentTarget.dataset || {};
            let num = dataset.num || 0;
            if (num != this.data.currentSelect) {
                if ((this.data.currentSelect == 0 && this.data.current_pics_arr.length > 0) || (this.data.currentSelect == 1 && this.data.video_url.length > 0)) { 
                    this.pageDialog.setTouchCancel(false);
                    this.pageDialog.setTitle(`提示`);
                    if (num == 1) {
                        this.pageDialog.setCentent(`切换上传视频将不保留本次上传的图片`);
                    } else {
                        this.pageDialog.setCentent(`切换上传图片将不保留本次上传的视频`);
                    }
                    this.pageDialog.setTwoBtn({
                        name: "取消",
                        tap: function() {
                            let _timer = setTimeout(() => {
                              clearTimeout(_timer);
                                that.setData({
                                    delete_hidden: false
                                })
                            }, 300)
                            that.pageDialog.dismiss();
                        }
                    }, {
                        name: "确定",
                        tap: function() {
                            that.setData({
                                currentSelect: num,
                            })
                            let _timer2 = setTimeout(() => {
                                clearTimeout(_timer2);
                                that.setData({
                                    delete_hidden: false
                                })
                            }, 300)
                            that.pageDialog.dismiss();
                        }
                    })
                    that.setData({
                        delete_hidden: true
                    })
                    this.pageDialog.show();
                } else {
                    that.setData({
                        currentSelect: num,
                    })
                }
            }

        },
        add_pictures(e) {
            let current = this.data.currentSelect;
            if (current == 0) {
                chooseFn.call(this, 0)
            } else if (current == 1) {
                chooseFn.call(this, 1)
            }
        },
        delete_fn(e) {
            let that = this;
            let dataset = e.currentTarget.dataset || {};
            let arrTemp = this.data.current_pics_arr || [];
            let num = dataset.num || 0;
            this.pageDialog.setTouchCancel(true);
            if (this.data.currentSelect == 0) {
                this.pageDialog.setTitle("确定删除该图片吗？");
                this.pageDialog.setCentent('');
                this.pageDialog.setTouchCancel(true);
                this.pageDialog.setTwoBtn({
                    name: "取消",
                }, {
                    name: "确定",
                    tap: function() {
                        arrTemp.splice(num, 1); //删除
                        that.setData({
                            current_pics_arr: arrTemp
                        })
                        that.pageDialog.dismiss();
                    }
                })
            } else if (this.data.currentSelect == 1) {
                this.pageDialog.setTitle("确定删除该视频吗？");
                this.pageDialog.setCentent('');
                this.pageDialog.setTouchCancel(false);
                this.pageDialog.setTwoBtn({
                    name: "取消",
                    tap: function() {
                        let _timer3 = setTimeout(() => {
                            clearTimeout(_timer3);
                            that.setData({
                                delete_hidden: false
                            })
                        }, 300)
                        that.pageDialog.dismiss();
                    }
                }, {
                    name: "确定",
                    tap: function() {
                        that.setData({
                            video_url: [],
                            delete_hidden: false
                        }) 
                        that.pageDialog.dismiss();
                    }
                })
                this.setData({
                    delete_hidden: true
                })
            }
            this.pageDialog.show();
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
        onLoadFn() {
            app.globalData.select_title = app.globalData.select_title ? app.globalData.select_title : '';
            app.globalData.select_content = app.globalData.select_content ? app.globalData.select_content : '';
            app.globalData.select_pictures = app.globalData.select_pictures ? app.globalData.select_pictures : [];
            app.globalData.select_video = app.globalData.select_video ? app.globalData.select_video : [];
            app.globalData.select_classify = app.globalData.select_classify ? app.globalData.select_classify : [];

            let bg_color = this.data.brand_info.style.bg_color;
            let l_font_color = app.getColor(bg_color, 10, -18, -9, 1);
            let l_bg_color = app.getColor(bg_color, 0, 0, 0, 0.1);
            let grass_delete = this.data.brand_info.icon_url + "micro_mall/seed_grass/grass_delete.png";
            let grass_pic = this.data.brand_info.icon_url + "micro_mall/seed_grass/grass_pic.png";
            let grass_pic_active = this.data.brand_info.icon_url + "micro_mall/seed_grass/grass_pic_active.png";
            let grass_video = this.data.brand_info.icon_url + "micro_mall/seed_grass/grass_video.png";
            let grass_video_active = this.data.brand_info.icon_url + "micro_mall/seed_grass/grass_video_active.png";
            let grass_add = this.data.brand_info.icon_url + "micro_mall/seed_grass/grass_add.png";
            let grass_classify = this.data.brand_info.icon_url + "micro_mall/seed_grass/grass_classify.png";
            this.setData({
                l_font_color: l_font_color,
                l_bg_color: l_bg_color,
                grass_delete: grass_delete,
                grass_pic: grass_pic,
                grass_pic_active: grass_pic_active,
                grass_video: grass_video,
                grass_video_active: grass_video_active,
                grass_add: grass_add,
                grass_classify: grass_classify,
                title_value: app.globalData.select_title,
                textarea_value: app.globalData.select_content,
                current_pics_arr: app.globalData.select_pictures,
                video_url: app.globalData.select_video
            })
            if (this.data.current_pics_arr.length <= 0 && this.data.video_url.length > 0) {
                this.setData({
                    currentSelect: 1
                })
            } 
            this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
            this.initVideo()
        }
    },
    pageLifetimes: {
        show() {
            // console.log('组件生命周期show:', app.globalData)
            //     console.log('全局globalData', app.globalData)
            if (this.videoContext) {
                this.videoContext.pause();
            }
            let select_classify = JSON.parse(JSON.stringify(app.globalData.select_classify || [])) || [];
            this.setData({
                select_classify: select_classify,
            })
            saveFn.call(this);
        },
        hide() {

        }
    }
}))



function chooseFn(choose = 0) {
    let that = this;
    if (this.button_loading) {
        return
    }
    loadingCheck.call(this);
    if (choose == 0) {
        let currentPicsNum = this.data.current_pics_arr.length || 0;
        let restPicsNum = 9 - currentPicsNum;
        restPicsNum = restPicsNum > 0 ? restPicsNum : 0;
        console.log('开始选择图片');
        wx.chooseImage({
            count: 9,
            // sizeType: ['compressed'],
            sourceType: ['album'],
            success: res => {
                // console.log('=========success:', res);
                let tempFilePaths = res.tempFilePaths;
                if (tempFilePaths.length + currentPicsNum > 9) {
                    tempFilePaths = tempFilePaths.slice(0, restPicsNum);
                };
                let arrTemp = that.data.current_pics_arr.concat(tempFilePaths);
                that.setData({
                    current_pics_arr: arrTemp
                });
                saveFn.call(that)
            },
            fail: res => {
                console.log('========fail：', res)
            },
            complete: res => {
                console.log('=========complete:', res);
            }
        })
    } else if (choose == 1) {
        console.log('开始选择视频');
        wx.chooseVideo({
            sourceType: ['album'],
            compressed:false,
            success(res) {
                // console.log('=========success:', res);
                console.log('视频路径:', res.tempFilePath);
                // let path = [];
                // path.push(res.tempFilePath);
                // that.setData({
                //     video_url: path
                // })  
                // saveFn.call(that)

                let size = res.size || 0;
                console.log('大小:', size, (size / (1024 * 1024)) , size > MAX_SIZE)
                if (size > MAX_SIZE) {
                    that.pageDialog.setTitle("提示");
                    that.pageDialog.setCentent(`选择的视频不能超过${MAX_SIZE_NUM}M，请重新选择`);
                    that.pageDialog.setTouchCancel(false);
                    that.pageDialog.setSingleBtn({
                        name: "确定",
                        tap: function() {
                            let _timer = setTimeout(() => {
                                clearTimeout(_timer);
                                that.setData({
                                    delete_hidden: false
                                })
                            }, 300)
                            that.pageDialog.dismiss();
                        }
                    })
                    that.setData({
                        delete_hidden: true
                    })
                    that.pageDialog.show();
                } else {
                    let path = [];
                    path.push(res.tempFilePath);
                    that.setData({
                        video_url: path
                    })
                    saveFn.call(that)
                }


            },
            fail: res => {
                console.log('========fail：', res)
            },
            complete: res => {
                console.log('========complete：', res);
            }
        })
    }
}

function saveFn(check = false) {
    let msg = '';
    if (check) {
        if (this.data.title_value && this.data.textarea_value && this.data.select_classify.length > 0) {
            if (this.data.currentSelect == 0 && this.data.current_pics_arr.length == 0) {
                msg = "至少上传一张图片"
                return msg;
            } else if (this.data.currentSelect == 1 && this.data.video_url.length == 0) {
                msg = "至少上传一个视频"
                return msg;
            }
        } else {
            msg = !this.data.title_value ? "请填写标题" : !this.data.textarea_value ? "请填写文章内容" : "至少选择一个分类"
            return msg;
        }
    }
    app.globalData.select_title = this.data.title_value ? this.data.title_value : '';
    app.globalData.select_content = this.data.textarea_value ? this.data.textarea_value : '';
    app.globalData.select_pictures = this.data.current_pics_arr ? this.data.current_pics_arr : [];
    app.globalData.select_video = this.data.video_url ? this.data.video_url : [];
    app.globalData.select_classify = this.data.select_classify ? this.data.select_classify : [];
    console.log('保存成功', app.globalData)
    return msg
}


function loadingCheck() {
    if (!this.button_loading) {
        this.button_loading = true;
        this.buttonLoadId = setTimeout(() => {
            clearTimeout(this.buttonLoadId);
            this.button_loading = false;
            delete this.buttonLoadId;
        }, 500)
    }
    // else{
    //     if (this.buttonLoadId){
    //         clearTimeout(this.buttonLoadId);
    //         delete this.buttonLoadId;
    //     }
    //     console.log('节流')
    //     this.buttonLoadId = setTimeout(() => {
    //         this.button_loading = false;
    //     }, 500)
    // }
}