<template>
  <div class="data-stati">
    <Card>
      <div id="dataChart"></div>
    </Card>
  </div>
</template>

<script>
import echarts from 'echarts';

export default {
  mounted () {
    this.loadData();
    // 饼状图
    // myChart.setOption({
    //     title: {
    //         text: '报表统计'
    //     },
    //     tooltip: {
    //       formatter(data) {
    //         let {
    //           name,
    //           value
    //         } = data.data;
    //         return `科目占比 <p>${name}: ${value}</p>`
    //       }
    //     },
    //     toolbox: {},
    //     legend: {
    //       icon: 'circle',
    //       itemWidth:20,
    //       itemHeight:20,
    //       textStyle: {
    //         color: 'red'
    //       },
    //       formatter: function (name) {
    //           //list需要接口返回的数据，在这里无法直接获取
    //           const list = {
    //             '语文': 50,
    //             '数学': 50
    //           }
    //           const value = list[name];
    //           return `${name} ${value}`;
    //       }
    //     },
    //     // 配置颜色
    //     color: ['#ca8622', '#bda29a'],
    //     series: [{
    //         type: 'pie',
    //         radius: 50,
    //         data: [{
    //           name: '语文',
    //           value: 50
    //         }, {
    //           name: '数学',
    //           value: 50
    //         }]
    //     }]
    // });
    // 饼状环形
    // myChart.setOption({
    //     title: {
    //         text: '报表统计'
    //     },
    //     tooltip: {
    //       show: true,
    //       // 设置提示位置
    //       position: ['48%', '42%'],
    //       backgroundColor: 'rgba(0,0,0,0)',
    //       textStyle: {
    //         color: 'red'
    //       },
    //       formatter(data) {
    //         let {
    //           name,
    //           value
    //         } = data.data;
    //         return `科目占比 <p>${name}: ${value}</p>`
    //       }
    //     },
    //     toolbox: {},
    //     legend: {
    //       icon: 'circle',
    //       itemWidth:20,
    //       itemHeight:20,
    //       formatter: function (name) {
    //           //list需要接口返回的数据，在这里无法直接获取
    //           const list = {
    //             '语文': 50,
    //             '数学': 50
    //           }
    //           const value = list[name];
    //           return `${name} ${value}`;
    //       }
    //     },
    //     // 配置颜色
    //     color: ['#ca8622', '#bda29a'],
    //     series: [{
    //         type: 'pie',
    //         radius: ['35%', '55%'],
    //         label: {
    //           show: false
    //         },
    //         data: [{
    //           name: '语文',
    //           value: 50
    //         }, {
    //           name: '数学',
    //           value: 50
    //         }]
    //     }]
    // });
  },
  methods: {
    loadData () {
      return this.$ajax.post(this.$api.communityTablesList, {
        start_time: '',
        end_time: ''
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          var myChart = echarts.init(document.getElementById('dataChart'));
    // 绘制图表 折线图
    myChart.setOption({
        title: {
            text: '报表统计'
        },
        tooltip: {
          trigger: 'axis',
          formatter(data) {
            let d = `<p>${data[0].name}</p>`;
            data.forEach(item => {
              d += `<p>${item.marker}${item.seriesName}: ${item.value}</p>`;
            });
            return `<div>${d}</div>`
          }
        },
        toolbox: {
          show: true,
					feature: {
            dataView: {
              readOnly: false
            },
            magicType: {
              type: ["line", "bar"]
            },
            saveAsImage: {
              show: true
            }
          }
				},
        legend: {
            data:['评论数', '点赞数', '收藏数', '点击数']
        },
        xAxis: {
            axisLabel:{
							show:true,
							textStyle:{
								color:"#ababab"
							}
						},
            data: res.data.items.xAxis
        },
        yAxis: {
          axisLabel : {
            formatter: '{value}',
            textStyle:{
              color:"#ababab"
            }
          },
          minInterval:1
        },
        series: res.data.items.data
    });
        }
      });
    },
  }
}
</script>

<style lang="less" scoped>
.data-stati{
  #dataChart{
    height: 400px;
  }
}
</style>
