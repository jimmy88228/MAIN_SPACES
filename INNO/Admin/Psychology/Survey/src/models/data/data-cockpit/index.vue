<template>
  <div class="cockpit-area data-cockpit-area" :class="{'fullscreen-data-cockpit' : isFullScreen}" id="dataCockpitArea">
    <Button class="screen-action" @click="switchFullScreen">
      <img v-if="isFullScreen" src="@/assets/images/data/set-unfull-screen-icon.png" />
      <img v-else src="@/assets/images/data/set-full-screen-icon.png" />
      {{isFullScreen ? '退出全屏' : '全屏查看'}}
    </Button>
    <div class="inline-b cockpit-area-header">
      <div class="flex-s-c w-nowrap">
        数据概况
        <p class="m-l-15" style="color:#5A5672;">统计时间 {{searchForm.to_date}}</p>
      </div>
      <div class="cockpit-structure w-nowrap">{{_getReqStructureName}}</div>
      <div class="inline-b">
        <data-select 
        class="cockpit-select"
        type="campus" 
        placeholder="请选择校区"
        v-model="searchForm.campus_id"
        :params="{school_id: _getReqStructureId}"
        @change="loadData()"
        :initCallback="getCampusData"
        valueKey="campus_id"
        nameKey="campus_name"
        >
        <span slot="prefix" class="cockpit-select-prefix">校区</span>
        <Option :value="0" slot="default-option">全部校区</Option>
        </data-select>
      </div>
    </div>
    <div class="data-main flex-b-s">
      <div class="data-main-bg">
        <dataMainBg 
        ref="dataMainBgRef"
        :searchForm="searchForm" 
        :organizeData="organizeData"
        @search="loadData()"
        ></dataMainBg>
      </div>
      <div class="data-main-l f-shrink-0 area-top flex">
        <div>
          <dataLeft 
          :totalUserInfo="totalUserInfo" 
          :summaryRecordInfo="summaryRecordInfo" 
          :warningRecordInfo="warningRecordInfo"
          :groupReportInfo="groupReportInfo"
          :cockpitData="cockpitData"
          ></dataLeft>
        </div>
        <div class="data-main-l-r">
          <dataMiddle 
          :searchForm="searchForm"
          :campusData="campusData"
          @search="loadData()"
          ></dataMiddle>
        </div>
      </div>
      <div class="data-main-m">
      </div>
      <div class="data-main-r f-shrink-0 area-top" style="margin-top: 150px;">
        <dataRight 
        :groupReportInfo="groupReportInfo" 
        :searchForm="searchForm" 
        :modelData="modelData"
        @search="loadData()" 
        @getOverview="getOverview"
        ></dataRight>
      </div>
    </div>
    <div class="data-bottom-area">
      <dataBottom :genderInfo="genderInfo"></dataBottom>
    </div>
    <Spin fix v-if="loading" class="cockpit-area-spin"></Spin>
    <overviewModal ref="overviewModalRef"></overviewModal>
  </div>
</template>

