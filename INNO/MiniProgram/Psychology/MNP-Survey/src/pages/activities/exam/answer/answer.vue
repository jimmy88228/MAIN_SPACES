<template>
  <frame-box :showPage="mixShowPage">
    <template v-slot:body>
      <view class="answer flex-s-s flex-col" :class="[popupH5Bool ? 'blur' : '']">
        <!-- #ifdef MP -->
        <page-nav :isCustomContent="true" mode="None">
          <template v-slot:custom-content>
            <view class="progress-box flex-s-c" :style="'height:' + navHeight + 'px;'">
              <!-- <view class="progress-title C_7f f-shrink-0 bold p-r-20"><text
                  class="font-24">进度{{ answerCount + 1 }}</text>/<text
                  class="font-18 C_B2">{{ answerCount + restQuestions}}</text>
              </view> -->
              <view class="progress-title C_7f f-shrink-0 bold p-r-20"><text class="font-24">进度</text>
              </view>
              <view class="progress">
                <progress :percent="getPercent(isFinish?answerCount:answerCount + 1, answerCount + restQuestions)"
                  active active-mode="forwards" :duration="10" stroke-width="6" border-radius="8" activeColor="#21B014"
                  backgroundColor="rgba(216,216,216,0.3)" />
              </view>
            </view>
          </template>
        </page-nav>
        <!-- #endif -->

        <!-- #ifdef H5 -->
        <view class="margin-box">
          <view class="progress-box flex-b-c">
            <view class="msg-box">
              <view class="progress">
                <progress :percent="getPercent(isFinish?answerCount:answerCount + 1, answerCount + restQuestions)"
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
              <view v-for="(item, index) in list" :key="index" class="swiper-item flex-s-s" :class="{'swiper-item-action':current == index}">
                <scroll-view class="flex1" scroll-y>
                <view class="item-box">
                  <view class="title bold">
                    {{index+1}}.{{ item.question || "" }}
                  </view>
                  <view class="answer-box flex-c-c flex-col" v-if="item.optionList">
                    <button :class="[
                        'answer-item',
                        'bold',
                        'flex-c-c',
                        item.selectOptionId == c_item.optionId
                          ? 'active'
                          : 'unactive',
                      ]" @click="onAnswer(c_item.optionId, index,c_item)" v-for="(c_item, c_index) in item.optionList"
                      :key="c_index">
                      {{ c_item.optionContent }}
                    </button>
                  </view>
                </view>
                </scroll-view>
              </view>
            </view>
          </view>
          <!-- #ifdef H5 -->
          <safe-area v-if="submitShow" areaType="bottom" position="sticky" class="flex-c-c" :extra="0"
            boxStyle="box-sizing: border-box;padding:40rpx 0;background: #fff;box-shadow: 0 -5px 10px rgb(0,0,0,0.05);border-radius:0 0 20rpx 20rpx;">
            <button class="flex-c-c submit relative" style="position: relative; left: unset;transform:unset;"
              :class="{ active: btnActive, dismiss: btnDismiss }" @click="submitFinish">
              提交
            </button>
          </safe-area>
          <!-- #endif -->

          <!-- #ifdef MP -->
          <view class="btn-box flex-s-c" id="btnBox">
            <view class="btn flex-c-c" @click="last">上一题</view>
            <view class="btn flex-c-c" @click="back('check')">暂停返回</view>
            <view class="flex-c-c submit" :class="{ active: btnActive, dismiss: btnDismiss }" v-if="submitShow"
              @click="submitFinish">提交</view>
          </view>
          <!-- #endif -->
        </view>
        <view class="touch-stop-box fixed" v-show="clickHoldMap['answer']" @click.stop="noAction"></view>
      </view>
    </template>
    <template v-slot:common>
      <ori-popup ref="popup" type="bottom" :is-mask-click="false" background-color="#fff"
        mask-background-color="transparent">
        <template v-slot:content>
          <view class="popup-content">
            <view class="popip-title font-38 bold C_222">确认暂停测评吗？</view>
            <view class="popip-tips font-28 C_7f">为你保留当前进度，休息一会记得回来噢～
            </view>
            <view class="pop-btn-box font-30 flex-c-c">
              <button class="pop-btn C_B2" @click="back('goon')">继续做题</button>
              <button class="pop-btn active" @click="back">确认退出</button>
            </view>
          </view>
        </template>
      </ori-popup>
      <ori-popup ref="popup_h5" type="center" :is-mask-click="false" mask-background-color="rgba(0,0,0,0.6)">
        <template v-slot:content>
          <view class="popup-content">
            <view class="C_fff">已暂停测评</view>
            <button class="goon-btn C_fff flex-c-c" @click="back('goon')">
              继续测评
            </button>
          </view>
        </template>
      </ori-popup>
    </template>
  </frame-box>
