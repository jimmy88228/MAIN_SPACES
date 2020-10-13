const app = getApp();
Page(app.BP({
    data: {
        swiper_arr: [{}, {}, {}, {}],
        label_list: [{}, {}, {}, {}, {}, {}, {}],
        relative_list: [{}, {}, {}],
        comment_list: [{}, {}, {}],
        match_goods_list: [{}, {}, {}],
        parentsComments: {},
        childComments: {},
        current_swiper: 0,
        apiMap: {
            infoData: 'get_Grass_Publish_Info',
            related: 'get_Grass_Pub_Related_Goods',
            reCommend: 'get_Grass_Pub_ReCommend_Goods',
        },
        filter: false,
        current_focus: false,
        current_parent_id: 0,
        placeholder_value: '',
        search_value: '',
        isLogin: app.LM.isLogin,
        showPlayBtn: true,
        show_full_btn: false,
        currentMuted: false,
        //
        customData:{
          comment:{
            level:"0",
            is_reply:"1",
            commentId:"0"
          }
        }
    },
    onLoad: function(options) {
        this.options = options;
        let bg_color = this.data.brand_info.style.bg_color;
        let l_border_color = app.getColor(bg_color, 10, -18, -9, 0.3);
        let l_font_color = app.getColor(bg_color, 10, -18, -9, 1);
        let grass_detail_likes = this.data.brand_info.icon_url + "micro_mall/seed_grass/grass_detail_likes.png";
        let grass_detail_likes_act = this.data.brand_info.icon_url + "micro_mall/seed_grass/grass_detail_likes_act.png";
        let grass_detail_collect = this.data.brand_info.icon_url + "micro_mall/seed_grass/grass_detail_collect.png";
        let grass_detail_collect_act = this.data.brand_info.icon_url + "micro_mall/seed_grass/grass_detail_collect_act.png";
        let grass_detail_comment = this.data.brand_info.icon_url + "micro_mall/seed_grass/grass_detail_comment.png";
        let grass_detail_share = this.data.brand_info.icon_url + "micro_mall/seed_grass/grass_detail_share.png";
        let grass_detail_delete = this.data.brand_info.icon_url + "micro_mall/seed_grass/grass_detail_delete.png";
        let grass_like = this.data.brand_info.icon_url + "micro_mall/seed_grass/grass_like.png";
        let grass_like_active = this.data.brand_info.icon_url + "micro_mall/seed_grass/grass_like_active.png";
        let mute = this.data.brand_info.icon_url + "micro_mall/seed_grass/mute.png";
        let mute_active = this.data.brand_info.icon_url + "micro_mall/seed_grass/mute_active.png";
        let videoImg = this.data.brand_info.icon_url + "micro_mall/seed_grass/video.png";
        let full_screen = this.data.brand_info.icon_url + "micro_mall/seed_grass/full_screen.png";
        let rightbutton = this.data.brand_info.icon_url + "micro_mall/rightbutton.png";
        let mobile_close = this.data.brand_info.icon_url + "micro_mall/Mobile_close.png";

        this.setData({
            l_font_color: l_font_color,
            l_border_color: l_border_color,
            grass_detail_likes: grass_detail_likes,
            grass_detail_likes_act: grass_detail_likes_act,
            grass_detail_collect: grass_detail_collect,
            grass_detail_collect_act: grass_detail_collect_act,
            grass_detail_comment: grass_detail_comment,
            grass_detail_share: grass_detail_share,
            grass_detail_delete: grass_detail_delete,
            rightbutton: rightbutton,
            grass_like: grass_like,
            grass_like_active: grass_like_active,
            full_screen: full_screen,
            mobile_close: mobile_close,
            videoImg: videoImg,
            mute: mute,
            mute_active: mute_active,
        })
        console.log('l_font_color', l_font_color, l_border_color)
    },
    onShow() {
        if (this.videoContext) {
            this.videoContext.pause();
        }
        // test.call(this)
        listen.call(this);
    },
    onReady() {
        this.initVideo();
    },
    onHide() {
        this.videoContext && this.videoContext.pause();
        unListen.call(this);
    },
    onUnload(){
      unListen.call(this);
    },
    onShareAppMessage() {
        let infoData = this.data.infoData || {};
        let pubInfo = infoData.pubInfo || {};
        let shareInfo = {
          isCustom: true,
          title: pubInfo.pub_title,
          path: '/pages/micro_mall/seeding_grass/article_detail/article_detail?id=' + pubInfo.pub_id,
          imageUrl: `${infoData.imgdomain}${pubInfo.cover_path}`
        }
        let index = pubInfo.cover_path.lastIndexOf(".");
        let imgType = pubInfo.cover_path.substring(index).toLowerCase() || "";
        if (imgType != "png" || imgType != "jpeg"){
          delete shareInfo.imageUrl
        }
        return shareInfo;
    },
    jump(e) {
        let dataset = e.currentTarget.dataset;
        let type = dataset.type || '';
        let goodsId = dataset.goodsId || 0;
        let url = dataset.url || '';
        if (type == 'comments') {
            url = url + `?id=${this.options.id || 0}`
        } else if (type == 'goods_detail') {
            url = url + `?goods_id=${goodsId || 0}`
        }
        wx.navigateTo({
            url: url,
        })
    },
    headJump(e) {
        if(this.isFullScreening){
            return
        }
        let infoData = this.data.infoData || {};
        let pubInfo = infoData.pubInfo || {};
        let url = "";
        if (pubInfo.isSelf) {
            url = "/pages/micro_mall/seeding_grass/my_publish/my_publish";
        } else {
            url = "/pages/micro_mall/seeding_grass/user_page/user_page?related_userid=" + pubInfo.pub_user_id
        }
        // let pages = getCurrentPages() || [];
        // console.log(pages);
        wx.navigateTo({
            url: url,
        })
    },
    swiper_change(e) {
        console.log(e);
        this.setData({
            current_swiper: e.detail.current || 0
        })
    },
    collectHandle() {
        checkLogin.call(this).then(() => {
            collectReq.call(this);
        })
    },
    likesHandle() {
        checkLogin.call(this).then(() => {
            likesReq.call(this);
        })
    },
    followHandle() {
        let infoData = this.data.infoData || {};
        let pubInfo = infoData.pubInfo || {}; 
        if (pubInfo.isFocuse){
          let that = this;
          this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
          this.pageDialog.setCentent(`是否取消关注？`);
          this.pageDialog.setTwoBtn({
            name: "取消",
            tap: function () {
              that.pageDialog.dismiss();
            }
          }, {
              name: "确定",
              tap: function () {
                followReq.call(that);
                that.pageDialog.dismiss();
              }
            })
          this.pageDialog.show();
        }else{
          followReq.call(this);
          // checkLogin.call(this).then(() => {
          //   followReq.call(this);
          // })
        }
    },
    delPubLishHandle() {
        if (!this.data.infoData.pubInfo.isSelf) {
            return
        }
        let that = this;
        this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
        this.pageDialog.setTitle(`提示`);
        this.pageDialog.setCentent(`是否删除该发布？`);
        this.pageDialog.setTwoBtn({
            name: "取消",
            tap: function() {
                that.pageDialog.dismiss();
            }
        }, {
            name: "确定",
            tap: function() {
                delPublish.call(that);
                that.pageDialog.dismiss();
            }
        })
        this.pageDialog.show();
    },
    handle_focus(e) {
        console.log(e.currentTarget.dataset);
        // let dataset = e.currentTarget.dataset || {};
        // checkLogin.call(this).then(() => {
        //     let is_reply = dataset.is_reply;
        //     if (is_reply == 0) {
        //         return
        //     }
        //     this.setData({
        //         filter: true
        //     })
        //     let parentsId = dataset.parentsId || 0;
        //     let commentId = dataset.commentId || 0;
        //     if (commentId == this.commentId) {
        //         console.log('重复点击', commentId);
        //         return
        //     }

        //     let reply, value;
        //     let level = dataset.level || 0;
        //     let num = dataset.num || 0;
        //     let name = dataset.name || '';
        //     this.parentsId = parentsId;
        //     this.level = level;
        //     this.num = num;
        //     this.commentId = commentId;
        //     if (commentId != 0) {
        //         reply = '回复:' + name;
        //         this.reply = true;
        //         value = level == 0 ? this.data.parentsComments[commentId].current_value : level == 1 ? this.data.childComments[parentsId][num].current_value : '';
        //     } else {
        //         this.reply = false;
        //     }
        //     this.setData({
        //         // current_focus: true,
        //         current_parent_id: commentId,
        //         placeholder_value: reply || '',
        //         search_value: value || ''
        //     })
        //     // console.log('评论parent id:', this.data.current_parent_id)
        //     // console.log('评论内容缓存:', this.data.search_value)
        // })
        let detail = e.detail || e.currentTarget.dataset || {};
        let is_reply = detail.is_reply;
        if (is_reply == 0) {
          return
        }
        this.setData({
          filter: true
        })
        let parentsId = detail.parentsId || 0;
        let commentId = detail.commentId || 0;
        if (commentId == this.commentId) {
          console.log('重复点击', commentId);
          return
        }

        let reply, value;
        let level = detail.level || 0;
        let num = detail.num || 0;
        let name = detail.name || '';
        this.parentsId = parentsId;
        this.level = level;
        this.num = num;
        this.commentId = commentId;
        if (commentId != 0) {
          reply = '回复:' + name;
          this.reply = true;
          value = level == 0 ? this.data.parentsComments[commentId].current_value : level == 1 ? this.data.childComments[parentsId][num].current_value : '';
        } else {
          this.reply = false;
        }
        this.setData({
          // current_focus: true,
          current_parent_id: commentId,
          placeholder_value: reply || '',
          search_value: value || ''
        })
    },
    handle_focus_set() {
        this.setData({
            current_focus: true
        })
    },
    handle_blur(e) {
        this.setData({
            // filter: false,
            current_focus: false,
        })
    },
    handle_cancel() {
        this.setData({
            filter: false,
            current_focus: false
        })
    },
    handle_confirm(e) {
        let value = this.data.search_value || '';
        if (/^\s*$/.test(value)) {
            app.SMH.showToast({
                title: '发表内容不能为空'
            })
        } else {
            console.log('发表内容', value);
            publish_comment.call(this)
        }
    },
    handle_input(e) {
        let dataset = e.currentTarget.dataset || {};
        let type = e.type || '';
        let valueType = dataset.valueType || '';
        let value = e.detail.value || '';
        if (type == 'input' && valueType) {
            if (this.reply) {
                if (this.level == 0) {
                    this.data.parentsComments[this.commentId].current_value = value;
                    this.setData({
                        parentsComments: this.data.parentsComments
                    })
                } else if (this.level == 1) {
                    this.data.childComments[this.parentsId][this.num].current_value = value;
                    this.setData({
                        childComments: this.data.childComments
                    })
                }
            }
            this.setData({
                [valueType]: value,
            })
        }
    },
    handle_showAll(e) {
        console.log(e);
        let dataset = e.currentTarget.dataset || {};
        let commentId = dataset.commentId || 0;
        let num = dataset.num || 0;

        this.data.parentsComments[commentId].showAll = !this.data.parentsComments[commentId].showAll
        this.setData({
            parentsComments: this.data.parentsComments
        })
    },
    commentLikes(e) {
        let detail = e.detail || {};
        let commentId = detail.commentId || 0;
        // checkLogin.call(this).then(() => {
        //   commentLikesReq.call(this, commentId)
        // })
      console.log(detail)
        commentLikesReq.call(this, commentId)
    },
    initVideo() {
        this.videoContext = wx.createVideoContext('videoId'); 
    },

    videoFull: function(e) { 
        var fullScreen = e.detail.fullScreen;
        if (fullScreen) {
            console.log('全屏生效');
            this.isFullScreening = true;
            this.videoContext.hideStatusBar(); 
            // this.setData({
            //     show_full_btn: true
            // })
            this.videoContext.play();
        } else {
            console.log('退出全屏');
            this.isFullScreening = false;
            // this.setData({
            //     show_full_btn: false
            // })
            this.videoContext.pause();
        }
    },
    videoPlayHandle() {
        this.setData({
            showPlayBtn: false
        })
    },
    videoPauseHandle() {
        this.setData({
            showPlayBtn: true
        })
    },
    videoClick(e) {
        // let dataset =e.currentTarget.dataset || {};
        // let type = dataset.type;
        let showPlayBtn = this.data.showPlayBtn; 
        if (showPlayBtn) {
            this.videoContext.play();
            showPlayBtn = false;
        } else {
            this.videoContext.pause();
            showPlayBtn = true;
        }
        this.setData({
            showPlayBtn: showPlayBtn
        })
    },
    videoClick_full(e) {
        this.videoContext.requestFullScreen();
        // this.videoContext.requestFullScreen({
        //     direction: this.data.videoH >= this.data.videoW ? 0 : 90
        // });
    },
    videoClick_quiet(e) {
        // this.videoContext.showStatusBar();
        this.setData({
            currentMuted: !this.data.currentMuted
        })
    },
    videoClick_full_quit(e) {
        this.videoContext.exitFullScreen();
    },
    checkPreviewImage(e) {
        let infoData = this.data.infoData || {};
        let dataset = e.currentTarget.dataset || {};
        let imgs = [];
        for (let i in infoData.pubImages) {
            imgs.push(`${infoData.imgdomain}${infoData.pubImages[i].img_path}`)
        }
        wx.previewImage({
            current: dataset.index || 0,
            urls: imgs
        })
    },
    loadImageSize(e) {
        console.log(e, "图片信息");
        let infoData = this.data.infoData || {};
        let pubInfo = infoData.pubInfo || {};
        let dataset = e.currentTarget.dataset || {};
        let detail = e.detail || {};
        let viewW = app.SIH.screenWidth;
        let viewH = parseFloat(((detail.height * viewW) / detail.width).toFixed(2)) || '';
        if (pubInfo.media_type == 0) { //图片类型
            let swiperH = this.data.swiperH || {};
            swiperH[dataset.index] = {
                imageW: viewW,
                imageH: viewH
            }
            this.setData({
                swiperH: swiperH
            })
            console.log('swiperH', this.data.swiperH)
        } else {
            this.setData({
                videoW: viewW,
                videoH: viewH
            })
        }
        console.log('宽高--------', this.data.videoW, this.data.videoH)
    } 
}))
//
function loadData(type = '') {
    if (this.data.apiMap[type]) {
        let reqParams = {
            pubId: this.options.id || 0,
            userToken: app.LM.userToken,
            brandCode: app.Conf.BRAND_CODE
        }
        return app.GrassApi[this.data.apiMap[type]]({
            params: reqParams,
            other: {
                isShowLoad: true
            }
        }).then(res => {
            if (res.code == 1) {
                const data = res.data || {};
                if (type == "infoData") { //非审核通过文章，不可分享
                    let pubImages = data.pubImages || [];
                    pubImages.sort(function(a, b) {
                        let sortA = a["sort"];
                        let sortB = b["sort"];
                        return sortA - sortB
                    })
                    let pubInfo = data.pubInfo || {};
                    if (pubInfo.status != 1) {
                        wx.hideShareMenu();
                    }
                }
                this.setData({
                    [type]: data
                })
                return Promise.resolve(res);
            }
            return Promise.reject(res);
        }).catch(e=>{ 
            if (e && e.msg) {
                app.SMH.showToast({
                    "title": e.msg
                })
            }
        })
    }
}
//收藏
function collectReq() {
    let infoData = this.data.infoData || {};
    let pubInfo = infoData.pubInfo || {};
    let req = pubInfo.isCollect ? 'removeCollectSharePublish' : 'addCollectSharePublish';
    let reqData = {
        "userToken": app.LM.userToken,
        "brandCode": app.Conf.BRAND_CODE
    }
    if (pubInfo.isCollect) {
        reqData.pubIds = this.options.id
    } else {
        reqData.pubId = this.options.id
    }
    return app.GrassApi[req]({
        data: reqData,
        other: {
            isShowLoad: true
        }
    }).then(e => {
        let warn = "操作失败";
        if (e.code == 1) {
            if (e.data == 1) {
                warn = pubInfo.isCollect ? "取消收藏" : "收藏成功"
                // warn = pubInfo.isCollect ? "取消收藏" : e.msg
                pubInfo.collections = pubInfo.isCollect ? pubInfo.collections - 1 : pubInfo.collections + 1;
                pubInfo.isCollect = !pubInfo.isCollect;
                infoData.pubInfo = pubInfo;
                this.setData({
                    infoData: infoData
                })
                // return Promise.resolve();
            }
        }
        app.SMH.showToast({
            "title": warn
        })
        // return Promise.reject();
    })
}
//点赞
function likesReq() {
    let infoData = this.data.infoData || {};
    let pubInfo = infoData.pubInfo || {};
    return app.GrassApi.opSharePublishLike({
        data: {
            "pubId": this.options.id,
            "userToken": app.LM.userToken,
            "opType": pubInfo.isLikes ? 0 : 1,
            "brandCode": app.Conf.BRAND_CODE
        },
        other: {
            isShowLoad: true
        }
    }).then(e => {
        let warn = "操作失败";
        if (e.code == 1) {
            if (e.data == 1) {
                warn = pubInfo.isLikes ? "取消点赞" : "点赞";
                pubInfo.likes = pubInfo.isLikes ? pubInfo.likes - 1 : pubInfo.likes + 1;
                pubInfo.isLikes = !pubInfo.isLikes;
                infoData.pubInfo = pubInfo;
                this.setData({
                    infoData: infoData
                })
            }
        }
        app.SMH.showToast({
            "title": warn
        })
        // return Promise.reject();
    })
}
//关注
function followReq() {
    let infoData = this.data.infoData || {};
    let pubInfo = infoData.pubInfo || {};
    return app.GrassApi.opGrassRelation({
        data: {
            related_userId: pubInfo.pub_user_id,
            userToken: app.LM.userToken,
            brandCode: app.Conf.BRAND_CODE,
            opType: pubInfo.isFocuse ? 0 : 1
        },
        other: {
            isShowLoad: true
        }
    }).then(e => {
        let warn = "操作失败";
        if (e.code == 1) {
            if (e.data == 1) {
                warn = pubInfo.isFocuse ? "取消关注" : "已关注";
                pubInfo.isFocuse = !pubInfo.isFocuse
                infoData.pubInfo = pubInfo;
                this.setData({
                    infoData: infoData
                })
            }
        }
        app.SMH.showToast({
            "title": warn
        })
    })
}
//评论点赞
function commentLikesReq(comment_id = 0) {
    let parentsComments = this.data.parentsComments || {};
    return app.GrassApi.op_SharePubCommnet_Like({
        data: {
            "pubId": Number(this.options.id || 0),
            "commentId": comment_id,
            "opType": parentsComments[comment_id].isSelfLike == 1 ? 0 : 1,
            "userToken": app.LM.userToken,
            "brandCode": app.Conf.BRAND_CODE
        },
        other: {
            isShowLoad: true
        }
    }).then(e => {
        let warn = "操作失败";
        if (e.code == 1) {
            if (e.data == 1) {
                warn = parentsComments[comment_id].isSelfLike == 1 ? "取消点赞" : "点赞";
                parentsComments[comment_id].likes = parentsComments[comment_id].isSelfLike ? parentsComments[comment_id].likes - 1 : parentsComments[comment_id].likes + 1;
                parentsComments[comment_id].isSelfLike = !parentsComments[comment_id].isSelfLike;
                this.setData({
                    parentsComments: parentsComments
                })
            }
            // console.log('====new parentsComments', this.data.parentsComments)
        }
        app.SMH.showToast({
            "title": warn
        })
        // return Promise.reject();
    })
}
//
function aLLCommentList() {
    return app.GrassApi.get_Pub_Grass_ALLCommentList({
        params: {
            brandCode: app.Conf.BRAND_CODE,
            pubId: this.options.id || 0,
            pageIndex: this.page || 1,
            pageSize: 1,
            userToken: app.LM.userToken
        },
        other: {
            isShowLoad: false
        }
    }).then(res => {
        if (res.code == 1) {
            const data = res.data || {};
            const records = data.records || 0;
            let listTemp = [];
            listTemp = [].concat(data.data || []);
            console.log('原数据:', listTemp);
            let parentObj = {};
            let childObj = {};
            listTemp.forEach((item, index) => {
                if (item.Level == 0) {
                    parentObj[item.comment_id] = item;
                    parentObj[item.comment_id].showAll = false;
                    parentObj[item.comment_id].current_value = '';
                    let customData = {
                      level: item.Level,
                      name: item.real_name,
                      is_reply: item.is_reply,
                      commentId: item.comment_id,
                      isLikes: item.isSelfLike
                    }
                    parentObj[item.comment_id].customData = customData;
                } else {
                    item.current_value = '';
                    if (!childObj.hasOwnProperty(item.parent_comment_id)) {
                        childObj[item.parent_comment_id] = []
                    }
                    childObj[item.parent_comment_id].push(item)
                }
            })
            let comment_detail_info = {};
            for (let item in parentObj) {
                comment_detail_info = parentObj[item] || {};
            }
          console.log(parentObj,"parentObj");
            this.setData({
                parentsComments: parentObj,
                childComments: childObj,
                records: records,
                comment_detail_info: comment_detail_info,
            })
            console.log('parentsComments', this.data.parentsComments)
            console.log('childComments', this.data.childComments)
        }

    }).finally(() => {
        this.isLoading = false;
    })
}
//
function publish_comment() {
    return app.GrassApi.publish_Commnet({
        data: {
            userToken: app.LM.userToken,
            brandCode: app.Conf.BRAND_CODE,
            pubId: this.options.id || 0,
            parentCommentId: this.data.current_parent_id || 0,
            CommnetContent: this.data.search_value || ''
        },
        other: {
            isShowLoad: true
        }
    }).then(res => {
        console.log('评论成功', res);
        app.SMH.showToast({
            "title": '发表成功，过审后显示',
            duration:2500
        })
        this.setData({
            filter: false
        })
        this.commentId = '';
        this.parentsId = '';
        this.level = 0;
        this.num = 0;
        this.reply = false;
        aLLCommentList.call(this);
    })
}
//删除发布
function delPublish() {
    let infoData = this.data.infoData || {};
    let pubInfo = infoData.pubInfo || {};
    return app.GrassApi.delPublish({
        data: {
            "pubIds": pubInfo.pub_id,
            "userToken": app.LM.userToken,
            "brandCode": app.Conf.BRAND_CODE
        },
        other: {
            isShowLoad: true
        }
    }).then(e => {
        if (e.code == 1) {
            app.SMH.showToast({
                "title": "删除成功",
                "duration": 3000
            })
            wx.navigateBack({
                fail() {
                    wx.navigateTo({
                        url: '/pages/micro_mall/seeding_grass/my_publish/my_publish',
                    })
                }
            })
            return;
        } else {
            app.SMH.showToast({
                "title": "操作失败"
            })
        }
    })
}

function osShowEvent() {
    loadData.call(this, 'infoData');
    loadData.call(this, 'related');
    loadData.call(this, 'reCommend');
    aLLCommentList.call(this);
    this.pageHome = this.pageHome || this.selectComponent("#pageHome")
    this.pageHome.initPageHome();
}
//检测登录
function checkLogin() {
    return app.LM.getUserTokenAsync(true).then(data => {
        if (data.userToken) {
            return Promise.resolve();
        }
        return Promise.reject();
    });
}
//
function listen() {
    osShowEvent.call(this);
    if (app.LM.isLogin) {
        this.setData({
            isLogin: app.LM.isLogin
        });
        return;
    }
    this.listenLoginStatuId = app.EB.listen("LoginStateChange", () => {
        this.setData({
            isLogin: app.LM.isLogin
        });
        osShowEvent.call(this);
    });
}

function unListen() {
    app.EB.unListen("LoginStateChange", this.listenLoginStatuId);
}
 