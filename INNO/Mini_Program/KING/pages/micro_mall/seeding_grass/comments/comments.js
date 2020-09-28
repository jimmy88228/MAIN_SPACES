// pages/micro_mall/seeding_grass/comments/comments.js
const app = getApp();
Page(app.BP({
    data: {
        current_focus: false,
        search_value: '',
        current_parent_id: 0,
        placeholder_value: '',
        parentsComments: [],
        // parentsComments: {},
        childComments: {},
        none: false,
        isLogin: app.LM.isLogin
    },
    page: 1,
    hasMore: true,
    isLoading: false,
    onLoad: function(options) { 
        this.options = options;
        let grass_like = this.data.brand_info.icon_url + "micro_mall/seed_grass/grass_like.png";
        let grass_like_active = this.data.brand_info.icon_url + "micro_mall/seed_grass/grass_like_active.png";
        this.setData({
            grass_like: grass_like,
            grass_like_active: grass_like_active,
        })
        listen.call(this)
        loadData.call(this);
    }, 
    onUnload(){
        unListen.call(this)
    },
    handle_scroll(e) {
        loadData.call(this);
    },
    handle_showAll(e) {
        let dataset = e.currentTarget.dataset || {};
        let commentId = dataset.commentId || 0;
        let commentNum = dataset.commentNum || 0;  
        this.data.parentsComments[commentNum].showAll = !this.data.parentsComments[commentNum].showAll
        this.setData({
            parentsComments: this.data.parentsComments
        })
    },
    handle_confirm(e) {
        if (!this.data.isLogin) {
            return
        }
        if(this.button_loading){
            return
        }
        loadingCheck.call(this);
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
        if (!this.data.isLogin) {
            return
        }
        let dataset = e.currentTarget.dataset || {};
        let type = e.type || '';
        let valueType = dataset.valueType || '';
        let value = e.detail.value || '';
        if (type == 'input' && valueType) {
            if (this.reply) {
                if (this.level == 0) {
                    this.data.parentsComments[this.commentNum].current_value = value;
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
    handle_login_bottom(e) {
        // checkLoginFn.call(this).then(res => { 
            
        // });
        this.handle_focus(e);
    },
    handle_login_reply(e) {
        // checkLoginFn.call(this).then(res => { 
        //     this.handle_focus(e);
        // });
      this.handle_focus(e);
    },
    handle_login_like(e) {
        if(this.button_loading){
            return
        }
        loadingCheck.call(this);
        this.handle_like(e);
        // checkLoginFn.call(this).then(res => { 
        //     this.handle_like(e);
        // });
    },


    handle_focus(e) {
        if (!this.data.isLogin) {
            return
        }
        console.log(e);
        let detail = e.detail || {};
        let is_reply = detail.is_reply;
        if (is_reply == 0) { 
            return
        } 
        let parentsId = detail.parentsId || 0;
        let commentId = detail.commentId || 0;
        if (commentId == this.commentId) {
            console.log('重复点击', commentId);
            this.setData({
                current_focus: true,
            })
            return
        }
        let level = detail.level;
        let num = detail.num || 0;
        let name = detail.name || '';
        let commentNum = detail.commentNum || 0;
        let reply = '回复:' + name;
        // console.log(this.data.childComments, commentId, this.data.childComments[commentId])
        let value = level == 0 ? this.data.parentsComments[commentNum].current_value : level == 1 ? this.data.childComments[parentsId][num].current_value : '';
        this.parentsId = parentsId;
        this.commentId = commentId;
        this.commentNum = commentNum;
        this.level = level;
        this.num = num;
        this.reply = name ? true : false;
        this.setData({
            current_focus: true,
            current_parent_id: commentId,
            placeholder_value: name ? reply : '',
            search_value: value || ''
        })
        console.log('评论parent id:', this.data.current_parent_id)
        console.log('评论内容缓存:', this.data.search_value)
    },
    handle_like(e) {
        if (!this.data.isLogin) {
            return
        }
        let detail = e.detail || {};
        let commentId = detail.commentId || 0;
        let commentNum = detail.commentNum || 0;
        likesReq.call(this, commentId, commentNum)
    }, 
}))

// function checkLoginFn() {
//     return app.LM.getUserTokenAsync(true).then(res => {
//         if (res.userToken) {
//             return Promise.resolve(res)
//         }
//         return Promise.reject();
//     })
// }

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
            isShowLoad: false
        }
    }).then(res => {
        console.log('评论发布成功', res);
        app.SMH.showToast({
            "title": '评论发布成功'
        })
        reset.call(this);
        loadData.call(this);
    })
}

