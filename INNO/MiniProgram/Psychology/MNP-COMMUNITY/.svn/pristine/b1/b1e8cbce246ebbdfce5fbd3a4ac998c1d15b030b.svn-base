<template>
  <view class="tree-hole">
    <page-nav isTransparent>
      <template v-slot:custom-content>
        <view class="header-box flex-s-c">
          <!-- <view class="header flex-c-c" @click="jumpAction" data-url="/pages/tree-hole/record">
            <view>记录</view>
          </view> -->
          <image :src="setStaticAddress('/tree-hole/record.png')" @click="jumpAction" data-url="/pages/tree-hole/record" mode="aspectFit" class="header" />
          <view v-if="hugContentCount>0" class="news-box" :class="{anim:hugContentAnim}" @click="toogle('news',true)">
            <span class="news">收到{{hugContentCount}}个匿名拥抱</span>
            <span class="circle"></span>
          </view>
        </view>
      </template>
    </page-nav>
    <view class="message-main-box flex-e-c flex-col" :class="{sended}">
      <view class="img-bg-box">
        <view class="img-sending-box">
          <image :src="setStaticAddress('/tree-hole/send.png')" class="img-sending" :class="{anim:animShowType==1,animRever:animShowType==2}" mode="aspectFit"></image>
          <image :src="setStaticAddress('/tree-hole/twinkle.png')" class="img-twinkle" :class="{anim:animShowType==1,animRever:animShowType==2}" mode="aspectFit"></image>
          <view class="img-sending-direction flex-c-c flex-col">
            <view class="msg-text font-28" :class="{showMsgTextAnim}">你的心事已发出...</view>
          </view>
        </view>
        <image :src="setStaticAddress('/tree-hole/tree-hole-bg.jpg')" mode="aspectFill" class="img-bg" />
      </view>
      <view class="message-box flex-c-c flex-col">
        <image class="img-text-bg opacity-1 transition-all" :class="{transparent:curSendType == 'record'}" :src="setStaticAddress('/tree-hole/text-bg.png')" mode="widthFix" />
        <ori-textarea ref="textarea" v-show="curSendType == 'text'" :class="{transparent:curSendType == 'record'}"  class="textarea-box flex1 ori-textarea opacity-1 transition-all" :maxlength="maxLength" placeholder="书写你的心事或对着大海呐喊一声..."></ori-textarea>
        <safe-area areaType="paddingBottom" class="textarea-box op-box-sage-area">
          <view class="op-box flex-s-c f-shrink-0">
            <view class="mike flex-c-c" @click="switchTap(curSendType=='record'?'text':'record')">
              <view v-if="curSendType == 'record'" class="bold">文</view>
              <image v-else :src="setStaticAddress('/tree-hole/recording.png')" class="img-recording" mode="aspectFit" ></image>
            </view>
            <template v-if="curSendType == 'text'">
              <view class="send flex-c-c" @click="sendText">送出</view>
              <view class="msg-box C_7f">
                <view class="">请放心，你的倾诉仅对你自己可见</view>
                <view class="">信封发出后会在{{expire_timeStr}}后过期封存。</view>
              </view>
            </template>
            <template v-else>
              <view class="flex-1" :class="{'disabled-opacity':recording}" @longpress="longpress" @touchstart="touchstart" @touchend="touchend" @touchmove="touchmove">
                <button class="flex-c-c record-box">按住 说话</button>
              </view>
            </template>
            
             
          </view>
        </safe-area>
      </view>
    </view>
    <ori-popup ref="news" type='center' :is-mask-click="false">
      <template v-slot:content>
        <div class="popup-box flex-c-c flex-col">
          <image :src="setStaticAddress('/tree-hole/hug.png')" mode="aspectFit" class="img-hug" />
          <view class="hug-text">{{hugContent && hugContent[0] || "收到一个匿名的拥抱"}}</view>
          <view class="btn-box flex-b-c">
            <view class="flex-c-c btn m-r-20" @click="toogle('news',false)">回馈一个拥抱</view>
            <view class="flex-c-c btn" @click="toogle('news',false)"> 收到</view>
          </view>
        </div>
      </template>
    </ori-popup>

    <ori-popup ref="recording" type='bottom' :is-mask-click="false" :safeArea="false" mask-background-color="rgba(0,0,0,0.7)">
      <template v-slot:content>
        <view class="sending-box flex-e-s flex-col">
          <view class="sending-cancel" :class="{active:isCancelActive}" @click="clickEnd">
            <view class="row"></view>
            <view class="col"></view>
          </view>
          <view class="wave-box flex-c-c flex-col" :class="{active:(isCancelActive||!recording),recording}">
            <view class="sending-text W100" v-if="!recording">录音准备中</view>
            <view class="wave flex-c-c">
              <view class="wave-arrow"></view>
              <view v-for="item in [1,2,3,4,5,6,7,8,9,10,11]" :key="item" class="bodong"></view>
            </view>
          </view>
          <view class="sending-content flex-c-c" :class="{isIphoneX}">
            <view class="sending-content-bg" :class="{active:isCancelActive}"></view>
            <view class="sending-text" v-if="!isCancelActive">松开 发送</view>
            <image :src="setStaticAddress('/tree-hole/voice.png')" mode="aspectFit" class="img-voice" />
          </view>
        </view>
      </template>
    </ori-popup>
  </view>
