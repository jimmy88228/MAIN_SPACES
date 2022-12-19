<template>
  <frame-box>
    <template v-slot:body>
      <view class="answer flex-s-s flex-col" :class="[popupH5Bool ? 'blur' : '']">
        <!-- #ifdef MP -->
        <page-nav mode="None"></page-nav>
        <!-- #endif -->
        <view v-show="showLoading" class="loading-view flex-c-c">
          <loading-view></loading-view>
        </view>
         <view class="evaluating-bg-area-cover" v-if="answerBgImg && !isH5 && !showLoading">
          <image class="evaluating-bg-area-cover-image" @load="getBgSize" :style="{height:bgHeight,width:bgWidth}"
            :src="answerBgImg" />
        </view>
        <view v-show="!showLoading" class="flex-s-s flex-col flex1 main-box box flex-col-1">
          <view class="tips" style="padding: 0px 80rpx" v-if="acInfo.modelInstruction"> {{ acInfo.modelInstruction }}
          </view>
          <view id="swiperId" class="swiper flex1" :class="[isFinish ? 'showSubmit' : '']">
            <view class="swiper-item-box flex-s-s" v-if="list.length>0"
              :style="'transform:translateX(-' + current * 100 + '%);'">
              <view v-for="(item, index) in list" :key="index" class="swiper-item flex-s-s"
                :class="{'swiper-item-action':current == index}">
                <scroll-view class="flex1" scroll-y>
                  <view class="item-box">
                    <!--v-show="current == index"-->
                    <view class="title bold"> {{ item.question || "" }}</view>
                    <!-- ,current == index?buttonAnimation:'' -->
                    <view :class="['answer-box','flex-c-c','flex-col' ]" v-if="item.optionList">
                      <view v-show="item.optionList.length>7">
                        <ori-picker @pickerChange="(e) => pickerChange(e, 'optionSelect')" range-key="optionContent"
                          mode="selector" :range="item.optionList" :pickerValue="item.pickerValue">
                          <template v-slot:content>
                            <view
                              :class="['font-32', 'answer-select', 'flex-b-c',current == index ? buttonAnimation : 'animate-fade-out-down']">
                              <template v-if="item.pickerValue == -1">
                                <view class="C_8E">请选择选项</view>
                              </template>
                              <template v-else>
                                <view class="bold">{{item.optionList[item.pickerValue].optionContent}}</view>
                              </template>
                              <view :style="{color:brandStyle.themeColor}">选择</view>
                            </view>
                          </template>
                        </ori-picker>
                        <view v-if="index < list.length - 1"
                          :class="['answer-confirm','flex-c-c','font-32','bold',current == index ? buttonAnimation : 'animate-fade-out-down',item.pickerValue == -1?'grey-button':'primary-button']"
                          @click="selectPicker()">
                          下一题
                        </view>
                      </view>
                      <view v-show="item.optionList.length<=7">
                        <!-- ,current == index ? buttonAnimation : 'animate-fade-out-down' -->
                        <button :class="[
                        'answer-item',
                        'bold',
                        'flex-c-c',
                        item.selectOptionId == c_item.optionId
                          ? 'active'
                          : '' 
                      ]" @click="onAnswer(c_item.optionId, index,c_item)" v-for="(c_item, c_index) in item.optionList"
                          :key="c_index">
                          <!-- :style="{'animation-delay':`${current == index ? c_item.showTime : 0}s`}" -->
                          {{ c_item.optionContent }}
                        </button>
                      </view>
                    </view>
                  </view>
                </scroll-view>
              </view>
            </view>
          </view>
          <!-- #ifdef H5 -->
          <safe-area v-if="submitShow" areaType="bottom" position="sticky" class="flex-c-c" :extra="0"
            boxStyle="box-sizing: border-box;padding:40rpx 0;background: #fff;box-shadow: 0 -5px 10px rgb(0,0,0,0.05);border-radius:0 0 20rpx 20rpx;">
            <button class="flex-c-c submit relative" style="position: relative; left: unset; transform: unset"
              :class="{ active: btnActive, dismiss: btnDismiss }" @click="submitFinish">
              提交
            </button>
          </safe-area>
          <!-- #endif -->

          <!-- #ifdef MP -->
          <view class="btn-box flex-s-c" id="btnBox">
            <view class="btn flex-c-c" @click="last">上一题</view>
            <view class="btn flex-c-c" @click="back('check')">暂停/返回</view>
            <view v-if="acInfo.multiChoice == 1" class="btn next-question flex-c-c" @click="next">下一题</view>
            <view class="flex-c-c submit" :class="{ active: btnActive, dismiss: btnDismiss }" @click="submitFinish">
              信息确认无误，进入测评</view>
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
              <button class="pop-btn C_7f" @click="back('goon')">
                继续做题
              </button>
              <button class="pop-btn active" @click="back">确认退出</button>
            </view>
          </view>
        </template>
      </ori-popup>
      <ori-popup ref="popup_h5" type="center" :is-mask-click="false" mask-background-color="rgba(0,0,0,0.6)">
        <template v-slot:content>
          <view class="popup-content">
            <view class="C_fff">已暂停评测</view>
            <button class="goon-btn C_fff flex-c-c" @click="back('goon')">
              继续评测
            </button>
          </view>
        </template>
      </ori-popup>
    </template>
  </frame-box>
