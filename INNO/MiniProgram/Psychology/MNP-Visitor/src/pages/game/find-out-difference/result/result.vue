<template>
  <view class="game-result">
    <page-nav navBoxStyle="position:relative;z-index:1;" :isTransparent="true">
      <view slot="custom-content">
        <image @click="getRank" class="game-rank-icon" :src="staticAddress + '/game/different/rank-icon.png'"
          mode="widthFix">
      </view>
    </page-nav>
    <view class="result-cont">
      <view class="cont-tip-area">
        <image class="cont-tip-icon" :src="staticAddress + '/game/different/game-success-tip.png'" mode="widthFix">
      </view>
      <view class="result-cont-main">
        <view>
          <image class="main-l-icon" :src="staticAddress + '/game/different/flower-l.png'" mode="widthFix">
        </view>
        <view class="cont-main-txt">
          <view class="txt-tip">共耗时</view>
          <view class="txt-time">{{options.score}}</view>
        </view>
        <view>
          <image class="main-r-icon" :src="staticAddress + '/game/different/flower-r.png'" mode="widthFix">
        </view>
      </view>
      <view class="result-cont-sub">
        <view class="sub-txt">加油！突破下自己</view>
        <view class="sub-time">最好成绩 {{bestScore}}</view>
      </view>
      <view class="custom-page-area">
        <custom-page :isShowNav="false" :fullScreen="false" ref="customPageRef"></custom-page>
      </view>
    </view>
    <view class="result-operate-height"></view>
    <view class="result-operate">
      <view class="operate-area">
        <button class="operate-btn restart-btn" @click="tryAgain">再来一局</button>
      </view>
      <view class="operate-area">
        <button class="operate-btn rest-btn" @click="shareImg">分享好友</button>
      </view>
    </view>
    <newRecord @confirm="confirmName" :score="options.score" ref="newRecordRef"></newRecord>
    <poster ref="poster"></poster>
  </view>
</template>

<script>
  import newRecord from "../../components/new-record/new-record.vue";
  import DateUtil from "@/common/support/utils/date-util.js";
  import poster from '@/components/poster/index.vue';
  import {RoutesKey} from "@/common/manager/log-map.js"
  const app = getApp();
  const pageOption = Page.BasePage({
    data() {
      return {
        options: {},
        codeIsLoading:false,
        appletCode:"",
      };
    },
    components: {
      newRecord,
      poster
    },
    computed: {
      bestScore() {
        let options = this.options;
        let bestScore = options.bestScore;
        let bestScoreStr = DateUtil.spanFormat(bestScore * 1000);
        return bestScoreStr
      }
    },
    onLoad(options) {
      this.options = options || {};
    },
    onReady() {
      this.$nextTick(() => {
        if (this.options.newScore == 1) {
          this.$refs["newRecordRef"] && this.$refs["newRecordRef"].showModal();
        }
        this.getPage().then((data)=>{
          if(this.options.newScore == 1){
            this.$refs["newRecordRef"] && this.$refs["newRecordRef"].initCustomPage(data);
          }
        })
      })
    },
    methods: {
      getPage() {
        // return this.$Http(this.$Apis.getPageDetail, {
          return this.$Http(this.$Apis.getGameResultPage, {
          other: {
            isShowLoad: true,
            isHideMsg:true
          }
        }).then(res => {
          if (res.code == 1) {
            let data = res.data || {};
            this.$refs["customPageRef"] && this.$refs["customPageRef"].initData(data);
            return data;
          }
        })
      },
      getRank() {
        this.jumpAction(`/pages/game/find-out-difference/rank/list?gameActivityId=${this.options.gameActivityId}`);
      },
      tryAgain() {
        this.redirectAction(`/pages/game/find-out-difference/game?gameActivityId=${this.options.gameActivityId}`);
      },
      shareImg() {
        if(this.codeIsLoading)return
        this.codeIsLoading = true;
        this.createAppletCode().then(code=>{
           this.showPoster({
            code,
            score:this.options.score||0,
            bestScore:this.bestScore||"",
           }) 
        }).finally(()=>{
          this.codeIsLoading = false;
        })
      }, 
      showPoster(posterData) {
          let arr = [];
          let top = 0;
          let pHeight = 685,codeH=160;
          arr.push({
            type: "image",
            url: this.staticAddress + '/game/different/game-poster.jpg',
            css: {
              width: 650,
              height: pHeight,
              top,
              left: 0,
            }
          });
          top+=(25+pHeight);
          arr.push({
            type: "image",
            url: posterData.code,
            css: {
              width: codeH,
              height: codeH,
              top,
              left: 460,
            } 
          });
          arr.push({
            type: "text",
            text: "长按识别二维码进入",
            css: {
              textAlign: 'left',
              fontSize: 20,
              fontStyle: "Microsoft YaHei",
              color: '#000',
              top:top+20+codeH,
              left: 450
            }
          }); 
          top+=(25+10); 
          this.setTextBold(`我仅用`,{
            textAlign: 'left',
            fontSize: 26,
            fontStyle: "Microsoft YaHei",
            color: '#000',
            top,
            left: 40
          },arr);
          top+=(25+30);
          this.setTextBold(`【${this.getTimeText()}】就挑战成功`,{
            textAlign: 'left',
            fontSize: 26,
            fontStyle: "Microsoft YaHei",
            color: '#000',
            top,
            left: 26
          },arr);
          top+=(25+30);
          this.setTextBold("你呢？快来解压  --------->",{
            textAlign: 'left',
            fontSize: 26,
            fontStyle: "Microsoft YaHei",
            color: '#000',
            top,
            left: 40
          },arr); 
          console.log('poster', arr)
          this._getRefs("poster").showModal({
            view: arr, 
            width:650,
            height:pHeight+260
          })
      },
      setTextBold(text,css={},arr){
        arr.push({
          type:"text",
          text,
          css
        });
        arr.push({
          type:"text",
          text,
          css
        });
      },
      getTimeText(){
        let score = String(this.options.score);
        let timeArr = score && score.split && score.split(":")||[];
        let hour = Number(timeArr[0]||0) , min = Number(timeArr[1]||0), sec = Number(timeArr[2]||0);
        let timeText = `${hour?hour+'小时':''}${min||hour?min+'分':''}${sec<10?'0'+sec:sec}秒`;
        return timeText;
      },
      createAppletCode() {
        if(this.appletCode)return Promise.resolve(this.appletCode);
        return this.$Http(this.$Apis.createAppletCode, {
          data: {
            "codeId":"home",
            "page":RoutesKey.INDEX,
            "data": ""
          }
        }).then(res => {
          if (res.code) {
            let code = res.data || "";
            this.appletCode = code;
            return code
          }
          return Promise.reject(res);
        })
      },
      confirmName(name) {
        let nickName = name.trim() || "匿名"
        this.$Http(this.$Apis.saveGameUserInfo, {
          data: {
            nickName
          }
        }).then(res => {
          let msg = ""
          if (res.code != 1) {
            msg = '名字保存失败';
          } else {
            msg = '名字保存成功';
            this.getRank();
          }
          app.SMH.showToast({
            title: msg
          })
        })
      }
    },
    onShow() {

    },
    onShareAppMessage(){
      return {
        path:RoutesKey.INDEX
      }
    }

  });
  export default pageOption;
