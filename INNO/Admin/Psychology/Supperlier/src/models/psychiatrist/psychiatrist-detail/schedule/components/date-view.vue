<template>
  <div class="schedule-date-view">
    <div class="date-view-header flex-b-c">
      <div class="header-left">
        <div class="header-tip-area" :class="{'isBatch': isBatch}">
          <div class="tip-item">
            <div>
              <p class="header-tip m-b-5">坐班日期</p>
              <p class="header-tip-sub">可编辑近30天坐班表</p>
            </div>
          </div>
          <div class="tip-item">
            请选择日期
          </div>
        </div>
      </div>
      <div class="header-operate">
        <div class="header-operate-stay" :class="{'isBatch': isBatch}">
          <Button class="operate-btn" type="primary" @click="changeBatch(true)">批量配置时段</Button>
          <Button class="operate-btn" @click="isBatch = false">取消批量编辑</Button>
        </div>
      </div>
    </div>
    <div class="date-view">
      <div class="month-item" v-for="(mItem, mIndex) in dateData" :key="mIndex">
        <p class="month-item-tip">{{mIndex.split(";").slice(-1)[0]}}月</p>
        <div class="day-list">
          <dateItem :hasData="(scheduleData[item.schedule_day] && scheduleData[item.schedule_day].length) ? true : false" :isBatch="isBatch" v-for="(item, index) in mItem" :key="index" :selected="setSelect(item)" @clickItem="selectDate(item)">
            <p>{{item.dateViewStr}}</p>
            <p>{{item.week}}</p>
          </dateItem>
        </div>
      </div>
    </div>
    <div class="p-t-20 p-b-10 time-operate" v-if="isBatch">
      <Button class="time-operate-btn" size="large" type="primary" @click="setTime">配置时段</Button>
    </div>
  </div>
</template>

<script>
import dateUtil from "@/helper/utils/date-util.js";
import dateItem from "./items/date-item.vue";
export default {
  components: { dateItem },
  props: {
    chooseData: {
      type: Object,
      default(){
        return {}
      }
    },
    scheduleData: {
      type: Object,
      default(){
        return {}
      },
    },
    today: String
  },
  data(){
    return {
      dateData: {},
      isBatch: false,
      //
    }
  },
  computed: {
    multipleIds(){
      let multipleDate = (this.chooseData && this.chooseData.multipleDate) || [];
      let multipleIds = [];
      for(let i = 0; i < multipleDate.length; i++){
        if(multipleDate[i].dateViewStr){
          multipleIds.push(multipleDate[i].dateViewStr)
        }
      }
      return multipleIds;
    }
  },
  methods: {
    setSelect(item){
      if(this.isBatch){
        return this.multipleIds.indexOf(item.dateViewStr) != -1 ? true : false;
      } else {
        return this.chooseData.singleDate && this.chooseData.singleDate.dateViewStr == item.dateViewStr ? true : false;
      }
    },
    initDate(){
      if(!this.today){
        console.log("无效当前时间");
        return;
      }
      // 初始化30天日期
      let days = 30, dateData = {};
      let currDate = this.today ? new Date(this.today) : new Date();
      let oneDay = 1000 * 60 * 60 * 24; // 一天时间
      while(days > 0){
        let year = currDate.getFullYear();
        let month = currDate.getMonth() + 1;
        let key = year+";"+month;
        if(!dateData[key]){
          dateData[key] = []
        }
        dateData[key].push({
          date: currDate,
          dateViewStr: dateUtil.format(currDate, 'MM-dd'),
          schedule_day: dateUtil.format(currDate, 'yyyy-MM-dd'),
          dateStrTxt: dateUtil.format(currDate, 'MM月dd日'),
          week: "周" + dateUtil.getWeekStr(currDate.getDay()),
          selectTime: []
        })
        currDate = new Date(currDate.getTime() + oneDay);
        --days;
      }
      this.dateData = dateData;
    },
    changeBatch(state){
      this.isBatch = state;
      this.chooseData.singleDate = {}
      this.chooseData.multipleDate = [];
    },
    selectDate(item){
      if(this.isBatch){
        let index = this.multipleIds.indexOf(item.dateViewStr);
        if(index != -1){
          this.chooseData.multipleDate.splice(index, 1);
        } else {
          this.chooseData.multipleDate.push(this.getSelectTime(item))
        }
        this.chooseData.singleDate = {}
      } else {
        this.chooseData.singleDate = this.getSelectTime(item);
        this.chooseData.multipleDate = [];
      }
    },
    getSelectTime(item){
      // 获取入库的时间点
      let selectTime = this.scheduleData[item.schedule_day] || [];
      item.selectTime = JSON.parse(JSON.stringify(selectTime));
      return item;
    },
    setTime(){
      if(this.chooseData.multipleDate && this.chooseData.multipleDate.length){
        this.$emit("setTime", { isBatch: this.isBatch })
      } else {
        this.$Message.warning("请选择配置日期")
      }
    }
  },
  mounted(){
  },
  watch: {
    today: {
      handler(){
        this.initDate();
      },
      immediate: true
    }
  }
}
</script>

<style lang="less" scoped>
.schedule-date-view{
  background-color:#F9F9F9;
  padding: 15px;
  padding-top: 20px;
  border-radius: 10px;
  width: 425px;
  .header-left{
    height: 55px;
    overflow: hidden;
  }
  .header-tip-area{
    height: 200%;
    transition: transform .35s;
  }
  .tip-item{
    display: flex;
    align-items: center;
    height: 50%;
    padding: 5px 0px;
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #575757;
    line-height: 22px;
  }
  .header-tip-area.isBatch{
    transform: translateY(-50%);
  }
  .header-tip{
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #575757;
    line-height: 22px;
  }
  .header-tip-sub{
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #B2B2B2;
    line-height: 18px;
  }
  .header-operate{
    overflow: hidden;
    width: 120px;
  }
  .header-operate-stay{
    width: 200%;
    display: flex;
    transition: transform .35s;
  }
  .operate-btn{
    width: 50%;
  }
  .header-operate-stay.isBatch{
    transform: translateX(-50%);
  }
  .month-item-tip{
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #575757;
    line-height: 22px;
    padding: 10px 0px;
  }
  .day-list{
    display: grid;
    grid-template-columns: repeat(5, 20%);
  }
  .time-operate{
    position: sticky;
    bottom: 0px;
    left: 0px;
    z-index: 2;
  }
  .time-operate-btn{
    width: 100%;
    box-shadow: 0px 0px 10px #ccc;
  }
}
</style>