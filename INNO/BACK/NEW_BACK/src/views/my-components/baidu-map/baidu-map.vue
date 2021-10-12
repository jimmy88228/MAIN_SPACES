<style lang="less">
#allmap {
	width: 100%;
	height: 100%;
	overflow: hidden;
	margin:0;
	font-family:"微软雅黑";
}
</style>

<template>
	<div>
		<div id="mapjs"></div>
		<div style="padding-bottom:10px;">
			<Form ref="formSearch" inline>
				<Input v-model="searchq" placeholder="请输入地址关键词搜索" clearable style="width:220px"></Input>
				<Button type="info" icon="ios-search" @click="searchPlace" shape="circle">搜索</Button>
				<span style="float:right">请点击地图选取位置经纬： 经度=<b style="color:blue">{{xlon}}</b> , 纬度=<b style="color:blue">{{xlat}}</b></span>
			</Form>
		</div>
		<div id="allmap" @click="goChangeData"></div>
		<input type="hidden" id="change-data" value="" />
	</div>
</template>

<script>
// import util from '@/libs/util.js';

export default {
  name: 'BaiduMap',
  props: {

  },
  data () {
    	return {
    		map: {},
    		searchq: '',
    		xlon: 0,
    		xlat: 0,
    		isInit: 0,
    		cityName: '',
    		marker: ''
    	}
  },
  methods: {
    // 	// 初始化,在配置加载完毕才进行初始化
    // 	init (lon, lat, title, address) {
    // 		var ak = util.bmapAK;
    // 		this.xlon = lon;
    // 		this.xlat = lat;

    // 		if (this.isInit == 1) {
    // 			// 已经初始化过地图的就不重复初始化
    // 			if (lon != 0 && lat != 0) {
	  //   			this.initMap(lon, lat, title, address);
    //     } else {
    // 				// 以城市和为中心
    // 				if (this.cityName == '') {
    // 					this.initCityCenter();
    // 				} else {
    // 					this.map.setCenter(this.cityName);
    // 				}
    // 			}
    // 		} else {
    // 			// 初始化地图
	  //   		this.loadScript('http://api.map.baidu.com/getscript?type=quick&file=api&ak=' + ak);
    //     this.loadScript('http://api.map.baidu.com/getscript?type=feature&file=api&ak=' + ak,
    //       () => {
    //         this.isInit = 1;
    //         // 百度地图API功能
    //         this.map = new BMap.Map('allmap'); // 创建Map实例

    //         if (lon == 0 && lat == 0) {
    //           this.initCityCenter();
    //         } else {
    //           var point = new BMap.Point(lon, lat);
    //           // 创建标注
    //           var marker = new BMap.Marker(point);
    //           this.marker = marker;
    //           this.map.addOverlay(marker);
    //           this.map.centerAndZoom(point, 12); // 初始化地图,设置中心点坐标和地图级别

    // 	    		// 标志位置
    //           var opts = {
    // 				  width: 200, // 信息窗口宽度
    // 				  height: 100, // 信息窗口高度
    // 				  title: title, // 信息窗口标题
    // 				  enableMessage: false// 设置允许信息窗发送短息
    //           };
    //           // 创建信息窗口对象
    //           var infoWindow = new BMap.InfoWindow(address, opts);
    //           // 开启信息窗口
    //           this.map.openInfoWindow(infoWindow, point);
    //         }

    //         // 单击获取点击的经纬度事件绑定
    //         this.map.addEventListener('click', function (e) {
    //           // 更新数据
    //           document.getElementById('change-data').value = JSON.stringify({ lon: e.point.lng, lat: e.point.lat });
    //         });

    //         this.map.enableScrollWheelZoom(true);
    //       });
    //   }
    // 	},
    // 	// 初始化地图参数
    // 	initMap (lon, lat, title, address) {
    // 		var point = new BMap.Point(lon, lat);
    // 		// 清除旧标注
    // 		if (this.market != '') {
    // 			this.map.removeOverlay(this.marker);
    // 		}

    // 		// 创建标注
    //   var marker = new BMap.Marker(point);
    //   this.marker = marker;
    //   this.map.addOverlay(marker);
    //   this.map.centerAndZoom(point, 12); // 初始化地图,设置中心点坐标和地图级别

    // 		// 标志位置
    //   var opts = {
    // 	  width: 200, // 信息窗口宽度
    // 	  height: 100, // 信息窗口高度
    // 	  title: title, // 信息窗口标题
    // 	  enableMessage: false// 设置允许信息窗发送短息
    //   };
    //   // 创建信息窗口对象
    //   var infoWindow = new BMap.InfoWindow(address, opts);
    //   // 开启信息窗口
    //   this.map.openInfoWindow(infoWindow, point);

    //   setTimeout(() => {
    //     // 这里要异步才生效
	  //       	this.map.setCenter(point);
    //   }, 1000);
    // 	},
    // 	initCityCenter () {
    // 		var myCity = new BMap.LocalCity();
    //   myCity.get((result) => {
    //     this.cityName = result.name;
    //     this.map.setCenter(this.cityName);
    //   });
    // 	},
    // 	goChangeData () {
    // 		var val = document.getElementById('change-data').value;
    // 		if (val != '') {
    // 			var obj = JSON.parse(val);

    // 			if (obj.lon != this.xlon || obj.lat != this.xlat) {
    // 				if (confirm('确定修改设备位置吗？')) {
    //     			this.xlon = obj.lon;
    //     			this.xlat = obj.lat;
	  //   			}
    // 			}
    // 		}
    // 	},
    // 	getResult () {
    // 		return {
    // 			lon: this.xlon,
    // 			lat: this.xlat
    // 		};
    // 	},
    // 	// 搜索位置事件
    // 	searchPlace () {
    // 		var local = new BMap.LocalSearch(this.map, {
    //     renderOptions: { map: this.map }
    //   });
    //   local.search(this.searchq);
    // 	},
    // 	// 加载外部js
    // 	loadScript (url, callback) {
    //   var script = document.createElement('script');
    //   script.type = 'text/javascript';
    //   if (typeof (callback) !== 'undefined') {
    //     if (script.readyState) {
    //       script.onreadystatechange = function () {
    //     			if (script.readyState == 'loaded' || script.readyState == 'complete') {
    //         			script.onreadystatechange = null;
    //         			callback();
    //         		}
    //       		};
    //     	} else {
    //     		script.onload = function () {
    // 	        	callback();
    // 	      	};
    //     	}
    //   }
    //   script.src = url;
    //   document.getElementById('mapjs').appendChild(script);
    // }

  },
  mounted () {

  }
};
</script>
