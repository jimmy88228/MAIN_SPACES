// components/comments/comments.js
const app = getApp();
Component(app.BTAB({ 
  
  options: {
    addGlobalClass: true,
  },
  properties: { 
  },
  data: {

  },
  ready(){
    let brand_info = this.data.brand_info || {};
    let start_icon_active = brand_info.icon_url + "micro_mall/comment/start_icon_active.png";
    let start_icon = brand_info.icon_url + "micro_mall/comment/start_icon.png";
    this.setData({
      start_icon_active,
      start_icon
    })
  },
  methods: {
    initData(goodsId){
      this.goods_id = goodsId||0;
      loadCommentData.call(this,goodsId) 
    },
    
    handleShowBigImg: function (e) {
      const itemIndex = e.target.dataset.itemindex;
      const imgIndex = e.target.dataset.imgindex;
      let list = this.data.commentList||[];
      this.setData({
        showBigImg: true,
        bigImgList: list[itemIndex].imgList,
        bigImgIndex: imgIndex
      });
      wx.previewImage({
        current:list[itemIndex].imgList[imgIndex],
        urls: this.data.bigImgList,
      })
    },

    jump_comment: function (e) {
      wx.navigateTo({
        url: `/pages/micro_mall/comment/goods_comment_list/goods_comment_list?goods_id=${this.goods_id}`,
      })
    },
  }
}))

function loadCommentData (goodsId) {
  return app.GoodsApi.getGoodsCommentListOnline({
    params: {
      goodsId: goodsId||"",
      pageIndex: 1,
      pageSize: 2,
      brandCode: app.Conf.BRAND_CODE
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == "1") {
      let data = e.data;
      if (!data) return Promise.reject();
      let commentData = data;
      commentData.comment_list.forEach((item) => {
        item.score = handleScore.call(this,item.comment_level);
        let imgList = [];
        for (let index = 1, len = 10; index < len; index++) {
          let key = `img${index}_path`;
          if (item[key]) {
            imgList.push(item[key]);
          }
          delete item[key];
        }
        item.imgList = imgList;
      });
      //
      this.setData({
        favCommentRatio: +commentData.fav_comment_ratio * 100 + '%',
        commentList: commentData.comment_list
      });
      this.triggerEvent('commentEvent', this.data.commentList && this.data.commentList.length>0)
      return Promise.resolve(e);
    }
  })
}

function handleScore(level) {
  let score = [true, true, true, true, true];
  for (let index = 0, len = score.length; index < len; index++) {
    if (index >= level) {
      score[index] = false;
    } else {
      score[index] = true;
    }
  }
  return score;
}