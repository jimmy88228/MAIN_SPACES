<template>
  <frame-box :showPage="mixShowPage">
    <template v-slot:body>
      <view class="answer flex-s-s flex-col" :class="[popupH5Bool ? 'blur' : '']">
        <!-- #ifdef MP -->
        <page-nav></page-nav>
        <!-- #endif -->

        <!-- #ifdef H5 -->
        <view class="margin-box">
          <view class="progress-box flex-b-c">
            <view class="msg-box">
              <view class="progress">
                <progress :percent="getPercent(isFinish?answerCount:answerCount + 1, totalCount)"
                  active active-mode="forwards" :duration="10" stroke-width="6" border-radius="8" activeColor="#21B014"
                  backgroundColor="rgba(216,216,216,0.3)" />
              </view>
              <view class="progress-title C_7f f-shrink-0 bold p-r-20"><text class="font-24">进度</text>
              </view>
            </view>
            <view class="flex-s-c">
              <button class="sm-btn flex-c-c" @click="last">上一题</button>
              <button class="sm-btn flex-c-c" @click="back('check')">
                暂停
              </button>
            </view>
          </view>
        </view>
        <!-- #endif -->

        <view class="box flex-col-1 flex-s-c">
          <view class="tips" style="padding: 0px 80rpx" v-if="acInfo.description">
            {{ acInfo.description }}（总分{{acInfo.totalMark||0}}）</view>
          <view id="swiperId" class="swiper flex1" :class="[isFinish?'showSubmit':'']">
            <view class="swiper-item-box flex-s-s" :style="'transform:translateX(-' + current * 100 + '%);'">
              <view v-for="(item, index) in list" :key="index" class="swiper-item"  :class="{'swiper-item-action':current == index}">
                <view class="item-box">
                  <view class="title bold">
                    {{index+1}}.{{ item.question || "" }}
                  </view>
                  <view class="answer-box flex-c-c flex-col" v-if="item.optionList">
                    <view :class="[
                        'answer-item',
                        'bold',
                        'flex-c-c',
                        item.selectOptionId == c_item.optionId
                          ? 'active'
                          : 'unactive',
                        item.isRight == 0
                          ? 'error'
                          : '',
                          
                      ]" 
                      v-for="(c_item, c_index) in item.optionList"
                      :key="c_index">
                      {{ c_item.optionContent }}
                    </view>
                  </view>
                </view>
              </view>
            </view>
            <view class="C_7f border-box error-tips" :class="{isShow:list[current].isRight == 0}">
              <view class="p-b-20">回答错误</view>
              <view class="">{{list[current].questionTips}}</view>
            </view>
          </view>
          <!-- #ifdef MP -->
          <template>  
            <view class="btn-box flex-b-c" id="btnBox">
              <view :class="{isShow:current>0}" class="btn flex-c-c" @click="last">上一题</view>
              <view :class="{isShow:list[current].restQuestions>0}" class="btn flex-c-c" @click="next">下一题</view>
            </view>
          </template>
          <!-- #endif -->
        </view> 
        <view class="touch-stop-box fixed" v-show="clickHoldMap['answer']" @click.stop="noAction"></view>
      </view>
    </template>
  </frame-box>
</template>

