<template>
  <div>
    <div class="data-range-list">
      <div class="data-range-item bg-1">
        <div class="range-item-tip item-tip">平台用户总量 </div>
        <div class="flex-s-c range-item-cont">
          <img class="range-item-icon" src="@/assets/images/ought_member.png"/>
          <div class="range-item-val">{{totalUserInfo.total_users}}</div>
          <div class="">
            <p class="flex-b-c m-t-10 m-b-10">平台学生累计 {{totalUserInfo.total_student}}</p>
            <p class="flex-b-c m-t-10 m-b-10">平台老师累计 {{totalUserInfo.total_teacher}}</p>
          </div>
        </div>
      </div>
      <div class="data-range-item bg-1">
        <div class="range-item-tip item-tip">平台测评统计</div>
        <div class="flex-s-c range-item-cont">
          <img class="range-item-icon" src="@/assets/images/join_member.png" />
          <div class="range-item-val">{{summaryRecordInfo.rerord_count}}</div>
          <div >
              <p class="flex-b-c m-t-10 m-b-10">
                较昨日{{parseFloat(summaryRecordInfo.last_rand) >= 0 ? '新增' : '减少'}} 
                {{parseFloat(summaryRecordInfo.last_rand) ? Math.abs(parseFloat(summaryRecordInfo.last_rand)) + '%' : ' - -'}}
                <span class="trend m-l-20" :class="getTrendClass(summaryRecordInfo.last_rand)"></span>
              </p>
              <p class="flex-b-c m-t-10 m-b-10">
                较上周{{parseFloat(summaryRecordInfo.week_rand) >= 0 ? '新增' : '减少'}} 
                {{parseFloat(summaryRecordInfo.week_rand) ? Math.abs(parseFloat(summaryRecordInfo.week_rand)) + '%' : ' - -'}}
                <span class="trend m-l-20" :class="getTrendClass(summaryRecordInfo.week_rand)"></span>
              </p>
          </div>
        </div>
      </div>
      <div class="data-range-item bg-1">
        <div class="range-item-tip item-tip">累计排查风险</div>
        <div class="flex-s-c range-item-cont">
          <img class="range-item-icon" src="@/assets/images/ought_member.png" />
          <div class="range-item-val">{{warningRecordInfo.warning_count}}</div>
          <div class="">
            <p class="flex-b-c m-t-10 m-b-10">
              较昨日{{parseFloat(warningRecordInfo.last_rand) >= 0 ? '新增' : '减少'}} 
              {{parseFloat(warningRecordInfo.last_rand) ? Math.abs(parseFloat(warningRecordInfo.last_rand)) + '%' : ' - -'}}
              <span class="trend m-l-20" :class="getTrendClass(warningRecordInfo.last_rand)"></span>
            </p>
            <p class="flex-b-c m-t-10 m-b-10">
              较上周{{parseFloat(warningRecordInfo.week_rand) >= 0 ? '新增' : '减少'}} 
              {{parseFloat(warningRecordInfo.week_rand) ? Math.abs(parseFloat(warningRecordInfo.week_rand)) + '%' : ' - -'}}
              <span class="trend m-l-20" :class="getTrendClass(warningRecordInfo.week_rand)"></span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="early-warn-area bg-1">
      <div class="early-warn-tip flex-b-c">
        <div class="early-warn-tip-txt item-tip">各年级风险预警情况</div>
        <div class="flex-s-c">
          <p class="warning flex-s-c m-l-10 m-r-20">预警</p>
          <p class="healthing flex-s-c m-l-5 m-r-10">健康</p>
        </div>
      </div>
      <div class="early-warn-list">
        <div class="early-warn-item flex-s-c" v-for="(item, index) in cockpitDataView" :key="index">
          <div class="warn-item-txt f-shrink-0">{{item.gradeName}}</div>
          <div class="warn-item-percen">
            <div class="percen-bg"><span :style="'width: ' + item.healthPercent + ';'" class="percen-rate health-rate"></span></div>
            <div class="percen-bg"><span :style="'width: ' + item.warnPercent + ';'" class="percen-rate warn-rate"></span></div>
          </div>
          <div class="warn-item-percen-val f-shrink-0">{{item.healthPercent}} / {{item.warnPercent}}</div>
        </div>
        <div class="empty-report" v-if="!cockpitDataView || cockpitDataView.length == 0">暂无数据</div>
      </div>
    </div>
  </div>
</template>