</template>

<script>
  import oriTextarea from "@/components/ori-comps/textarea/ori-textarea.vue"
  import safeArea from "@/components/safe-area/index.vue"
  import RecorderHandler from "@/common/helper/recorder-handler.js";
  import oriPopup from "@/components/ori-comps/popup/ori-popup.vue";
  import Conf from "@/config/config.js"
  import UniApi from "@/common/support/tools/uni-api-promise.js";
  import DateUtil from "@/common/support/utils/date-util.js";
  const app = getApp();
  const pageOption = Page.BasePage({ 
    data() {
      return {
        sended:false,
        recording:false,
        recorderM:null,
        options:{},
        isLoading:false,
        animShowType:-1,
        showMsgText:false,
        showMsgTextAnim:false,
        curSendType:'text',
        curStartY:-1,
        curY:-1,
        dt:0,
        recordAuthorize:false,
        touchStatus:-1,
        hugContent:[],
        hugContentCount:0,
        animAllTime:4000,
        hugContentAnim:false,
        isShowHugContent: false,
        expire_time:'',
        expire_timeStr:"",
        maxLength:350,
      }
    },
    components: {
      oriTextarea,
      safeArea,
      oriPopup,
    },
    computed:{
      isCancelActive(){
        return this.dt<-100;
      },
    },
    onLoad(){
      this.init();
    },
    methods: {
      init(){ 
        app.Sysm.getSysConfReq('tree_hole_expire_time').then(data=>{
          this.expire_timeStr = this.getTime(Number(data)*60);
        })
      }, 
      getTime(data){
        let format = data > (60 * 60) ? 'HH小时mm分钟' : 'mm分钟';
        return DateUtil.spanFormat((Number(data)) * 1000, format);
      },
      switchTap(type){
        if(type == 'record' && !this.recordAuthorize){
          return RecorderHandler.check(true).then(res=>{
            if(res){
              this.recordAuthorize = true;
              this.curSendType = type;
            }
          })
        }else{
          this.curSendType = type; 
        }
      },
      longpress(e){
        console.log('longpress',e);
        this.toogle('recording',true); 
        this.record();
      },
      touchstart(e){
        this.dt = 0;
        this.curStartY = this.getTouchY(e);
        this.curY = this.curStartY;
        this.touchStatus = 1;
        console.log('touchstart',this.curStartY);
      },
      touchend(e){
        if(e){
          this.curY = this.getTouchY(e);
          this.dt = this.curY - this.curStartY;
        }
        this.touchStatus = 2;
        console.log('touchend',this.curY,this.dt,this.recorderM);
        this.toogle('recording',false);
        this.stop();
      },
      touchmove(e){
        this.curY = this.getTouchY(e);
        this.dt = this.curY - this.curStartY;
        // console.log('touchmove',this.curY);
      },
      clickEnd(){
        this.curY=0;
        this.curStartY=0;
        this.dt=0;
        this.touchend();
      },
      getTouchY(e){
        return e&&e.changedTouches&&e.changedTouches[0]&&e.changedTouches[0].clientY || 0;
      },
      record(){
        console.log('isLoading',this.isLoading,this.recording&&this.recorderM);
        if(this.isLoading)return
        if(this.recording&&this.recorderM){
          this.stop();
          return
        }
        return this.getRecorder().then(res=>{
          console.log('RecorderHandler then',res,this.recorderM);
          if(res){
            let {recordM,options} = res;
            this.recorderM = recordM||{};
            this.recorderM.onStart(() => {
              console.log('recorder start');
              this.recording = true;
              if(this.touchStatus == 2){
                this.stop();
              }
            })
            this.recorderM.onStop((res) => {
              console.log('recorder stop', res)
              this.recording = false;
              const { tempFilePath } = res;
              console.log('tempFilePath',tempFilePath); 
              if(!this.isCancelActive){
                this.upLoadFunc('voice',tempFilePath).then(()=>{
                  this.send('voice');
                })
              } 
            })
            this.recorderM.start(options||{});
          }
        })
      },
      sendText(){
        if(this.isLoading)return;
        let textValue = (this.$refs.textarea.inputValue).substring(0,this.maxLength);
        if(!textValue){
          uni.showToast({title:"请书写你的心事！",icon:"none"});
          return
        }; 
        this.upLoadFunc('text',textValue).then(()=>{
          this.send();
        })
      },
      getRecorder(){
        if(this.recordM)return Promise.resolve({recordM:this.recordM,options:this.options});
        return RecorderHandler.getRecorder();
      },
      stop(){
        if(!this.recording || !this.recorderM)return;
        this.recorderM.stop();
      },
      send(type='text'){
        this.sended = true; 
        this.animShowType =  Math.random()*10<5?1:2;
        setTimeout(() => {
          type=='text' && this.$refs.textarea.reset();
          this.sended=false;
          setTimeout(() => {
            this.isLoading=false;
            this.showMsgTextAnim = false;
            this.animShowType = -1;
            this.showMsgText = false;
          }, 300);
        }, (this.animAllTime+1500));
        setTimeout(() => {
          this.showMsgText = true;
          this.showMsgTextAnim = false;
          setTimeout(() => {
            this.showMsgTextAnim = true;
          }, 100); 
        }, this.animAllTime);
      },
      toogle(key,bool=true){
        this.$refs[key][bool?'show':'dismiss']();
        if(key == 'news'){
          this.hugContentCount<=0 && (this.hugContentAnim = false)
          if(!bool){
            setTimeout(() => {
              this.hugContent.shift();
            }, 300);
          }else{
            this.hugContentCount -= 1;
          }
        }
      },
      upLoadFunc(type,data){ 
        uni.showLoading();
        this.isLoading = true;
        return this.uploadApi(type,data).then(res=>{
          let check = this.dealData(res,type);
          if(check){
            return res;
          }
          return Promise.reject(res);
        }).catch(e=>{
          console.log('catch',e);
          this.isLoading = false;
          this.showToast('发送异常,请稍后再试','none');
          return Promise.reject(e);
        }).finally(()=>{
          uni.hideLoading();
        }); 
      },
      uploadApi(type,data){
        if(type == 'text'){
          return this.$Http(this.$Apis.uploadText, {
            data: {
              content:data
            },
          })
        }else{
          let url = this.$Apis.uploadVoice && this.$Apis.uploadVoice.u || '';
          let params = {
            url,
            filePath:data,
            name:'file',
            header:{
              userToken:app.LM.userToken||"",
              platformType:Conf.platformSrc||"",
              appCode:Conf.brandCode||""
            },
          };
          console.log('params',params);
          return UniApi.uploadFile({
            ...params
          })
        } 
      },
      dealData(temp,type){
        // console.log('dealData',type,temp);
        let check = false;
        try{
          if(type == 'text'){
            let res = temp;
            if(res.code == 1){
              this.setHugContent(res);
              check = true;
            }else{
              this.showToast(res.msg||'发送异常,请稍后再试','none');
            }
          }else{
            if(temp && temp.data && JSON.parse(temp.data)){
              let res = JSON.parse(temp.data);
              if(res.code == 1){
                this.setHugContent(res);
                check = true;
              }else{
                this.showToast(res.msg||'发送异常,请稍后再试','none');
              }
            }else{
              this.showToast('发送异常,请稍后再试','none');
            }
          }
        }catch(e){
          this.showToast('发送异常,请稍后再试','none');
        } 
        return check
      },
      setHugContent(res){
        this.isShowHugContent = true;
        setTimeout(() => {
          this.hugContent.unshift(res.data && res.data.hugContent||'');
          this.hugContentCount += 1;
          setTimeout(() => {
            this.hugContentAnim = true;
          }, 100);
        }, this.animAllTime+2000);
      },
    },
  })
  export default pageOption