<script>
  import sysInfosHandler from "@/common/helper/sys-infos-handler";
  import SMH from "@/common/helper/show-msg-handler";
  import oriPopup from "@/components/ori-comps/popup/ori-popup";
  import safeArea from "@/components/safe-area/index.vue";

  const app = getApp();
  const pageOption = Page.BasePage({
    components: {
      oriPopup,
      safeArea,
    },
    data() {
      return {
        noneFn: "",
        submitShow: false,
        navHeight: sysInfosHandler.navHeight || 40,
        current: 0,
        pageIndex: 0,
        pageSize: 2,
        totalCount: 0,
        preview: 5, //提前X道题预加载题目
        btnActive: false,
        btnDismiss: false,
        list: [],
        hasMore: true,
        isFinish: false,
        swiperStyle: "",
        acInfo: {},
        popupH5Bool: false,
        //
        screenPage: 3, // 仅加载前 中 后3屏数据
        answerIng: false,

        // 跳题
        questionIndex: 0,
        restQuestions: 0,
        answerCount: 0,
        examRecordId:0
      };
    },
    onLoad(options) {
      this.options = options;
    },
    onReady() {
      this.checkInit();
    },
    computed: {
      CurPreviewNum() {
        return this.current + this.preview;
      },
    },
    methods: {
      checkInit(){
        this.loadData(1, 0).then(() => {
          // this.searchTargetQuestion(0, 0)
          this.getBoxH();
        });
      },
      searchTargetQuestion(nextQuestionId, fromQuestionId) {
        console.log('searchTargetQuestion',nextQuestionId, fromQuestionId)
        let list = this.list;
        let current;
        if (!nextQuestionId) {
          this.current = 0;
          this.loadData();
          return;
        }
        let question = list.filter((item, i) => {
          if (item.questionId == nextQuestionId) current = i
          return item.questionId == nextQuestionId
        })
        console.log('question',question);
        if (question && question.length > 0) {
          if (fromQuestionId) this.list[current].fromQuestionId = fromQuestionId;
          this.current = current
        } else {
          this.answerIng = true;
          this.loadData().then((res) => {
            if (res.code) {
              this.searchTargetQuestion(nextQuestionId, fromQuestionId)
            }
          }).finally(()=>{
            this.answerIng = false;
          })
        }
      },
      // getActInfo() {
      //   return this.$Http(this.$Apis.getExamModel, {
      //     data: {
      //       modelId : this.options.modelId ,
      //     },
      //   }).then((res) => {
      //     if (res.code == 1) {
      //       let data = res.data || {};
      //       // 判断剩余题目
      //       if (!data.answerCount) {
      //         this.restQuestions = data.questionCount;
      //       } else if (!data.lastQuestion.nextQuestionId && data.lastQuestion.questionId) {
      //         this.restQuestions = 0
      //       } else {
      //         this.restQuestions = data.lastQuestion.restQuestions;
      //       }
      //       this.answerCount = data.answerCount||0;
      //       this.acInfo = data;
      //     }
      //   });
      // },
      loadData(pageIndex = 0, pageSize = 0) {
        if (!this.hasMore) {
          return Promise.reject();
        }
        if (!pageIndex) pageIndex = this.pageIndex + 1;
        if (!pageSize) pageSize = this.pageSize;
        return this.$Http(this.$Apis.getAnswerCoupon, {
          data: {
            examRecordId:this.options.examRecordId,
            skip: parseInt(pageIndex - 1) * this.pageSize, // 跳过行数
            take: pageSize, // 取得行数
          },
          other: {
            isShowLoad: true,
          },
        }).then((res) => {
          if (res.code == 1) {
            this.pageIndex = pageIndex;
            let data = res.data || {};
            let list = data.list || [];
            this.totalCount = data.totalCount || 0;
            this.hasMore = pageIndex * pageSize < this.totalCount;
            this.list = this.list.concat(list);
            this.mixShowPage = true;
          }
          return res;
        });
      },
      onAnswer(id, index, optionItem) {
        console.log('onAnswer',index,id, optionItem)
        if (this.list[this.current].questionId != this.list[index].questionId) return
        if (index != this.totalCount - 1) {
          let check = this._clickHold("answer", 400);
          if (!check) return;
        }
        if (this.answerIng) return;
        this.answerIng = true;
        let item = this.list[index];
        let list = this.list;
        console.log(item.restQuestions, "剩余题目")
        // 如果后续题目路线不一样，清空后续选项
        let lastSelectItem = item.optionList.filter(optionChild => {
          return optionChild.optionId == item.selectOptionId
        });
        if (lastSelectItem.length > 0 && (lastSelectItem[0].nextQuestionId != optionItem.nextQuestionId)) {
          list.map((item, i) => {
            if (i > index) {
              item.questionIndex = 0;
              item.selectOptionId = 0;
            }
          })
          this.list = list;
        }
        item.selectOptionId = id || 0;
        
          

        this.restQuestions = item.restQuestions;
        // 答题完成
        // if (this.isFinish || item.restQuestions == 0 || optionItem.nextQuestionId == 0) {
        //   this.setSubmitBtn();
        //   this.restQuestions = 0;
        //   list.map((item, i) => {
        //     if (i > index) {
        //       item.questionIndex = 0;
        //       item.selectOptionId = 0;
        //     }
        //   })
        //   this.list = list;
        //   return
        // } else {
        //   this.setSubmitBtn(false);
        // }
        if (item.restQuestions > 0) {
          console.log('itemitem',item)
          this.searchTargetQuestion(optionItem.nextQuestionId, item.questionId)
          this.answerCount += 1
          // if (
          //   this.isFinish ||
          //   (optionItem.nextQuestionId == 0 &&
          //     this.list[this.current] &&
          //     this.list[this.current].selectOptionId > 0)
          // ) {
          //   this.setSubmitBtn();
          // }
        }
        setTimeout(() => {
          this.answerIng = false;
        }, 300)
      },

      // submit(index) {
      //   let item = this.list[index] || {};
      //   if (item.selectOptionId <= 0) {
      //     SMH.showToast({
      //       title: `第${index + 1}道题目答案异常`,
      //     });
      //     return;
      //   }
      //   let answerList = [{
      //     optionId: item.selectOptionId || 0,
      //     questionId: item.questionId || 0,
      //   }, ];
      //   return this.$Http(this.$Apis.submitExam, {
      //     data: {
      //       contentId: this.options.contentId || 0,
      //       courseId: this.options.courseId || 0,
      //       answerList,
      //     },
      //     other: {
      //       isShowLoad: true,
      //     },
      //   }).then((res) => {
      //     if (res.code == 1) {
      //       let data = res.data || {};
      //       this.examRecordId = data.examRecordId||0;
      //       this.isFinish = data.isFinish || false;
      //       return Promise.resolve(res);
      //     } else {
      //       return Promise.reject(res);
      //     }
      //   });
      // },
      
      // setSubmitBtn(bool = true) {
      //   if (bool) {
      //     if (this.submitShow) return;
      //     this.submitShow = true;
      //     setTimeout(() => {
      //       this.btnDismiss = false;
      //       this.btnActive = true;
      //     }, 50);
      //   } else {
      //     if (this.btnDismiss) return;
      //     this.btnActive = false;
      //     this.btnDismiss = true;
      //     setTimeout(() => {
      //       this.submitShow = false;
      //       this.btnDismiss = false;
      //     }, 400);
      //   }
      // },
      last() {
        if (this.current == 0) return
        //  !this.isFinish && this.submitShow && this.setSubmitBtn(false);
        this.answerCount -= 1;
        let list = this.list;
        // 计算剩余题目数
        let restQuestions;
        let fromQuestionId = this.list[this.current].fromQuestionId;
        list.map((item, i) => {
          if (item.questionId == fromQuestionId) restQuestions = item.restQuestions
        })
        this.restQuestions = restQuestions;
        // 计算剩余题目数 End
        this.searchTargetQuestion(this.list[this.current].fromQuestionId);
      },
      next(){
        // if (this.current == this.list.length-1) return;
        console.log('this.list',this.list,this.current)
        let item = this.list[this.current] || {};
        let index = item.optionList.findIndex(i=>{console.log(i,item);return i.optionId == item.selectOptionId})
        console.log('findIndex',index)
        let option = item.optionList[index];
        this.onAnswer(item.selectOptionId,this.current,option);
      },
      back(type) {
        let ref = "popup";
        // #ifdef H5
        ref = "popup_h5"
        // #endif
        if (type == "check") {
          // #ifdef H5
          this.popupH5Bool = true
          // #endif
          this.$refs[ref].show();
        } else if (type == "goon") {
          // #ifdef H5
          this.popupH5Bool = false
          // #endif
          this.$refs[ref].dismiss();
        } else {
          this.backAction();
        }
      },
      getPercent(cur, len) {
        return Number((cur / len).toFixed(2)) * 100;
      },
      submitFinish() {
        // let index = -1;
        // let check = this.list.every((item, i) => {
        //   index = i;
        //   return item.selectOptionId > 0;
        // });
        if (!this.isFinish) {
          SMH.showToast({
            title: `还有未打完的题目，请检查`,
          });
          // this.current = index;
          return;
        }
        return this.$Http(this.$Apis.finishExam, { 
          data:{
            activityId:Number(this.options.activityId),
            courseId:this.options.courseId,
            examRecordId:this.examRecordId||0
          }, 
          other: {
            isShowLoad: true,
          },
        }).then((res) => {
          if (res.code) {
            this.redirectAction(
              `/pages/activities/exam/answer/exam-record?activityId=${this.options.activityId||0}&contentId=${this.this.options.contentId}&courseId=${this.this.options.courseId}`
            );
          } else {
            app.SMH.showToast({
              title: res.msg,
            });
          }
        });
      },
      getBoxH() {
        return this._getQuery("#swiperId,#btnBox", "all").then((res) => {
          let swiperInfo = (res[0] && res[0][0]) || {};
          let footerInfo = (res[0] && res[0][1]) || {};
          let height =
            footerInfo.top - swiperInfo.top > 0 ?
            footerInfo.top - swiperInfo.top + "px" :
            "70vh";
          this.swiperStyle = `height:${height};`;
          console.log("_getQuery", res, this, this.swiperStyle);
          return this.swiperStyle;
        });
      },
    },
  });
  export default pageOption;
