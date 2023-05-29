const app = getApp();
Page(app.BP({
  data: {
    article: {}
  },
  onLoad: function (options) {
    this.options = options;
  },
  onReady: function () {

  },
  onShow: function () {
    init.call(this).then(res=>{
      wx.setNavigationBarTitle({
        title: res || "协议详情"
      })
      getAgreetArticle.call(this);
    })
  },
}))

function getAgreetArticle() {
  if(!this.options.articleId) return;
  return app.UserApi.getUserAgreementArticle({
    params: {
      brandCode: app.Conf.BRAND_CODE,
      articleId: this.options.articleId
    },
    other: {
      isShowLoad: true
    }
  }).then(res => {
    if (res.code == 1) {
      this.setData({
        article: res.data || {}
      })
      return Promise.resolve(res.data);
    }
    return Promise.reject();
  })
}

function init() {
  let title = "协议详情";
  let type = this.options.type||"";
  if (type){
    title = (type == "USER_RIGHT" || type == "REDPACK") ? "权益详情" : "协议详情";
    return app.UserApi.getUserAgreement({
      params: {
        brandCode: app.Conf.BRAND_CODE,
        agreementType: type
      },
      other: {
        isShowLoad: true
      }
    }).then(res => {
      if (res.code == 1) { 
        let data = res.data || {};
        let child_article = data.child_article && data.child_article[0] || {}
        this.options.articleId =  child_article.article_id || 0
        if((data.article_title || data.article_content) && !child_article.article_id){
          title = data.article_title;
          this.setData({
            article: data
          })
        }
        return Promise.resolve(title);
      }
      return Promise.reject();
    }) 
  }else{
    return Promise.resolve(title);
  }
}