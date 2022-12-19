<template>
  <div class="schedule-time-view" v-show="!multipleDate.length">
    <template v-if="singleDate.schedule_day">
      <div class="flex-b-c time-view-header">
        <div class="view-header-tip">{{singleDate.dateStrTxt}} 坐班时段</div>
        <div>
          <Button type="primary" @click="setTime()">编辑时段</Button>
        </div>
      </div>
      <div class="p-t-10 p-b-10">
          <div class="time-class-item flex" v-for="(gItem, gIndex) in timeDate" :key="gItem.timeGroup">
            <div class="class-item-tip flex-c-c">
              <div>
                <p>{{gItem.timeGroup}}</p>
                <span class="item-tip-sub" v-if="gItem.selectTime.length == 0 || gItem.isFull">{{gItem.isFull ? '已约满' : '无配时段'}}</span>
              </div>
            </div>
            <div class="time-list " >
              <timeItem :fullBooked="!!item.appointment_id" :isView="!!(!item.appointment_id)" v-for="(item, index) in gItem.selectTime" :key="item.id" @cancel="cancelItem(gIndex, index)">
                <p>{{item.beginTime}}</p>-<p>{{item.endTime}}</p>
              </timeItem>
              <timeItem stateLess v-if="gItem.selectTime.length == 0">休息</timeItem>
            </div>
          </div>
      </div>
      <div class="p-10 text-r">
        <Button type="primary" @click="confirm()">保存</Button>
      </div>
    </template>
    <template v-else>
      <div class="no-choose">
        <p>请选择编辑的坐班日期</p>
      </div>
    </template>
  </div>
</template>

<script>
import timeItem from "./items/time-item.vue";
export default {
  components: { timeItem },
  props: {
    chooseData: {
      type: Object,
      default(){
        return {};
      }
    }
  },
  computed: {
    singleDate(){
      return this.chooseData.singleDate || {};
    },
    multipleDate(){
      return this.chooseData.multipleDate || [];
    }
  },
  data(){
    return {
      defautTimeDate: {
        '上午': {
          timeGroup: '上午',
          isFUll: true,
          selectTime: []
        },
        '下午': {
          timeGroup: '下午',
          isFUll: true,
          selectTime: []
        },
        '晚上': {
          timeGroup: '晚上',
          isFUll: true,
          selectTime: []
        }
      },
      timeDate: {},
    }
  },
  watch: {
    singleDate: {
      handler(nV){
          let date = JSON.parse(JSON.stringify(nV || {})) || {};
          let selectTime = date.selectTime || [];
          let timeDate = JSON.parse(JSON.stringify(this.defautTimeDate));
          for(let i = 0; i < selectTime.length; i++){
            let time_group = selectTime[i].time_group;
            //检测是否约满
            if(!selectTime[i].appointment_id && timeDate[time_group].isFUll){
              timeDate[time_group].isFUll = false
            }
            timeDate[time_group].selectTime.push(selectTime[i]);
          }
          this.timeDate = timeDate || {};
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    getSelectData(){
      let selectData = [];
      for(let i in this.timeDate){
        selectData = selectData.concat(this.timeDate[i].selectTime);
      }
      return selectData || [];
    },
    setTime(){
      this.$emit("setTime", {
        isBatch: false,
        selectData: this.getSelectData()
       })
    },
    cancelItem(gIndex, index){
      this.timeDate[gIndex].selectTime.splice(index, 1);
    },
    confirm(){
      this.$emit("confirm", {
        isBatch: false,
        selectData: this.getSelectData()
      })
    }
  },
}
</script>

<style lang="less" scoped>
.schedule-time-view{
  background-color:#F9F9F9;
  padding: 15px;
  padding-top: 20px;
  border-radius: 10px;
  width: 610px;
  .view-header-tip{
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #575757;
    line-height: 22px;
  }
  .time-class-item{
    padding-top: 20px;
  }
  .class-item-tip{
    width: 80px;
    height: 80px;
    text-align: center;
    font-size: 15px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #222222;
    line-height: 26px;
  }
  .item-tip-sub{
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #B2B2B2;
    line-height: 15px;
  }
  .time-list{
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 20px;
    border-bottom: 1px solid #DDD;
  }
  .no-choose{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 300px;
    color: #b2b2b2;
    font-size: 16px;
  }
}
</style>