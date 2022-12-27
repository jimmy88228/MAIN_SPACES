// pages/main/staff-module/repository/goods/index.js
import WxApi from "../../../../../common/utils/wxapi/index";
const App = getApp();
Page(App.BP({   
    data: {
        goodsInfo:{},
        isEdit:false,
    },
    onLoad(options){
        this.options = options;
        let isEdit = options.isEdit==1,goodsInfo={};
        isEdit && (goodsInfo = JSON.parse(decodeURIComponent(options.goodsInfo||'{}')))
        this.setData({
            isEdit,
            goodsInfo
        })
        console.log('goodsInfo',goodsInfo)
    },
    onInput(e){
        let key = this.getDataset(e,'key');
        let value = e.detail && e.detail.value; 
        this.setData({
            [`goodsInfo.${key}`]:value
        })
    },
    onAddImg(){
        let goodsInfo = this.data.goodsInfo||{};
        let goodsImgs = goodsInfo.goodsImgs||[];
        let count = 9 - goodsImgs.length;
        return WxApi.chooseMedia({
            count,
            mediaType:'image',
        }).then(res=>{
            console.log('res',res)
            let tempFiles = res&&res.tempFiles||[];
            goodsImgs = goodsImgs.concat(tempFiles.map(item=>item.tempFilePath||''));
            this.setData({
                'goodsInfo.goodsImgs':goodsImgs
            });
            console.log('goodsInfo',this.data.goodsInfo)
        })
    },
    save(){
        if(this.options.fromType == 'activity'){
            App.StorageH.set('curSetGoodsInfo',{activity_id:this.options.activity_id||0,goodsInfo:this.data.goodsInfo});
            wx.navigateBack();
        }else{

        }
    },
})) 
