<template>
  <div class="gender-data flex-a-c bg-1">
    <div class="gender-data-tip item-tip">平台用户性别分布</div>
    <div class="flex-s-c gender-data-cont">
      <div class="flex-s-c gender-data-item">
        <Icon type="md-man" :size="66" color="#0AAD91"/>
        <div>
          <span class="gender-percen">{{genderInfoView.maleRatio}}</span>
          <p class="gender-val-txt">共 <span class="gender-val">{{genderInfoView.total_male_users}}</span> 人</p>
        </div>
      </div>
      <div class="flex-s-c gender-data-item">
        <Icon type="md-woman" :size="66" color="#F53D9E"/>
        <div>
          <span class="gender-percen">{{genderInfoView.femaleRatio}}</span>
          <p class="gender-val-txt">共 <span class="gender-val">{{genderInfoView.total_female_users}}</span> 人</p>
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
          if(nV.total_users){
            nV.maleRatio = (Number(nV.total_male_users || 0) / Number(nV.total_users) * 100).toFixed(1);
            nV.femaleRatio = (100 - parseFloat(nV.maleRatio)).toFixed(1) + '%'
          } else {
            nV.maleRatio = nV.femaleRatio = '0%';
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
          trigger: 'item'
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
              { value: data.total_health_female_users, name: '女',  color: '#F3399D', itemStyle: {
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
              { value: data.total_health_male_users, name: '男', color: '#1EAD91', itemStyle: {
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
      }
      let option = {
        tooltip: {
          show: true
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
              { value: data.total_warning_female_users, name: '女', color: '#F3399D', itemStyle: {
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
              { value: data.total_warning_male_users, name: '男', color: '#1EAD91', itemStyle: {
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
    height: 173px;
    padding: 0px 50px;
    border-radius: 200px;
    color:#fff;
  }
.gender-data-tip{}
.gender-data-item{
  min-width: 170px;
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
  width: 150px;
  height: 150px;
  margin: 0px 20px;
  // background-color: #efefef;
}
</style>