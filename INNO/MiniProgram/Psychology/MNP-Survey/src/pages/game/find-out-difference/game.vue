<template>
  <view class="game-area text-c">
    <page-nav :isTransparent="true"></page-nav>
    <view>
      <view class="game-level">第 {{currLevel + 1}} 关</view>
      <view class="game-title">
        <view class="title-c">
          <view class="title-t">{{actInfo.gameName}}</view>
          <view class="title-b">{{actInfo.gameName}}</view>
        </view>
      </view>
      <view class="game-time" v-show="!showLoading">
        <view class="time-tip m-r-10">耗时</view>
        <view class="time-used">{{usedTime}}</view>
      </view>
    </view>
    <view id="game-main">
      <view class="game-cont"  v-show="!showLoading && isShow">
        <view class="rect-list" :style="'padding-left:' + vItem.saftPadding + 'rpx;padding-right:' + vItem.saftPadding + 'rpx;'" v-show="vIndex == currLevel" v-for="(vItem, vIndex) in dataListView" :key="vIndex">
          <view class="rect-item" :style="{'width': item.width, 'padding-top': item.width}" v-for="(item, index) in vItem.data"
            :key="index">
            <view class="item-cont-area"
              :class="{'shake' : chooseIndex == item.id && prizeGroup.indexOf(chooseIndex) == -1 && isShake}">
              <view class="item-cont" @click="chooseItem(item.id)" :class="{'animate': isAnimate}"
                :style="{'animation-duration': item.time + 's'}">
                <image class="item-img" :src="item.isRight.logo" mode="widthFix"
                  v-if="prizeGroup.indexOf(item.id) != -1" />
                <image class="item-img" :src="item.isError.logo" mode="widthFix" v-else />
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view v-show="false">
      <image v-for="(item, index) in allPrizePool" :key="item.elementId" :src="item.logo">
    </view>
    <view v-show="showLoading" class="loading-view flex-c-c">
      <loading-view></loading-view>
    </view>
    <!--开始动画-->
    <countDown ref="countDownRef"></countDown>
  </view>
</template>