<script>
import dataLeft from "./components/data-left.vue";
import dataRight from "./components/data-right.vue";
import dataMainBg from "./components/data-main-bg.vue";
import dataMiddle from "./components/data-middle.vue";
import dataBottom from "./components/data-bottom.vue";
import dataUtil from '@/helper/utils/date-util.js';
import overviewModal from "./components/overview-modal/overview-modal.vue";
export default {
  components: {
    dataLeft,
    dataRight,
    dataMainBg,
    dataMiddle,
    dataBottom,
    overviewModal
  },
  data(){
    return {
      loading: false,
      searchForm: {
        campus_id: 0,
        model_id: 0,
        to_date: ''
      },
      cockpitData: [],
      organizeData: [],
      totalUserInfo: {},
      summaryRecordInfo: {},
      warningRecordInfo: {},
      groupReportInfo: {
        list: {},
        national_norm: 0,
        warning_line: 0,
      },
      genderInfo: {},
      modelData: [],
      campusData: [],
      isFullScreen: false,
      resizeObserver: null
    }
  },
  methods: {
    initData(){
      this.searchForm.to_date = dataUtil.format(new Date(new Date().getTime() - (1000 * 60 * 60 * 24)), 'yyyy-MM-dd HH:mm')
    },
    loadData(){
      return this.$MainApi.dataDriveCompartment({
          data: {
              ...this.searchForm,
              school_id: this._getReqStructureId,
          },
          other: {
              isErrorMsg: true
          }
      })
      .then((res) => {
          if (res.code) {
              let data = res.data || {};
              this.totalUserInfo = data.total_user_info || {};
              this.summaryRecordInfo = data.summary_record_info || {};
              this.warningRecordInfo = data.warning_record_info || {};
              this.groupReportInfo = data.group_report_info || {};
              this.genderInfo = data.info || {};
              this.organizeData = JSON.parse(JSON.stringify(data.itmes || []));
              this.cockpitData = JSON.parse(JSON.stringify(data.itmes || []));
              this.$refs["dataMainBgRef"] && this.$refs["dataMainBgRef"].initData(this.organizeData);
          }
      }).finally(()=>{
      })
    },
    getModelData(){
      return this.$MainApi.getGroupReportModelList({
          data: {
              school_id: this._getReqStructureId,
          },
          other: {
              isErrorMsg: true
          }
      }).then((res)=>{
        if(res.code){
          let data = res.data || {};
          let items = data.items || [];
          this.modelData = items;
          // 默认选择第一个量表
          if(items.length){
            this.searchForm.model_id = items[0].id;
          }
        }
      })
    },
    getCampusData(data){
      this.campusData = data || [];
    },
    getOverview(detail){
      this.$refs["overviewModalRef"] && this.$refs["overviewModalRef"].showModal(detail)
    },
    judegIsFullScreen(isActive) {
      if(!isActive && this.resizeObserver){
        this.resizeObserver.disconnect();
        return;
      }
      this.resizeObserver = new ResizeObserver((entries) => {
        let target = entries[0].target;
        if(target.id == 'dataCockpitArea'){
          console.log("screen.height", screen.height);
          console.log("target.clientHeight", target.clientHeight);
          if(this.isFullScreen != (screen.height == target.clientHeight)){
            this.isFullScreen = (screen.height == target.clientHeight)
          }
        }
      })
      this.resizeObserver.observe(this._getDom('dataCockpitArea'));
    },
    switchFullScreen(){
      if(this.isFullScreen){
        this._exitFullScreen('dataCockpitArea', ()=>{
          this.isFullScreen = false;
          this.$refs["dataMainBgRef"] && this.$refs["dataMainBgRef"].resize(this.organizeData);
        })
      } else {
        this._fullScreen('dataCockpitArea', ()=>{
          this.isFullScreen = true;
          this.$refs["dataMainBgRef"] && this.$refs["dataMainBgRef"].resize(this.organizeData);
        })
      }
    }
  },
  mounted(){
    this.initData();
    if(this.loading) return;
    this.loading = true;
    this.getModelData().finally(()=>{
      this.loadData().finally(()=>{
        this.loading = false;
      })
    })
    this.judegIsFullScreen(true);
  },
  beforeDestroy(){
    this.judegIsFullScreen(false);
  }
}
</script>
<style lang="less" >
@import "@/assets/font/FUTURA.css";
.data-cockpit-area{
  // comm  --↓
  .b-r-30{
    border-radius: 30px;
  }
  .bg-1{
    background: linear-gradient(180deg, #15144C 0%, #06002B 100%);
  }
  .bg-2{
    background: linear-gradient(180deg, #2D2B83 0%, #14134C 100%);
  }
  .trend{
    padding: 3px;
    width: 20px;
    height: 20px;
    display: inline-block;
    position:relative;
    overflow: hidden;
  }
  .trend:before{
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 100%;
    background-color: #4B439E;
  }
  .trend:after{
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40%;
    height: 2px;
    background-color: #fff;
  }
  .rise{
    padding: 0px;
  }
  .rise:before{
    content: "";
    display: block;
    margin: 0 auto;
    width: 0px;
    height: 0px;
    border: 5px solid #2BB026;
    border-color: transparent transparent #2BB026 transparent;
    margin-top: -2px;
    background: none;
    border-radius: 0;
  }
  .rise:after{
    position: static;
    content: "";
    display: block;
    margin: 0 auto;
    width: 4px;
    height: 8px;
    transform: unset;
    background-color:#2BB026;
    border-radius: 0;
  }
  .fall{
    padding: 0px;
  }
  .fall:before{
    position: static;
    content: "";
    display: block;
    margin: 0 auto;
    width: 4px;
    height: 8px;
    margin-top: 4px;
    transform: unset;
    background-color:#E50111;
    border-radius: 0;
  }
  .fall:after{
    content: "";
    display: block;
    margin: 0 auto;
    width: 0px;
    height: 0px;
    border: 5px solid #E50111;
    border-color:#E50111 transparent transparent  transparent;
    background: none;
    border-radius: 0;
    position: static;
    transform: unset;
  }
  .warning:before{
    content: "";
    width: 40px;
    height: 2px;
    background-color:#FF6101;
    margin-right: 5px;
    display: inline-block;
  }
  .healthing:before{
    content: "";
    width: 40px;
    height: 2px;
    background-color:#57B410;
    margin-right: 5px;
    display: inline-block;
  }
  .warn-rate{
    background-color:#FF6101;
    top: 0px;
    left: 0px;
  }
  .health-rate{
    background-color:#57B410;
    top:0px;
    right: 0px;
  }
  .item-tip{
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #83839F;
    line-height: 22px;
    margin-bottom: 5px;
  }
  .item-sub-tip{
    font-size: 13px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #435391;
    line-height: 18px;
  }
  .cockpit-select{
    min-width: 120px;
    .cockpit-select-prefix{
      color: #fff;
      font-size: 12px;
      line-height: 30px;
      padding: 0px 5px 0px 10px;
    }
    .ivu-select-selection{
      border: 1px solid #005874;
      background: rgba(0,86,114,0.34);
      border-radius: 100px;
    }
    .ivu-select-dropdown{
      border: 1px solid #005874;
      background: rgba(0,86,114, 0.7);
      border-radius: 6px;
      color: #fff;
    }
    
    .ivu-select-item{
      color: #fff;
    }
    .ivu-select-item:hover{
      background: rgba(0,86,114, 0.8);
      color: #fff;
    }
    .ivu-select-item-selected{
      background: rgba(0,86,114, 1);
      color: #fff;
    }
    .ivu-select-input{
      color:#fff;
    }
  }
  .area-top{
    margin-top: 250px;
  }
  .empty-report{
    text-align:center;
    padding: 50px 0px;
    color: #ccc;
    font-size: 14px;
  }
  // comm  --↑
}
</style>
<style lang="less" scoped>
.cockpit-area{
  width: 100%;
  min-height: 100%;
  // background-color:#06002A;
  position: relative;
  .cockpit-area-header{
    position: absolute;
    top:0px;
    left:0px;
    z-index: 2;
    color:#fff;
    padding: 60px 0px 0px 55px;
  }
  .cockpit-structure{
    font-size: 36px;
    font-family: SimSun;
    font-weight: bold;
    color: #FFFFFF;
    line-height: 53px;
    letter-spacing: 4px;
    margin: 14px 0px 24px 0px;
    width: 0;
  }
  //
  .data-main{
    justify-items: flex-start;
    position:relative;
  }
  .data-main-l{
    width: 30%;
    max-width: 540px;
    min-width: 450px;
    position:relative;
  }
  .data-main-l-r{
    position:relative;
  }
  .data-main-r{
    width: 30%;
    max-width: 615px;
    min-width: 450px;
    position:relative;
    // pointer-events: none;
  }
  .data-main-m{
    min-width: 300px;
  }
  .data-main-bg{
    position: absolute;
    top:0px;
    left:0px;
    width: 100%;
    height: 100%;
  }
  .cockpit-area-spin{
    background-color: #06002A;
    opacity: 0.7;
  }
}
.screen-action{
  height: 36px;
  position: absolute;
  top:30px;
  right: 30px;
  background: rgba(0,86,114,0.34);
  border-radius: 46px;
  border: 1px solid #005874;
  padding: 0px 10px;
  z-index: 3;
  color: #fff;
  /deep/span{
    display: flex;
    align-items: center;
    justify-content: center;
  }
  img{
    width: 22px;
    height: 22px;
    margin-right: 10px;
  }
}
.fullscreen-data-cockpit{
  width:100%;
  height: 100%;
  overflow-y: auto;
  background-color:#060029;
}
.data-bottom-area{
  // position: sticky;
  // bottom: 0px;
  // text-align: center;
}
</style>