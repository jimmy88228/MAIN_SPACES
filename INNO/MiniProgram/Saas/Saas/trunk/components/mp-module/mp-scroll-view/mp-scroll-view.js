// components/mp-module/mp-scroll-view/mp-scroll-view.js
const app = getApp();
Component(app.BTAB({
    externalClasses: ['ext-scroll-view'],
    properties: {
        scrollType:{
            type:String,
            value:"y"
        },
        boxStyle:{
            type:String,
            value:""
        },
        setScroll:{
            type:Boolean,
            value:false
        }
    },
    data: {

    },
    methods: {
        scroll(e){
            this.triggerEvent('scroll',e);
        },
        scrollToLower(e){
            this.triggerEvent('scrolltolower');
        },
        scrolltoupper(e){
            this.triggerEvent('scrolltoupper');
        },
        refresherrefresh(e){
            this.triggerEvent('refresherrefresh');
        },
    }
}))
