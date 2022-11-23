<template>
  <view class="work-bench-detail" :style="isEmpty ? 'background-color: #fff;' : ''">
    <page-nav>
      <template slot="title">
        <view class="bench-title">
          <view class="font-26 clamp">{{oragnize.structureName || ''}}</view>
          <view class="font-18 C_7f clamp">{{oragnize.parentStructureName || ''}}</view>
        </view>
      </template>
    </page-nav>
    <view class="bench-top-area flex-s-c" :style="{'top':navTop+'px'}">
      <view class="bench-top-item" @click="turnPage" data-mode="caring-staff">
        <image :src="staticAddress+caringStaffIcon" mode="widthFix" />
        <view class="C_7f font-22">
          关爱人员
        </view>
      </view>
      <view class="bench-top-item" @click="turnPage" data-mode="reserve-supervise-list">
        <image :src="staticAddress+reserveSuperviseIcon" mode="widthFix" />
        <view class="C_7f font-22">
          预约督导
        </view>
      </view>
      <view class="bench-top-item" @click="jumpAction('/pages/custom/page/page?type=psycHandbook')">
        <image :src="staticAddress+psychologyBookIcon" mode="widthFix" />
        <view class="C_7f font-22">
          心理手册
        </view>
      </view>
    </view>
    <template v-if="!isEmpty">
      <view v-for="(pageItem,pageIndex) in evalList" :key="pageIndex">
        <view class="eval-list">
          <view class="eval-item bg_fff" v-for="(item,i) in pageItem" :key="i">
            <view class="flex-s-c eval-item-title">
              <view class="C_7f font-22">量表测评</view>
              <view v-if="item.status != 2 && item.status != 3" class="eval-status flex-c-c">
                {{checkStatus(item.status)}}</view>
              <view v-else class="eval-status eval-status-finish flex-c-c">{{checkStatus(item.status)}}</view>
            </view>
            <view class="eval-detail">
              <view class="eval-detail-title flex-b-c">
                <view class="flex-s-c flex1">
                  <image class="eval-icon f-shrink-0" @error="imgerror($event, i, pageIndex)" :src="item.logo"
                    mode="aspectFill" />
                  <view class="flex1 clamp">
                    <view class="font-26 m-b-10 flex1 clamp">{{item.activityName}}</view>
                    <template v-if="item.limitTime != 0">
                      <view class="font-18 C_B2 flex1 clamp" v-if="item.status == 0">活动开始日期
                        {{formatDate(item.startTime)}}
                      </view>
                      <view class="font-18 C_B2 flex1 clamp" v-else>{{formatDate(item.endTime)}} 截止</view>
                    </template>
                  </view>
                </view>
                <view class="activity-code" v-if="item.status == 0">
                  <image :src="staticAddress+blueCodeIcon" mode="widthFix" @click="createCode(item)" />
                  <view class="font-20 C_7f">活动码</view>
                </view>
              </view>
              <view class="count-group flex-a-c" v-if="item.status != 0">
                <view class="count-item">
                  <view class="font-22 C_7f">应收测评</view>
                  <view class="font-44 C_008acb">{{item.receiveCount}}</view>
                </view>
                <view class="count-item">
                  <view class="font-22 C_7f">待收测评</view>
                  <view class="font-44 C_008acb">{{item.waitCount}}</view>
                </view>
                <view class="count-item">
                  <view class="font-22 C_7f">风险预警</view>
                  <view class="font-44 C_008acb">{{item.warningCount}}</view>
                </view>
              </view>
              <view class="split" v-if="item.status != 0"></view>
              <view class="eval-button flex-b-c" v-if="item.status != 0">
                <view class="flex-c-c" @click="createCode(item)">
                  <image :src="staticAddress+bgreyCodeIcon" mode="widthFix" />
                  <view class="font-22 C_7f">生成活动码</view>
                </view>
                <view class="button-split"></view>
                <view class="flex-c-c" @click="participation" :data-receive-count="item.receiveCount"
                  :data-id="item.activityId" :data-p-index="pageIndex">
                  <image :src="staticAddress+participationIcon" mode="widthFix" />
                  <view class="font-22 C_7f">参与情况</view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </template>
    <template v-else>
      <empty>暂无相关活动哦~</empty>
    </template>
    <poster ref="poster"></poster>
    <psychologyProtocol @confirm="confirmProtocol" ref="psychologyProtocol"></psychologyProtocol>
  </view>
</template>

