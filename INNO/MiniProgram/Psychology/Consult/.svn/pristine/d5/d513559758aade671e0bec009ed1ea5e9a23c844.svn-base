<template>
  <view class="caring-staff">
    <page-nav>
      <template slot="title">
        <view>关爱人员</view>
      </template>
    </page-nav>
    <view v-if="!empty" class="caring-staff-list">
      <view class="caring-staff-item" v-for="(item,i) in caringList" :key="i">
        <view class="flex-s-c caring-staff-info flex-wrap">
          <view class="bold font-34">
            {{_nameEllipsis(item.memberName)}}
          </view>
          <template v-if="item.exit == 1">
            <view class="organization-type" :class="{'referrals':item.referral == 1,'exit':item.exit == 1}">
              已不在组织中
            </view>
          </template>
          <template v-if="item.exit != 1">
            <view class="warn-level warn-level-normal" :class="{'warning':item.warningLevel > 0}">
              <template v-if="item.warningLevel == 0">
                已解除
              </template>
              <template v-if="item.warningLevel > 0">
                <span v-for="(item,index) in item.waringLevelArr" :key="index">I</span>
                <span>级</span>
              </template>
            </view>
            <template v-if="item.referral > 0 && item.referral != 3">
              <view class="organization-type referrals">
                {{getReferralText(item)}}
              </view> 
            </template>
          </template>
        </view>
        <view class="flex-b-c" v-if="item.organizeType != 0"> 
          <view class="button flex-c-c" @click="turnPage" :data-item="item" data-mode="intervene-record" :data-key="['memberName','userId','structureId','warningLevel']">
            <image :src="staticAddress+interventionRecordIcon" mode="widthFix" />
            <view class="C_555 font-22">干预记录</view>
          </view>
          <view class="button flex-c-c" @click="turnPage" :data-item="item" data-mode="archives" :data-key="['memberName','userId']">
            <image :src="staticAddress+mentalFileIcon" mode="widthFix" />
            <view class="C_555 font-22">档案详情</view>
          </view>
          <view class="button flex-c-c" :class="{'disabled':item.referral > 0 && item.referral != 3 }" @click="turnPage" :data-item="item" data-mode="referrals" :data-key="['memberName','userId','structureId']">
            <image :src="staticAddress+referralIcon" mode="widthFix" />
            <view class="C_555 font-22">请求转介</view>
          </view>
          
        </view>
      </view>
    </view>
    <view v-else class="global-empty"></view>
    <view class="watermark-box flex-s-s">
      <view class="watermark" v-for="(item,index) in watermarkArr" :key="index">{{item}}</view>
    </view>
  </view>
</template>

<script>
import structureManage from '@/common/manager/structure-manage.js'
import StorageH from "@/common/helper/storage-handler.js";
  const app = getApp();
  const pageOption = Page.BasePage({
    data() {
      return {
        interventionRecordIcon: "/caring-staff/intervention-record.png",
        mentalFileIcon: "/caring-staff/mental-file.png",
        referralIcon: "/caring-staff/referral.png",
        caringList: [],
        pageIndex:1,
        pageSize: app.Conf.PAGE_SIZE,
        empty:false, 
        watermarkArr:[],
        hasMore:false,
      }
    },
    components: {

    },
    onLoad(){ 
      this.init();
      this.loadData()
    },
    // onShareAppMessage(e){},
    methods: {
      init(){
        let storage = StorageH.get('USER_INFOS') || {};
        let name = storage.realName||"水印";
        this.watermarkArr = new Array(120).fill(name);
      },
      loadData() {
        return this.$Http(this.$Apis.selectCareWorkerByPage, {
          data: {
            pageIndex:this.pageIndex,
            pageSize: this.pageSize,
            structureId:structureManage.structureInfo.structureId||0,
          },
        }).then((res) => {
          if (res.code == 1) {
            let data = res.data || {};
            let list = data.list||[];
            list.forEach(item=>{
              item.waringLevelArr = this.getWarningLevelArr(item.warningLevel);
            })
            this.caringList = [].concat(this.caringList,list) || [];
            console.log('this.caringList',this.caringList)
            this.hasMore = this.pageIndex * this.pageSize < data.totalCount;
            this.pageIndex == 1 && this.caringList.length<=0 && (this.empty = true);
            this.pageIndex += 1;
          }
          return res;
        }).catch(()=>{
          this.pageIndex == 1 && (this.empty = true);
        }); 
      },
      onReachBottom(){
        if(this.hasMore){
          this.loadData();
        }
      },
      turnPage({currentTarget}){
        let mode = currentTarget.dataset.mode;
        let data = currentTarget.dataset.item||{};
        let keyArr = currentTarget.dataset.key||[];
        if(mode == 'referrals' && data.referral > 0 && data.referral != 3){
          app.SMH.showToast({
            title:"该人员还未结束转介"
          })
          return
        }
        let url = `/pages/work-bench/${mode}/${mode}`;
        keyArr.forEach((item,index)=>{
          url = url + `${index == 0?'?':'&'}${item}=${data[item]||""}`
        })
        this.jumpAction(url);
      },
      getWarningLevelArr(len){
        console.log('new Array(Number(len||0))',new Array(Number(len||0)))
        return new Array(Number(len||0));
      },
      getReferralText(item){
        let referral = item.referral||0,result = "";
        switch (referral) {
          case 1:
            result = "转介中";
            break;
          case 2:
            result = `已转介至${item.referralOrganization||""}机构`;
            break;
          default:
            break;
        }
        return result
      }
    }, 
  })
  export default pageOption
</script>

<style lang="scss" scoped>
.caring-staff {
  min-height: 100vh;
  background-color: #F7F7F7;

  .caring-staff-list {
    padding: 30rpx 24rpx;

    .caring-staff-item {
      background: #FFFFFF;
      padding: 15rpx;
      border-radius: 20rpx;
      margin-bottom: 20rpx;

      .caring-staff-info {
        margin: 50rpx 40rpx;

        .warn-level {
          font-size: 20rpx;
          padding: 2rpx 8rpx;
          border-radius: 5rpx;
          font-size: 20rpx;
          margin-left: 15rpx;
        }

        // .warn-level-warning {
            
        // }

        .warn-level-normal {
          color: #4F902C;
          background: #EAF6E4;
          &.warning{
            color: #E78532;
            background: #FFF2E7;
          }
        }

        .organization-type {
          // max-width: 200rpx;
          word-break: break-all;
          font-size: 20rpx;
          padding: 2rpx 8rpx;
          border-radius: 5rpx;
          font-size: 20rpx;
          margin-left: 15rpx;
          &.referrals{
            background-color: #F9F5FE;
            color: #947BDD;
          } 
          &.exit {
            background-color: #DDDDDD;
            color: #7F7F7F;
          }
        }
      }

      .button {
        width: 216rpx;
        height: 80rpx;
        background: #FAFAFA;
        border-radius: 10rpx;
        &.disabled{
          opacity: 0.5;
        }
        &>image {
          width: 32rpx;
          height: 32rpx;
          margin-right: 15rpx;
        }
      }
    }
  } 
  .watermark-box{
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%) rotate(-20deg);
    flex-wrap: wrap;
    z-index: 2;
    width: 150%;
    height: 100%;
    pointer-events:none;
  }
  .watermark{
    width: 20%;
    line-height: 120rpx;
    opacity: 0.1; 
    text-align: center;
  }
}
</style>