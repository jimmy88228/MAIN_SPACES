<template>
  <view class="rank-area" :style="{ 'background-color': actInfo.backgroundColor }">
    <page-nav :full="true" :isTransparent="true"></page-nav>
    <view class="rank-header-area">
      <image class="rank-header" :src="actInfo.rankingImg || staticAddress + '/game/different/rank-header.jpg'" mode="widthFix" />
      <view class="rank-header-txt">
        <view class="top-txt">TOP{{actInfo.rankingTop}}</view>
        <view class="top-game-name">游戏：{{actInfo.gameName}}</view>
      </view>
    </view>
    <view class="rank-list-area" >
      <view class="rank-list">
        <scroll-view v-show="!showLoading" class="rank-scroll" :scroll-y="true" >
          <view class="rank-item" :class="{'curr-rank-item':  item.userRanking}" v-for="(item, index) in rankListView"
            :key="index">
            <view class="item-left">
              <view class="item-top-area" v-if="index < 3">
                <image class="top-area-img" :src="staticAddress + '/game/different/top' + (Number(index) + 1) + '.png'"
                  mode="widthFix" />
              </view>
              <view v-else class="bold">
                <view>TOP</view>
                <view>{{Number(index) + 1}}</view>
              </view>
            </view>
            <view class="item-cont">
              <view class="item-name-area">
                <view class="item-name" :class="{'invalid': !item.userId}">{{item.userId ? item.nickName : '虚位以待'}}</view>
                <view class="edit-img-point" @click="changeNameAction(index, item)">
                  <image v-if="item.userRanking" class="edit-name-img" :src="staticAddress + '/game/different/edit.png'" />
                </view>
              </view>
              <view class="item-time">
                <view class="time-tip">闯关记录</view>
                <view class="time-val">{{item.userId ? item.timeStr : '--:--:--'}}</view>
              </view>
              <view class="like-area" >
                <template v-if="item.userId">
                  <view class="like-img-area">
                    <view class="like-img-sprite" :class="{ 'islike':  item.isLike}">
                      <image class="like-img"  @click="setLike(index, item)"
                      :src="staticAddress + '/game/different/like.png'" mode="widthFix" />
                      <image class="like-img" @click="setLike(index, item)"
                      :src="staticAddress + '/game/different/liked.png'" mode="widthFix" />
                    </view>
                  </view>
                  <view class="like-txt">{{item.likeCount}}</view>
                </template>
              </view>
            </view>
          </view>
        </scroll-view>
        <view v-show="showLoading" class="loading-area flex-c-c">
          <loading-view ></loading-view>
        </view>
      </view>
    </view>
    
    <newName ref="newNameRef" @changeName="changeName"></newName>
  </view>
</template>

<script>
  import newName from "../../components/new-name/new-name.vue";
  import DateUtil from "@/common/support/utils/date-util.js";
  import LoadingView from '@/components/css3/loading/loading.vue';
  const app = getApp();
  const pageOption = Page.BasePage({
    components: {
      newName,
      LoadingView
    },
    data() {
      return {
        showLoading: true,
        actInfo: {},
        options: {},
        emptyList: [{},{},{},{},{},{},{},{},{},{}],
        rankList: [],
        liking: false,
        editIndex: -1,
      };
    },
    computed:{
      rankListView(){
        let rankList = this.rankList || [];
        if(rankList.length){
          return rankList;
        } else {
          return this.emptyList || [];
        }
      }
    },
    onLoad(options) {
      this.options = options || {};
      this.getBaseActInfo(options.gameActivityId);
      this.loadData(options.gameActivityId);
    },
    methods: {
      getBaseActInfo(activityId){
        if(!Number(activityId)) { return Promise.reject() }
        return this.$Http(this.$Apis.getGameActivityBaseInfo, {
          data: {
            activityId: activityId,
          },
        }).then((res)=>{
          if(res.code){
            this.actInfo = res.data || {};
          }
        })
      },
      loadData(activityId) {
        if(!Number(activityId)) { 
          this.showLoading = false
          return Promise.reject()
         }
        this.showLoading = true;
        return this.$Http(this.$Apis.selectRankingListByPage, {
          data: {
            activityId: activityId,
          },
        }).then((res) => {
          if (res.code == 1) {
            let data = res.data || [];
            for(let i = 0; i < data.length; i++){
              let bestScore = data[i].bestScore;
              data[i].timeStr = DateUtil.spanFormat(bestScore * 1000);
              // if(i == 0){
              //   data[i].userRanking = 2 
              // }
            }
            this.rankList = data;
          }
          return res;
        }).finally(()=>{
          this.showLoading = false;
        })
      },
      setLike(index, item) {
        let options = this.options || {};
        if(!Number(options.gameActivityId)) { return Promise.reject() }
        if (this.liking) {
          return
        }
        this.liking = true
        return this.$Http(this.$Apis.setGameLike, {
          data: {
            activityId: options.gameActivityId,
            isLike: !item.isLike,
            likeUserId: item.userId
          },
        }).then((res) => {
          if (res.code == 1) {
            let likeCount = item.isLike ? Number(item.likeCount) - 1 : Number(item.likeCount) + 1;
            this.$set(this.rankList[index], "likeCount", likeCount);
            this.$set(this.rankList[index], "isLike", !item.isLike);
            app.SMH.showToast({
              title: !item.isLike ? "取消成功" : "点赞成功",
              duration: 3000
            })
          }
          return res;
        }).finally(()=>{
          this.liking = false
        })
      },
      changeNameAction(index, item){
        this.editIndex = index;
        this.$refs["newNameRef"] && this.$refs["newNameRef"].showModal({
          name: ''
        });
      },
      changeName(name){
        return this.$Http(this.$Apis.saveGameUserInfo, {
          data: {
            nickName: name
          },
        }).then((res) => {
          if (res.code == 1) {
            setTimeout(()=>{
              if(this.editIndex != -1){
                this.$set(this.rankList[this.editIndex], 'nickName', name);
                this.editIndex = -1;
              }
              app.SMH.showToast({
                title: "修改成功",
                duration: 3000
              })
              this.$refs["newNameRef"] && this.$refs["newNameRef"].dismiss();
            }, 500)
          }
          return res;
        }).finally(()=>{

        })
      }
    },
    onShow() {

    },
  });
  export default pageOption;
