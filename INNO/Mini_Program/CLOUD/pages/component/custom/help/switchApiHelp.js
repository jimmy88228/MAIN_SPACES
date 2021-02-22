import countDownTextHelp from '../../../../helper/handle/countDownTextHelp.js';
import Conf from "../../../../conf";
import LM from "../../../../helper/manager/login-manager";
import RunApi from "../../../../helper/manager/apiPackage.js"
import MyDate from '../../../../support/utils/date-util.js';
import StrH from "../../../../helper/handle/strHandle.js"; 
const LIMIT_SORTS = 5;
function SwitchApi({bindType,data,index,extend,sr_t,Limit_S}) {
  bindType = bindType || 0, data = data || {}, index = index || 0,extend=extend||{};
  let api = '',url = '',params = {},extra = {};
  let initMsg = {goApi:true,data:[],hide:false,apiParams:{api, url, params, extra}};
  let p = new Promise((rs, rj) => {
    switch (bindType) { //1~12 初始化参数
      case 1:
        try {
          api = 'GoodsApi';
          url = 'getALLGoodsListByGoodsIds';
          params = initParams({bindType,index,sr_t,data:data.moduleItem && data.moduleItem.itemList || []});
          if (!params || !params.goodIds) {
            initMsg.hide = true;
          };
        } catch (e) {
          initMsg.hide = true;
        }
        break;
      case 2:
        try {
          api = 'GoodsApi';
          url = 'getSearchGoodsListBySkip';
          params = initParams({bindType,index,data,Limit_S});
        } catch (e) {
          initMsg.hide = true;
        }
        break;
      case 3:
      case 13:
        try {
          let s_ad = data && data.moduleItem && data.moduleItem.itemList || [];
          /*对热点数据处理*/
          if (s_ad.length > 0) {
            mapData(s_ad);
          }
          initMsg.data = s_ad;
        } catch (e) {
          initMsg.hide = true;
        }
        break;
      case 4:
        try {
          let carousel_ad = data && data.moduleItem && data.moduleItem.itemList || [];
          if (carousel_ad.length > 0) {
            mapData(carousel_ad);
          }
          initMsg.hide = carousel_ad.length <= 0;;
          initMsg.data = carousel_ad;
        } catch (e) {
          initMsg.hide = true;
        }
        break;
      case 7:
        try {
          api = 'GoodsApi';
          let listItem = data.detail_list && data.detail_list[extend.index || 0] && data.detail_list[extend.index || 0] || {};
          if (listItem.activity_show_type == 'auto') {
            url = 'getSumaryALLGoodsList'; //自动获取 页数
          } else if (listItem.activity_show_type == 'manual') {
            url = 'getSeckillGoodList'; //手动获取 goods_id
          } else {
            initMsg.hide = true;
            // console.log('异常,不能初始化params',index,bindType,data)
          }
          params = initParams({sr_t,index, bindType, data, extend}); 
          extra = { diy: true };
        } catch (e) {
          console.log(e)
          initMsg.hide = true;
        }
        break;
      case 8:
        try {
          api = 'CollageApi';
          url = 'getCollageGroupGoodsList';
          extra = {
            diy: true
          }
          params = initParams({index, bindType, data, extend});
        } catch (e) {
          initMsg.hide = true;
        }
        break;
      case 9:
        try {
          api = 'SecKillApi';
          let listItem = data.detail_list && data.detail_list[extend.index || 0] && data.detail_list[extend.index || 0] || {};
          if (data.moduleStyles == "8") {
            let itemList = data && data.moduleItem && data.moduleItem.itemList || [];
            initMsg.data = itemList;
            if (itemList.length > 0) {
              return rs(itemList)
            } else {
              initMsg.hide = true;
            }
          } else {
            if (listItem.activity_show_type == 'auto') {
              url = 'getGoodsList'; //自动获取 页数
            } else if (listItem.activity_show_type == 'manual') {
              url = 'getGoodsList'; //手动获取 goods_id
            }
            params = initParams({sr_t,index, bindType, data, extend});  //jimmy0 时间轴
            extra = {
              diy: true
            }
          }

        } catch (e) {
          console.log(e)
          initMsg.hide = true;
        }
        break;
      case 10:
        try {
          api = 'PreSaleApi';
          url = 'getPresaleGoodsList';
          extra = {
            diy: true
          }
          params = initParams({index, bindType, data, extend});
        } catch (e) {
          initMsg.hide = true;
        }
        break;
      case 11:
        try {
          api = 'PointApi';
          url = 'getPointMkGoodsList';
          extra = {
            diy: true
          }
          params = initParams({index, bindType, data, extend});
        } catch (e) {
          initMsg.hide = true;
        }
        break;
      case 12:
        try {
          api = 'BargainApi';
          url = 'getHagglePriceActivityList';
          params = initParams({index, bindType, data, extend});
        } catch (e) {
          initMsg.hide = true;
        }
        break;
      case 14:
        try {
          api = 'GoodsApi';
          url = 'getValidGoodsPackageList';
          params = initParams({index, bindType, data, extend});
        } catch (e) {
          initMsg.hide = true;
        }
        break;
      default:
        initMsg.hide = true;
        break;
    }
    if(bindType == 3 || bindType == 4 || bindType == 13 || initMsg.hide){
      initMsg.goApi = false;
      // if(bindType == 3 || bindType == 4){
        // initMsg.data = motion_data[parseIndex];
        // return rs(motion_data[parseIndex]);
      // }
      // return rs([])
      return rs(initMsg)
    }
    if (!params) {
      initMsg.goApi = false;
      if (bindType != 7) { //params异常,隐藏模块
        initMsg.hide = true;
        //setEmpty({parseIndex,bindType,motion_data,hideModule});
        // return rs([]);
      } else { //params异常,特殊处理秒杀  jimmy ?
        console.log('params异常,特殊处理秒杀 ?')
        // let acId = data.detail_list[extend.index || 0].activity_id || '0';
        // motion_data[parseIndex] = motion_data[parseIndex] || {};
        // motion_data[parseIndex][acId] = [];
        // return rs([]);
      }
      return rs(initMsg);
    }
    initMsg.apiParams = {api,url,params,extra};
    return rs(initMsg);  

  });
  return p;
}