function loadData() {
    if(!this.hasMore && this.page>1){
        app.SMH.showToast({
            title:"已经到底啦！"
        })
    }
    if (this.hasMore && !this.isLoading) {
        this.isLoading = true;
        return app.GrassApi.get_Pub_Grass_ALLCommentList({
            params: {
                brandCode: app.Conf.BRAND_CODE,
                pubId: this.options.id || 0,
                pageIndex: this.page || 1,
                pageSize: app.Conf.PAGE_SIZE,
                userToken: app.LM.userToken
            },
            other: {
                isShowLoad: true
            }
        }).then(res => { 
            if (res.code == 1) {
                const data = res.data || {};
                let listTemp = [];
                listTemp = [].concat(data.data || []);
                console.log('原数据:', listTemp);
                let parentObj = JSON.parse(JSON.stringify(this.data.parentsComments || [])) || []; 
                let childObj =  JSON.parse(JSON.stringify(this.data.childComments||{})) || {};
                listTemp.forEach((item, index) => {
                    if (item.Level == 0) {
                        item.showAll = false;
                        item.current_value = '';
                        let customData = {
                          level: item.Level,
                          name: item.real_name,
                          is_reply: item.is_reply,
                          commentId: item.comment_id,
                          commentNum:index
                        }
                        item.customData = customData;
                        parentObj.push(item);
                        // parentObj[item.comment_id] = item;
                        // parentObj[item.comment_id].showAll = false;
                        // parentObj[item.comment_id].current_value = '';
                    } else {
                        item.current_value = '';
                        if (!childObj.hasOwnProperty(item.parent_comment_id)) {
                            childObj[item.parent_comment_id] = []
                        }
                        childObj[item.parent_comment_id].push(item)
                    }
                })
                this.setData({
                    parentsComments: parentObj,
                    childComments: childObj,
                    none: data.records == 0,
                })
                this.hasMore = this.page * app.Conf.PAGE_SIZE < data.records;
                this.page += 1;
                console.log('parentsComments', this.data.parentsComments);
                console.log('childComments', this.data.childComments);
                return Promise.resolve(res);
            }
            return Promise.reject();
        }).finally(() => {
            this.isLoading = false;
        }).catch(()=>{
            this.isLoading = false;
        })
    }
}

//点赞
function likesReq(commentId = 0, commentNum) {
    if (!this.data.isLogin) {
        return
    }
    let parentsComments = this.data.parentsComments || {};
    console.log('点赞', commentId, ',', parentsComments)
    return app.GrassApi.op_SharePubCommnet_Like({
        data: {
            "pubId": Number(this.options.id || 0),
            "commentId": commentId,
            "opType": parentsComments[commentNum].isSelfLike == 1 ? 0 : 1,
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
                warn = parentsComments[commentNum].isSelfLike == 1 ? "取消点赞" : "点赞";
                parentsComments[commentNum].likes = parentsComments[commentNum].isSelfLike ? parentsComments[commentNum].likes - 1 : parentsComments[commentNum].likes + 1;
                parentsComments[commentNum].isSelfLike = !parentsComments[commentNum].isSelfLike;
                this.setData({
                    parentsComments: parentsComments
                })
            }
        }
        app.SMH.showToast({
            "title": warn
        })
        // return Promise.reject();
    })
}

function listen() {
    if (app.LM.isLogin) {
        this.setData({
            isLogin: app.LM.isLogin
        })
        return
    }
    this.login_EB_Id = app.EB.listen("LoginStateChange", () => {
        this.setData({
            isLogin: app.LM.isLogin
        })
        loadData.call(this);
    })
}

function unListen() {
    app.EB.unListen("LoginStateChange", this.login_EB_Id);
}
  
function reset() {
    this.page = 1;
    this.isLoading = false;
    this.hasMore = true;
    this.commentId = 0;
    this.commentNum = 0;
    this.parentsId = 0;
    this.level = 0;
    this.num = 0;
    this.reply = false;
    this.data.parentsComments = [];
    this.data.childComments = {};
    this.setData({ 
        search_value: '',
        placeholder_value: '',
        current_parent_id:0, 
    })
}



function loadingCheck() {
    if (!this.button_loading) {
        this.button_loading = true;
        this.buttonLoadId = setTimeout(() => {
            clearTimeout(this.buttonLoadId);
            this.button_loading = false;
        }, 500)
    }
}
