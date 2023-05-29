var app = getApp();
Page(app.BP({
    data: {
        brand_info: app.globalData.brand_info,
        goods_id: 0,
        commentList: [],
        bigImgList: [],
        bigImgIndex: 0,
        showBigImg: false,
        favCommentRatio: '100%',
        pageIndex: 1,
        eachPageNum: 10,
        maxPage: 1024,
    },

    onLoad: function(options) {
        this.options = options;
        let start_icon_active = this.data.brand_info.icon_url + "micro_mall/comment/start_icon_active.png";
        let start_icon = this.data.brand_info.icon_url + "micro_mall/comment/start_icon.png";
        this.setData({
            goods_id: options.goods_id || "20901",
            start_icon: start_icon,
            start_icon_active: start_icon_active,
        });
    },

    onShow: function() {
        this.loadCommentData(this.data.goods_id, this.data.pageIndex);
    },

    onReachBottom: function() {
        this.loadCommentData(this.data.goods_id, this.data.pageIndex);
    },

    handleScore(level) {
        let score = [true, true, true, true, true];
        for (let index = 0, len = score.length; index < len; index++) {
            if (index >= level) {
                score[index] = false;
            } else {
                score[index] = true;
            }
        }
        return score;
    },

    loadCommentData: function(goodsId, pageIndex) {
        if (this.data.pageIndex > this.data.maxPage) {
            app.SMH.showToast({
                "title": "已经到底啦！"
            })
            return;
        }
        return app.CL_GoodsApi.getGoodsCommentListOnline({
            params: {
                goodsId: goodsId,
                pageIndex: pageIndex,
                pageSize: app.Conf.PAGE_SIZE,
            },
            other: {
                isShowLoad: true
            }
        }).then(e => {
            let data = e.data;
            let commentData = data;
            commentData.comment_list.forEach((item) => {
                let imgList = [];
                item.score = this.handleScore(item.comment_level);
                for (let index = 1, len = 10; index < len; index++) {
                    const key = `img${index}_path`;
                    if (item[key]) {
                        imgList.push(item[key]);
                    }
                    delete item[key];
                }
                console.log('item.create_time', item.create_time)
                if (item.create_time) {
                    item.create_time = item.create_time.split(' ')[0].replace(/\//g,'-');
                }
                item.imgList = imgList;
            });

            this.setData({
                pageIndex: this.data.pageIndex + 1, // 递增数据页数
                maxPage: Math.ceil(commentData.allCount / this.data.eachPageNum),
                favCommentRatio: +commentData.fav_comment_ratio * 100 + '%',
                commentList: [...this.data.commentList, ...commentData.comment_list]
            });
        })
        // app.wxReq('', 'comment_getGetGoodsCommentListOnline', {
        //   'goods_id': goodsId,
        //   'page': pageIndex,
        //   'page_number': this.data.eachPageNum
        // }, (info) => {
        //   wx.hideLoading();
        //   if (info.error != 0) {
        //     wx.showToast({
        //       image: '/images/micro_mall/cn/err_tip_icon.png',
        //       title: info.message,
        //     });
        //     return;
        //   }
        //   const commentData = info.data;
        //   commentData.comment_list.forEach((item) => {
        //     let imgList = [];
        //     item.score = this.handleScore(item.comment_level);
        //     for (let index = 1, len = 10; index < len; index++) {
        //       const key = `img${index}_path`;
        //       if (item[key]) {
        //         imgList.push(item[key]);
        //       }
        //       delete item[key];
        //     }
        //     if (item.create_time){
        //       item.create_time = item.create_time.split(' ')[0];
        //     }
        //     item.imgList = imgList;
        //   });

        //   this.setData({
        //     pageIndex: this.data.pageIndex + 1, // 递增数据页数
        //     maxPage: Math.ceil(commentData.allCount / this.data.eachPageNum),
        //     favCommentRatio: +commentData.fav_comment_ratio * 100 + '%',
        //     commentList: [...this.data.commentList, ...commentData.comment_list]
        //   });
        // });
    },

    handleShowBigImg: function(e) {
        const itemIndex = e.target.dataset.itemindex;
        const imgIndex = e.target.dataset.imgindex;
        let bigImgList = this.data.commentList[itemIndex].imgList;
        let reg1 = new RegExp('//m', 'ig');
        let reg2 = new RegExp('images/comment/', 'ig');
        let reg3 = new RegExp('x200.jpg', 'ig')
        for (let i in bigImgList) {
            bigImgList[i] = bigImgList[i].replace(reg1, "//glimg");
            bigImgList[i] = bigImgList[i].replace(reg2, "");
            bigImgList[i] = bigImgList[i].replace(reg3, "");
        }
        this.setData({
            showBigImg: true,
            bigImgList: bigImgList,
            bigImgIndex: imgIndex
        });
    },

    handlehideBigImg: function() {
        this.setData({
            showBigImg: false,
        });
    },

}))