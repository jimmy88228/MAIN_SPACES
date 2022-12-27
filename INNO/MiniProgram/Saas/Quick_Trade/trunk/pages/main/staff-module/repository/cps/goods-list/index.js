const App = getApp();
Component(App.BC({  
    options:{
        addGlobalClass:true
    },
    properties: {
        goodsList:{
            type:Array,
            value:[]
        },
        isSelect:{
            type:Boolean,
            value:false
        }
    }, 
    data: {
        isSelectAll:false,
        selectNum:0
    },
    observers:{
        goodsList:function(nV,oV) {
            if(nV && Array.isArray(nV) && nV.length>0){
                let isSelectAll = true,selectNum=0;
                nV.forEach(item=>{
                    isSelectAll && (isSelectAll = item.isSelected);
                    item.isSelected && (selectNum += 1);
                }); 
                this.setData({isSelectAll,selectNum})
            }
        }     
    },
    /**
     * 组件的方法列表
     */
    methods: {
        onSelect(e){
            let goodsList = this.properties.goodsList||[];
            let item = this.getDataset(e,'item')||{};
            let index = this.getDataset(e,'index')||0;
            item.isSelected = !!!item.isSelected; 
            console.log('onSelect',item,goodsList) 
            this.triggerEvent('onSelect',{index,item});
        },
        selectAll(){
            let goodsList = this.properties.goodsList||[];
            goodsList.forEach(item=>{
                item.isSelected = !this.data.isSelectAll;
            })
            this.triggerEvent('onSelectAll',{goodsList});
        },
        save(e){
            let goodsList = this.properties.goodsList||[];
            this.triggerEvent('save',{goodsList})
        }
    }
}))