<script>
  import countDown from "../components/count-down/count-down.vue";
  import JSEncrypt from "@/common/support/jsEncrypt-mp/jsencrypt.js";
  import LoadingView from '@/components/css3/loading/loading.vue';
  import DateUtil from "@/common/support/utils/date-util.js";

  const app = getApp();
  const pageOption = Page.BasePage({
    components: {
      countDown,
      LoadingView
    },
    data() {
      return {
        isShow: false,
        currLevel: 0,
        usedTime: "00:00:00",
        usedSeconds: 0,
        gameLog: [],
        itemList: [],
        elementList: [],
        dataListView: [],
        isAnimate: false,
        isShake: false,
        shakeTimer: null,
        prizeGroup: [], // 中奖点
        chooseIndex: -1, // 选择点
        score: 0,
        levelScore: [],
        anmiateMaxTime: 0,
        reckonTimer: null,
        showLoading: true,
        actInfo: {},
        saftHeight: 0,
        saftPadding: 0,
        // 
        allPrizePool: [], // 所有奖池
        currPrizePool: [], // 当前奖池
        rightPrizePool: [], // 剔除isRight 不为1的奖池
        errorPrizePool: []
      };
    },
    // computed: {
    // },
    onLoad(options) {
      this.options = options || {};
      this.getBaseActInfo();
      // this.initSafeArea();
    },
    onShow() {
      this.showLoading = true
      this.usedTime = '00:00:00';
      this.usedSeconds = 0;
      this.currLevel = 0;
      this.score = 0;
      this.isAnimate = false;
      this.isShow = false;
      this.prizeGroup = [];
      this.initSafeArea().then(()=>{
        this.loadData();
      })
      
    },
    onHide() {
      this.$refs["countDownRef"] && this.$refs["countDownRef"].destroy();
      this.reckonTime(true);
      this.isShow = false;
    },
    onUnload() {
      this.$refs["countDownRef"] && this.$refs["countDownRef"].destroy();
      this.reckonTime(true);
      this.isShow = false;
    },
    methods: {
      getBaseActInfo(){
        let options = this.options;
        if(!Number(options.gameActivityId)) { return Promise.reject() }
        return this.$Http(this.$Apis.getGameActivityBaseInfo, {
          data: {
            activityId: options.gameActivityId,
          },
        }).then((res)=>{
          if(res.code){
            this.actInfo = res.data || {};
          }
        })
      },
      initSafeArea(){
        let safeArea = app.SIH.safeArea || {};
        return new Promise((rs, rj)=>{
          this.$nextTick(()=>{
            setTimeout(()=>{
              const query = uni.createSelectorQuery().in(this);
              query.select('#game-main').boundingClientRect(data => {
                let top = data.top || 0;
                this.saftHeight = safeArea.height - top - 70; // 70 为padding上下
                return rs();
              }).exec();
            }, 100)
          })
        })
      },
      loadData() {
        this.$Http(this.$Apis.getGameMainInfo, {
          data: {
            activityId: this.options.gameActivityId,
          },
        }).then((res) => {
          if (res.code == 1) {
            let data = res.data || {};
            let gameLevelInfoList = data.gameLevelInfoList || [];
            this.allPrizePool = data.gameElementInfoList || [];
            let rightPrizePool = [], errorPrizePool = [];
            this.allPrizePool.forEach(item => {
              if (item.isRight) {
                rightPrizePool.push(item);
              } else {
                errorPrizePool.push(item);
              }
            });
            this.rightPrizePool = rightPrizePool;
            this.errorPrizePool = errorPrizePool;
            this.currPrizePool = JSON.parse(JSON.stringify(rightPrizePool));
            this.itemList = gameLevelInfoList;
            this.initData()
          }
        })
      },
      getRandomRight(rightCount){
        let currPrizePool = this.currPrizePool || [];
        if(rightCount > currPrizePool.length){
          currPrizePool = JSON.parse(JSON.stringify(this.rightPrizePool)) || [];
        }
        let rigthIndex = parseInt(Math.random() * (currPrizePool.length));
        let elementList = {
          isRight: JSON.parse(JSON.stringify(currPrizePool.splice(rigthIndex, 1)[0])) || {},
          isError: this.errorPrizePool[0]
        }
        console.log("elementList", elementList);
        this.currPrizePool = currPrizePool;
        return elementList;
      },
      // 初始化展示数据
      initData() {
        let itemList = this.itemList || [];
        let dataListView = [];
        let wWidth = app.SIH.windowWidth;
        for (let i = 0; i < itemList.length; i++) {
          let currItem = itemList[i] || {};
          let {
            columnCount,
            rowCount,
            rightCount
          } = currItem;
          if (!columnCount || !rowCount) continue;
          let itemCount = parseInt(Number(columnCount) * Number(rowCount));
          let width = 100 / columnCount + "%";
          let time = 0.4;
          let itemData = []
          // this.anmiateMaxTime = 300;
          let specWidth = wWidth / columnCount;
          // 设置的宽度大于安全高度, 挤压宽度
          let allSpecHeight = specWidth * rowCount;
          let saftPadding = allSpecHeight > this.saftHeight ? (allSpecHeight - this.saftHeight) / 2 : 20;
          
          let elementList = this.getRandomRight(rightCount)
          for (let i = 0; i < itemCount; i++) {
            itemData.push({
              width: width,
              id: i,
              delayed: 0,
              time: time,
              ...currItem,
              ...elementList
            });
          }
          dataListView.push({
            saftPadding: saftPadding,
            data: itemData
          });
        }
        this.dataListView = dataListView || [];
        this.$refs["countDownRef"] && this.$refs["countDownRef"].initAnimate(() => {
          this.isShow = true;
          this.initAnimation();
          this.reckonTime();
        })
        this.showLoading = false
      },
      reckonTime(isClear) {
        if (this.reckonTimer) {
          clearInterval(this.reckonTimer);
          this.reckonTimer = null;
        }
        if (isClear) return;
        let nowTime = new Date().getTime();
        this.reckonTimer = setInterval(() => {
          let currTime = new Date().getTime();
          let timeDiff = currTime - nowTime;
          this.usedSeconds += 1;
          this.usedTime = DateUtil.spanFormat(timeDiff);
        }, 1000)
      },
      // 排列动画
      initAnimation() {
        // this.$nextTick(()=>{
        //   this.random();
        //   this.isAnimate = true;
        // })
        this.random();
        this.isAnimate = true;
      },
      // 生成随机数
      random() {
        let dataListView = this.dataListView || [];
        let itemList = this.itemList || [];
        let itemCount = dataListView && dataListView[this.currLevel] && dataListView[this.currLevel].data.length || 0;
        let rightCount = itemList[this.currLevel].rightCount || 1
        // 根据正确数量添加可选项
        this.prizeGroup = [];
        for (let i = 0; i < rightCount; i++) {
          let val = parseInt(Math.random() * itemCount);
          this.prizeGroup.push(val);
        }
      },
      chooseItem(id) {
        this.chooseIndex = id;
        if (this.prizeGroup.indexOf(id) == -1) {
          this.setShake(false, () => {
            this.chooseIndex = -1;
          });
        } else {
          this.prizeGroup = this.prizeGroup.filter((item) => {
            return item != id
          })
          if (this.prizeGroup.length <= 0) {
            this.setShake(true, () => {
              this.chooseIndex = -1;
            });
            this.score += 1
          }
          if (this.currLevel + 1 < this.itemList.length) {
            if (this.itemList[this.currLevel].upCondition == this.score) {
              this.score = 0
              this.$nextTick(() => {
                this.currLevel = Number(this.currLevel) + 1;
              })
            }
            this.getNext();
          } else {
            this.reckonTime(true);
            this.submitScore().then(res => {
              app.SMH.hideLoading()
              let newScore = res.isBest ? 1 : 0
              this.redirectAction(
                `/pages/game/find-out-difference/result/result?bestScore=${res.bestScore}&newScore=${newScore}&score=${this.usedTime}&gameActivityId=${this.options.gameActivityId}`
              )
            })
          }
        }
      },

      // 获取加密公钥
      getRsaKey() {
        return this.$Http(this.$Apis.createRsaKey).then((res) => {
          if (res.code == 1) {
            return res.data
          } else {
            return Promise.reject()
          }
        })
      },

      // 加密字符串
      encryptStr(str, publicKey) {
        var encryptor = new JSEncrypt() // 创建加密对象实例
        //之前ssl生成的公钥，复制的时候要小心不要有空格
        encryptor.setPublicKey(publicKey) //设置公钥
        var rsaPassWord = encryptor.encrypt(str) // 对内容进行加密
        return rsaPassWord
      },
      // 提交分钟
      submitScore() {
         this.showLoading = true
        return this.getRsaKey().then(res => {
          let publicKey = res.publicKey
          let data = {
            "activityId": this.options.gameActivityId || 1,
            "consumingTime": this.usedSeconds
          };
          let encryptData = this.encryptStr(JSON.stringify(data), publicKey)
          let formData = {
            data: encryptData,
            publicKey
          }
          return this.$Http(this.$Apis.submitResult, {
            data: {
              ...formData
            }
          }).then(scoreRes => {
            if (scoreRes.code == 1) {
              return scoreRes.data
            } else {
              return Promise.reject()
            }
          })
        })
      },
      getNext() {
        this.isAnimate = false;
        this.$nextTick(() => {
          this.initAnimation();
        })

      },
      setShake(isClear, callback) {
        if (isClear) { // 切换下一关时，需要清空动画
          this.isShake = false;
          clearTimeout(this.shakeTimer);
          this.shakeTimer = null;
          return;
        }
        this.$nextTick(() => {
          if (this.shakeTimer) {
            return;
          } // shake 过程中，不处理
          this.isShake = true;
          this.shakeTimer = setTimeout(() => {
            this.isShake = false;
            if (this.shakeTimer) {
              clearTimeout(this.shakeTimer);
              this.shakeTimer = null
            }
            typeof callback == 'function' && callback();
          }, 800)
        })
      },
    },
  });
  export default pageOption;

  // // Fisher–Yates shuffle 洗牌算法
  // Array.prototype.shuffle = function () {
  //   var input = this;
  //   for (var i = input.length - 1; i >= 0; i--) {
  //     var randomIndex = Math.floor(Math.random() * (i + 1));
  //     var itemAtIndex = input[randomIndex];
  //     input[randomIndex] = input[i];
  //     input[i] = itemAtIndex;
  //   }
  //   return input;
  // };
