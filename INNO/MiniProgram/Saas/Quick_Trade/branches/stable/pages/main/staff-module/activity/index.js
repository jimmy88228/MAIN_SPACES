// pages/main/staff-module/activity/index.js
const App = getApp();
import DateUtils from "../../../../common/utils/date/index.js"
Page(App.BP({
    data:{
        acInfo:{},
        goodsList:[],
        inited:false,
        dateString:"",
        setting:false,
        acGoodsInfo:{},
        domainPath:""
    },
    onShow(){
        this.checkSet();
    }, 
    onLoad(){ 
      this.setView({ 
        goodsListRef: { get: () => this.findView("#goods-list") }, 
      })
      this.loadData();
    },
    loadData(){
        return this.getActivityNoCachDetail().then(()=>{
            return this.activityGoodsInfo().catch((e)=>{
              this.setData({inited:true,acGoodsInfo:{}});
              return Promise.reject(e)
            });
        });
    }, 
    checkSet(){
        if(this.data.inited){
            let curSetGoodsInfo = App.StorageH.get('curSetGoodsInfo') || {}; 
            let curGetGoodsList = App.StorageH.get('curGetGoodsList') || {}; 
            let acGoodsInfo = this.data.acGoodsInfo||{};
            console.log('checkSet 外面',curSetGoodsInfo,curGetGoodsList,acGoodsInfo);
            if(curGetGoodsList.activity_id && (curGetGoodsList.activity_id == acGoodsInfo.activity_id)){ //商品导入
                let goodsList = curGetGoodsList.goodsList||[]; 
                let domainPath = curGetGoodsList.domainPath||[]; 
                goodsList = goodsList.filter(item=>item.isSelected).map(item=>{
                    return {
                        ...item,
                        insert:1,
                        goods_number:"", 
                        sale_price:"",

                        min_price:0,
                        max_price:0,
                        min_market_price:item.market_price,
                        max_market_price:item.market_price,
                        goods_gallery:item.galleryList||[],
                    }
                })
                acGoodsInfo.goods_Infos = this.listConcat(goodsList);
                this.setData({acGoodsInfo,domainPath},()=>this.setScrollTop(0));
                App.StorageH.remove('curGetGoodsList')
            }
            if(curSetGoodsInfo.activity_id && (curSetGoodsInfo.activity_id == acGoodsInfo.activity_id)){ //编辑、新增商品
                let goodsInfo = curSetGoodsInfo.goodsInfo||{},isAdd=false;
                let index = acGoodsInfo.goods_Infos.findIndex(item=>item.goods_id == goodsInfo.goods_id);
                if(index>-1 || (goodsInfo.isAdd)){
                  if(goodsInfo.isAdd){
                        goodsInfo.goods_img = goodsInfo.goodsImgs[0] || "";
                        acGoodsInfo.goods_Infos.unshift(goodsInfo);
                        isAdd = true;
                        delete goodsInfo.isAdd;
                  }else{
                      goodsInfo.insert=0; 
                      goodsInfo.goods_img = goodsInfo.goodsImgs && goodsInfo.goodsImgs[0] || goodsInfo.goods_img || "";
                      acGoodsInfo.goods_Infos[index] = goodsInfo
                  }
                  this.setData({acGoodsInfo},()=>isAdd && this.setScrollTop(0));
                  App.StorageH.remove('curSetGoodsInfo')
                }
            }
        }
    },
    listConcat(list){
        let acGoodsInfo = this.data.acGoodsInfo||{};
        let goodsList = JSON.parse(JSON.stringify(acGoodsInfo.goods_Infos||[]));
        let ids = goodsList.map(item=>item.goods_id);
        goodsList.unshift(...(list.filter(item=>!ids.includes(item.goods_id))));
        return goodsList;
    },
    getActivityNoCachDetail(){ 
        return getActivityNoCachDetail().then(res=>{
            if(res.code==1){
                let acInfo = res.data||{};
                acInfo.end_time_show = acInfo.status != 2 && acInfo.end_time || "";
                acInfo.start_time_show = acInfo.status != 2 && acInfo.start_time || "";
                this.setData({acInfo})
            }
            return res
        })
    },
    activityGoodsInfo(){
        let activityId = this.data.acInfo.id || 0;
        if(!activityId)return Promise.reject({code:-1,msg:"活动已失效"});
        return activityGoodsInfo({activityId:this.data.acInfo.id||0}).then(res=>{
            if(res.code==1){ 
                let acGoodsInfo = res.data||{};  
                acGoodsInfo.insertOrupdate = acGoodsInfo.goods_Infos.length>0 ? 1:0;
                acGoodsInfo.goods_Infos.forEach(item=>{
                  item.insert=0;
                  item.originate=true;
                })
                this.setData({acGoodsInfo,inited:true,domainPath:acGoodsInfo.img_domain});
                console.log('acGoodsInfo',this.data.acGoodsInfo)
                return res;
            }
            return Promise.reject(res)
          }).catch(e=>{
          return Promise.reject(e)
        })
    },
    activityGoodsUpdateOrInsert(id){
        let acGoodsInfo = JSON.parse(JSON.stringify(this.data.acGoodsInfo||{}));
        let goods_Infos = acGoodsInfo.goods_Infos||[];
        let goods_gallery = [];
        acGoodsInfo.goods_Infos=goods_Infos.map((item,index)=>{
          goods_gallery = goods_gallery.concat(item.goods_gallery);
          return {...item,sort:index}
        });
        console.log('activityGoodsUpdateOrInsert',{...acGoodsInfo,insertOrupdate:acGoodsInfo.insertOrupdate,goods_gallery,activity_id:id||0})
        return activityGoodsUpdateOrInsert({...acGoodsInfo,insertOrupdate:acGoodsInfo.insertOrupdate,goods_gallery,activity_id:id||0}).then(res=>{
            if(res.code==1){}
            return res
        })
    },
    setTime(){ 
        let acInfo = this.data.acInfo||{};
        let storeInfo = App.StoreH.storeInfo||{};
        let start_time = acInfo.start_time_show||"";
        let end_time = acInfo.end_time_show||"";
        let params = {
            ActityId: acInfo.id||0,
            start_time,
            end_time, 
            store_id: storeInfo.storeId||0,
        }
        return activityUpdateOrInsert(params)
    },
    checkSetTime(e){
      this._setPageLoading('checkSetTime');
      let acInfo = this.data.acInfo||{};
      let func = e.detail;
      if(!acInfo.id){
        this.checkValid(true);
        return this.setTime().then(res=>{
          if(res.code==1){
            return this.loadData().then(res=>{
              if(res.code==1){
                func && typeof(func) == 'function' && func(); //先保存再跳转
                return res;
              }
              return Promise.reject(res);
            })
          } 
          return Promise.reject(res);
        })
      }else{
        func && typeof(func) == 'function' && func();
      }
    },
    onTimeChange(e){
        let key = this.getDataset(e,'key')||"";
        this.setData({setting:true})
        let detail = e.detail||{}; 
        let dateString = detail.dateString||"";
        this.setData({[`acInfo.${key}`]:dateString})
    },
    save(){
        this._setPageLoading('save');
        this.checkValid();
        this.setTime().then(res=>{ //返回id
          console.log('setTime then',res)
          if(res.code==1){
            return this.activityGoodsUpdateOrInsert(res.data).then(res=>{
              if(res.code==1){
                return this.loadData().then(()=>{
                  App.SMH.showToast({title:"保存成功"});
                })
              }
              return Promise.reject(res);
            })
          }
          return Promise.reject(res);
        })
    },
    checkValid(onlyTime){ 
        let title = "",index = -1,acInfo = this.data.acInfo,acGoodsInfo=this.data.acGoodsInfo;
        let goods_Infos = acGoodsInfo.goods_Infos||[];
        if(!acInfo.start_time_show){
            title = '请先设置活动开始时间'; 
        } else if(!acInfo.end_time_show){
            title = '请先设置活动结束时间'; 
        } else if(DateUtils.parse(acInfo.end_time_show).getTime() <= DateUtils.parse(acInfo.start_time_show).getTime()){
          title = "结束时间不能早于开始时间"
        }else if(onlyTime){
          return
        }
        else if (goods_Infos.length<=0){
            title = '请先添加活动商品'; 
        } else { 
            goods_Infos.every((item,i)=>{
                index = i;
                !(item.sale_price>0 && item.goods_sn) && (title = item.sale_price>0?'请完善该商品的款号':'请完善该商品的秒杀价')
                return (item.sale_price>0 && item.goods_sn);
            }); 
        }
        if(title){
          if(index>-1){
            this.setScrollTop(index,true).then(()=>{
              App.SMH.showToast({title});
            });
          }else{
            App.SMH.showToast({title});
          }
          throw title
        }
    },
    setScrollTop(index,showErr=false){
      this.goodsListRef.setScrollTop(index,showErr)
      return Promise.resolve(true)
    },
    onChangeList(e){
        let detail = e.detail||{};
        let list = detail.list||[]; 
        this.setData({
            'acGoodsInfo.goods_Infos':list
        })
    },
    onDelete(e){
      let {index,goodsId} = e.detail||0,acGoodsInfo=this.data.acGoodsInfo; 
      this.deleteActivityGoods(goodsId).then(res=>{
        acGoodsInfo.goods_Infos.splice(index,1);
        this.setData({
          'acGoodsInfo.goods_Infos':acGoodsInfo.goods_Infos
        })
      })
    },
    deleteActivityGoods(goodsId){
      let params = {
        goodsId,
        activityId:this.data.acInfo.id||0
      };
      return deleteActivityGoods(params)
    },
    navClick(){
      let acGoodsInfo = this.data.acGoodsInfo||{};
      let goods_Infos = acGoodsInfo.goods_Infos||[];
      if(goods_Infos.length>0){
        let valid = goods_Infos.every((item)=>{
          return item.originate;
        });
        if(!valid){
          this._showModal({content:"存在未保存的商品,确定要返回吗"}).then(()=>{
            wx.navigateBack();
          });
          return
        }
      }
      wx.navigateBack();
    },

}))
function  getActivityNoCachDetail(){
    return App.Http.QT_GoodsApi.getActivityNoCachDetail({
        data:{},
    })
}
function  activityGoodsInfo(params){
    return App.Http.QT_GoodsApi.activityGoodsInfo({
        data:params||{},
    })
}

function activityUpdateOrInsert(params){
    return App.Http.QT_GoodsApi.activityUpdateOrInsert({
        data:params
    })
}

function activityGoodsUpdateOrInsert(params){
    return App.Http.QT_GoodsApi.activityGoodsUpdateOrInsert({
        data:params
    })
} 
function deleteActivityGoods(params){
    return App.Http.QT_GoodsApi.deleteActivityGoods({
        data:params
    })
} 