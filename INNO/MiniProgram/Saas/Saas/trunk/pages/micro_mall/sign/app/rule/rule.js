// pages/micro_mall/sign/app/rule/rule.js
import WindowBehaviors from "../../../../../components/ui/cps/window/window-behaviors";
const app = getApp();
Component(app.BTAB({
    behaviors: [WindowBehaviors],
    properties: {
        isJump:{
            type:Boolean,
            value:true
        },
    },
    data: {
        boxStyle: "opacity:0;transition: all 300ms ease-in-out;",
        iconUrl: app.Conf.ICON_URL
    },
    detached() {},
    methods: {
        onAttached() {
            let sign_bg = this.data.brand_info.default_icon_url + '/sign/sign_bg.png';
            let reward_tip = this.data.brand_info.default_icon_url + '/sign/reward_tip.png';
            this.setData({
                boxStyle: "opacity:1;transition: all 300ms ease-in-out;",
                sign_bg,
                reward_tip
            });
            this.setTouchCancel(false);
        },
        onDetached() {
            this.setData({
                boxStyle: "opacity:0;transition: all 300ms ease-in-out;"
            });
            return 300;
        },
        cancel() {
            this.dismiss();
        },
        showData(data,baseInfo={}){
            console.log('showData',data);
            let sum = 0;
            data = data||{};
            if(data.totalGiftPoint>0){
                sum+=1;
            }
            if(data.totalGiftBonus>0){
                sum+=1;
            }
            if(data.totalGiftLottery>0){
                sum+=1;
            }
            let reward = data.signOrderActivityReward||{};
            this.setData({
                sum,
                baseInfo,
                ruleList:data,
                type:reward.goodsId?'continuous':'normal'
            })
            wx.nextTick(()=>{
                this.show();
            })
            setTimeout(() => {
                this.setData({
                    showFlopBool:true,
                })
                wx.nextTick(()=>{
                    this.setData({
                        opacityBoxStyle: "opacity:1;",
                        showFlopAnim:true
                    })
                })
            }, 320);
        },
        onTap(e){
            let dataset = this.getDataset(e);
            let type = dataset.type||"";
            if(type == 'close'){
                this.dismiss();
            }else if(type == 'other'){
                this.setData({
                    type:'normal'
                })
            }else if(type == 'jump'){
                let baseInfo = this.data.baseInfo||{};
                let jumpPath = baseInfo.jumpPath||"";
                !jumpPath && (jumpPath = "pages/micro_mall/index/index");
                if(jumpPath.indexOf('/') != 0){
                    jumpPath = '/' + jumpPath;
                }
                this.dismiss();
                wx.navigateTo({
                  url: jumpPath,
                  fail:res=>{
                      wx.switchTab({
                        url: jumpPath,
                      })
                  }
                })
            }
        },
        jumpCenter(){
            wx.switchTab({
              url: '/pages/micro_mall/user/user',
            })
        }
    }
}))