</script>

<style lang="less">
  // page{
  //   min-height: calc(100vh);
  //   background: linear-gradient(-43deg, #FFF6D4, #FFFDF4);
  //   overflow-y: auto;
  //   overflow-x: hidden;
  // }
  .loading-view {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    min-height: 100vh;
  }

  .game-area {
    min-height: calc(100vh);
    background: linear-gradient(-43deg, #FFF6D4, #FFFDF4);
  }

  .game-level {
    margin-top: 23rpx;
    margin-bottom: 34rpx;
    font-size: 32rpx;
    font-family: PingFang SC;
    font-weight: 400;
    font-style: italic;
    color: #682a00;
    line-height: 30rpx;
  }

  .game-title {
    text-align: center;
    margin-bottom: 44rpx;

    .title-c {
      display: inline-block;
      font-size: 52rpx;
      font-family: PingFang SC;
      font-weight: 600;
      line-height: 48rpx;
      position: relative;
    }

    .title-t {
      z-index: 2;
      position: relative;
      color: #ffa800;
    }

    .title-b {
      z-index: 0;
      position: absolute;
      top: 5rpx;
      left: 0px;
      color: #fff;
      text-shadow: -1px 0px 1px #ffce0a, 1px 0px 1px #ffce0a, 0px -1px 1px #ffce0a,
        0px 1px 1px #ffce0a;
    }
  }

  .game-time {
    display: flex;
    align-items: center;
    justify-content: center;

    .time-tip {
      font-size: 26rpx;
      font-family: PingFang SC;
      font-weight: 400;
      color: #000000;
      line-height: 20rpx;
      opacity: 0.5;
    }

    .time-used {
      font-size: 28rpx;
      font-family: Krungthep;
      font-weight: bold;
      color: #333333;
      line-height: 48rpx;
    }
  }

  .game-cont {
    margin-top: 30rpx;
    padding: 30rpx;
    width: 100%;
    padding-top: 100%;
    height: 0px;
    box-sizing: border-box;
    position: relative;
  }

  .rect-list {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    padding: 20rpx;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;

    .rect-item {
      position: relative;
    }
  }

  .item-cont-area {
    position: absolute;
    top: 0px;
    left: 0px;
    padding: 15rpx;
    width: 100%;
    height: 100%;
    box-sizing: border-box;

    .item-cont {
      width: 100%;
      height: 100%;
      // transform: translateY(10%);
      // opacity: 0;
      animation-name: fadeOut;
      animation-fill-mode: forwards;
    }

    .item-img {
      width: 100%;
      display: block;
    }

    .item-cont.animate {
      animation-name: fadeIn;
      animation-fill-mode: forwards;
    }
  }

  .item-cont-area.shake {
    animation-name: shake;
    animation-duration: 800ms;
    animation-fill-mode: forwards;
    animation-timing-function: ease-in-out;
  }

  @keyframes fadeIn {
    from {
      transform: translateY(10%);
      opacity: 0;
    }

    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes fadeOut {
    from {
      transform: translateY(0);
      opacity: 1;
    }

    to {
      transform: translateY(10%);
      opacity: 0;
    }
  }

  @keyframes shake {

    10%,
    90% {
      transform: translate3d(-2rpx, -2rpx, 0);
    }

    20%,
    80% {
      transform: translate3d(+6rpx, +6rpx, 0);
    }

    30%,
    70% {
      transform: translate3d(-12rpx, -12rpx, 0);
    }

    40%,
    60% {
      transform: translate3d(+12rpx, +12rpx, 0);
    }

    50% {
      transform: translate3d(-12rpx, -12rpx, 0);
    }
  }
</style>