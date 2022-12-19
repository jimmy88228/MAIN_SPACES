<template>
  <view>
    <page-nav>
      <template slot="title">
        预警名单
      </template>
    </page-nav>
    <view class="warning-list" :style="{'min-height':`calc(100vh - ${navTop}px)`}">
      <view class="top-select-action flex-b-c" :style="{top:`${navTop}px`}">
        <view class="top-select-item flex-s-c">
          <view class="top-select-title font-24 m-r-15">班级</view>
          <view class="select-input flex-b-c" @click="showOrganizeLsit">
            <view class="font-24">{{selectClass}}</view>
            <view class="select-icon"></view>
          </view>
        </view>
        <view class="top-select-item flex-s-c">
          <view class="top-select-title font-24 m-r-15">审核状态</view>
          <ori-picker @pickerChange="(e) => pickerChange(e, 'approvalStatus')" range-key="status_name" mode="selector"
            :range="approvalStatusGroup" :pickerValue="approvalStatusValue">
            <template v-slot:content>
              <view class="select-input flex-b-c">
                <view class="font-24">{{approvalStatusGroup[approvalStatusValue].status_name}}</view>
                <view class="select-icon"></view>
              </view>
            </template>
          </ori-picker>
        </view>
      </view>
      <template v-if="!isEmpty">
        <view class="warning-list-group">
          <view v-for="(pageItem,pageIndex) in list" :key="pageIndex">
            <view class="warning-list-item m-b-20 bg_fff" v-for="(item,i) in pageItem" :key="i">
              <view class="flex-b-c student-info">
                <view class="flex-s-c p-t-15 p-b-15 m-r-20">
                  <view class="font-32 bold text-wrap">{{item.name}}</view>
                  <view class="font-22 C_7f m-l-13 p-t-10 shrink0">{{item.clazz}}</view>
                </view>
                <view :data-pIndex="pageIndex" @click="turnPage" :data-item="item" data-mode="archives"
                  :data-key="['name','userId']" class="archives-button flex-c-c shrink0">
                  <image class="mental-file-icon m-r-13" :src="requireStatic(mentalFileIcon)" mode="widthFix" />
                  <view class="font-24 C_7f">心理档案</view>
                </view>
              </view>
              <view class="student-score-group">
                <view class="font-20 C_7f">
                  本次测评结果
                </view>
                <view class="score-item m-t-15 relative flex-b-c" v-for="(sItem,sItemIndex) in item.recordDetailList"
                  :key="sItemIndex">
                  <view v-if="sItem.result != 0" class="warning-item-tips flex-c-c font-20">
                    {{formatResult(sItem.result)}}
                  </view>
                  <view v-else class="warning-item-tips warning-item-tips-grey flex-c-c font-20">
                    {{formatResult(sItem.result)}}
                  </view>
                  <view class="font-24 C_333 p-t-32 p-b-32">
                    {{sItem.modelName}}
                  </view>
                  <view>
                    <view class="font-22 C_7f flex-e-c">
                      <view class="m-r-10">测评得分</view>
                      <text class="font-36 bold">{{sItem.point}}</text>
                    </view>
                    <view v-if="sItem.result == 0" :data-item="{...item,...sItem}" @click="turnPage"
                      data-mode="warning-mark" :data-key="['name','userId','recordId','modelId']"
                      :data-pIndex="pageIndex" class="warning-item-button font-20 flex-c-c button-green m-t-15">
                      审核标记
                    </view>
                  </view>

                </view>
              </view>
            </view>
          </view>
        </view>
      </template>
      <template v-else>
        <view class="empty">
          {{emptyStr}}
        </view>
      </template>
    </view>
    <psychologyProtocol @confirm="confirmProtocol" ref="psychologyProtocol"></psychologyProtocol>

    <work-bench ref="workBench" :activityId="options.activityId" isChild isShowAll @loadSuccess="loadOrganizeSuccess"
      @selected="selectClassAction"></work-bench>
  </view>
</template>

