// pages/main/staff-module/activity/cps/goods-list/index.js
const App = getApp();
Component(App.BC({ 
    options: {
        addGlobalClass: true,
    },
    properties: {
        list:{
            type:Array,
            value:[]
        },
        inited:{
            type:Boolean,
            value:false
        },
        activity_id:{
            type:String,
            value:""
        }
    },
    data: {
        msgList:[{
            key:"goods_name",
            name:"商品名称",
        },{
            key:"sale_price",
            name:"抢购价格",
        },{
            key:"goods_number",
            name:"抢购数量",
        },{
            key:"goods_sn",
            name:"商品款号",
        }]
    },
    methods: {
        addGoods(){
            this.jumpAction(`/pages/main/staff-module/repository/goods/index?activity_id=${this.properties.activity_id}&fromType=activityAdd`);
        },
        editGoods(e){ 
            let goodsInfo = this.getDataset(e,'item')||{}; 
            console.log('goodsInfo',goodsInfo);
            let goods_gallery = goodsInfo.goods_gallery||[];
            goodsInfo.goodsImgs = goods_gallery.length<=0?[goodsInfo.goods_img]:goods_gallery;
            // let transData = encodeURIComponent(JSON.stringify(goodsInfo));
            this.jumpAction(`/pages/main/staff-module/repository/goods/index?activity_id=${this.properties.activity_id}&isEdit=1&fromType=activity&goodsId=${goodsInfo.goods_id||0}`);
            // this.jumpAction(`/pages/main/staff-module/repository/goods/index?goodsInfo=${transData}&activity_id=${this.properties.activity_id}&isEdit=1&fromType=activity&goodsId=${goodsInfo.goods_id||0}`);
        },
        onImport(){
            if(!this.properties.activity_id){
                App.SMH.showToast({title:"请先保存活动"})
                return
            }
            this.jumpAction(`/pages/main/staff-module/repository/index?fromType=activity&activity_id=${this.properties.activity_id||0}`);
        },
        sortTap(e){
            let dataset = this.getDataset(e)||{};
            let {index,tap} = dataset;
            let list = this.data.list||[];
            let temp=JSON.parse(JSON.stringify(list[index]||{}));
            if(tap == 'top'){ 
                list.splice(index,1);
                list.unshift(temp);
            }else{
                let changeIndex = tap == 'up' ? index - 1 : index + 1; 
                list[index] = JSON.parse(JSON.stringify(list[changeIndex]));
                list[changeIndex] = temp;
            }
            this.triggerEvent('change',{list});
        }
    }
}))