</script>

<style lang="scss">
  .game-result {
    width: 100%;
    min-height: calc(100vh);
    background: linear-gradient(-43deg, #FFF6D4, #FFFDF4);

    .game-rank-icon {
      width: 90rpx;
      height: 90rpx;
    }

    .result-cont {
      margin: 0 auto;
      padding: 26rpx;
      box-sizing: border-box;
      width: 700rpx;
      margin-top: 227rpx;
      background: #FFFFFF;
      box-shadow: 0px 1px 45rpx 1px rgba(184, 128, 63, 0.1700);
      border-radius: 30rpx;
      position: relative;
      text-align: center;
    }

    .cont-tip-area {
      width: 481rpx;
      height: 101rpx;
      position: absolute;
      top: 0px;
      left: 50%;
      transform: translate(-50%, -50%);

      .cont-tip-icon {
        width: 100%;
        display: block;
      }
    }

    .result-cont-main {
      margin: 80rpx 0px 45rpx 0;
      display: flex;
      align-items: center;
      justify-content: center;

      .main-l-icon,
      .main-r-icon {
        width: 85rpx;
        display: block;
      }

      .cont-main-txt {
        padding: 0px 20rpx;
      }

      .txt-tip {
        font-size: 28rpx;
        font-family: PingFang SC;
        font-weight: 400;
        color: #000000;
        line-height: 30rpx;
        opacity: 0.5;
        margin-bottom: 10rpx;
      }

      .txt-time {
        font-size: 46rpx;
        font-family: Krungthep;
        font-weight: bold;
        color: #333333;
        line-height: 48rpx;
      }
    }

    .result-cont-sub {}

    .custom-page-area {
      margin-top: 20rpx;
      border-radius: 30rpx;
      overflow: hidden;
    }

    .sub-txt {
      font-size: 36rpx;
      font-family: PingFang SC;
      font-weight: 500;
      color: #FFC63F;
      line-height: 40rpx;
      margin-bottom: 30rpx;
    }

    .sub-time {
      font-size: 24rpx;
      font-family: PingFang SC;
      font-weight: 500;
      color: #7F7F7F;
      line-height: 40rpx;
    }

    .result-operate {
      background: #FFF6D4;
      position: fixed;
      bottom: 0;
      width: 100%;
      box-sizing: border-box;
      padding: 0 20rpx;
      display: flex;
      justify-content: space-around;
      padding-top: 50rpx;
      padding-bottom: 50rpx;
      text-align: center;

      .operate-area {
        width: 45%;
      }

      .operate-btn {
        margin: 0 auto;
        height: 100rpx;
        border-radius: 50rpx;
        font-family: PingFang SC;
        font-weight: bold;
        font-size: 40rpx;
        line-height: 40rpx;
      }

      .restart-btn {
        background: #F0570F;
        color: #FFF9D9;
        margin-bottom: 30rpx;
      }

      .rest-btn {
        background: #FCEBBE;
        color: #C55D07;
      }
    }

    .result-operate-height {
      height: 250rpx;
      width: 100%;
    }
  }
</style>