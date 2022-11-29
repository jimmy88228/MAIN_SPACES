<template>
  <div class="data-right-area">
    <div class="bg-1 act-report">
          <div class="item-tip">相关活动情况</div>
          <div class="act-report-list">
            <div class="report-scroll">
              <div class="report-scroll-stay">
                <vue-scroll @handle-scroll="handleScroll" ref="vueScrollRef">
                  <div class="p-r-20">
                    <div class="bg-2 report-item flex-b-c" v-for="(item, index) in actList" :key="item.id">
                      <div class="report-item-l">
                        <div class="act-report-name">{{item.activity_name}}</div>
                        <div class="report-progress">
                          <p class="progress-bg"><span class="progress-val" :style="'width:' + item.schedule_info.joinPercent + ';'"></span></p>
                        </div>
                        <p class="progress-txt">测评进度 {{item.schedule_info.join_member}}/{{item.schedule_info.has_all_join_member}}</p>
                      </div>
                      <div class="report-item-r text-c" @click="getActOverview(item)">
                        <Icon class="item-r-arrow" color="#1E1E60" :size="26" type="md-arrow-round-forward" />
                        <p class="m-t-10">活动概况</p>
                      </div>
                    </div>
                    <div class="p-t-10 p-b-10 m-t-10" v-if="hasMore">
                      <Spin >
                        <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                        <div>Loading</div>
                      </Spin>
                    </div>
                    <div class="empty-report" v-if="(!actList || actList.length == 0) && !hasMore">暂无数据</div>
                  </div>
                </vue-scroll>
                <div class="scroll-mask"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-1 average-area">
          <div class="item-tip flex-b-c m-b-10">
            <div>各年级测评平均分</div>
            <div>
              <Select class="cockpit-select" filterable placeholder="请选择量表" v-model="searchForm.model_id" @on-change="changeModel">
                <!-- <span slot="prefix" class="cockpit-select-prefix w-nowrap">量表</span> -->
                <Option v-for="(item ) in modelData" :key="item.id" :value="item.id" >{{item.name}}</Option>
              </Select>
            </div>
          </div>
          <div class="average-chart" id="average-chart"></div>
        </div>  
  </div>  
</template>

