import countDownTextHelp from '../../../common/helper/handle/countDownTextHelp.js';
import RunApi from "../../../common/helper/apiPackage.js"
const goodsSearch = {
  goodsCat:"CA",
  vat:"VA",
  goods:"goods",
  goodsBrand:"Brandcode"
}
function SwitchApi({code,setting,data,index,extend,sr_t,Limit_S,bindType}) {
  code = code || '', setting = setting || {}, data = data || {}, index = index || 0,extend=extend||{};
  let api = '',url = '',params = {},extra = {},m='GET';
  let initMsg = {goApi:false,data:[],hide:false,apiParams:{api, url, params, extra, m}};
  let p = new Promise((rs, rj) => {
    try{
      switch (code) { //1~12 初始化参数
        case 'text':
        case 'video':
        case 'richText':
        case 'textScroll':
        case 'customerService':
        case 'imageTextNavigate':
          initMsg.data = setting;
          break;
        case 'imageAd':
          initMsg.data = setting;
          let images = setting.images;
          if(Array.isArray(images)){
            for(let i =0,len=images.length;i<len;i++){
              if(Array.isArray(images[i].poster_map)){
                mapData(images[i].poster_map,setting); //热点处理
              }
            }
          }
          break; 
        case 'goodsList':
          initMsg.goApi = true;
          api = 'CL_GoodsApi';
          url = 'getSearchGoodsListBySkip';
          initMsg.apiParams = initParamsNew(setting,code,initMsg.apiParams,extend);
          break; 
        default:
          initMsg.hide = true;
          break;
      }
    }catch(e){
      initMsg.hide = true;
      console.log('报错',e,initMsg)
    }


    if(code == 'text' || code == 'imageAd' || code == 'imageTextNavigate' || code ==  'richText' || code == 'video' || code == 'customerService'||code == 'textScroll'){ // || initMsg.hide
      initMsg.goApi = false;
      return rs(initMsg)
    }
    if (!params) {
      initMsg.goApi = false;
      initMsg.hide = true;
      return rs(initMsg);
    }
    return rs(initMsg);
  });
  return p;
}

function GetData(apiParams = {},code,i) {
    let tempData = [];
    let resExtra = {};
    let {api='',url='',params={},extra={},m="GET"} = apiParams;
    // console.log('调接口', i,api, url, params,m,apiParams);
    let p = new Promise((rs, rj) => {
      return RunApi.go(m,api, url, params, extra).then(res => { //对应模块换数据   //广告和轮播不用另外调接口，在case已经整理完毕 
        if(code == 'goodsList'){
          tempData =  res && res.data && res.data.goods_list || [];
          resExtra.data = tempData;
        } 
        // console.log('接口回来',i,code,tempData,res)
        return rs({data:tempData,resExtra});
      }).catch(e => {
        console.log('catch',e);
        // setEmpty({parseIndex,code,motion_data,hideModule});
        return rs([]);
      })
    });
    return p;
  }

module.exports = {
    SwitchApi: SwitchApi,
    GetData: GetData,
} 

function initParamsNew(setting,code,apiParams,extend={}){
  if(code == 'goodsList'){
    apiParams.api = "CL_GoodsApi";
    apiParams.extra = {diy:true};
    let goodsGroup = [],goodsList = [],ids,goodsListType, index=extend&&extend.index||0;
    if(Array.isArray(setting.goodsGroup)){
      goodsGroup = setting.goodsGroup||[];
      goodsList = goodsGroup[index].goodsList||[];
      goodsListType = goodsGroup[index].goodsListType;
      ids = mapGoodsList(goodsList) || [];
      if(goodsSearch[goodsGroup[index].goodsListType] == 'goods'){
        apiParams.url = "getALLGoodsListByGoodsIds";
        apiParams.m = "POST";
        apiParams.params = {
           goodsIdList : ids
        }
      }else{
        apiParams.url = "getSearchGoodsListBySkip";
        ids = ids.join(',');
        apiParams.params = {
          functype: goodsSearch[goodsListType] || 'CA',
          catId: goodsListType != 'goodsBrand' ? ids : 0,
          strAttrId: '',
          strAttrValue: '',
          colorCatId: 0,
          startPrice: -1,
          endPrice: -1,
          strWhere: '',
          pageSize: 1000,
          pageIndex: 1,
          skipCount: setting.skip || 0,
          sortField: 'DEFAULT',
          sortBy: 'desc',
          goods_brand_ids: goodsListType == 'goodsBrand' ? ids : 0,
          storeId: '0',
        }
      }
    } 
  }
  return apiParams
}

function mapData(data = [],setting) { //热点处理
  if(setting.type == 't2'){ //暂时只有一行一个
    setting.row = 1;
  }
  let row = setting.row;
  data.forEach((item, i) => {
    item.x = transMnPx(item.map_x)/row;
    item.w = transMnPx(item.map_width)/row;
    item.h = transMnPx(item.map_height)/row; 
    item.y = transMnPx(Math.abs(item.map_y) - item.map_height)/row; 
  })
}

function checkTime(activityInfo={},type) { //ok
  activityInfo = activityInfo || {};
  let result = countDownTextHelp.getCustomSkTimeMsg(activityInfo,type);
  result = result || {};
  // console.log('time文案文案', result,activityInfo,type);
  return result
}  

function transMnPx(data){
  return (data*750)/600;
}

function mapGoodsList(arr=[],type){
  let result = [];
  for(let i = 0,len=arr.length;i<len;i++){
    result.push(arr[i].id);
  }
  return result
}