<script>
  import SMH from "@/common/helper/show-msg-handler.js";
  import SIH from "@/common/helper/sys-infos-handler"
  import structureManage from '@/common/manager/structure-manage.js'
  import poster from '@/components/poster/index.vue';
  import psychologyProtocol from '@/components/psychology-protocol/psychology-protocol.vue';
  const app = getApp();
  const pageOption = Page.BasePage({
    components: {
      poster,
      psychologyProtocol
    },
    data() {
      return {
        activityIcon: "/activity-icon.jpg",
        caringStaffIcon: "/caring-staff.png",
        reserveSuperviseIcon: "/reserve-supervise.png",
        psychologyBookIcon: "/psychology-book.png",
        blueCodeIcon: "/blue-code.png",
        bgreyCodeIcon: "/grey-code.png",
        participationIcon: "/participation.png",
        navTop: SIH.navPlace,
        // 组织信息
        oragnize: {},
        oldStructureID: '',
        // 分页
        isEmpty: false,
        pageIndex: 0,
        pageSize: app.Conf.PAGE_SIZE,
        hasMore: true,
        evalList: [],
        activityAppletCode: {},
      }
    },
    onShow() {
      console.log(this.staticAddress, "图片地址")
      let oragnize = app.SM.structureInfo
      this.oragnize = oragnize;
      if (this.clickPage) this.pageIndex = this.clickPage - 1 || 0;
      this.loadData();
    },
    methods: {
      initList() {
        this.evalList = [];
        this.pageIndex = 0;
        this.hasMore = true;
        this.isEmpty = false;
        this.loadData();
      },
      loadData() {
        let pageIndex = this.pageIndex ? this.pageIndex + 1 : 1;
        return this.$Http(this.$Apis.getActivityListByStructure, {
          data: {
            pageIndex: pageIndex,
            pageSize: this.pageSize,
            structureId: this.oragnize.structureId
          },
        }).then((res) => {
          if (res.code == 1) {
            let data = res.data || {};
            this.pageIndex = pageIndex;
            let currPage = pageIndex - 1 ? pageIndex - 1 : 0;
            this.evalList[currPage] = data.list || [];
            this.hasMore = this.pageIndex * this.pageSize < data.totalCount;
            this.setEmpty(this.evalList);
          }
          return res;
        });
      },
      formatDate(date) {
        return date ? date.slice(0, 10) : ''
      },
      checkStatus(status) {
        let tips = ""
        switch (status) {
          case 0:
            tips = "待开始";
            break
          case 1:
            tips = "进行中"
            break
          case 2:
            tips = "已结束";
            break
          case 3:
            tips = "已关闭";
            break
          default:
            break
        }
        return tips
      },
      checkPIndex(pIndex) {
        if (pIndex) {
          this.clickPage = pIndex || 0
        } else {
          this.clickPage = this.pageIndex
        }
      },
      participation({
        currentTarget
      }) {
        console.log(currentTarget.dataset)
        if (currentTarget.dataset.receiveCount == 0) {
          SMH.showToast({
            title: "活动暂无参与人员"
          })
          return
        }
        this.checkPIndex(currentTarget.dataset.pIndex)
        let id = currentTarget.dataset.id
        this.jumpAction(`/pages/work-bench/participation/participation?activityId=${id}`)
      },

      turnPage({
        currentTarget
      }) {
        let mode = currentTarget.dataset.mode;
        if (mode == "caring-staff") {
          this.$refs.psychologyProtocol.showModal();
          return
        }
        this.checkPIndex(currentTarget.dataset.pIndex)
        this.jumpAction(`/pages/work-bench/${mode}/${mode}`)
      },

      confirmProtocol() {
        this.checkPIndex()
        this.jumpAction(`/pages/work-bench/caring-staff/caring-staff`)
      },

      setEmpty(data) {
        if (data instanceof Array) {
          if (data.length == 0 || !data[0] || (data[0] && data[0].length == 0)) {
            this.isEmpty = true;
          } else {
            this.isEmpty = false;
          }
        } else {
          this.isEmpty = false;
        }
      },
      createCode(item = {}) {
        return this.createActivityAppletCode(item.activityId).then(code => {
          this.showPoster({
            title: structureManage.structureInfo.structureName || "",
            tips: item.activityName || "",
            code: code,
            key: item.activityId
          })
        })
      },
      createActivityAppletCode(id) {
        if (this.activityAppletCode[id]) return Promise.resolve(this.activityAppletCode[id]);
        let params = {
          "activityId": id || 0,
          "structureId": structureManage.structureInfo.structureId || 0,
          "appCode": app.Conf.appCode
        }
        return this.$Http(this.$Apis.createActivityAppletCode, {
          data: {
            "activityId": params.activityId,
            "structureId": params.structureId,
            "data": {
              ...params
            }
          }
        }).then(res => {
          if (res.code) {
            this.activityAppletCode[id] = res.data || "";
            return this.activityAppletCode[id]
          }
          return Promise.reject(res);
        })
      },
      imgerror(e, img_index, index) {
        var _this = this;
        var imgChildList = _this.evalList[index];
        if (imgChildList.length > 0) {
          imgChildList[img_index].logo = this.staticAddress + this.activityIcon;
        }
        this.$forceUpdate()
      },
      showPoster(posterData) {
        let arr = [];
        let top = 84;
        arr.push({
          type: "image",
          url: posterData.code,
          css: {
            width: 650,
            height: 448,
            top,
            left: 0,
          }
        });
        top += (448 + 68);
        arr.push({
          type: "text",
          text: posterData.title.slice(0, 10),
          css: {
            textAlign: 'center',
            fontSize: 42,
            fontStyle: "bold",
            color: '#333',
            top,
            left: 0
          }
        });
        if (posterData.title.length > 10) {
          top += (42 + 8);
          arr.push({
            type: "text",
            text: this.setEllipsis(posterData.title.slice(10), 10),
            css: {
              textAlign: 'center',
              fontSize: 42,
              fontStyle: "bold",
              color: '#333',
              top,
              left: 0
            }
          });
        }
        top += (42 + 20);
        arr.push({
          type: "text",
          text: posterData.tips.slice(0, 20),
          css: {
            textAlign: 'center',
            fontSize: 24,
            fontStyle: "bold",
            color: '#333',
            top,
            left: 0
          }
        });
        if (posterData.tips.length > 20) {
          top += (24 + 8);
          arr.push({
            type: "text",
            text: this.setEllipsis(posterData.tips.slice(20), 20),
            css: {
              textAlign: 'center',
              fontSize: 24,
              fontStyle: "bold",
              color: '#333',
              top,
              left: 0
            }
          });
        }
        console.log('arrarr', arr)
        this._getRefs("poster").showModal({
          view: arr,
          key: posterData.key || ""
        })
      },
      setEllipsis(title, len) {
        let result = title;
        if (title.length > len) {
          result = title.slice(0, len - 1) + '...';
        }
        return result;
      }
    },
    onReachBottom() {
      console.log("到达底部");
      if (this.hasMore) {
        this.loadData();
      }
    },
    onReady() {}
  })
  export default pageOption