function GetData(apiParams = {},bindType,i) {
    let tempData = [];
    let resExtra = {};
    let {api='',url='',params={},extra={}} = apiParams;
    // console.log('调接口', i,api, url, params);
    let p = new Promise((rs, rj) => {
      return RunApi.go(api, url, params, extra).then(res => { //对应模块换数据   //广告和轮播不用另外调接口，在case已经整理完毕
        if (bindType == 1) { //单品
          tempData = res.data && res.data.goodsList || [];
        } else if (bindType == 2 || (bindType == 7 && url == 'getSumaryALLGoodsList')) { //分类、秒杀
          tempData = res.data && res.data.goods_list || [];
        } else if (bindType == 8 || (bindType == 7 && url == 'getSeckillGoodList')) { //拼团、手动添加的秒杀
          tempData = res && res.data || [];
        } else if (bindType == 9) { //助力秒杀
          tempData = res && res.data && res.data.list || [];
        } else if (bindType == 10) { //预售
          tempData = res && res.data && res.data.dataList || [];
        } else if (bindType == 11) { //积分
          tempData = res && res.data && res.data.list || [];
        } else if (bindType == 12) { //砍价
          tempData = res && res.data && res.data.dataList || [];
        } else if (bindType == 14) { //砍价
          tempData = res && res.data && res.data.dataList || [];
        }
        // let name = bindType == 1 ? '单品' : bindType == 2 ? '分类' : bindType == 7 ? '秒杀' : bindType == 8 ? '拼团' : '其他' + bindType;
        // console.log('接口回来',i,bindType,name, tempData)
        if (bindType == 1 || bindType == 2) {
          for (let i = 0, len = tempData.length; i < len; i++) {
            tempData[i].salesVolumeStr = StrH.numberCarryBit(tempData[i].salesVolume);
          }
          // motion_data[parseIndex] = tempData;
          // _tag = res.data.goodsTagList || [];
          resExtra.data = res.data;
          // tagSortFnc.call(_tag, _path, bindType, res);
        } else if (bindType == 7) {
          // tempData && tempData.length<=0 && console.log('接口返回 秒杀数据空', index, bindType,res,motion_data[parseIndex]);
        } else if (bindType == 8 || bindType == 10 || bindType == 11 || bindType == 12) { //还没和秒杀合并数据结构 另外处理倒计时
        
        } else if (bindType == 9) {
          tempData.forEach(item => {
            item.percent = getPercent(item.inventoryRemnant, item.inventory);
          })
        }
        return rs({data:tempData,resExtra});
      }).catch(e => {
        console.log(e);
        // setEmpty({parseIndex,bindType,motion_data,hideModule});
        return rs([]);
      })
    });
    return p;
  }

