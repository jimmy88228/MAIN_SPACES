// components/address/areaSelect.js
//import areaData from '../..//areaData.js'
import AddressH from "./module/addressHandle";
var App = getApp();
var callBack;
Component(App.BC({
  data: {
    show_region_select_pop: '',
    //地址选择器数据
    regionData: {
      prov_data: {
        region_ids: [],
        region_names: [],
      },
      city_data: {
        region_ids: [],
        region_names: [],
      },
      dist_data: {
        region_ids: [],
        region_names: [],
      },
    },
    areaData: {},
    currVal: [0, 0, 0],
    selectVal: [0, 0, 0],
    //所有省市区数据
    allData: {
      prov_data: [],
      city_data: [],
      dist_data: []
    },
  },

  ready() {
    this.loadAdress();
  },

  /**
   * 组件的方法列表
   */
  methods: {
    loadAdress: function (options) {
      this.getRegionList(this);
    },
    getRegionList: function () {
      return AddressH.getRegionListSync(true)
        .then(areaData => {
            let allData = this.data.allData;
            for (let i in areaData) {
              let region_type = areaData[i].region_type;
              switch (region_type) {
                case 1:
                  allData.prov_data.push(areaData[i]);
                  break;
                case 2:
                  allData.city_data.push(areaData[i]);
                  break;
                case 3:
                  allData.dist_data.push(areaData[i]);
                  break;
              }
            }
            this.setData({
              allData: allData
            })
        })
    },
    SwitchAreaSelect: function (selectData, func) {
      var show_region_select_pop = this.data.show_region_select_pop;
      if (!show_region_select_pop) {
        if (selectData && selectData.district_str) {
          this.InitRegionData(selectData);
        } else {
          this.ChangeRegionData([0, 0, 0])
        }
        show_region_select_pop = true;
      } else {
        show_region_select_pop = false;
      }
      this.setData({
        show_region_select_pop: show_region_select_pop
      })
      //存起回调
      callBack = func;
    },
    bindChange: function (e) {
      var val = e.detail.value;
      var selectVal = this.data.selectVal;
      selectVal = val;
      this.setData({
        selectVal: selectVal
      })
      this.ChangeRegionData(val);
    },
    ChangeRegionData: function (data) {
      var allData = this.data.allData;
      var all_prov_data = allData.prov_data;
      var all_city_data = allData.city_data;
      var all_dist_data = allData.dist_data;
      var prov_index = data[0] ? data[0] : 0;
      var city_index = data[1] ? data[1] : 0;
      var dist_index = data[2] ? data[2] : 0;
      //初始化
      var regionData = {
        prov_data: {
          region_ids: [],
          region_names: []
        },
        city_data: {
          region_ids: [],
          region_names: []
        },
        dist_data: {
          region_ids: [],
          region_names: []
        }
      }
      // //省
      for (let i in all_prov_data) {
        var reg_id = all_prov_data[i].region_id;
        var reg_name = all_prov_data[i].region_name;
        regionData.prov_data.region_ids.push(reg_id);
        regionData.prov_data.region_names.push(reg_name);
      }
      // //市
      var this_prov_reg_id = regionData.prov_data.region_ids[prov_index];
      for (let i in all_city_data) {
        var part_id = all_city_data[i].parent_id;
        if (part_id === this_prov_reg_id) {
          var reg_id = all_city_data[i].region_id;
          var reg_name = all_city_data[i].region_name;
          regionData.city_data.region_ids.push(reg_id);
          regionData.city_data.region_names.push(reg_name);
        }
      }
      // //区
      var this_city_reg_id = regionData.city_data.region_ids[city_index];
      for (let i in all_dist_data) {
        var part_id = all_dist_data[i].parent_id;
        if (part_id === this_city_reg_id) {
          var reg_id = all_dist_data[i].region_id;
          var reg_name = all_dist_data[i].region_name;
          regionData.dist_data.region_ids.push(reg_id);
          regionData.dist_data.region_names.push(reg_name);
        }
      }
      this.setData({
        regionData: regionData
      })
    },
    //带值初始化
    InitRegionData: function (data) {
      //data中，省reg_id，市reg_id，区reg_id
      var prov_id = data.province;
      var city_id = data.city;
      var dist_id = data.district;
      var allData = this.data.allData;
      var all_prov_data = allData.prov_data;
      var all_city_data = allData.city_data;
      var all_dist_data = allData.dist_data;
      var selectVal = this.data.selectVal;
      var prov_index = 0,
        city_index = 0,
        dist_index = 0;
      //初始化
      var regionData = {
        prov_data: {
          region_ids: [],
          region_names: []
        },
        city_data: {
          region_ids: [],
          region_names: []
        },
        dist_data: {
          region_ids: [],
          region_names: []
        }
      }
      //省
      for (let i in all_prov_data) {
        var region_id = all_prov_data[i].region_id;
        var region_name = all_prov_data[i].region_name;
        if (region_id == prov_id) {
          prov_index = parseInt(i);
        }
        regionData.prov_data.region_ids.push(region_id);
        regionData.prov_data.region_names.push(region_name);
      }
      //市
      var this_prov_reg_id = regionData.prov_data.region_ids[prov_index];
      var j = 0;
      for (let i in all_city_data) {
        var part_id = all_city_data[i].parent_id;
        if (part_id === this_prov_reg_id) {
          var reg_id = all_city_data[i].region_id;
          var reg_name = all_city_data[i].region_name;
          regionData.city_data.region_ids.push(reg_id);
          regionData.city_data.region_names.push(reg_name);
          //
          if (reg_id === city_id) {
            city_index = j;
          }
          j++;
        }
      }
      //区
      var this_city_reg_id = regionData.city_data.region_ids[city_index];
      var k = 0;
      for (let i in all_dist_data) {
        var part_id = all_dist_data[i].parent_id;
        if (part_id === this_city_reg_id) {
          var reg_id = all_dist_data[i].region_id;
          var reg_name = all_dist_data[i].region_name;
          regionData.dist_data.region_ids.push(reg_id);
          regionData.dist_data.region_names.push(reg_name);
          if (reg_id === dist_id) {
            dist_index = k;
          }
          k++;
        }
      }
      var currVal = [prov_index, city_index, dist_index];
      selectVal = currVal;
      this.setData({
        regionData: regionData,
        currVal: currVal,
        selectVal: selectVal
      })
    },
    
    confirmSelectArea: function () {
      var selectVal = this.data.selectVal;
      var prov_index = selectVal[0];
      var city_index = selectVal[1];
      var dist_index = selectVal[2];
      var regionData = this.data.regionData;
      var selectArea = {
        province: regionData.prov_data.region_ids[prov_index],
        province_str: regionData.prov_data.region_names[prov_index],
        city: regionData.city_data.region_ids[city_index],
        city_str: regionData.city_data.region_names[city_index],
        district: regionData.dist_data.region_ids[dist_index],
        district_str: regionData.dist_data.region_names[dist_index],
      }
      this.setData({
        show_region_select_pop: false
      })
      typeof (callBack) === "function" && callBack(selectArea)
    }

  }
}))