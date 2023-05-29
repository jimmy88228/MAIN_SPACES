// components/form-models/input-drop-down/input-drop-down.js
const app = getApp();
const defaultStyle = { //默认样式
    "box-width":"460rpx",
    "fold-height":"56rpx",
    "unfold-height":"256rpx",
    "item-height":"50rpx"
};
Component(app.BTAB({
    properties: {
        styleModels:{ //设置样式
            type:Object,
            value:{},
        },
        vocabulary:{
            type:Array,
            value:[]
        },
        userSelect:{
            type:Object,
            value:{}
        },
        inputActive:{
            type:Boolean,
            value:true
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
        }
    }, 
    methods: {
        handleInput(e){
            this.triggerEvent('handleInput',e);
        },
        scrollToLower(e){
            this.triggerEvent('scrolltolower',e);
        },
        handleFocus(e){
            this.setFocus(true);
            this.triggerEvent('handleFocus',e);
        },
        selectItem(e){
            this.triggerEvent('selectItem',e);
        }, 
        handleToggle(){
            this.setFocus(!!!this.data.focus);
        },
        setInput(value){
            this.mpInput || (this.mpInput = this.selectComponent('#mpInput'));
            this.mpInput.setInput(value);
        },
        setFocus(focus){
            this.setData({focus});
        }
    }
}))