module.exports = {
    SwitchApi: SwitchApi,
    GetData: GetData,
}

function initParams({index = 0, bindType = 0, data = {}, extend = {},sr_t,Limit_S}) { //传参初始化  SwitchApi 函数用到
  let params = {};
  if (bindType == 7) {
    data.dt_list_init = data.dt_list_init || {};
    if (!data.dt_list_init[data.moduleId] && data.detail_list) { //时间轴初始化
      data.dt_list_init[data.moduleId] = true;
      sortBy(data.detail_list);
      trimTime(data.detail_list,sr_t,bindType); 
      // console.log(data.moduleId, '时间轴', data.detail_list);
    }
    let listItem = data.detail_list && data.detail_list[extend.index || 0] || {};
    let dataIds = listItem.activity_show_type == 'auto' ? '' : listItem.dataIds || '';
    let dataIds_len = dataIds && typeof dataIds == 'string' && dataIds.split(',').length || 1;
    let pageSize = listItem.activity_show_type == 'auto' ? listItem.show_number || MAX_READ : dataIds_len;
    if (!dataIds && listItem.activity_show_type == 'manual') {
      return false
    }
    if (dataIds) {
      params = { //手动
        issueId: listItem.activity_id || 0,
        goodsIds: dataIds,
        pageSize: pageSize || Conf.PAGE_SIZE,
        pageIndex: 1,
      }
    } else {
      params = { //自动
        functype: 'SK',
        strWhere: '',
        sort_field: 'goods_id',
        sort_by: 'desc',
        goods_brand_ids: '',
        cate_Id: listItem.activity_id || 0,
        pageSize: pageSize || Conf.PAGE_SIZE,
        pageIndex: 1,
      }
    }
  } else if (bindType == 9) {
    data.ass_list_init = data.ass_list_init || {};
    if (!data.ass_list_init[data.moduleId] && data.detail_list) { //时间轴初始化
      data.ass_list_init[data.moduleId] = true;
      sortBy(data.detail_list);
      trimTime(data.detail_list,sr_t,bindType,data); 
      // console.log(data.moduleId,'时间轴', data.detail_list);
    }
    let listItem = data.detail_list && data.detail_list[extend.index || 0] || {};
    let dataIds = listItem.activity_show_type == 'auto' ? '' : listItem.dataIds || '';
    let dataIds_len = dataIds && typeof dataIds == 'string' && dataIds.split(',').length || 1;
    let pageSize = listItem.activity_show_type == 'auto' ? listItem.show_number || MAX_READ : dataIds_len;
    if (!dataIds && listItem.activity_show_type == 'manual') {
      return false
    }
    if (dataIds) {
      params = { //手动
        issueId: listItem.activity_id || 0,
        activityId: listItem.activity_id || 0,
        goodsIds: dataIds,
        pageSize: pageSize || Conf.PAGE_SIZE,
        pageIndex: 1,
      }
    } else {
      params = { //自动
        activityId:listItem.activity_id || 0,
        pageSize: pageSize || Conf.PAGE_SIZE,
        pageIndex: 1,
      }
    }
  }else if (bindType == 8 || bindType == 10 || bindType == 11|| bindType == 12) {
    let arr = data && typeof data.collageGroupActivityIds == 'string' && data.collageGroupActivityIds.split(',') || [];
    let pageSize = data.activityShowType == 'auto' ? data.pageSize || MAX_READ : arr.length || Conf.PAGE_SIZE;
    params = {
      pageSize:pageSize,
      pageIndex: 1,
      activityIds:data.collageGroupActivityIds || ""
    }
  } else if (bindType == 2) {
    params = {
      functype: data.catType || 'CA',
      catId: data.catId || 0,
      strAttrId: '',
      strAttrValue: '',
      colorCatId: 0,
      startPrice: -1,
      endPrice: -1,
      strWhere: '',
      pageSize: data.pageSize < Limit_S ? data.pageSize : data.moduleStyles != '4' ? Limit_S : data.pageSize,
      pageIndex: 1 || data.pageIndex || 1,
      skipCount: data.skip || 0,
      sortField: 'goods_id',
      sortBy: 'desc',
      goods_brand_ids: '',
      storeId: '0',
    }
  } else if (bindType == 1) {
    let goodsIds = [];
    data.forEach(item => {
      if (item.goods_id) {
        goodsIds.push(item.goods_id)
      }
    })
    let ids = goodsIds.join(',');
    if (ids) {
      params = {
        goodIds: ids
      }
    }
  }else if(bindType == 14){
    params = {
      activityIds: data.collageGroupActivityIds,
      searchStr:"",
      pageIndex:1,
      pageSize:data.pageSize,
      // brandCode:Conf.BRAND_CODE,
    }
  }
  return params
}

