// components/mp-module/mp-video/mp-video.js
const app = getApp();
Component(app.BTAB({ 
    externalClasses: ['ext-video-class'],
    properties: {
        src:{
            type:String,
            value:"",
        },
        controls:{
            type:Boolean,
            value:true,
        },
        poster:{
            type:String,
            value:"",
        },
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {

    }
}))
