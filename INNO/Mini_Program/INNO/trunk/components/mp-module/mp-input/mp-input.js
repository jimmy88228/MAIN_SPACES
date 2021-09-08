// components/mp-module/mp-input/mp-input.js
const app = getApp();
Component(app.BTAB({
    externalClasses: ['ext-input-class','ext-placeholder-class'],
    properties: {
        placeholderProp:{
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
            console.log(e,key);
            let value = e.detail.value;
            let dataset = this.getDataset(e);
            let key = dataset.key || "";
            this[key] = value;
            this.triggerEvent('handleInput',value);
            // console.log(key,this[key]);
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
