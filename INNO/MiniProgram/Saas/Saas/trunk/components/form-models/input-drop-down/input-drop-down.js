// components/form-models/input-drop-down/input-drop-down.js
const app = getApp();
const defaultStyle = { //默认样式
    "box-width":"460rpx",
    "fold-height":"56rpx",
    "unfold-height":"256rpx",
    "item-height":"50rpx"
};
Component(app.BTAB({
    options:{
        styleIsolation:'apply-shared'
    },
    properties: {
        styleModels:{ //设置样式
            type:Object,
            value:{},
        },
        vocabulary:{
            type:Array,
            value:[]
        },
        inputActive:{
            type:Boolean,
            value:true
        },
        setUnfold:{
            type:Boolean,
            value:false
        },
        disabled:{
            type:Boolean,
            value:false
        },
        placeholder:{
            type:String,
            value:"请输入"
        },
        emptyText:{
            type:String,
            value:""
        },
        fromType:{
            type:String,
            value:""
        }
    },
    observers:{
        'styleModels':function(n,o){
            n && this.setData({
                _styleModels : {
                    ...defaultStyle,
                    ...n,
                }
            })
        }
    },
    data: {
        _styleModels:{
            ...defaultStyle
        },
        searchText:""
    }, 
    methods: {
        handleInput(e){
            this.setData({searchText:e&&e.detail||""})
            this.triggerEvent('handleInput',e);
        },
        scrollToLower(e){
            this.triggerEvent('scrolltolower',e);
        },
        handleFocus(e){
            this.setFocus(true);
            this.triggerEvent('handleFocus',true);
        },
        selectItem(e){
            this.triggerEvent('selectItem',e);
        }, 
        handleToggle(e){
            this.setFocus(!!!this.data.focus);
            this.triggerEvent('handleToggle',this.data.focus);
        },
        setInput(value){
            this.mpInput || (this.mpInput = this.selectComponent('#mpInput'));
            this.mpInput.setInput(value);
        },
        setFocus(focus){
            if(!this.data.setUnfold)return
            this.setData({focus});
        },
        getInput(e){
            this.mpInput || (this.mpInput = this.selectComponent('#mpInput'));
            return this.mpInput && this.mpInput.getInput() || "";
        },
        handleTap(e){
            this.triggerEvent('handleTap',e);
        }, 
    }
}))