function mapData(data = []) { //热点处理
  data.forEach((item, index) => {
    let extend_content = item.extend_content || "";
    let func_type = item.func_type || "";
    
    item.customData = {
      func_type: func_type,
      related_id: item.related_id || '',
      link_url: item.link_url,
      stringJump: extend_content,
      tag: item.rd_tag || item.tag,
      goods_id: item.goods_id,
      page_id: item.page_id
    }
    if (extend_content && func_type == "RD") {
      let map_data = extend_content.replace(/'/g, '"');
      map_data = JSON.parse(map_data);
      for (let k in map_data) {
        map_data[k].x = map_data[k].x * 100;
        map_data[k].y = map_data[k].y * 100;
        map_data[k].w = map_data[k].ex * 100 - map_data[k].x;
        map_data[k].h = map_data[k].ey * 100 - map_data[k].y;
      }
      item.map_data = map_data;
    }
  })
}

function checkTime(activityInfo={},type) { //ok
  activityInfo = activityInfo || {};
  let result = countDownTextHelp.getCustomSkTimeMsg(activityInfo,type);
  result = result || {};
  // console.log('time文案文案', result,activityInfo,type);
  return result
}


function getPercent(inven = 0, invenSum = 0) { //ok
  let percent = (invenSum == 0) ? 0 : inven / invenSum >= 1 ? 100 : inven / invenSum > 0.01 ? parseInt(((inven / invenSum) * 100).toFixed(2)) : parseFloat((inven / invenSum) * 100);
  percent = percent > 0 && percent < 1 ? 1 : percent;
  return percent;
}


function sortBy(data) {
  if(!data)return;
  data = data.sort((a, b) => {
    if (a.sort > b.sort) {
      return 1
    };
    if (a.sort < b.sort) {
      return -1
    };
    if (a.sort == b.sort) {
      return 0
    };
  });
} 

function trimTime(data,sr_t,bindType,moduleList={}) {
  let now_t = MyDate.parse(sr_t);
  data.forEach(item => {
    if(bindType == 7){
      let start_t = MyDate.parse(item.begin_time);
      let end_t = MyDate.parse(item.end_time);
      if (end_t <= now_t) {
        item.status = "已结束";
      } else if (now_t < start_t) {
        item.status = "敬请期待";
      } else if (now_t < end_t) {
        item.status = "正在疯抢";
      } else {
        item.status = "敬请期待";
      }
    }else if(bindType == 9){
      if (now_t < MyDate.parse(item.begin_time)){
        item.state = 1;
      } else if (now_t >= MyDate.parse(item.end_time)) {
        item.state  = 4;
      } else if (now_t < MyDate.parse(item.begin_time2)) {
        item.state  = 2;
      } else {
        item.state  = 3;
      }
      let act_info = {
        state:item.state,
        rtime:item.begin_time,
        stime:item.begin_time2,
        etime:item.end_time,
        serverTime:sr_t
      }
      let check = checkTime(act_info, moduleList.showActivityTime); //返回倒计时文案对象
      item.status = check.text || "";
      if (check.timeDown) {
          // endTime = check.etime || 0;
          item.countDown = true;
          item.timeDown = 1;
        }else {
        item.timeDown = 0;
        item.showDate = check.time;
      }
    } 
  })
}