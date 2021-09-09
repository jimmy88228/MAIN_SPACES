// components/mp-module/mp-input/mp-input.js
const app = getApp();
Component(app.BTAB({
    externalClasses: ['ext-input-class','ext-placeholder-class'],
    properties: {
        placeholder:{
            type:String,
            value:""
        },
        placeholderStyle:{
            type:String,
            value:""
        },
        type:{
            type:String,
            value:"text"
        },
        setFocus:{
            type:Boolean,
            value:false
        },
        setBlur:{
            type:Boolean,
            value:false
        },
        password:{
            type:Boolean,
            value:false
        },

    },
    data: {
        searchKey:"searchText",
        searchText:"",
    },
    methods: {
        handleInput(e){
            // console.log(e);
            let value = e.detail.value;
            let key = this.getDataset(e,'key');
            this[key] = value;
            this.triggerEvent('handleInput',value);
        },
        getInput(e){
            return this[this.data.searchKey];
        },
        setInput(searchText){
            this[this.data.searchKey] = searchText;
            this.setData({
                searchText
            })
        },
        handleFocus(){
            this.triggerEvent('handleFocus');
        },
        handleBlur(){
            this.triggerEvent('handleBlur');
        },
    }
}))
