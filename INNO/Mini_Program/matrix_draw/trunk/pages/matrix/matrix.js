const app = getApp();
Page.BasePage({
    data: {
        
    },
    onLoad: function (options) {
        this.options = options; 
        this.options.activityId = this.options.activityId || 13;
        this.setData({ 
            isAttached: true,
            showRefresh: true, 
        })
    },
    onReady() { 
        app.LM.login(true).ignore(() => {
            setTimeout(() => {
                this.checkLoginChange();
                this.setData({
                    showRefresh: false 
                });
                this.draw_box = this.draw_box || this.selectComponent("#draw_box");
                this.draw_box._onShow(this.options);
            }, 500);
        })
    },
    onUnload() {
        this.draw_box.onUnload();
    },
    onShareAppMessage: function () {
        this.draw_box = this.draw_box || this.selectComponent("#draw_box"); 
        let shareInfo = this.draw_box.getShareInfo();
        return {
            title: "活动分享",
            path:`/pages/matrix/matrix?activityId=${this.options.activityId}`,
            ...shareInfo
        };
    },
    getMsg(e){
        let msg = e && e.detail||{};
        this.setData({
            msg
        })
    }
})
 
 