</script>

<style lang="scss">
  .rank-area {
    background-color: #FFCD00;
    display: flex;
    flex-direction: column;
    height: calc(100vh);
    overflow: hidden;
    .rank-header-area{
      min-height: 280rpx;
      position: relative;
    }
    .rank-header {
      width: 100%;
      display: block;
    }
    .rank-header-txt{
      position: absolute;
      top: 50%;
      right: 120rpx;
      transform: translateY(-50%);
      margin-top: 30rpx;
    }
    .top-txt{
      font-size: 70rpx;
      font-family: FZZhengHeiS-EB-GB;
      font-weight: bold;
      color: #342A04;
      line-height: 70rpx;
      margin-bottom: 10rpx;
    }
    .top-game-name{
      font-size: 18rpx;
      font-family: PingFang SC;
      font-weight: 400;
      color: #AF7300;
      line-height: 20rpx;
      padding-left: 5rpx;
    }
    .rank-list-area {
      flex: 1;
      overflow: hidden;
      padding: 0px 18rpx;
    }

    .rank-list {
      width: 100%;
      height: 100%;
      background: #FFFFFF;
      border-radius: 30rpx;
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0px;
      position: relative;
      overflow: hidden;
      -webkit-backface-visibility: hidden; // 兼容ios scroll-view无法圆角
      -webkit-transform: translate3d(0, 0, 0);
    }

    .rank-scroll {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      position: relative;
    }

    .rank-item {
      width: 100%;
      display: flex;
      align-items: center;

      .item-left {
        width: 95rpx;
        padding: 0px 10rpx;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        min-height: 152rpx;
      }

      .item-top-area {}

      .top-area-img {
        width: 80rpx;
        display: block;
      }

      .item-cont {
        flex: 1;
        border-bottom: 1px solid #F2F2F2;
        display: flex;
        align-items: center;
        // height: 100%;
        min-height: 152rpx;
      }

      .item-name-area{
        display: flex;
        flex: 1;
        padding-left: 20rpx;
        align-items: center;
      }

      .item-name {
        font-size: 26rpx;
        font-family: PingFang SC;
        font-weight: bold;
        color: #333333;
        line-height: 48rpx;
        white-space: pre-line;
        word-break: break-all;
        word-wrap: break-word;
      }
      .item-name.invalid{
        color: #E0E0E0;
      }
      .edit-img-point{
        padding: 10rpx;
      }
      .edit-name-img{
        display: block;
        width: 30rpx;
        height: 30rpx;
        margin-left: 15rpx;
      }

      .item-time {
        flex-shrink: 0;
        width: 158rpx;
        text-align: center;
      }

      .time-tip {
        font-size: 20rpx;
        font-family: PingFang SC;
        font-style: italic;
        color: #B2B2B2;
        line-height: 24rpx;
        margin-top: 10rpx;
      }

      .time-val {
        font-size: 28rpx;
        font-family: Krungthep;
        font-weight: bold;
        font-style: italic;
        color: #333333;
        line-height: 48rpx;
      }

      .like-area {
        width: 127rpx;
        flex-shrink: 0;
        text-align: center;
      }
      .like-img-area{
        margin: 0 auto;
        margin-top: 15rpx;
        width: 55rpx;
        height: 55rpx;
        position: relative;
        overflow: hidden;
      }
      .like-img-sprite{
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        transition: all .35s;
      }
      .like-img-sprite.islike{
        transform: translateY(-50%);
      }
      .like-img {
        width: 55rpx;
        height: 55rpx;
        display: block;
      }

      .like-txt {
        font-size: 20rpx;
        font-family: PingFang SC;
        // font-style: italic;
        color: #B2B2B2;
        line-height: 48rpx;
      }
    }

    .curr-rank-item {
      z-index: 5;
      position: sticky;
      top: 0px;
      bottom: 0px;
      left: -18rpx;
      background-color: rgba(81, 44, 0, 0.89);
      color: #fff !important;

      .item-left {
        min-height: 120rpx;
        color: #fff !important;
      }

      .item-cont {
        min-height: 120rpx;
        border: 0 none;

        .item-name,
        .time-tip,
        .time-val,
        .like-txt {
          color: #fff;
        }
      }
    }
  }
</style>