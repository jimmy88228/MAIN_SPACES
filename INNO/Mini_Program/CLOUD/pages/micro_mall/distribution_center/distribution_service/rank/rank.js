// pages/micro_mall/distribution_center/distribution_service/rank/rank.js
import CheckUpdateTimer from "../../../../../helper/manager/check-update-timer"; 
const app = getApp();
Page(app.BP({
  data: {
    rankList:[],
    high_light: "#FF770A",
    cur_time: 0,
    cur_select: 0,
    show_sel_box:false,
    empty:false, 
    options: ["全部销售", "所在门店"],
    timeList: ["历史", "昨日", "本周", "本月"],
    u_rank_info: ["当前排名", "销售额"]
  },
  page: 1,
  hasMore: true,
  isLoading: false,
  onLoad: function (options) {
    tipVisit.call(this);
    loadData.call(this);
  },
  onShow: function () {
  },
  paging(e){
    if(!this.isLoading && this.hasMore){
      loadData.call(this);
    }  
  },
  onTap(e){
    let dataset = e.currentTarget.dataset||{};
    console.log(dataset,'dataset');
    let type = dataset.type || "";
    let onlySet = dataset.onlySet || false;
    let fn = false;
    if(type == 'selectShow'){
      setAnim.call(this,this.data.show_sel_box); 
    }else if(type == 'selectTime'){
      let cur_time = dataset.index ||0; 
      if(this.data.cur_time == cur_time)return
      this.setData({
        cur_time
      });
      fn = true;
    }else if(type == 'selectOption'){
      let cur_select = dataset.index ||0; 
      this.onTap({currentTarget:{dataset:{type:"selectShow",index:this.data.cur_time},onlySet:true}});
      if(this.data.cur_select == cur_select)return
      this.setData({
        cur_select, 
      }); 
      fn = true; 
    }
    if(fn && !onlySet){
      throttle.call(this,500,()=>{
        reset.call(this);
        loadData.call(this);
      })
    }
  }
}))

function loadData() {
  this.isLoading = true;
  let params = {
    type: this.data.cur_time || 0,
    pageIndex: this.page || 1,
    pageSize: app.Conf.PAGE_SIZE,
    isStore:this.data.cur_select
  }
  return app.RunApi.go('DistributionApi', 'getStaffDstbRankReport', params).then(res => {
    if (res.code == 1) {
      let data = res.data || {};
      let rankInfo = data.rankInfo || {};
      // rankInfo.last_rank = 10;
      rankInfo.showChange = rankInfo.curr_rank > 0 && rankInfo.last_rank > 0;
      rankInfo.change = rankInfo.showChange ? parseInt(rankInfo.last_rank - rankInfo.curr_rank) : 0;
      rankInfo.changeVal = Math.abs(rankInfo.change);
      let rankList = data.rankList || [];
      rankList.forEach(item=>{
        item.order_amount = (parseFloat(item.order_amount)).toFixed(2);

      })
      let empty = (this.page == 1 && rankList.length ==0);
      this.hasMore = (this.page * app.Conf.PAGE_SIZE) < (rankInfo.total_count || 0);
      this.page += 1;
      console.log('hasmore',this.hasMore,this.page * app.Conf.PAGE_SIZE,rankInfo.total_count)
      this.setData({
        rankInfo,
        rankList:[...this.data.rankList,...rankList],
        empty,
        userInfo:app.globalData.staffSimpleIno||{}
      })
      return Promise.resolve(res)
    }
    return Promise.reject(res)
  }).finally(()=>{
    this.isLoading = false;
  })
}

function reset() {
  this.page = 1;
  this.hasMore = true;
  this.isLoading = false;
  this.data.rankList = [];
}

function setAnim(bool=false,type=""){
  if(!bool){
    this.setData({
      show_sel_box : true
    });
    setTimeout(()=>{
      this.setData({
        show_sel_op:true
      })
    },100)
  }else{
    this.setData({
      show_sel_op:false
    });
    setTimeout(()=>{
      this.setData({
        show_sel_box : false
      })
    },100)
  }
}

function throttle(time = 350,fn){
  this.troId && clearTimeout(this.troId);
  this.troId = setTimeout(()=>{
    fn && typeof (fn) == "function" && fn();
  },time)
}

function tipVisit(){
  CheckUpdateTimer.updateTimer("staffRankTip");
}

