<template>
  <div class="gender-data  bg-1">
    <div class="gender-data-tip item-tip">平台用户性别分布</div>
    <div class="flex-a-c">
      <div class="flex-s-c gender-data-cont">
        <div class="flex-s-c gender-data-item">
          <Icon type="md-man" :size="66" color="#0AAD91"/>
          <div>
            <span class="gender-percen">{{genderInfoView.maleUserRatio}}</span>
            <p class="gender-val-txt">男生共 <span class="gender-val">{{genderInfoView.total_male_users}}</span> 人</p>
          </div>
        </div>
        <div class="flex-s-c gender-data-item">
          <Icon type="md-woman" :size="66" color="#F53D9E"/>
          <div>
            <span class="gender-percen">{{genderInfoView.femaleUserRatio}}</span>
            <p class="gender-val-txt">女生共 <span class="gender-val">{{genderInfoView.total_female_users}}</span> 人</p>
          </div>
        </div>
        <div class="flex-s-c gender-data-item">
          <Icon class="p-10" type="md-help-circle" :size="50" color="#70B4D0"/>
          <div>
            <span class="gender-percen">{{genderInfoView.unKnowUserRatio}}</span>
            <p class="gender-val-txt">未知共 <span class="gender-val">{{genderInfoView.total_unknown_gender_users}}</span> 人</p>
          </div>
        </div>
      </div>
      <div class="flex-s-c">
        <div class="gender-chart" id="healthy-chart">

        </div>
        <div class="gender-chart" id="risk-chart">

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'; // 5.0以上版本
// import echarts from 'echarts';
export default {
  props: {
    genderInfo: {
      type: Object,
      default:()=>{
        return {}
      }
    }
  },
  data(){
    return {
      healthyChart: null,
      riskChart: null,
      genderInfoView: {}
    }
  },
  watch:{
    genderInfo:{
      handler(nV, oV){
        this.$nextTick(()=>{
          nV = JSON.parse(JSON.stringify(nV));
          let totalUser = parseInt(nV.total_unknown_gender_users) + parseInt(nV.total_female_users) + parseInt(nV.total_male_users);
          if(totalUser){
            nV.maleUserRatio = this.getPercent(nV.total_male_users, totalUser) + '%';
            nV.femaleUserRatio = this.getPercent(nV.total_female_users, totalUser) + '%';
            nV.unKnowUserRatio = Math.abs(100 - parseFloat(nV.maleUserRatio) - parseFloat(nV.femaleUserRatio)).toFixed(1) + '%'
          } else {
            nV.unKnowUserRatio = nV.maleUserRatio = nV.femaleUserRatio = '0%';
          }
          let totalHealth = parseInt(nV.total_health_unknown_gender) + parseInt(nV.total_health_female_users) + parseInt(nV.total_health_male_users);
          if(totalHealth){
            nV.maleHealthRatio = this.getPercent(nV.total_health_male_users, totalHealth) + '%';
            nV.femaleHealthRatio = this.getPercent(nV.total_health_female_users, totalHealth) + '%';
            nV.unKnowHealthRatio = (100 - parseFloat(nV.maleHealthRatio) - parseFloat(nV.femaleHealthRatio)).toFixed(1) + '%'
          } else {
            nV.unKnowHealthRatio = nV.maleHealthRatio = nV.femaleHealthRatio = '0%';
          }
          let totalWarn = parseInt(nV.total_warning_unknown_gender) + parseInt(nV.total_warning_female_users) + parseInt(nV.total_warning_male_users);
          if(totalWarn){
            nV.maleWarnRatio = this.getPercent(nV.total_warning_male_users, totalWarn) + '%';
            nV.femaleWarnRatio = this.getPercent(nV.total_warning_female_users, totalWarn) + '%';
            nV.unKnowWarnRatio = (100 - parseFloat(nV.maleWarnRatio) - parseFloat(nV.femaleWarnRatio)).toFixed(1) + '%'
          } else {
            nV.unKnowWarnRatio = nV.maleWarnRatio = nV.femaleWarnRatio = '0%';
          }
          this.genderInfoView = nV;
          this.initChart(nV);
        })
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    getPercent(val, total){
      if(!total){
        return 0
      }
      return (parseInt(val || 0) / parseInt(total) * 100).toFixed(1);
    },
    initChart(data) {
      this.initHealthyChart(data);
      this.initRiskChart(data);
    },
    initHealthyChart(data){
      if (!this.healthyChart) {
          this.healthyChart =
              this.healthyChart ||
              echarts.init(document.getElementById("healthy-chart"));
      }
      let option = {
        tooltip: {
          show: true,
          formatter: (params)=>{
            let data = params.data || {};
            let str = params.seriesName || '';
            str = str ? str + '<br />' : '';
            str += params.name + '：  ' + params.value + '<br /> 占比：  ';
            if(data.type == 'female'){
              str += this.genderInfoView.femaleHealthRatio;
            } else if(data.type == 'male'){
              str += this.genderInfoView.maleHealthRatio;
            } else {
              str += this.genderInfoView.unKnowHealthRatio;
            }
            return str
          }
        },
        grid: {
          top: "5%",
          left: "0%",
          right: "0%",
          bottom: "13%",
          containLabel: true,
        },
        series: [
          {
            name: '健康占比',
            type: 'pie',
            radius: ['55%', '90%'],
            avoidLabelOverlap: false,
            label: {
              position: 'center',
              show: true,
              borderWidth: 0,
              color: '#fff',
              formatter: (params)=>{
                return params.seriesName
              }
            },
            emphasis: {
              disabled: true,
              label: {
                show: false
              }
            },
            data: [
              { value: data.total_health_female_users, type: 'female', name: '女',  color: '#F3399D', itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                      offset: 0, color: "#260034"
                  }, {
                      offset: 1, color: "#AE005E"
                  }],
                  global: false
                }
              }},
              { value: data.total_health_male_users, type: 'male', name: '男', color: '#1EAD91', itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                      offset: 0, color: "#15696A"
                  }, {
                      offset: 1, color: "#1FB495"
                  }],
                  global: false
                }
              }},
              { value: data.total_health_unknown_gender, type: 'unkonw', name: '未知', color: '#70B4D0', itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                      offset: 0, color: "#79B9D4"
                  }, {
                      offset: 1, color: "#4F9FC0"
                  }],
                  global: false
                }
              }}
            ]
          }
        ]
      }
      this.healthyChart.setOption(option);
    },
    initRiskChart(data){
      if (!this.riskChart) {
          this.riskChart =
              this.riskChart ||
              echarts.init(document.getElementById("risk-chart"));
      } else {
        this.riskChart.clear();
      }
      let option = {
        tooltip: {
          show: true,
          formatter: (params)=>{
            let data = params.data || {};
            let str = params.seriesName || '';
            str = str ? str + '<br />' : '';
            str += params.name + '：  ' + params.value + '<br /> 占比：  ';
            if(data.type == 'female'){
              str += this.genderInfoView.femaleWarnRatio;
            } else if(data.type == 'male'){
              str += this.genderInfoView.maleWarnRatio;
            } else {
              str += this.genderInfoView.unKnowWarnRatio;
            }
            return str
          }
        },
        series: [
          {
            name: '存在风险占比',
            type: 'pie',
            radius: ['55%', '90%'],
            avoidLabelOverlap: false,
            label: {
              position: 'center',
              show: true,
              borderWidth: 0,
              color: '#fff',
              lineHeight: 20,
              formatter: (params)=>{
                return params.seriesName.replace("占比","\n占比");
              }
            },
            emphasis: {
              disabled: true
            },
            data: [
              { value: data.total_warning_female_users, type: 'female', name: '女', color: '#F3399D', itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                      offset: 0, color: "#260034"
                  }, {
                      offset: 1, color: "#AE005E"
                  }],
                  global: false
                }
              }},
              { value: data.total_warning_male_users, type: 'male', name: '男', color: '#1EAD91', itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                      offset: 0, color: "#15696A"
                  }, {
                      offset: 1, color: "#1FB495"
                  }],
                  global: false
                }
              }},
              { value: data.total_warning_unknown_gender, type: 'unkonw', name: '未知', color: '#70B4D0', itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                      offset: 0, color: "#79B9D4"
                  }, {
                      offset: 1, color: "#4F9FC0"
                  }],
                  global: false
                }
              }}
            ]
          }
        ]
      }
      this.riskChart.setOption(option);
    }
  },
  mounted(){
    // this.initChart();
  }
}
</script>

<style lang="less" scoped>
.gender-data{
    max-width: 1007px;
    margin: 16px auto;
    min-height: 173px;
    padding: 20px 40px;
    padding-right: 10px;
    border-radius: 200px;
    color:#fff;
    min-width: 900px;
    .gender-data-tip{
      padding-left: 30px;
      margin-bottom: -10px;
    }
  }

.gender-data-item{
  min-width: 180px;
}
.gender-percen{
  font-size: 28px;
  font-family: Futura;
  font-weight: normal;
  color: #FFFFFF;
  line-height: 37px;
}
.gender-val-txt{
  color: #6A6A8B;
  font-size: 16px;
  font-family: Futura-MediumItalic, Futura;
  font-weight: normal;
  line-height: 21px;
}
.gender-val{
  color: #fff;
}
.gender-chart{
  width: 125px;
  height: 125px;
  margin: 0px 20px;
  // background-color: #efefef;
}
</style>