<script>
import dataSort from "./data-sort.js";
export default {
  props: {
    totalUserInfo: {
      type: Object,
      default(){
        return {}
      }
    },
    summaryRecordInfo: {
      type: Object,
      default(){
        return {}
      }
    },
    warningRecordInfo: {
      type: Object,
      default(){
        return {}
      }
    },
    groupReportInfo: {
      type: Object | Array,
      default(){
        return {}
      }
    },
    cockpitData:{
      type: Array,
      default(){
        return []
      }
    },
  },
  data(){
    return {
      cockpitDataView: [],
      totalCount: {
        totalWarn:0,
        totalHealth: 0,
        totalUser: 0
      }
    }
  },
  watch: {
    cockpitData:{
      handler(nV){
        if(nV instanceof Array){
          let gradeJson = [], gradeData = [];
          this.totalCount = {
            totalWarn:0,
            totalHealth: 0,
            totalUser: 0
          }
          for(let i = 0; i < nV.length; i++){
            let item = nV[i] || {};
            let grade_name = item.grade_name || '未知年级';
            let gradeIndex = gradeJson.indexOf(grade_name);
            if(gradeIndex == -1){
              gradeJson.push(grade_name);
              gradeData.push({
                totalWarn: 0,
                totalHealth: 0,
                totalUser: 0,
                gradeName: grade_name,
              })
              gradeIndex = gradeData.length - 1;
            }
            // 预警
            let warnCount = parseInt(item.warning_male) + parseInt(item.warning_female) + parseInt(item.warning_unknown_gender);
            // 健康
            let healthCount = parseInt(item.health_male) + parseInt(item.health_female) + parseInt(item.health_unknown_gender);
            // 用户数
            let userCount = parseInt(item.male_users) + parseInt(item.female_users) + parseInt(item.unknown_gender_users);
            gradeData[gradeIndex].totalWarn += warnCount;
            gradeData[gradeIndex].totalHealth += healthCount;
            gradeData[gradeIndex].totalUser += userCount;
            // 总人数
            this.totalCount.totalWarn += warnCount;
            this.totalCount.totalHealth += healthCount;
            this.totalCount.totalUser += userCount;
          }
          console.log("gradeData", JSON.parse(JSON.stringify(gradeData)));
          // 
          try {
            gradeData.sort((a, b)=>{
              // 比较中文排序
              return dataSort.gradeOrder.indexOf(a.gradeName) - dataSort.gradeOrder.indexOf(b.gradeName); 
            })
          } catch (error) {}
          // 避免出现
          let lastWarn = 100, lastHealth = 100, lastUser = 100; 
          gradeData.map((item, index)=>{
            if(index == gradeData.length - 1){
              item.warnPercent = item.totalWarn ? lastWarn.toFixed(1) + "%" : "0.0%";
              item.healthPercent = item.totalHealth ? lastHealth.toFixed(1) + "%" : "0.0%";
              item.userPercent = item.totalUser ? lastUser.toFixed(1) + "%" : "0.0%";
            } else {
              item.warnPercent = this.setPercent(item.totalWarn, this.totalCount.totalWarn)
              item.healthPercent = this.setPercent(item.totalHealth, this.totalCount.totalHealth)
              item.userPercent = this.setPercent(item.totalUser, this.totalCount.totalUser)
              lastWarn = lastWarn - parseFloat(item.warnPercent)
              lastHealth = lastHealth - parseFloat(item.healthPercent)
              lastUser = lastUser - parseFloat(item.userPercent)
            }
          })
          
          this.cockpitDataView = gradeData;
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods:{
    getTrendClass(val){
      if(parseFloat(val) > 0){
        return 'rise'
      } else if(parseFloat(val) < 0){
        return 'fall'
      }
    },
    setPercent(val, total){
      if(!total){
        return "0.0%";
      }
      return ((val / total) * 100).toFixed(1) + '%'
    }
  }
}
</script>

<style lang="less" scoped>

.data-range-item {
    padding: 27px 20px 20px 55px;
    color:#fff;
    border-top-right-radius: 30px;
  }
.range-item-tip{}
.range-item-val{
  margin: 0px 10px 0px 12px;
  font-size: 30px;
  font-family: Futura;
  font-weight: normal;
  color: #FFFFFF;
  line-height: 42px;
  min-width: 124px;
}
.range-item-icon{
  width: 34px;
  height: 34px;
  display: block;
  border-radius: 100%;
  background-color:#efefef;
}
.early-warn-area{
    padding: 35px 40px 40px 40px;
    border-top-right-radius: 30px;
  }
  .early-warn-tip{
    color:#fff;
  }
  .early-warn-tip-txt{}
  .early-warn-list{
    padding: 20px 0px;
  }
  .early-warn-item{
    display: flex;
    padding: 10px 0px;
    color:#fff;
  }
  .warn-item-txt{
    min-width: 70px;
  }
  .warn-item-percen-val{
    min-width: 100px;
    text-align: right;
  }
  .warn-item-percen{
    width: 0px;
    flex: 1;
    height: 8px;
    display: flex;
    background-color:#282C4A;
  }
  .percen-bg{
    flex: 1;
    height: 100%;
    position: relative;
  }
  .percen-rate{
    display: inline-block;
    height: 100%;
    position: absolute;
  }
</style>