// pages/component/micro-page/items/notice/notice.js
const app = getApp();
const baseH = 70;
Component(app.BTAB({
  properties: {
    m_item:{
      type:Object,
      value:{},
      observer:function(n,o){
        n && n.bindType && this.init(n);
      }
    }, 
    m_index: {
      type: Number,
      value: 0,
    },
    img_url: {
      type: String,
      value: '',
    },
    page_module_list: {
      type: Object,
      value: {}
    },
  },
  attached(){
    this.readyed = true;
  },
  ready(){
    setNoticeW.call(this);
  },
  data: {
    playMode:{}, 
    currentSwiper: 0,
    screenWidth:app.SIH.screenWidth,
  },
  methods: {
    init(_data){
      console.log('init',_data)
      this.setData({
        _data, 
      })
      setNoticeW.call(this);
    }, 
    toogle: function (e) {
      this.setData({
        currentSwiper: e.detail.current
      });
    },
    onTap(e){
      let dataset = e.currentTarget.dataset||{};
      let type = 'more';
      if(type== 'more'){
        let _data = this.data._data||{};
        let showName = _data.activityTitleName && _data.activityTitleName.replace(/<br>/g,'\n') || ""; //转换
        app.StorageH.set('NOTICE',showName||"");
        wx.navigateTo({
          url: '/pages/micro_mall/notice/more/more',
        })
      }
    }
  }
}))
function setNoticeW(){
  let data = this.data._data||{};
  if(!data.bindType || this.isInited)return
  this.isInited = true;
  let noticeImg = this.data.brand_info.default_icon_url + "notice.png";
  let noticeText = data.activityTitleName || "";
  let place = data.moduleStyles == '9' || data.moduleStyles == '10'?'  ':'\n'
  noticeText = noticeText.replace(/<br>/g,place); //转换
  console.log('noticeText',noticeText)
  let baseW = data.showMore == '1' ?'270':'305';  
  this.setData({
    noticeImg,
    noticeText,
    baseW,
  })
   this.nextTickTask().then(()=>{
    let className = data.moduleStyles == '9' || data.moduleStyles == '10' ? '.text_size_test' : '.text_size_test_ver'
    this._getQuery(className).then(res=>{
      let info = res[0],time=10,median=0;
      if(data.moduleStyles == '9' || data.moduleStyles == '10'){ //水平
        median = info.width||0;
        data.moduleStyles == '10' && median < baseW && (median=baseW);
        time = Math.max(parseFloat((median / baseW).toFixed(2)) * 10,10);
      }else if(data.moduleStyles == '11' || data.moduleStyles == '12'){ //垂直
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