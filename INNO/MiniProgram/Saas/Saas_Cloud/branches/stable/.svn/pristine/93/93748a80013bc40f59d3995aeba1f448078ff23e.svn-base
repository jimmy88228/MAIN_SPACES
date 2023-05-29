// components/micro-page/items/advertise/advertise.js
const app = getApp();
import mcBehavior from '../../../help/mc-behavior.js'
Component(app.BTAB({
  behaviors: [mcBehavior],
  properties: {
    dt:{
      type:Object,
      value:{},
      observer:function(n,o){
        n && this.init(n);
      }
    },
    extraInfo:{
      type:Object,
      value:{}, 
    },
    autoShow: {
      type: Boolean,
      value: false
    },
    isLogin: {
      type: Boolean,
      value: false
    },
  },
  attached(){
    this.isAttached = true;
    this.queryInfo = {};
  },
  data: {
    screenWidth:app.SIH.screenWidth,
    curTab:0,
  },
  ready(){
  },
  methods: {
    init(_data){
      let imagesGroup = _data.imagesGroup && _data.imagesGroup[this.data.curTab];
      let curTab = this.data.curTab||0;
      this.getCompContainerSize().then(res => {
        const containerWidth = (res.width * ((750 / app.SIH.screenWidth) || 2)) || 750;
        this.trimData(_data,imagesGroup, containerWidth); //热点处理
        this.setData({
          _data,
          showTab:_data.imagesGroup && _data.imagesGroup.length>1 && _data.code != 'userCard'
        })
        if(this.properties.autoShow){
          this.loadData();
        }
      })

      // if(_data.imagesGroup[curTab].images.length>5 && _data.type == 't1'){
      //   _data.row = 5; //一行5个
      //   _data.open_slide = true; //轮播
      // }
    },
    loadData(data){
      this.setData({
        isInited:true
      });
      let _data = this.data._data||{};
      let curTab = this.data.curTab||0;
      if(_data.code == 'userCard' || (_data.type == 't1' && !_data.open_slide)){
        this.mcItemRefresh();
      }else{ //swiper 先不刷新
        this.swiperId = this.swiperId || this.selectComponent("#swiperId");
        this.swiperId.loadData(_data.imagesGroup[curTab].images);
      }
    },
    onTap(e){
      let detail = e&&e.detail||{};
      let type = detail.type||"";
      if(type == 'tab'){
        let curTab = detail.curTab||0;
        this.setData({
          curTab
        })
      }
    },
    imgLoad(){}
  }
}))