<script>
  import SIH from "@/common/helper/sys-infos-handler"
  import oriPicker from "@/components/ori-comps/picker/ori-picker.vue";
  import psychologyProtocol from '@/components/psychology-protocol/psychology-protocol.vue';
  import workBench from "@/components/custom-page/work-bench/work-bench";

  const app = getApp();
  const pageOption = Page.BasePage({
    data() {
      return {
        // 心理档案图片
        mentalFileIcon: 'class-manage/mental-file.png',
        options: {},
        navTop: SIH.navPlace,
        approvalStatusGroup: [
          //  -1-全部 0-待审核，1-已标记，2-已复核
          {
            id: -1,
            status_name: "全部"
          },
          {
            id: 0,
            status_name: "待审核"
          },
          {
            id: 1,
            status_name: "已标记"
          },
          {
            id: 2,
            status_name: "已复核"
          }
        ],
        approvalStatusValue: 0,
        list: [],
        pageIndex: 0,
        pageSize: app.Conf.PAGE_SIZE,
        state: -1,
        selectClass: '',
        structureId: 0,
        hasMore: true,
        isEmpty: false,
        clickPage: 0,
        holdJumpData: {}
      };
    },
    computed: {
      emptyStr() {
        let status_name = this.approvalStatusGroup[this.approvalStatusValue].status_name;
        let selectClass = this.selectClass;
        let str = `${selectClass == '全部'?'':selectClass+' '}暂无“${status_name == '全部' ? '' :status_name}”预警人员噢~`
        return str
      }
    },
    components: {
      workBench,
      oriPicker,
      psychologyProtocol
    },
    onLoad(options) {
      this.options = options || {};
    },
    onShow() {
      console.log(this.clickPage, "this.clickPage")
      if (this.clickPage) {
        this.pageIndex = this.clickPage - 1 || 0;
        this.loadData();
      }
    },
    methods: {
      initData() {
        this.list = [];
        this.pageIndex = 0;
        this.hasMore = true;
        this.isEmpty = false;
        this.loadData()
      },
      loadData() {
        let pageIndex = this.pageIndex ? this.pageIndex + 1 : 1;
        this.$Http(this.$Apis.getWarningParticipateList, {
          data: {
            activityId: this.options.activityId,
            pageIndex,
            pageSize: this.pageSize,
            state: this.state,
            structureId: this.structureId
          },
        }).then((res) => {
          if (res.code == 1) {
            let data = res.data || {};
            this.pageIndex = pageIndex;
            let currPage = pageIndex - 1 ? pageIndex - 1 : 0;
            this.list[currPage] = data.list || [];
            this.hasMore = this.pageIndex * this.pageSize < data.totalCount;
            this.setEmpty(this.list);
          }
          return res;
        });
      },
      checkPIndex(pIndex) {
        if (pIndex) {
          this.clickPage = pIndex || 0
        } else {
          this.clickPage = this.pageIndex
        }
      },
      turnPage({
        currentTarget
      }) {
        let pIndex = currentTarget.dataset.pIndex || 0;
        let mode = currentTarget.dataset.mode;
        let data = currentTarget.dataset.item || {};
        let keyArr = currentTarget.dataset.key || [];
        let url = `/pages/work-bench/${mode}/${mode}`;
        keyArr.forEach((item, index) => {
          url = url + `${index == 0?'?':'&'}${item}=${data[item]||""}`
        })
        if (mode == "archives") {
          this.holdJumpData = {
            pIndex,
            mode,
            data,
            keyArr,
            url
          }
          this.$refs.psychologyProtocol.showModal();
          return
        }
        this.checkPIndex(pIndex)
        this.jumpAction(url);
      },
      formatResult(result) {
        let str = '';
        switch (result) {
          case 0:
            str = '待审核'
            break
          case 1:
            str = '已标记'
            break
          case 2:
            str = "已复核"
            break
        }
        return str
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
      pickerChange({
        detail
      }, type) {
        if (type == "approvalStatus") {
          this.approvalStatusValue = detail.value;
          this.state = String(this.approvalStatusGroup[detail.value].id) || "";
        }
        this.initData()
      },
      showOrganizeLsit() {
        let ref = "workBench";
        this.$refs[ref].showBench();
      },
      loadOrganizeSuccess(e) {
        this.structureId = e[0].classId;
        this.selectClass = e[0].className;
        this.loadData()
      },
      selectClassAction(e) {
        console.log(e)
        this.structureId = e.classId;
        this.selectClass = e.className;
        this.initData()
      },
      confirmProtocol() {
        let holdJumpData = this.holdJumpData
        this.holdJumpData = {}
        this.checkPIndex(holdJumpData.pIndex)
        console.log(holdJumpData, "data")
        let url =
          `pages/work-bench/archives/archives?memberName=${holdJumpData.data.name}&userId=${holdJumpData.data.userId}`
        this.jumpAction(url);
      },
    },
    onReachBottom() {
      console.log("到达底部");
      if (this.hasMore) {
        this.loadData();
      }
    }
  });
  export default pageOption;
</script>

<style lang="scss">
  .select-icon {
    width: 0px;
    height: 0px;
    border: 9rpx solid transparent;
    border-top-color: #000000;
    margin-top: 15rpx;
    transform-origin: 15rpx 7.5rpx;
    transition: 0.5s all;
  }

  .warning-list {
    background: #F7F7F7;
    width: 100%;
    padding-bottom: 25rpx;
    box-sizing: border-box;

    .top-select-action {
      background: #F7F7F7;
      width: 100%;
      position: sticky;
      padding: 25rpx 20rpx;
      box-sizing: border-box;
      z-index: 2;

      .top-select-item {

        .select-input {
          box-sizing: border-box;
          width: 250rpx;
          height: 66rpx;
          background: #FFFFFF;
          border-radius: 10rpx;
          padding: 0 20rpx;
        }
      }
    }

    .warning-list-group {
      padding: 20rpx;

      .warning-list-item {
        position: relative;
        width: 100%;
        border-radius: 10rpx;
        box-sizing: border-box;
        overflow: hidden;
        box-shadow: 0px 0rpx 14rpx 0px rgba(0, 0, 0, 0.07);

        .student-info {
          min-height: 110rpx;
          width: 100%;
          padding: 0 26rpx 0 41rpx;
          background: #FFFFFF;
          box-shadow: 0px 4rpx 9rpx 0px rgba(0, 0, 0, 0.07);
          box-sizing: border-box;
        }

        .archives-button {
          width: 180rpx;
          height: 66rpx;
          background: #FAFAFA;
          border-radius: 7rpx;
          border: 1px solid #F1F1F1;

          .mental-file-icon {
            width: 26rpx;
          }
        }

        .student-score-group {
          padding: 20rpx 20rpx 30rpx;
        }

        .warning-item-tips {
          position: absolute;
          top: 0;
          left: 0;
          width: 88rpx;
          height: 35rpx;
          background: #EDF9EC;
          border-radius: 10rpx 0px 10rpx 0px;
          color: $uni-main-color;
        }

        .warning-item-tips-grey {
          background: #EFEFEF !important;
          color: #666666 !important;
        }

        .score-item {
          width: 100%;
          box-sizing: border-box;
          padding: 13rpx 21rpx 13rpx 23rpx;
          min-height: 110rpx;
          background: rgba($color: #EDF9EC, $alpha: 0.2);
          border-radius: 10rpx;
          border: 1px solid rgba($color: #21B014, $alpha: 0.2);

          text {
            color: $uni-main-color;
          }

          .warning-item-button {
            width: 145rpx;
            height: 40rpx;
            border-radius: 20rpx;
          }

          .button-grey {
            color: #979797;
            background: #FBFBFB;
            border: 1px solid #F1F1F1;
          }

          .button-green {
            color: $uni-main-color;
            background: #F0FAEF;
            border: 1px solid rgba(33, 176, 20, 0.11);
          }
        }
      }
    }
  }

  .empty {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 32rpx;
    color: #7f7f7f;
    white-space: nowrap;
  }
</style>