<script>
import * as echarts from 'echarts'; // 5.0版本以上
// import echarts from "echarts";
import dataSort from "./data-sort.js";
export default {
  props: {
    searchForm: {
      type: Object,
      default(){
        return {}
      }      
    },
    modelData: {
      type: Object | Array,
      default(){
        return []
      }      
    },
    groupReportInfo: {
      type: Object | Array,
      default(){
        return {}
      }      
    },
  },
  data(){
    return {
      averageChart: null,
      actList: [],
      page: 0,
      pageSize: 4,
      actLoading: false,
      hasMore: true,
      nationalNorm: 0,
      warningLine: 0
    }
  },
  methods: {
    loadAct(){
      if(this.actLoading || !this.hasMore){
        return;
      }
      this.actLoading = true;
      let page = this.page ? this.page + 1 : 1;
      return this.$MainApi.assessmentTaskList({
          data: {
              is_record_drive: 1, // 0 普通 1 数据仓 
              page: page,
              pageSize: this.pageSize
          },
          other: {
              isErrorMsg: true
          }
      })
      .then((res) => {
          if (res.code) {
            this.page = page;
            let data = res.data || {};
            let items = data.items || [];
            for(let i = 0; i < items.length; i++){
              let schedule_info = items[i].schedule_info || {};
              schedule_info.joinPercent = ((parseInt(schedule_info.join_member) / parseInt(schedule_info.has_all_join_member)) * 100).toFixed(2) + '%'
            }
            this.actList = this.actList.concat(items);
            this.hasMore = this.actList.length < data.total ? true : false;
          }
      }).finally(()=>{
        setTimeout(()=>{
          this.actLoading = false;
        }, 500)
      })
    },
    handleScroll(vertical, horizontal, nativeEvent){
      let vueScrollRef = this.$refs["vueScrollRef"];
      let vH = vueScrollRef.$el.clientHeight;
      if(vertical.process * vH > (vH - 50)){
        this.loadAct();
      }
    },
    changeModel(){
      this.$emit('search')
    },
    getActOverview(item){
      this.$emit("getOverview", item);
    },
    dataHandle(data){
      this.nationalNorm = parseFloat(data.national_norm || 0);
      this.warningLine = parseFloat(data.warning_line || 0);
      let chartData = [], itemIndex = 0, warnData = [];
      let list = data.list || {};
      let maxY = 0, xName = [], colors = ['#B765D1', '#3BA21D'];
      // 先处理出现的年级
      for(let key in list){
        let item = list[key] || [];
        for(let i = 0; i < item.length; i++){
          let group_key_name = item[i].group_key_name;
          if(xName.indexOf(group_key_name) == -1){
            xName.push(group_key_name);
          }
        }
      }
      // 根据中文排序年级
      try {
        xName.sort((a, b)=>{
          return dataSort.gradeOrder.indexOf(a) - dataSort.gradeOrder.indexOf(b); // 比较中文排序
        })
      } catch (error) {}
      // 通过年级的排序，对应插入数据
      for(let key in list){
        let item = list[key] || [];
        let chartItem = {
          name: key + "学年",
          isData: true,
          color: colors[itemIndex],
          data: []
        }
        for(let i = 0; i < item.length; i++){
          let group_key_name = item[i].group_key_name;
          let index = xName.indexOf(group_key_name);
          chartItem.data[index] = item[i].group_mean;
          maxY = Math.max(maxY, item[i].group_mean);
        }
        chartData.push(chartItem);
        itemIndex++;
      }
      // 常模
      if(parseInt(this.nationalNorm) > 0){
        maxY = Math.max(maxY, this.nationalNorm);
        warnData.push({
          name: "常模",
          color: "#FDB72A",
          val: parseFloat(this.nationalNorm),
        })
      }
      // 预警分数线
      if(parseInt(this.warningLine) > 0){
        maxY = Math.max(maxY, this.warningLine);
        warnData.push({
          name: "预警分数线",
          color: "#FC541D",
          val: parseFloat(this.warningLine),
        })
      }
      chartData = chartData.concat(warnData);
      console.log("chartData", chartData);
      this.initChart(chartData, maxY, xName);
    },
    initChart(data, maxY, xName) {
      maxY = maxY || 50;
      maxY = this.formatInt(maxY, true);
      if (!this.averageChart) {
          this.averageChart =
              this.averageChart ||
              echarts.init(document.getElementById("average-chart"));
      }
      let legendData = [], series = [];
      for (let i = 0; i < data.length; i++) {
          let item = data[i] || {};
          let seriesConf = {
            name: item.name,
            type: "line",
            lineStyle: {
                color: item.color,
            },
            smooth: true
          }
          if(item.isData){
            seriesConf.symbol = 'path://M 50 10 A 40 40 0 1 0 50 90 A 40 40 0 1 0 50 10 Z M 50 30 A 20 20 0 1 1 50 70 A 20 20 0 1 1 50 30 Z';
            seriesConf.symbolSize = 10;
            seriesConf.data = item.data;
            seriesConf.itemStyle = {
                color: item.color,
            }
          } else {
            seriesConf.markLine = {
              symbol: 'none',
              label: {
                show: false,
                position: 'insideEndBottom'
              },
              lineStyle: {
                color: item.color,
                type: "solid",
                width: 2
              },
              data: [
                {
                  name: item.name,
                  yAxis: item.val
                }
              ]
            }
          }
          series.push(seriesConf)
          legendData.push({
            name: item.name,
            itemStyle: {
              color: item.color
            }
          })
      }
      let option = {
          animationDuration: 1000,
          tooltip: {
              trigger: "item",
          },
          grid: {
              top: "5%",
              left: "0%",
              right: "0%",
              bottom: "13%",
              containLabel: true,
          },
          legend: {
            bottom: 0,
            left: "4%",
            icon: "path://M0,0 L0,1.5 L15,1.5, L15,0 L0,0",
            itemGap: 15,
            textStyle: {
              color: '#DBDBDB'
            },
            data: legendData
          },
          xAxis: {
            type: 'category',
            data: xName,
            axisLine: {
                show: false,
                lineStyle: {
                    color: "#ACACAC" 
                }
            },
            axisLabel: {
                color: "#DBDBDB",
            },
            z: 10,
          },
          yAxis: [
              {
                  show: true,
                  type: "value",
                  min: 1,
                  max: maxY,
                  splitNumber: 5,
                  axisLine: {
                      show: false,
                      lineStyle: {
                          color: "#ACACAC" 
                      }
                  },
                  axisLabel: {
                      show: true,
                      lineStyle: {
                          color: "#DBDBDB" 
                      }
                  },
                  splitLine: {
                      show: true,
                      lineStyle: {
                          color: "#242151",
                          width: 0.8,
                          type: "dashed",
                      },
                  },
              },
          ],
          series: series,
      };
      this.averageChart.setOption(option);
    },
    formatInt(num, ceil = true){
      let prec = (parseInt(num) + '').length - 1;
      prec = prec || 1;
      const len = String(num).length;
      if (len <= prec) { return num };
      const mult = Math.pow(10, prec);
      return ceil ? 
        Math.ceil(num / mult) * mult : Math.floor(num / mult) * mult;
    }
  },
  mounted(){
    this.loadAct();
  },
  watch: {
    groupReportInfo: {
      handler(nV){
        if(nV.list){
          this.$nextTick(()=>{
            this.dataHandle(nV);
          })
        }
      },
      immediate: true,
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
.data-right-area{
  // pointer-events: none;
  .act-report{
    padding: 30px 5px 20px 33px;
    border-top-left-radius: 30px;
    .item-tip{
      padding-bottom: 26px;
    }
    .act-report-list{
      min-height: 120px;
      max-height: 400px;
      display: flex;
    }
    .report-scroll{
      flex: 1;
    }
    .report-scroll-stay{
      width: 100%;
      height:100%;
      position: relative;
    }
    .scroll-mask{
      position: absolute;
      left: 0px;
      bottom: 0px;
      width: 100%;
      height: 100%;
      display: block;
      background: linear-gradient(180deg, rgba(45, 43, 131, 0.2) 50%, #0B0736 100%);
      // opacity: 0.5;
      pointer-events: none;
    }
    .report-item{
      padding: 20px;
      margin-bottom: 15px;
    }
    .act-report-name{
      font-size: 17px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #FFFFFF;
      line-height: 24px;
    }
    .report-progress{
      padding: 12px 0px 9px 0px;
    }
    .progress-bg{
      width: 70%;
      height: 8px;
      border-radius: 8px;
      background-color:#444373;
      overflow: hidden;
      position:relative;
    }
    .progress-val{
      position: absolute;
      width: 0%;
      top:0px;
      left:0px;
      height: 8px;
      display: inline-block;
      background-color:#1CAB8A;
      border-radius: 8px;
      transition: width .35s .1s;
    }
    .progress-txt{
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #9A9A9A;
      line-height: 17px;
    }
    .item-r-arrow{
      border-radius: 100%;
      background-color:#0AAD91;
      padding: 2px;
    }
    .item-r-arrow:before{
      display: block;
      transform: scaleY(0.8);
    }
    .report-item-l{
      min-width: 250px;
    }
    .report-item-r{
      cursor: pointer;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #9E9DE8;
      line-height: 20px;
      padding: 0px 10px 0px 20px;
    }
  }
  // loading
  .ivu-spin{
    position:relative;
    color: #fff;
    z-index: 2;
  }
  .demo-spin-icon-load{
    
      animation: ani-demo-spin 1s linear infinite;
  }
  @keyframes ani-demo-spin {
      from { transform: rotate(0deg);}
      50%  { transform: rotate(180deg);}
      to   { transform: rotate(360deg);}
  }
  .average-area{
    padding: 20px 30px 20px 40px;
    border-radius: 30px 0px 0px 0px;
  }
  .average-chart{
    width: 100%;
    height: 300px;
  }
}
</style>