</script>

<style lang="scss">
page{
  background-color: rgb(2, 159, 199);
}
</style>
<style lang="scss" scoped>
.tree-hole{
  position: relative;
  .header-box{
    // margin-left: 45rpx;
  }
  .header{  
    width: 116rpx;
    height: 58rpx; 
    margin-right: 20rpx;
  }
  .news-box{
    padding: 10rpx 30rpx;
    color: #fff;
    background: rgba($color: #043B59, $alpha: 0.6);
    position: relative;
    border-radius: 30rpx;
    font-size: 24rpx;
    opacity: 0;
    transition: all 0.6s;
    &.anim{
      opacity: 1;
    }
  }
  .circle{
    width: 20rpx;
    height: 20rpx;
    border-radius: 50%;
    background: rgb(0, 169, 0);
    position: absolute;
    right: 0;
    top: -8rpx;
  }
  .img-recording{
    width: 80rpx;
    height: 80rpx;
  }
  .message-main-box{
    box-sizing: border-box;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    // padding:0 10rpx;
    transform: translateY(0);
    transition: all 0.4s;
  }
  .message-box{
    width: 100%;
    box-sizing: border-box;
    position: relative;
    z-index: 2;
  }
  .ori-textarea{
    width: 90%;
    position: absolute;
    top: 50rpx;
    left: 50%;
    transform: translateX(-50%);
    overflow: hidden;
    height: 550rpx; 
    padding: 0 40rpx;
    box-sizing: border-box;
  }
  .op-box-sage-area{
    bottom: 50rpx;
    left: 40rpx;
    width: calc(100% - 80rpx);
  }
  .op-box{
    width:100%;
    // padding-right:40rpx;
    box-sizing: border-box;
    
  }
  .mike,.send{
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    background: rgba($color: #fff, $alpha: 0.9);
    margin-right: 20rpx;
  }
  .send{
    width: 140rpx;
    border-radius: 80rpx;
    margin-right: 60rpx;
  }
  .record-box{
    height: 80rpx;
    border-radius: 80rpx;
    background: #fff;
    font-size: 26rpx;
  }
  .msg-box{
    border-left: 1px solid #7f7f7f;
    line-height: 30rpx;
    font-size: 18rpx;
    box-sizing: border-box;
    padding-left: 30rpx;
    letter-spacing: 1px;
  }
  .img-bg-box{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 200vh;
    z-index: 1;
  }
  .img-sending-box{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 2;
    color: #fff;
    perspective:1000;
  }
  .img-sending-direction{
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%,-50%);
    font-size: 28rpx;
  }
  .img-sending,.img-twinkle{
    width: 137rpx;
    height: 85rpx;
    position: absolute;
    opacity: 1;
    transition: opacity 0.3s;
    transform: translate(-50%,-50%);
    top: 50%;
    left: 50%; 
    transform-origin: 80% 50%;
    &.anim{
      // animation: animX 1.2s cubic-bezier(0.36,0,0.64,1) -0.6s 2 alternate forwards, animY 1.8s cubic-bezier(0.36,0,0.64,1) 0s 1 normal forwards ,animZ 1.8s cubic-bezier(0.36,0,0.64,1) 0s 1 normal forwards;      
      animation: animX 1s cubic-bezier(0.36,0,0.64,1) 0.5s 1 forwards,animX2 1.5s cubic-bezier(0.36,0,0.64,1) 1.5s 1 forwards, animY 2.5s cubic-bezier(0.36,0,0.64,1) 0.5s 1 normal forwards ,animZ 2s cubic-bezier(0.36,0,0.64,1) 1s 1 forwards;
    }
    &.animRever{
      transform: translate(-50%,-50%) rotateY(-180deg);
      animation: animX-rever 1s cubic-bezier(0.36,0,0.64,1) 0.5s 1 forwards,animX2-rever 1.5s cubic-bezier(0.36,0,0.64,1) 1.5s 1 forwards, animY 2.5s cubic-bezier(0.36,0,0.64,1) 0.5s 1 normal forwards ,animZ-rever 2s cubic-bezier(0.36,0,0.64,1) 1s 1 forwards;

    } 
  }

  @keyframes animX{
    0% {left: 50%;} 
    100% {left: 110rpx;}
  }
  @keyframes animX2{
    0% {left: 110rpx;} 
    100% {left: calc(80%);}
  }
  @keyframes animX-rever{
    0% {left: 50%;} 
    100% {left: calc(80%);}
  } 
  @keyframes animX2-rever{
    0% {left: calc(80%);} 
    100% {left: 110rpx;}
  } 
  @keyframes animY{
    0% {top: 50%;}
    100% {top: 20%;}
  }
  @keyframes animZ{
    0% {transform:translate(-50%,-50%) rotateZ(0) scale(1);} 
    35% {transform:translate(-50%,-50%) rotateZ(115deg) scale(1);}
    100% {transform:translate(-50%,-50%) rotateZ(120deg) scale(0);}
  }
  @keyframes animZ-rever{
    0% {transform:translate(-50%,-50%) rotateY(-180deg) rotateZ(0) scale(1);} 
    35% {transform:translate(-50%,-50%) rotateY(-180deg) rotateZ(115deg) scale(1);}
    100% {transform:translate(-50%,-50%) rotateY(-180deg) rotateZ(120deg) scale(0);}
  }   
  @keyframes animScale-twinkle{
    0% {transform:translate(calc(-100% + 5rpx),20rpx) rotateZ(120deg) scale(1);opacity: 0;} 
    50% {transform:translate(calc(-100% + 5rpx),20rpx) rotateZ(120deg) scale(1);opacity: 1;} 
    100% {transform:translate(calc(-100% + 5rpx),20rpx) rotateZ(120deg) scale(1);opacity: 0;}
  }
  @keyframes animScale-twinkle-rever{
    0% {transform:translate(-5rpx,20rpx) rotateY(-180deg) rotateZ(120deg) scale(1);opacity: 0} 
    50% {transform:translate(-5rpx,20rpx) rotateY(-180deg) rotateZ(120deg) scale(1);opacity: 1;} 
    100% {transform:translate(-5rpx,20rpx) rotateY(-180deg) rotateZ(120deg) scale(1);opacity: 0;}
  }
  

  .img-twinkle{  
    opacity: 0;
    &.anim{
      // animation: animX 1s cubic-bezier(0.36,0,0.64,1) 0.5s 1 alternate forwards,animX2 1.5s cubic-bezier(0.36,0,0.64,1) 1.5s 1 alternate forwards, animY 2.5s cubic-bezier(0.36,0,0.64,1) 0.5s 1 normal forwards ,animZ 2s cubic-bezier(0.36,0,0.64,1) 1s 1 normal forwards,animScale-twinkle 1.5s linear 3s 1 normal forwards;
      animation: animX 1s cubic-bezier(0.36,0,0.64,1) 0.5s 1 forwards,animX2 1.5s cubic-bezier(0.36,0,0.64,1) 1.5s 1 forwards, animY 2.5s cubic-bezier(0.36,0,0.64,1) 0.5s 1 forwards ,animZ 2s cubic-bezier(0.36,0,0.64,1) 1s 1 forwards,animScale-twinkle 1s linear 3s 1 forwards;
      // animation: animX 1.2s cubic-bezier(0.36,0,0.64,1) -0.6s 2 alternate forwards, animY 1.8s cubic-bezier(0.36,0,0.64,1) 0s 1 forwards ,animZ 1.8s cubic-bezier(0.36,0,0.64,1) 0s 1 forwards,animScale-twinkle 1.5s linear 1.8s 1 forwards;
    }
    &.animRever{
      transform: translate(-50%,-50%) rotateY(-180deg);
      animation: animX-rever 1s cubic-bezier(0.36,0,0.64,1) 0.5s 1 forwards,animX2-rever 1.5s cubic-bezier(0.36,0,0.64,1) 1.5s 1 forwards, animY 2.5s cubic-bezier(0.36,0,0.64,1) 0.5s 1 forwards ,animZ-rever 2s cubic-bezier(0.36,0,0.64,1) 1s 1 forwards,animScale-twinkle-rever 1s linear 3s 1 forwards;
    }
  }

  .msg-text{
    opacity: 0;
    transition: opacity 0.8s;
    letter-spacing: 1px;
    &.showMsgTextAnim{
      opacity: 1;
    }
  }
  .img-bg{
    width: 100%;
    height: 100%;
  }
  .sended{
    transform: translateY(100vh);
  }
  .popup-box{
    width: 520rpx;
    min-height: 600rpx;
    background: #FFFFFF;
    border-radius: 34px;
    border: 1px solid #979797;
    padding: 30rpx;
    box-sizing: border-box;
  }
  .img-hug{
    width: 258rpx;
    height: 226rpx;
    margin: 0 auto;
  }
  .hug-text{
    padding:55rpx 0 60rpx 0;
    font-size: 28rpx;
    text-align: center;
  }
  .btn-box{

  }
  .btn{
    min-width: 158rpx;
    height: 92rpx;
    padding: 0 45rpx;
    background: #059EC8;
    color: #fff;
    box-sizing: border-box;
    border-radius: 50rpx;
  }
  .img-text-bg{
    width: 100%;
    min-height:60vh;
    position: relative;
    z-index: 1;
    // border-radius: 40rpx 40rpx 0 0;
  }
  .textarea-box{
    position: absolute;
    z-index: 2;
  } 
  .sending-box{
    position: relative;
    width: 100%;
    height: 100vh;
  }
  .wave-box{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  .wave{
    padding: 10rpx 80rpx;
    height: 100rpx;
    border-radius: 24rpx;
    background: rgb(0, 225, 0);
    position: relative;
    transition: all 0.4s;
    .wave-arrow{
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translate(-50%,100%);
      width: 0;
      height: 0;
      border: 10rpx solid transparent;
      border-top-color: rgb(0, 225, 0); 
      transition: all 0.4s;
    }
  }
  .bodong{
    width: 4rpx;
    height: 8rpx; 
    position:relative;
    background: #444;
    margin-right: 4rpx;
    border-radius: 8rpx;
  }
  .recording{
    .bodong{
      animation: bodong 2s infinite alternate linear;
      &:first-child{
        animation-delay:-0.3s;
      } 
      &:nth-child(2){
          animation-delay:-0.4s;
      }
      &:nth-child(3){
        animation-delay:-0.6s;
      }
      &:nth-child(4){
        animation-delay:-0.8s;
      }
      &:nth-child(5){
        animation-delay:-1s;
      }
      &:nth-child(6){
        animation-delay:-1.2s;
      }
      &:nth-child(7){
        animation-delay:-1.4s;
      }
      &:nth-child(8){
        animation-delay:-1.6s;
      }
      &:nth-child(9){
        animation-delay:-1.8s;
      }
      &:nth-child(10){
        animation-delay:-2s;
      }
      &:nth-child(11){
        animation-delay:-2s;
      }
    }
  }
  .active{
    .wave{
      background: rgb(214, 77, 77);
    }
    .wave-arrow{
      border-top-color: rgb(214, 77, 77);
    }
  }

  @-webkit-keyframes bodong{
      0%{height:8rpx;}
      25%{height:12rpx;}
      50%{height:16rpx;}
      75%{height:12rpx;}
      100%{height:8rpx;}
  }
  .sending-content{
    width: 100%;
    height: 200rpx;
    border-radius: 50% 50% 0 0;
    background: linear-gradient(to top, #bfbfbf 0%, #5f5f5f 100%);
    position: relative;
    &.isIphoneX{
      height: calc(200rpx + 34px);
    }
  }
  .sending-content-bg{
    position: absolute;
    width: calc(100% + 4rpx);
    height: calc(100% + 4rpx);
    transition: opacity 0.4s;
    opacity: 0;
    border-radius:50% 50% 0 0;
    background:#444; 
    z-index: 1;
    box-shadow: 0 0 20rpx rgba($color: #000000, $alpha: 0.2);
    &.active{
      opacity: 1;
    }
  }
  .sending-text{
    position: absolute;
    top:0;
    left: 50%;
    transform: translateX(-50%);
    margin-top: -40rpx;
    color: #dfdfdf;
    font-size: 24rpx;
    font-weight: bold;
    text-align: center;
  }
  .img-voice{
    width: 100rpx;
    height: 100rpx;
    position: relative;
    z-index: 2;
  }
  .sending-cancel{
    width: 100rpx;
    height: 100rpx;
    position: relative;
    border-radius: 50%;
    background: #7f7f7f;
    transform: rotate(45deg);
    margin: 0 auto;
    margin-bottom: 80rpx;
    transition: all 0.3s;
    &.active{
      background: #fff;
      .row,.col{
        background: #333;
      }
    }
  }
  .row,.col{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    background: #fff;
  }
  .row{
    width: 35%;
    height: 4rpx;
  }
  .col{
    height: 35%;
    width: 4rpx;
  }

}
</style>