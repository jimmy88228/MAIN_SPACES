// pages/draw/draw_result/draw_result.js
import {createBehavior} from "../../../components/window/anim-helper";
const app = getApp();
const anim = {
    enterTo: "transition: all 300ms ease-in-out;",
    leaveTo: "opacity: 0; transition: all 300ms ease-in-out;",
    duration: 300
}
const SUM = 36;
Component({
    behaviors: [Behavior.BaseBehavior,createBehavior(anim)],
    properties: {
        lotteryInfo: {
            type: Object,
            value: {},
            observer(nV, oV){
                console.log(nV,"lotteryInfo");
                this.setData({
                    _lotteryInfo: nV
                });
            }
        },
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
        prizeList:[ 
                    {src:'http://devadminwebapi.innourl.com/image/show/assets-images-bonus.png',prizeId:1},
                    {src:'http://devadminwebapi.innourl.com/image/show/assets-images-point.png',prizeId:2},
                    {src:'https://devimgtest.innourl.com/SAAS_IMAGE/images/INNO/index/gallery/20210413/20210413171931717_4046338.jpg',prizeId:3},
                    {src:'http://devadminwebapi.innourl.com/image/show/assets-images-bonus.png',prizeId:1},
                    {src:'http://devadminwebapi.innourl.com/image/show/assets-images-point.png',prizeId:2},  
                    {src:'http://devadminwebapi.innourl.com/image/show/assets-images-point.png',prizeId:2},  
                    {src:'http://devadminwebapi.innourl.com/image/show/assets-images-point.png',prizeId:2},  
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
      onTap(e){
        let dataset = this.getDataset(e);
        let type = dataset.type||"";
        if(type == 'close'){
          this.triggerEvent('close');
          this.setData({
            start:false,
          })
          wx.nextTick(()=>{
            this.dismiss(); 
          })
        }
      },
      show2(){
        let prizeList = this.data.prizeList||[];
        let sum = this.data.SUM;
        if(prizeList.length<=sum){
          const temp = prizeList;
          let len = Math.ceil((sum/temp.length));
          for(let i = 0;i<len;i++){
            if(prizeList.length>=sum){
              prizeList = prizeList.slice(0,sum);
              break;
            }
            prizeList = prizeList.concat(temp);
          }
        }else{
          prizeList = prizeList.slice(0,sum);
        }
        prizeList.push({src:'http://devadminwebapi.innourl.com/image/show/assets-images-bonus.png',prizeId:1},
        {src:'http://devadminwebapi.innourl.com/image/show/assets-images-point.png',prizeId:2},
        {src:'https://devimgtest.innourl.com/SAAS_IMAGE/images/INNO/index/gallery/20210413/20210413171931717_4046338.jpg',prizeId:3},
        {src:'http://devadminwebapi.innourl.com/image/show/assets-images-bonus.png',prizeId:1},
        {src:'http://devadminwebapi.innourl.com/image/show/assets-images-point.png',prizeId:2});
        console.log('prizeListprizeList',prizeList)
        this.show();
        this.setData({
          prizeList,
          showAnimBool:true,
          baseW:getBaseW(),
        })
        console.log('onAttached',this.data.baseW);
        wx.nextTick(()=>{
          setTimeout(()=>{
            this.setData({
              start:true,
              mainOp:true
            });
            setTimeout(() => {
              this.setData({
                animBoxStyle:"opacity:0;"
                // mainOp:false,
              })
              setTimeout(() => {
                this.setData({
                  start:false,
                  // mainOp:true,
                  // animBoxStyle:"",
                  showAnimBool:false,
                  showPrizeBool:true, 
                });
                wx.nextTick(()=>{
                  this.setData({
                    animBoxStyle:"opacity:1;"
                  })
                })
              }, 300);
            }, 6000);
          },150)
        }) 
      }
        // closeWin() {
        //     this.dismiss();
        // },
        // cancel() {
        //     let self = this;
        //     if (this.data._lotteryInfo.isWinning) {
        //         wx.navigateTo({
        //             url: "/pages/micro_mall/lottery/lottery_record/lottery_record?activityId=" + self.data._activityId
        //         });
        //     }
        //     this.dismiss();
        // }
    }
})

function getBaseW(){
  return parseInt(app.SIH.systemInfo.windowWidth/750*214);
}