<template>
  <div class="data-middle-view">
    <div class="data-middle-chart" :class="{'chart-loading': chartLoading}" id="organize-chart"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'; // 5.0版本以上
// import echarts from "echarts";
export default {
  props: {
    searchForm: {
      type: Object,
      default:()=>{
        return {}
      }
    },
    organizeData: {
      type: Array,
      default:()=>{
        return []
      }
    },
  },
  data(){
    return {
      organizeChart: null,
      bgImg: require("@/assets/images/cockpit/cockpit_bg.png"),
      allUser: 0,
      levelConf: {
        "bg": {
          fixed: true,
          colorType: "bg",
          z: 1,
          symbolSize: 380,
          symbol: 'image://' + require("@/assets/images/cockpit/cockpit_bg.png")
        },
        "0": {
          z: 2,
          symbolSize: 120,
          fixed: true,
          color: "#F9D568",
          colorType: "radial",
          shadow: true,
          HollowColor: "#06002A",
          lineColor: "#E76A2B",
          itemTargetColor: "#F56E2E",
          lineTargetColor: "#40AE36",
          fontFamily: "Futura-MediumItalic, Futura"
        },
        "1": {
          z: 2,
          symbolSize: 60,
          color: "#C6F974",
          colorType: "radial",
          shadow: true,
          lineColor: "#16901F",
          itemTargetColor: "#18921F",
          lineTargetColor: "#1EB593",
          fontFamily: "Futura-MediumItalic, Futura"
        },
        "2": {
          z: 2,
          symbolSize: 50,
          lineColor: "#179878",
          color: "#1EB593",
          HollowColor: "#06002A"
        },
        // "3": {
        //   z: 2,
        //   symbolSize: 40,
        //   color: "#1FB795"
        // }
      },
      chartLoading: false,
      prevCampusId: null,
      resizeTimer: null
    }
  },
  methods: {
    initData(data){
      data = JSON.parse(JSON.stringify(data || []));
      if(data instanceof Array && this.prevCampusId != this.searchForm.campus_id){
          this.$nextTick(()=>{
            setTimeout(()=>{
              let { datas, links } = this.dataHandle(data);
              this.initChart(datas, links);
              window.onresize = ()=>{
                this.resize(data);
              }
              this.prevCampusId = this.searchForm.campus_id;
            }, 200)
          })
        }
    },
    resize(data){
      if(this.resizeTimer){
        clearTimeout(this.resizeTimer);
        this.resizeTimer = null;
      }
      this.$nextTick(()=>{
        this.resizeTimer = setTimeout(()=>{
          let { datas, links } = this.dataHandle(data);
          this.initChart(datas, links);
        }, 250)
      })
    },
    dataHandle(data){
      let organizeChart = document.getElementById("organize-chart");
      let x = organizeChart.offsetWidth / 2
      let y = (organizeChart.offsetHeight / 2)
      let position = {x, y};
      let schoolData = {
        category: 0,
        name: this._structureName,
        id: this._getReqStructureId + '',
        x: x,
        y: y,
        value: 100,
        symbolSize: 120,
        ...this.levelConf["0"]
      }, campusData = {}, gradeData = {}, classData = {};

      let installData = [{
        id: "bg",
        x: x,
        y: y,
        symbolSize: 380,
        ...this.levelConf["bg"]
      }]
      // 
      let datas = [], links = [];
      if(Number(this.searchForm.campus_id)){
        campusData = this.getLevelData(data, 'campus', 0, position);
        gradeData = this.getLevelData(data, 'grade', 1, position);
        classData = this.getLevelData(data, 'class', 2, position);
        datas = [
          ...installData,
          ...campusData._data,
          ...gradeData._data,
          ...classData._data
        ]
        links = [
          ...campusData._link,
          ...gradeData._link,
          ...classData._link
        ]
      } else { // 全校
        campusData = this.getLevelData(data, 'campus', 1, position);
        schoolData.value = this.allUser;
        installData.push(schoolData);
        datas = [
          ...installData,
          ...campusData._data
        ]
        links = [
          ...campusData._link
        ]
      }
      return {
        datas, links
      }
    },
    getLevelData(data, key, category = 0, position = {}){
      let _data = [], _link = [], dataJson = [], totalUsers = {};
      let _levelConf = JSON.parse(JSON.stringify(this.levelConf[category + ''] || {}));
      for(let i = 0; i < data.length; i++){
        let item = data[i] || {};
        let dataIndex = -1
        let _id = '', _name = '', _source = '';
        let positionData = {};
        if(key == 'campus'){ // 校区数据
          _id = item.campus_id + '';
          _name = item.campus_name;
          _source = item.school_id + '';
          if(category == 0){
            positionData = position
          }
        } else if(key == 'grade'){ // 年级数据
          _id = item.campus_name + item.grade_name + '';
          _name = item.grade_name;
          _source = item.campus_id + '';
        } else if(key == 'class'){ // 班级数据
          _id = item.campus_name + item.grade_name + item.class_full_name + '';
          _name = item.class_name;
          _source = item.campus_name + item.grade_name + '';
        }
        dataIndex = dataJson.indexOf(_id);
        if(dataIndex == -1){
          dataJson.push(_id);
          _data.push({
            key: key,
            category: category,
            id: _id,
            name: _name,
            ...positionData,
            ..._levelConf
          })
          _link.push({
            key: key,
            category: category,
            id: _id,
            name: _name,
            ..._levelConf,
            source: _source,
            target: _id
          })
          dataIndex = _data.length - 1;
          totalUsers[_id] = 0
        }
        totalUsers[_id] += parseInt(item.male_users) + parseInt(item.female_users) + parseInt(item.unknown_gender_users)
      }
      // 赋值总数
      for(let i = 0; i < _data.length; i++){
        _data[i].value = totalUsers[_data[i].id]
        _link[i].value = totalUsers[_link[i].id]
      }
      // 获取总数
      if(key == 'campus'){
        this.allUser = 0;
        for(let i in totalUsers){
          this.allUser += totalUsers[i];
        }
      }
      return {
        _data,
        _link
      }
    },
    initChart(data, links) {
      if (!this.organizeChart) {
          this.organizeChart =
              this.organizeChart ||
              echarts.init(document.getElementById("organize-chart"));
      } else {
        this.organizeChart.clear();
      }
      this.chartLoading = true;
      let option = {
        grid: {
          containLabel: true
        },
        animation: true,
        animationDuration: 1500,
        animationDurationUpdate: 500,
        animationEasing: 'cubicInOut',
        animationEasingUpdate: 'cubicInOut',
        animationThreshold: 2000,
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            type: 'graph',
            layout: 'force',
            smooth: true,
            labelLayout: {
              hideOverlap: true
            },
            selectedMode: false,
            data: data.map((item)=>{
              if(item.id == 'bg'){
                item.emphasis = {
                  disabled: true
                }
              }
              item.itemStyle = {
                 symbol: item.category > 1 ? 'circle' : false
              };
              // item图样式
              if(item.HollowColor){
                item.itemStyle.color = item.HollowColor;
                item.itemStyle.borderColor = (item.colorType && item.colorType == 'radial') ? {
                      type: 'linear',
                      x: 0,
                      y: 0,
                      x2: 0,
                      y2: 1,
                      colorStops: [{
                          offset: 0, color: item.color
                      }, {
                          offset: 1, color: item.itemTargetColor
                      }],
                      global: false
                    } : item.color || '',
                item.itemStyle.borderWidth = item.symbolSize * 0.2
              } else {
                item.symbolSize = item.symbolSize * 1.2
                item.itemStyle.color = (item.colorType && item.colorType == 'radial') ? {
                      type: 'radial',
                      x: 0.65,
                      y: 0.35,
                      r: 0.47,
                      colorStops: [{
                          offset: 0, color: item.color
                      }, {
                          offset: 1, color: item.itemTargetColor
                      }],
                      global: false
                    } : item.color || ''
              }
              // 阴影
              if(item.shadow){
                item.itemStyle = {
                  ...item.itemStyle,
                  shadowBlur: 20,
                  shadowColor: item.itemTargetColor || '',
                  shadowOffsetX: 3,
                  shadowOffsetY: 3,
                }
              }
              if(item.id == 'bg'){
                item.label = {
                  show: false
                }
                item.tooltip = {
                  show: false,
                  formatter:()=>{
                    return '';
                  }
                }
              } else {
                item.label = {
                  show: true
                }
                item.tooltip = {
                borderColor: item.color,
                formatter: (params)=>{
                  let data = params.data || {};
                  if(data.id == 'bg') return '';
                  return data.name + '： '  + data.value
                }
                }
              }
              // 

              return item;
            }),
            links: links.map((item)=>{
              item.lineStyle = {
                width: 5 - item.category,
                color: (item.color && item.lineTargetColor) ? {
                      type: 'linear',
                      x: 0,
                      y: 0,
                      x2: 0,
                      y2: 1,
                      colorStops: [{
                          offset: 0, color: item.itemTargetColor
                      }, {
                          offset: 1, color: item.lineTargetColor
                      }],
                      global: false
                    } : item.color || '',
              }
              return item;
            }),
            // categories: ['bg', 0, 1, 2, 3],
            center: ['50%', '50%'],
            roam: 'move',
            force: {
              repulsion : this.searchForm.campus_id ? 200 : 500,
              edgeLength: this.searchForm.campus_id ? 100 : 200,
              gravity: 0.01
            },
            labelLayout: {
              hideOverlap: true
            },
            scaleLimit: {
              min: 0.2,
              max: 2
            },
            emphasis: {
              // focus: 'adjacency',
              blurScope: 'global',
              // disabled: true,
            },
            label: {
              show: true,
              align: 'center',
              fontFamily: 'PingFangSC-Medium, PingFang SC',
              formatter: (params )=>{
                let data = params.data || {};
                let str = '{a' + data.category + '|' + data.name + '}\n{b' + data.category +'|' + data.value + '}';
                return str
              },
              rich: {
                a0: {
                  color: '#fff',
                  fontSize: 16,
                  padding: 8
                },
                b0:{
                  color: '#fff',
                  fontWeight: "bold",
                  fontSize: 26,
                  fontFamily: 'Futura-MediumItalic, Futura'
                },
                a1: {
                  color: '#0C4B00',
                  fontWeight: "bold",
                  fontSize: 12,
                  padding: 7
                },
                b1:{
                  color: '#fff',
                  fontWeight: "bold",
                  fontSize: 22,
                  fontFamily: 'Futura-MediumItalic, Futura'
                },
                a2: {
                  color: '#fff',
                  fontSize: 12,
                  padding: 5
                },
                b2:{
                  color: '#fff',
                  fontSize: 12,
                },
                a3: {
                  color: '#fff',
                  fontSize: 12,
                  padding: 5
                },
                b3:{
                  color: '#fff',
                  fontSize: 12,
                }
              },
              
            }
          },
        ]
      };
      this.organizeChart.off("click");
      this.organizeChart.setOption(option, {notMerge: true});
      this.$nextTick(()=>{
        setTimeout(()=>{
          this.chartLoading = false;
          this.organizeChart.setOption(option);
          this.organizeChart.on('click', (params)=>{
              this.echartClick(params);
          });
        }, 500)
      })
      
    },
    echartClick(params){
      params = params || {};
      let data = params.data || {};
      switch(data.key){
        case "campus":
          this.searchForm.campus_id = data.id;
          this.$emit("search");
          break
      }
    }
  },
  mounted(){},
  watch: {
    // organizeData:{
    //   handler(nV){
    //     if(nV instanceof Array && this.prevCampusId != this.searchForm.campus_id){
    //       this.$nextTick(()=>{
    //         let { datas, links } = this.dataHandle(nV);
    //         this.initChart(datas, links);
    //         window.onresize = ()=> {
    //           this.organizeChart.resize();
    //         };
    //         if(nV.length){
    //           this.prevCampusId = this.searchForm.campus_id;
    //         }
    //       })
    //     }
    //   },
    //   immediate: true,
    //   deep: true
    // }
  }
}
</script>

<style lang="less" scoped>
.data-middle-view{
  width:100%;
  height: 100%;
  .data-middle-chart{
    width:100%;
    height: 100%;
    opacity: 1;
    transition: opacity .35s;
  }
  .chart-loading{
    opacity: 0.8;
  }
}
</style>