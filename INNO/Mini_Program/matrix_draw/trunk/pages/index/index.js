const app = getApp();
Page.BasePage({
    data: {
        extraH:0
    },
    onLoad: function (options) {
        this.options = options; 
        this.setData({ 
            isAttached: true,
            showRefresh: true, 
        })
    },
    onReady() { 
        app.LM.login(true).ignore(() => {
            this.checkLoginChange();
            this.setData({
                showRefresh: false 
            });
            setTimeout(() => {
                this.mcPage = this.mcPage || this.selectComponent("#mcPage");
                this.mcPage.getPageData(this.options);
            }, 300);
        })
    }, 
    onChange(e){
        console.log(e);
        this.value = e.detail.value || "";
    },
    jump(e){ 
        wx.navigateTo({
          url: `/pages/matrix/matrix?activityId=${this.value || 18}`,
        })
    },
    onPageScroll(e) { 
        this.mcPage = this.mcPage || this.selectComponent("#mcPage");
        this.mcPage.handle_scroll(e&&e.scrollTop);
    }, 
})
 
 