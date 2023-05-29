// components/micro-page/items/notice/notice.js
import mcBehavior from '../../../help/mc-behavior.js'
const app = getApp();
const baseH = 70; 
Component(app.BTAB({
  behaviors: [mcBehavior],
  properties: {
    dt:{
      type:Object,
      value:{},
      observer:function(n,o){
        if (n && comIsEnable(n)) this.init(n);
        else this.setData({isHidden: true})
      }
    },
    autoShow: {
      type: Boolean,
      value: false
    },
  },
  attached(){
    this.readyed = true;
  },
  data: {
    // playMode:{},
    // colorMap,
    // currentSwiper: 0,
    screenWidth:app.SIH.screenWidth,
  },
  methods: {
    init(_data){
      // let playMode = {};
      // if(_data && _data.option){
      //   if(_data.option.direction == '1'){
      //     playMode = playModeSel.vertical;
      //   }else{
      //     playMode = playModeSel.level;
      //   } 
      // }
      let option = _data.option||{};
      _data.showMore = 1;
      _data.directionType = option.direction == 2 || option.direction == 3 ? 'level':'vertical';
      _data.noticeText = getNoticeText(_data.textList);
      console.log('_data_data',_data)
      this.setData({
        _data,
      })
      setNoticeW.call(this,_data);
    },
    onTap(e){
      let dataset = e.currentTarget.dataset||{};
      let type = 'more';
      if(type== 'more'){
        let _data = this.data._data||{};
        let showName = _data.noticeText && _data.noticeText.replace(/<br>/g,'\n') || ""; //转换
        app.StorageH.set('NOTICE',showName||"");
        wx.navigateTo({
          url: '/pages/micro_mall/notice/more/more',
        })
      }
    },
    loadData(_data){
      this.setData({
        isInited:true
      })
      this.mcItemRefresh();
    },
    toogle: function (e) {
      this.setData({
        currentSwiper: e.detail.current
      });
    },
  }
}))

function setNoticeW(data){
  // let data = this.data._data||{};
  if(this.isInited)return
  this.isInited = true;
  let noticeImg = this.data.brand_info.default_icon_url + "notice.png";
  let noticeText = data.noticeText || "";
  let place = data.directionType == 'level' ?'  ':'\n'
  noticeText = noticeText.replace(/<br>/g,place); //转换
  console.log('noticeText',noticeText)
  let baseW = data.showMore == '1' ?'270':'305';  
  this.setData({
    noticeImg,
    noticeText,
    baseW,
  })
   this.nextTick().then(()=>{
    let option = data.option||{};
    let className = data.directionType == 'level' ? '.text_size_test' : '.text_size_test_ver'
    this._getQuery(className,'','component').then(res=>{
      console.log('resres',res)
      let info = res[0],time=10,median=0;
      if(!info)return
      if(data.directionType == 'level'){ //水平
        median = info.width||0;
        option.direction == 3 && median < baseW && (median=baseW);
        time = Math.max(parseFloat((median / baseW).toFixed(2)) * 10,10);
      }else if(data.directionType == 'vertical'){ //垂直
        median = info.height || 0;
        let minH = app.SIH.screenWidth*baseH/750;
        median < minH && (median=minH);
        time = parseFloat((median / minH).toFixed(2)) * 10;  
      } 
      this.setData({
        showNotice: true,
        noticeTextWH:median,
        noticeTextT:time,
      })
    });
  })
}


function getNoticeText(list=[]){
  let text = "";
  list.forEach(item=>{
    if(item.is_enable){
      text+=(item.text||"");
    }
  })
  return text
}

function comIsEnable(data = {}){
  let enabled = true;
  if (data.is_enable == 0) enabled = false
  else if (data.startTime && new Date() < new Date(data.startTime)) enabled = false
  else if (data.endTime && new Date() > new Date(data.endTime)) enabled = false
  return enabled
}