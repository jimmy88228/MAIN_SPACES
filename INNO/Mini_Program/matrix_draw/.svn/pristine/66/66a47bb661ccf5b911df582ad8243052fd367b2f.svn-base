const app = getApp(); 
import WxParse from '../../../../../wxParse/wxParse.js'
Page(app.BP({
    data: {

    },
    onLoad: function (options) {
        console.log('options',options);
        this.agreement = options.agreement||'';
        this.agreement = decodeURIComponent(this.agreement);
        this.setData({
            agreement: this.agreement 
        })
        WxParse.wxParse('article', 'html', this.agreement, this, 0); 
    },

}))