</template>

<script>
  import utils from '@/common/support/utils.js'
  import LoadingView from '@/components/css3/loading/loading.vue';
  import sysInfosHandler from "@/common/helper/sys-infos-handler";
  import SMH from "@/common/helper/show-msg-handler";
  import oriPicker from "@/components/ori-comps/picker/ori-picker.vue";
  import oriPopup from "@/components/ori-comps/popup/ori-popup";
  import safeArea from "@/components/safe-area/index.vue";

  const app = getApp();
  const pageOption = Page.BasePage({
    components: {
      LoadingView,
      oriPopup,
      safeArea,
      oriPicker,
    },
    data() {
      return {
        // *背景图
        bgHeight: 0,
        bgWidth: 0,
        //********/
        buttonAnimation: 'animate-fade-in-right',
        showLoading: true,
        modelId: 0,
        noneFn: "",
        shinishShow: false,
        submitShow: false,
        navHeight: sysInfosHandler.navHeight || 40,
        current: 0,
        pageIndex: 0,
        pageSize: 5,
        totalCount: 0,
        demographicAnswerCount: 0,
        restQuestions: 0,
        preview: 5, //提前X道题预加载题目
        answerPadding: false,
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
        optionsPickerValue: -1
      };
    },
    onLoad(options) {
      this.options = options;
    },
    onReady() {
      this.getActInfo().then(() => {
        this.init();

      });
    },
    watch: {
      current: {
        handler(nV, oV) {
          if (nV < oV) {
            this.buttonAnimation = "animate-fade-in-left"
          } else {
            this.buttonAnimation = "animate-fade-in-right"
          }
        }
      }
    },
    computed: {
      CurPreviewNum() {
        return this.current + this.preview;
      },
       answerBgImg() {
        let acInfo = this.acInfo;
        let evaluateActivitySetting = acInfo.evaluateActivitySetting || {};
        let answerBgImg = evaluateActivitySetting.answerBgImg || ''
        return answerBgImg
      }
    },
    // onShareAppMessage(e){},
    methods: {
      init() {
        let allCount = parseInt(this.acInfo.questionCount || 0);
        let lastPageIndex = Math.ceil(allCount / this.pageSize);
        let lastPageSize = lastPageIndex * this.pageSize;
        this.showLoading = true;
        this.list = [];
        this.isFinish = false;
        this.pageIndex = 0;
        this.hasMore = true;
        this.loadData(1, lastPageSize).then(() => {
          if (!this.acInfo?.demographicLastQuestion?.nextQuestionId && this.acInfo?.demographicLastQuestion?.questionId) {
            this.searchTargetQuestion(this.acInfo.demographicLastQuestion.questionId, this.acInfo?.demographicLastQuestion?.fromQuestionId)
            this.isFinish = true;
            this.setFinishBtn()
          } else {
            this.searchTargetQuestion(this.acInfo?.demographicLastQuestion?.nextQuestionId, this.acInfo?.demographicLastQuestion?.questionId)
          }

          this.pageIndex = lastPageIndex;
          this.getBoxH();
        }).finally(() => {
          setTimeout(() => {
            this.showLoading = false
          }, 300);
        })
      },
      searchTargetQuestion(nextQuestionId, fromQuestionId) {
        let list = this.list;
        let current;
        if (!nextQuestionId) {
          this.current = 0;
          this.loadData()
          return;
        }
        let question = list.filter((item, i) => {
          if (item.questionId == nextQuestionId) current = i
          return item.questionId == nextQuestionId
        })
        if (question && question.length > 0) {
          this.restQuestions = question[0]?.restQuestions;
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
        return this.$Http(this.$Apis.getActivityInfo, {
          data: {
            activityId: this.options.activityId,
          },
        }).then((res) => {
          if (res.code == 1) {
            let data = res.data || {};
            this.modelId = data.modelId;
            this.acInfo = data;
            // 判断剩余题目
            if (!data.demographicAnswerCount) {
              this.restQuestions = Number(data.questionCount) - 1;
              this.demographicAnswerCount = 1;
            } else if (!data.demographicLastQuestion.nextQuestionId && data.demographicLastQuestion
              .questionId) {
              this.restQuestions = 0
              this.demographicAnswerCount = Number(data.demographicAnswerCount)
            } else {
              this.restQuestions = Number(data.demographicLastQuestion.restQuestions) - 1;
              this.demographicAnswerCount = Number(data.demographicAnswerCount) + 1;
            }
            return data
          }
        });
      },
      loadData(pageIndex = 0, pageSize = 0) {
        if (!this.hasMore) {
          return Promise.reject();
        }
        if (!pageIndex) pageIndex = this.pageIndex + 1;
        if (!pageSize) pageSize = this.pageSize;
        return this.$Http(this.$Apis.getDemographicQuestionList, {
          data: {
            activityId: this.options.activityId || 0,
            skip: parseInt(pageIndex - 1) * this.pageSize, // 跳过行数
            take: pageSize, // 取得行数
          },
        }).then((res) => {
          if (res.code == 1) {
            this.pageIndex = pageIndex;
            let data = res.data || {};
            let list = data.questionList.list || [];
            this.totalCount = data.totalCount || 0;
            this.hasMore = pageIndex * pageSize < this.totalCount;
            list.forEach((item) => {
              let optionList = item.optionList;
              let selectOptionId = item.selectOptionId;
              // 适配选择器样式
              if (selectOptionId == 0) {
                item.pickerValue = -1
              } else {
                for (let i = 0; i < optionList.length; i++) {
                  if (optionList[i].optionId == selectOptionId) {
                    item.pickerValue = i
                    continue;
                  }
                }
              }
              // 动画延时
              let time = 0.5;
              item.optionList.forEach((oItem, index) => {
                oItem.showTime = (index * time).toFixed(1);
              })
            })
            this.list = this.list.concat(list);
          }
          return res;
        });
      },
      pickerChange({
        detail
      }) {
        let selectIndex = detail.value;
        let index = this.current;
        let list = this.list;
        let currentItem = list[this.current];
        let optionList = currentItem.optionList;
        let optionItem = optionList[selectIndex];
        let id = optionItem.optionId;
        if (this.answerPadding) return;
        if (index != this.totalCount - 1) {
          let check = this._clickHold("answer", 400);
          if (!check) return;
        }
        // 答案上传中
        this.answerPadding = true;
        // 如果后续题目路线不一样，清空后续选项
        let lastSelectItem = currentItem.optionList.filter(optionChild => {
          return optionChild.optionId == currentItem.selectOptionId
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
        currentItem.pickerValue = selectIndex;
        currentItem.selectOptionId = id;
        this.submit(index).then(() => {
          this.restQuestions = currentItem.restQuestions - 1;
          // 答题完成
          if (this.isFinish || currentItem.restQuestions == 0 || optionItem.nextQuestionId == 0) {
            this.restQuestions = 0;
            this.setFinishBtn()
            return
          }
        }).finally(() => {
          setTimeout(() => {
            this.answerPadding = false;
          }, 300);
        })
      },
      selectPicker() {
        let list = this.list;
        let index = this.current;
        let currentItem = list[index];
        let optionList = currentItem.optionList;
        let optionItem = optionList.filter((item) => {
          return item.optionId == currentItem.selectOptionId
        })[0];
        // let optionItem = optionList[selectIndex];

        if (currentItem.selectOptionId == 0 || currentItem.pickerValue == -1) {
          SMH.showToast({
            title: "请先选择选项"
          })
          return
        }

        if (
          this.isFinish ||
          (optionItem.nextQuestionId == 0 &&
            this.list[this.current] &&
            this.list[this.current].selectOptionId > 0)
        ) {
          this.setFinishBtn()
        } else if (currentItem.restQuestions > 0) {
          this.searchTargetQuestion(optionItem.nextQuestionId, currentItem.questionId)
          this.demographicAnswerCount += 1
          if (this.shinishShow) this.setFinishBtn(false);
          if (this.isFinish) this.isFinish = false;
        }

      },
      onAnswer(id, index, optionItem) {
        if (this.list[this.current].questionId != this.list[index].questionId) return
        if (index != this.totalCount - 1) {
          let check = this._clickHold("answer", 400);
          if (!check) return;
        }
        if (this.answerPadding) return;
        this.answerPadding = true;
        let questionItem = this.list[index];
        let list = this.list;
        // 如果后续题目路线不一样，清空后续选项
        let lastSelectItem = questionItem.optionList.filter(optionChild => {
          return optionChild.optionId == questionItem.selectOptionId
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
        questionItem.selectOptionId = id;
        this.submit(index).then(() => {
          // 定时300毫秒防止动画卡顿
          setTimeout(() => {
            // 答题完成
            if (this.isFinish || optionItem.nextQuestionId == 0) {
              this.restQuestions = 0;
              this.setFinishBtn()
            }

            if (
              this.isFinish ||
              (optionItem.nextQuestionId == 0 &&
                this.list[this.current] &&
                this.list[this.current].selectOptionId > 0)
            ) {
              this.setFinishBtn()
            } else {
              this.searchTargetQuestion(optionItem.nextQuestionId, questionItem.questionId)
              this.demographicAnswerCount += 1
              if (this.shinishShow) this.setFinishBtn(false);
              if (this.isFinish) this.isFinish = false;
            }
          }, 300);
        }).finally(() => {
          setTimeout(() => {
            this.answerPadding = false;
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
        return this.$Http(this.$Apis.submitDemographic, {
          data: {
            activityId: this.options.activityId || 0,
            answerList,
          },
          other: {
            isShowLoad: true,
          },
        }).then((res) => {
          if (res.code == 1) {
            let data = res.data || {};
            this.isFinish = data.isFinish || false;
            return data
          } else {
            return Promise.reject(res);
          }
        });
      },
      // 提交整个答卷按钮显示/隐藏
      setFinishBtn(bool = true) {
        if (bool) {
          if (this.shinishShow) return;
          this.shinishShow = true;
          setTimeout(() => {
            this.btnDismiss = false;
            this.btnActive = true;
          }, 50);
        } else {
          if (this.btnDismiss) return;
          this.btnActive = false;
          this.btnDismiss = true;
          setTimeout(() => {
            this.shinishShow = false;
            this.btnDismiss = false;
          }, 400);
        }
      },
      last() {
        if (this.current == 0) {
          app.SMH.showToast({
            title: "已经是第一题了噢~"
          })
          return
        }
        if (this.shinishShow) this.setFinishBtn(false);
        if (this.isFinish) this.isFinish = false;
        this.demographicAnswerCount -= 1;
        let list = this.list;
        // 计算剩余题目数
        let restQuestions = this.restQuestions;
        let fromQuestionId = this.list[this.current].fromQuestionId;
        list.map((item, i) => {
          if (item.questionId == fromQuestionId) restQuestions = item.restQuestions
        })
        this.restQuestions = restQuestions;
        // 计算剩余题目数 End
        this.searchTargetQuestion(this.list[this.current].fromQuestionId);
      },
      back(type) {
        let ref = "popup";
        this.isH5 && (ref = "popup_h5");
        if (type == "check") {
          this.isH5 && (this.popupH5Bool = true);
          this.$refs[ref].show();
        } else if (type == "goon") {
          this.isH5 && (this.popupH5Bool = false);
          this.$refs[ref].dismiss();
        } else {
          this.backAction();
        }
      },
      getPercent(cur, len) {
        console.log(cur, len, "百分比")
        return Number((cur / len).toFixed(2)) * 100;
      },
      submitFinish() {
        let acInfo = this.acInfo || {};
        let index = -1;
        let check = this.list.every((item, i) => {
          index = i;
          return item.selectOptionId > 0;
        });
        if (!check && !this.isFinish) {
          SMH.showToast({
            title: `第${index + 1}道题目还没答题`,
          });
          this.current = index;
          return;
        }
        this.redirectAction(
          `/pages/activities/evaluating/answer/answer?activityId=${
          acInfo.activityId || 0
        }&current=${acInfo.answerCount || 0}&allCount=${acInfo.questionCount}`
        );

      },
      getBgSize({
        detail
      }) {
        let width = detail.width;
        let height = detail.height;
        utils.getBgSize(width, height).then(res => {
          this.bgWidth = res.imgW + "px"
          this.bgHeight = res.imgH + "px"
          this.isLoadBg = true;
        })
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

  .animate-fade-in-right {
    animation-name: fadeInRight;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
  }

  .animate-fade-in-left {
    animation-name: fadeInLeft;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
  }

  .animate-fade-out-down {
    // animation-name: fadeOutDown;
    // animation-iteration-count: 1;
    // animation-fill-mode: forwards;
  }

  .loading-view {
    position: fixed;
    z-index: 99;
    left: 0;
    top: 0;
    width: 100%;
    min-height: 100vh;
  }

  .answer {
    height: 100vh;
    width: 100%;

  .evaluating-bg-area-cover {
      position: fixed;
      top: 0px;
      left: 0px;
      width: 100%;
      height: 100%;
      z-index: -1;

      .evaluating-bg-area-cover-image {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }

    .msg-box {
      width: 320rpx;
    }

    .main-box {
      // flex: 1
    }

    .box {
      padding-top: 80rpx;
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
        // padding-bottom: 190rpx;
        padding-bottom: 40rpx;
      }
    }

    .swiper-item-box {
      flex-wrap: nowrap;
      transition: transform 0.45s;
      width: 100%;
      height: 100%;
    }

    .swiper-item {
      width: 100%;
      flex-shrink: 0;
      padding-bottom: 175rpx;
      transition: opacity 0.35s;
      opacity: 0;
      height: 100%;
      box-sizing: border-box;
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
      animation-duration: 0.6s;
    }

    .answer-select {
      opacity: 0;
      width: 558rpx;
      height: 120rpx;
      background: #FAFAFA;
      border-radius: 10rpx;
      padding: 0 30rpx 0 40rpx;
      animation-duration: 0.5s;
    }

    .answer-confirm {
      animation-duration: 0.5s;
      margin-top: 26rpx;
      width: 325rpx;
      height: 100rpx;
      border-radius: 10rpx;
      margin: 26rpx auto 0;
      transition: 0.5s all;
      opacity: 0;
    }

    .primary-button {
      color: #FFFFFF;
      background-color: $uni-main-color;
    }

    .grey-button {
      color: #000000;
      background-color: #FAFAFA;
    }

    .answer-item {
      animation-duration: 0.5s;
      opacity: 1;
      border-radius: 10rpx;
      font-size: 26rpx;
      margin-bottom: 20rpx;
      box-sizing: border-box;
      width: 630rpx;
      min-height: 106rpx;
      padding: 0 60rpx;
      // border: 1px solid #e4e4e4;
      background: #FAFAFA;
      color: #333333;
      box-shadow: 0px 2rpx 17rpx 0px rgba(181, 181, 181, 0.17);
      border: 1px solid #EFEFEF;

      &:last-child {
        margin-bottom: 0;
      }

      &.active {
        // color: #fff;
        // background: $uni-main-color;
        border: 2px solid $uni-main-color;
      }

      &.unactive:hover {
        background: rgba($color: #F3F3F3, $alpha: 1);
      }
    }

    .btn-box {
      position: fixed;
      bottom: 0rpx;
      left: 0;
      width: 100%;
      padding-left: 35rpx;
      box-sizing: border-box;
      background: #FFFFFF;
      // padding-top: 20rpx;
      // padding-bottom: 25rpx;
      height: 140rpx;
    }

    .btn,
    .sm-btn {
      width: 200rpx;
      height: 100rpx;
      border-radius: 58rpx;
      font-size: 28rpx;
      color: #7f7f7f;
      // background: #F3F3F3;
      background: #F3F3F3;
      margin-right: 45rpx;

      &:last-child {
        margin-right: 0;
      }
    }

    .next-question {
      background: #F5FAFF;
      color: $uni-main-color;
    }

    .submit {
      width: 420rpx;
      height: 110rpx;
      border-radius: 58rpx;
      background-color: $uni-main-color;
      color: #fff;
      box-shadow: 0px 9rpx 44rpx 0px rgba(6, 80, 155, 0.32);
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
      display: flex;
      justify-content: space-between;
      align-items: center;
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
    background: #F3F3F3;
    border-radius: 58rpx;
    width: 300rpx;
    height: 100rpx;

    &.active {
      background: rgba($color: $uni-main-color, $alpha: 0.2);
      color: $uni-main-color;
      margin-left: 28rpx;
    }
  }

  @keyframes fadeInRight {
    from {
      opacity: 0;
      transform: translateX(20%);
    }

    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes fadeInLeft {
    from {
      opacity: 0;
      transform: translateX(-20%);
    }

    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes fadeOutDown {
    from {
      opacity: 1;
    }

    to {
      opacity: 0;
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