</script>

<style lang="scss" scoped>
  @import "./H5.scss";
  @import "./MP.scss";

  .answer {
    .msg-box {
      width: 320rpx;
    }

    .box {
      padding-top: 80rpx;
      padding-bottom: 180rpx;
    }

    .tips {
      font-size: 26rpx;
      color: #b2b2b2;
      text-align: center;
    }

    .swiper {
      width: 100%;
      box-sizing: border-box;
      overflow-x: hidden;
      overflow-y: auto;

      &.showSubmit {
        // padding-bottom: 190rpx;
        padding-bottom: 40rpx;
      }
    }

    .swiper-item-box {
      flex-wrap: nowrap;
      transition: transform 0.3s linear;
      width: 100%;
    }

    .swiper-item {
      width: 100%;
      transition: opacity 0.35s;
      opacity: 0;
      flex-shrink: 0;
    }

  
    .swiper-item-action {
      opacity: 1;
    }

    .sp-item {
      width: 100%;
      height: 100%;
    }

    .item-box {
      padding: 0 90rpx;
    }

    .title {
      font-size: 38rpx;
      padding-top: 35rpx;
      padding-bottom: 60rpx;
      text-align: center;
    }

    .answer-box {
      text-align: center;
      padding-bottom: 90rpx;
    }

    .answer-item {
      border-radius: 58rpx;
      font-size: 32rpx;
      margin-bottom: 35rpx;
      box-sizing: border-box;
      padding: 0 60rpx;
      border: 1px solid #e4e4e4;
      background: unset;

      &:last-child {
        margin-bottom: 0;
      }

      &.active {
        color: #fff;
        background: $uni-main-color;
        &.error{
          background: #F0570F;
        }
      }

      &.unactive:hover {
        background: rgba($color: #fafafa, $alpha: 1);
      }
    }

    .btn-box {
      position: fixed;
      bottom: 45rpx;
      left: 0;
      width: 100%;
      padding:0 35rpx;
      box-sizing: border-box;
    }

    .btn,
    .sm-btn {
      width: 200rpx;
      height: 110rpx;
      border-radius: 58rpx;
      font-size: 28rpx;
      color: #b2b2b2;
      background: #fafafa;
      margin-right: 20rpx;

      &:last-child {
        margin-right: 0;
      }
    }
    .btn{
      opacity: 0;
      transition: all 0.3s;
      &.isShow{
        opacity: 1;
      }
    }

    .submit {
      width: 420rpx;
      height: 110rpx;
      border-radius: 58rpx;
      background-color: $uni-main-color;
      color: #fff;
      box-shadow: 0 9rpx 44rpx 0 rgba(40, 176, 20, 0.45);
      position: absolute;
      left: 255rpx;
      transform: scale3d(0, 1, 1);
      transform-origin: right;
      opacity: 0;

      &.active {
        animation: activeAnim 0.6s forwards;
      }

      &.dismiss {
        animation: dismissAnim 0.4s forwards;
      }
    }

    .margin-box {
      padding: 20px;
      box-sizing: border-box;
      border-radius: 20rpx;
    }

    .progress-box {
      padding: 0 38rpx;
      box-sizing: border-box;
      width: 550rpx;
    }

    .progress {
      width: 100%;
    }

    .touch-stop-box {
      width: 100%;
      height: 100vh;
      z-index: 9999;
      background-color: transparent;
    }

    .blur {
      filter: blur(3px);
    }
  }

  .goon-btn {
    width: 440rpx;
    height: 140rpx;
    background: #21b014;
    border-radius: 20rpx;
    margin-top: 160rpx;
    font-size: 24rpx;
  }

  .popup-content {
    box-shadow: 0 -15rpx 30rpx 1px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    text-align: center;
  }

  .popip-title {
    padding: 65rpx 0 45rpx 0;
  }

  .popip-tips {
    padding-bottom: 65rpx;
  }

  .pop-btn-box {
    padding-bottom: 50rpx;
    box-sizing: border-box;
  }

  .pop-btn {
    background: #fafafa;
    border-radius: 58rpx;
    width: 300rpx;
    height: 100rpx;

    &.active {
      background: #eefaef;
      color: #5ecf68;
      margin-left: 28rpx;
    }
  }

  @keyframes activeAnim {
    0% {
      border-radius: 50%;
      opacity: 0;
      transform: scale3d(0.15, 1, 1);
    }

    50% {
      border-radius: 58rpx;
      opacity: 1;
    }

    100% {
      border-radius: 58rpx;
      opacity: 1;
      transform: scale3d(1, 1, 1);
    }
  }

  @keyframes dismissAnim {
    0% {
      border-radius: 58rpx;
      opacity: 1;
      transform: scale3d(1, 1, 1);
    }

    20% {
      border-radius: 58rpx;
      color: transparent;
    }

    100% {
      border-radius: 50%;
      box-shadow: 0 9rpx 44rpx 0 transparent;
      font-size: 0;
      opacity: 0;
      transform: scale3d(0.15, 1, 1);
    }
  }
  .error-tips{
    padding:0 60rpx;
    opacity: 0;
    transition: all 0.2s;
    &.isShow{
      opacity: 1;
    }
  }
</style>