</template>

<script>
  import sysInfosHandler from "@/common/helper/sys-infos-handler";
  import SMH from "@/common/helper/show-msg-handler";
  import oriPopup from "@/components/ori-comps/popup/ori-popup";
  import safeArea from "@/components/safe-area/index.vue";
  import courseManage from "@/common/manager/course-manage.js";

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
        pageSize: 5,
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
        examRecordId: 0,
      };
    },
    onLoad(options) {
      this.options = options;
    },
    onReady() {
      this.getActInfo().then(() => {
        // 创建测评记录id
        this.createExamRecordId()
        this.init();
      });
    },
    computed: {
      CurPreviewNum() {
        return this.current + this.preview;
      },
    },
    // onShareAppMessage(e){},
    methods: {
      init() {
        let allCount = parseInt(this.acInfo.questionCount || 0);

        let lastPageIndex = Math.ceil(allCount / this.pageSize);
        let lastPageSize = lastPageIndex * this.pageSize;
        this.loadData(1, lastPageSize).then(() => {

          if (!this.acInfo.lastQuestion.nextQuestionId && this.acInfo.lastQuestion.questionId) {
            this.searchTargetQuestion(this.acInfo.lastQuestion.questionId, this.acInfo.lastQuestion
              .fromQuestionId)
            this.isFinish = true;
            this.setSubmitBtn()
          } else {
            this.searchTargetQuestion(this.acInfo.lastQuestion.nextQuestionId, this.acInfo.lastQuestion
              .questionId)
          }

          this.pageIndex = lastPageIndex;
          this.getBoxH();

        });
      },
      createExamRecordId(){
        return this.$Http(this.$Apis.createExamRecord,{
          data:{
            recordId:courseManage.recordId,
            contentId:this.options.contentId
          }
        }).then(res=>{
          if(res.code){
            this.examRecordId = res.data
          }
        })
      },
      searchTargetQuestion(nextQuestionId, fromQuestionId) {
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
        if (question && question.length > 0) {
          console.log(this.list[current], fromQuestionId)
          if (fromQuestionId) this.list[current].fromQuestionId = fromQuestionId;
          this.current = current
        } else {
          this.loadData().then((res) => {
            if (res.code) {
              this.searchTargetQuestion(nextQuestionId, fromQuestionId)
            }
          })
        }
      },
      getActInfo() {
        return this.$Http(this.$Apis.getExamModel, {
          data: {
            // activityId:this.options.activityId,
            modelId: this.options.modelId,
            contentId:this.options.contentId,
            recordId:courseManage.recordId
          },
        }).then((res) => {
          if (res.code == 1) {
            let data = res.data || {};
            // 判断剩余题目
            if (!data.answerCount) {
              this.restQuestions = data.questionCount;
            } else if (!data.lastQuestion.nextQuestionId && data.lastQuestion.questionId) {
              this.restQuestions = 0
            } else {
              this.restQuestions = data.lastQuestion.restQuestions;
            }
            this.answerCount = data.answerCount;
            this.acInfo = data;
          }
        });
      },
      loadData(pageIndex = 0, pageSize = 0) {
        if (!this.hasMore) {
          return Promise.reject();
        }
        if (!pageIndex) pageIndex = this.pageIndex + 1;
        if (!pageSize) pageSize = this.pageSize;
        return this.$Http(this.$Apis.getExamQuestionList, {
          data: {
            activityId: this.options.activityId || 0,
            contentId: this.options.contentId || 0,
            modelId: this.options.modelId || 0,
            skip: parseInt(pageIndex - 1) * this.pageSize, // 跳过行数
            take: pageSize, // 取得行数
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
        item.selectOptionId = id;
        this.submit(index).then(() => {

          this.restQuestions = item.restQuestions;
          // 答题完成
          if (this.isFinish || item.restQuestions == 0 || optionItem.nextQuestionId == 0) {
            this.setSubmitBtn();
            this.restQuestions = 0;
            list.map((item, i) => {
              if (i > index) {
                item.questionIndex = 0;
                item.selectOptionId = 0;
              }
            })
            this.list = list;
            return
          } else {
            this.setSubmitBtn(false);
          }
          if (item.restQuestions > 0) {
            this.searchTargetQuestion(optionItem.nextQuestionId, item.questionId)
            this.answerCount += 1;
            if (
              this.isFinish ||
              (optionItem.nextQuestionId == 0 &&
                this.list[this.current] &&
                this.list[this.current].selectOptionId > 0)
            ) {
              this.setSubmitBtn();
            }
          }
          // 需要加载更多数据
          // if (
          //   this.hasMore &&
          //   this.CurPreviewNum >= this.pageIndex * this.pageSize
          // ) {
          //   this.loadData();
          // }
        }).finally(() => {
          setTimeout(() => {
            this.answerIng = false;
          }, 300)
        })
      },
      submit(index) {
        let item = this.list[index] || {};
        if (item.selectOptionId <= 0) {
          SMH.showToast({
            title: `第${index + 1}道题目答案异常`,
          });
          return;
        }
        let answerList = [{
          optionId: item.selectOptionId || 0,
          questionId: item.questionId || 0,
        }, ];
        return this.$Http(this.$Apis.submitExam, {
          data: {
            // activityId: Number(this.options.activityId) || 0,
            // contentId: this.options.contentId || 0,
            // courseId: this.options.courseId || 0,
            examRecordId:this.examRecordId,
            recordId:courseManage.recordId,
            answerList,
          },
          other: {
            isShowLoad: true,
          },
        }).then((res) => {
          if (res.code == 1) {
            let data = res.data || {};
            // this.examRecordId = data.examRecordId || 0;
            this.isFinish = data.isFinish || false;
            this.isFinish && (this.restQuestions = 0);
            return Promise.resolve(res);
          } else {
            return Promise.reject(res);
          }
        });
      },
      setSubmitBtn(bool = true) {
        if (bool) {
          if (this.submitShow) return;
          this.submitShow = true;
          setTimeout(() => {
            this.btnDismiss = false;
            this.btnActive = true;
          }, 50);
        } else {
          if (this.btnDismiss) return;
          this.btnActive = false;
          this.btnDismiss = true;
          setTimeout(() => {
            this.submitShow = false;
            this.btnDismiss = false;
          }, 400);
        }
      },
      last() {
        if (this.current == 0) return !this.isFinish && this.submitShow && this.setSubmitBtn(false);
        this.answerCount -= 1;
        let list = this.list;
        // 计算剩余题目数
        let restQuestions;
        let fromQuestionId = this.list[this.current].fromQuestionId;
        console.log('计算剩余题目数', fromQuestionId, list)
        list.map((item, i) => {
          if (item.questionId == fromQuestionId) restQuestions = item.restQuestions
        })
        this.restQuestions = this.isFinish ? restQuestions : restQuestions+1
        // 计算剩余题目数 End
        this.searchTargetQuestion(this.list[this.current].fromQuestionId);
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
        if (!this.isFinish) {
          SMH.showToast({
            title: `还有未打完的题目，请检查`,
          });
          return;
        }
        return this.$Http(this.$Apis.finishExam, {
          data: {
            // activityId:Number(this.options.activityId),
            // contentId:this.options.contentId
            examRecordId:this.examRecordId
          },

          other: {
            isShowLoad: true,
          },
        }).then((res) => {
          if (res.code) {
            courseManage.getCourseList(this.options.activityId || 0);
            if(this.options.comeFrom == 'record'){
              this.backAction()
            }else{
              this.redirectAction(
                `/pages/activities/exam/answer/exam-record?activityId=${this.options.activityId||0}&contentId=${this.options.contentId||0}&courseId=${this.options.courseId||0}&modelId=${this.options.modelId||0}`
              );
            }
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
    height: 100vh;
    width: 100%;

    .msg-box {
      width: 320rpx;
    }

    .box {
      padding-top: 80rpx;
      padding-bottom: 180rpx;
      overflow-y: hidden;
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
      overflow-y: hidden;

      &.showSubmit {
        padding-bottom: 40rpx;
      }
    }

    .swiper-item-box {
      flex-wrap: nowrap;
      transition: transform 0.3s linear;
      width: 100%;
      height: 100%;
    }

    .swiper-item {
      width: 100%;
      height: 100%;
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
      padding-left: 35rpx;
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
</style>