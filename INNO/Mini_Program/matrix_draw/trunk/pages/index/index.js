import LM from "../../common/manager/login-manager";
const app = getApp();
const initPath = '../../static/images/draw/content_gif.gif';
// const initPath = 'https://devimgtest.innourl.com/wechat_applet_image/icon/default/content_gif.gif';
Page.BasePage({
    data:{
        // extraH:0,
        randomNum:'',
        showType:"",
    },
    onLoad(options) {
        console.log('getImageInfo',this.data.init)
        let randomNum = '' + new Date().getTime(); 
        this.showFst = true;
        this.initPath = initPath; 
        this.setData({
            content1:initPath + '?' + randomNum,
            content2:initPath + '?' + randomNum + 1,
        }); 
        // wx.downloadFile({
        //     // src: '/static/images/draw/content2.gif',
        //     // src: '../../static/images/draw/content2.gif',
        //     // src: '../../static/images/draw/content2.gif',
        //     url: 'https://devimgtest.innourl.com/wechat_applet_image/icon/default/content_gif.gif',
        //     success:res=> {
        //       console.log(res,'resres');
        //       this.initPath = initPath || res.tempFilePath;
        //       this.setData({
        //         content:initPath || res.tempFilePath,
        //         // content:'https://devimgtest.innourl.com/wechat_applet_image/icon/default/content_gif.jpg'
        //         // content:res.path
        //       }); 
        //     },
        //     complete:res=>{
        //       console.log(res,'resres2');
        //       this.setData({
        //         showRefresh: false,
        //         isLogin:app.LM.isLogin
        //       }); 
        //     }
        // })
    }, 
    onReady() { 
        this.setData({
            isAttached: true,
            showRefresh: true, 
        }); 
        setTimeout(() => {
            this.setData({
                showRefresh: false, //没有gif的时候可以关闭refresh
                isLogin:app.LM.isLogin
            });
        }, 1000);
    }, 
    loaded(e){
        console.log('loaded',e)
        if(this.data.showRefresh){
            if(this.initLoaded){
                this.setData({
                    init:false,
                    showRefresh:false
                })
            }
            this.initLoaded = true; 
        }
    },
    draw(){
        this.listenClose = true;
        if(app.clickHold("draw",2000)){
            if(this.showFst){
                this.showFst = false;
                this.setData({
                    showType:'first',
                })
            }else{
                this.showFst = true;
                this.setData({
                    showType:'second',
                })
            }
            wx.nextTick(()=>{
                this.draw_result = this.draw_result || this.selectComponent("#draw_result"); 
                setTimeout(() => {
                    this.setData({
                        showfilter:true,
                    })
                    wx.nextTick(()=>{
                        this.draw_result && this.draw_result._show();
                    })
                }, 950);
            })
        }
    },
    close(){
        console.log('close')
        if(!this.listenClose)return
        let randomNum = '' + new Date().getTime(); 
        let _data = {};
        if(this.data.showType == 'first'){
            _data.content1 = this.initPath + '?' + randomNum;
        }else{
            _data.content2 = this.initPath + '?' + randomNum;
        }
        this.setData({
            ..._data,
            showType:"",
            clickActive:false,
            showfilter:false
        })
    },
})