</script>

<style lang="scss" scoped>
  .work-bench-detail {
    min-height: 100vh;
    background-color: #F7F7F7;

    .bench-title {
      text-align: center;
    }

    .bench-top-area {
      position: sticky;
      z-index: 1;
      padding: 33rpx 36rpx;
      background-color: #FFFFFF;

      .bench-top-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-right: 68rpx;

        &>image {
          width: 80rpx;
          height: 80rpx;
          background: #ECB8A0;
          border-radius: 12rpx;
          margin-bottom: 16rpx;
        }
      }
    }

    .eval-list {
      padding: 22rpx;

      .eval-item {
        border-radius: 22rpx;
        margin-bottom: 16rpx;

        .eval-item-title {
          padding: 32rpx 32rpx 0rpx;

          .eval-status {
            margin-left: 13rpx;
            color: #0083CE;
            font-size: 17rpx;
            width: 64rpx;
            height: 24rpx;
            background: rgba($color: #E7F7FF, $alpha: 0.6);
            border-radius: 4rpx;
            opacity: 0.6;
            border: 1px solid rgba($color: #0083CE, $alpha: 0.6);
          }

          .eval-status-finish {
            color: #9E9E9E !important;
            background: rgba($color: #F1F1F1, $alpha: 0.6) !important;
            border: 1px solid rgba($color: #B2B2B2, $alpha: 0.6) !important;
          }
        }


        .eval-detail {


          .eval-detail-title {
            padding: 0 32rpx 0rpx;
            min-height: 130rpx;

            &>view:first-child {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .eval-icon {
              width: 61rpx;
              height: 61rpx;
              border-radius: 8rpx;
              margin-right: 16rpx;
            }

            .activity-code {
              border-left: 2rpx solid #EFEFEF;
              padding-left: 44rpx;

              &>image {
                width: 55rpx;
                height: 55rpx;
                border-radius: 50%;
                margin-bottom: 16rpx;
              }
            }

          }

          .count-group {
            padding: 0 32rpx 32rpx;

            .count-item {
              width: 200rpx;
              height: 150rpx;
              background: #FAFAFA;
              border-radius: 22rpx;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            }
          }

          .split {
            height: 2rpx;
            width: 100%;
            background-color: rgba($color: #979797, $alpha: 0.2);
          }

          .eval-button {
            position: relative;

            &>view {
              width: 50%;
              box-sizing: border-box;
              padding: 32rpx 0;

              &>image {
                width: 26rpx;
                height: 26rpx;
                margin-right: 10rpx;
              }
            }

            .button-split {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              background: rgba($color: #979797, $alpha: 0.3);
              height: 27rpx;
              width: 1rpx;
              padding: 0;
            }
          }
        }
      }
    }

    .img-poster {
      margin: auto;
      width: 650rpx;
      height: 816rpx;
    }

    .btn-save {
      width: 650rpx;
      height: 100rpx;
      background: $uni-main-color;
      border-radius: 16rpx;
      position: fixed;
      bottom: 48rpx;
      left: 50%;
      transform: translateX(-50%);
      font-size: 36rpx;

      &.loading {
        opacity: 0.5;
      }
    }
  }
</style>