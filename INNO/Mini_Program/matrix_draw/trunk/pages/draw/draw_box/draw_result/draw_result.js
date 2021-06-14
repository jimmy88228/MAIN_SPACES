// pages/draw/draw_result/draw_result.js
import {
  createBehavior
} from "../../../../components/window/anim-helper";
const app = getApp();
const anim = {
  enterTo: "transition: all 300ms ease-in-out;opacity: 1;",
  leaveTo: "opacity: 0; transition: all 300ms ease-in-out;",
  duration: 300
}
const SUM = 24; //奖品池大小
const IMG_BOX_W = 214; //基础盒子宽高
Component({
  behaviors: [Behavior.BaseBehavior, createBehavior(anim)],
  properties: {
    // lotteryInfo: {
    //     type: Object,
    //     value: {},
    //     observer(nV, oV){
    //         console.log(nV,"lotteryInfo");
    //         this.setData({
    //             _lotteryInfo: nV
    //         });
    //     }
    // },
    activityId: {
      type: Number,
      value: 0,
      observer(nV, oV) {
        this.setData({
          _activityId: nV
        });
      }
    }
  },
  data: {
    SUM,
    iconUrl: app.Conf.ICON_URL,
    _lotteryInfo: {},
    _activityId: 0,
    closeType: 'cancel',
    prizeList: [{
        src: 'http://devadminwebapi.innourl.com/image/show/assets-images-bonus.png',
        prizeId: 1
      },
      {
        src: 'http://devadminwebapi.innourl.com/image/show/assets-images-point.png',
        prizeId: 2
      },
      {
        src: 'https://devimgtest.innourl.com/SAAS_IMAGE/images/INNO/index/gallery/20210413/20210413171931717_4046338.jpg',
        prizeId: 3
      },
      {
        src: 'http://devadminwebapi.innourl.com/image/show/assets-images-bonus.png',
        prizeId: 1
      },
      {
        src: 'http://devadminwebapi.innourl.com/image/show/assets-images-point.png',
        prizeId: 2
      },
      {
        src: 'http://devadminwebapi.innourl.com/image/show/assets-images-point.png',
        prizeId: 2
      },
      {
        src: 'http://devadminwebapi.innourl.com/image/show/assets-images-point.png',
        prizeId: 2
      },
    ]
  },
  attached() {
    let win_bg = this.data.brand_info.icon_url + "micro_mall/lottery/win_bg.png";
    let failure_bg = this.data.brand_info.icon_url + "micro_mall/lottery/failure_bg.png";
    let win_bg_btn = this.data.brand_info.icon_url + "micro_mall/lottery/win_bg_btn.png";
    let default_img = this.data.brand_info.icon_url + "micro_mall/lottery/win_default.png";

    this.setData({
      win_bg,
      win_bg_btn,
      default_img,
      failure_bg,
    });
  },
  methods: {
    onTap(e) {
      let dataset = this.getDataset(e);
      let type = dataset.type || "";
      if (type == 'close') {
        _setAnim(this, 'prize', false);
        this.dismiss();
        this.triggerEvent('close');
      }
    },
    _show(code, prizeList, prizeMsg, index) {
      // let prizeList = this.data.prizeList||[];
      // //中奖逻辑
      // let SUM = this.data.SUM;
      // if(prizeList.length<=SUM){
      //   const temp = prizeList;
      //   let len = Math.ceil((SUM/temp.length));
      //   for(let i = 0;i<len;i++){
      //     if(prizeList.length>=SUM){
      //       prizeList = prizeList.slice(0,SUM);
      //       break;
      //     }
      //     prizeList = prizeList.concat(temp);
      //   }
      // }else{
      //   prizeList = prizeList.slice(0,SUM);
      // }
      // prizeList.push({src:'http://devadminwebapi.innourl.com/image/show/assets-images-bonus.png',prizeId:1},
      // {src:'http://devadminwebapi.innourl.com/image/show/assets-images-point.png',prizeId:2},
      // {src:'https://devimgtest.innourl.com/SAAS_IMAGE/images/INNO/index/gallery/20210413/20210413171931717_4046338.jpg',prizeId:3},
      // {src:'http://devadminwebapi.innourl.com/image/show/assets-images-bonus.png',prizeId:1},
      // {src:'http://devadminwebapi.innourl.com/image/show/assets-images-point.png',prizeId:2});
      // console.log('prizeListprizeList',prizeList)
      if (code == 'zajingdan') {
        let newPrizeList = JSON.parse(JSON.stringify(prizeList));
        //中奖逻辑
        let SUM = this.data.SUM;
        if (newPrizeList.length <= SUM) {
          const temp = newPrizeList;
          let len = Math.ceil((SUM / temp.length));
          for (let i = 0; i < len; i++) {
            if (newPrizeList.length >= SUM) {
              newPrizeList = newPrizeList.slice(0, SUM);
              break;
            }
            newPrizeList = newPrizeList.concat(temp);
          }
        } else {
          newPrizeList = newPrizeList.slice(0, SUM);
        }
        let lastPrizeList = newPrizeList.slice(0, 5);
        lastPrizeList.splice(2,1,prizeMsg);
        newPrizeList = newPrizeList.concat(lastPrizeList);
        console.log('newPrizeList',newPrizeList)
        this.setData({
          prizeList: newPrizeList,
          baseW: getBaseW(),
        })
        this.show();
        _setAnim(this, 'draw', true);
        // setTimeout(() => {
        //   _setAnim(this, 'draw', false);
        //   setTimeout(() => {
        //     _setAnim(this, 'prize', true);
        //   }, 300);
        // }, 4500);
      }

    }
  }
})

function getBaseW() {
  return parseInt(app.SIH.systemInfo.windowWidth / 750 * IMG_BOX_W);
}

function _setAnim(that, type, bool) {
  if (type == 'draw') {
    if (bool) {
      that.setData({
        animBoxStyle: "opacity:1;",
        start: true,
      })
    } else {
      that.setData({
        animBoxStyle: "opacity:0;"
      })
    }
  } else if (type == 'prize') {
    if (bool) {
      that.setData({
        start: false,
        showPrizeBool: true,
      });
      wx.nextTick(() => {
        that.setData({
          animBoxStyle: "opacity:1;"
        })
      })
    } else {
      that.setData({
        animBoxStyle: "opacity:0;",
        showPrizeBool: false,
      })
    }
  }
}