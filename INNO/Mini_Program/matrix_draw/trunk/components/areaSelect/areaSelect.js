let app = getApp();
let callBack;
Component({
  behaviors: [Behavior.BaseBehavior],
  properties: {

  }, 
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
    areaData:{},
    currVal:[0,0,0],
    selectVal:[0,0,0],
    //所有省市区数据
    allData: {
      prov_data: [],
      city_data: [],
      dist_data: []
    },
  },
  
  ready(){
    this.loadAdress();
  },

  /**
   * 组件的方法列表
   */
  methods: {
    loadAdress:function(options){
         this.getRegionList(this);      
    },
    getRegionList:function(){
          return app.UserApi.getRegionList({
               data: {

               },
               other: { showLoading: true }
          }).then(e => {
               if (e.code == "1") {
                    let allData = this.data.allData;
                    let data = e.data||{};
                    let list = data.list||[];
                    for(let i = 0,len=list.length;i<len;i++){
                      let region_type = list[i].region_type; 
                      switch (region_type) {
                        case 1:
                            allData.prov_data.push(list[i]);
                            break;
                        case 2:
                            allData.city_data.push(list[i]);
                            break;
                        case 3:
                            allData.dist_data.push(list[i]);
                            break;
                      }
                    } 
                    this.canSwitch = true;
                    this.setData({
                      allData: allData,
                    })
                  }
               return Promise.reject()
          })

     },
    SwitchAreaSelect:function(selectData,func){
      if(!this.canSwitch){
        app.SMH.showToast({
          title:"数据初始化中..."
        })
        return
      }
      let show_region_select_pop = this.data.show_region_select_pop;
      if (!show_region_select_pop){
        if (selectData && selectData.district_str){
          this.InitRegionData(selectData);
        }else{
          this.ChangeRegionData([0,0,0])
        }
        show_region_select_pop = true;
      }else{
        show_region_select_pop = false;
      }
      this.setData({
        show_region_select_pop: show_region_select_pop
      })
      //存起回调
      callBack = func;
    },
    bindChange:function(e){
      let val = e.detail.value;
      let selectVal = this.data.selectVal;
      selectVal = val;
      this.setData({
        selectVal: selectVal
      })
      this.ChangeRegionData(val);
    },
    ChangeRegionData:function(data){
      let allData = this.data.allData;
      let all_prov_data = allData.prov_data;
      let all_city_data = allData.city_data;
      let all_dist_data = allData.dist_data;
      let prov_index = data[0] ? data[0] : 0;
      let city_index = data[1] ? data[1] : 0;
      let dist_index = data[2] ? data[2] : 0;
      //初始化
      let regionData = {
        prov_data:{
          region_ids:[],
          region_names:[]
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
      for (let i in all_prov_data){
        let reg_id = all_prov_data[i].region_id;
        let reg_name = all_prov_data[i].region_name;
        regionData.prov_data.region_ids.push(reg_id);
        regionData.prov_data.region_names.push(reg_name);
      }
      // //市
      let this_prov_reg_id = regionData.prov_data.region_ids[prov_index];
      for (let i in all_city_data){
        let part_id = all_city_data[i].parent_id;
        if (part_id === this_prov_reg_id){
          let reg_id = all_city_data[i].region_id;
          let reg_name = all_city_data[i].region_name;
          regionData.city_data.region_ids.push(reg_id);
          regionData.city_data.region_names.push(reg_name);
        }
      }
      // //区
      let this_city_reg_id = regionData.city_data.region_ids[city_index];
      for (let i in all_dist_data){
        let part_id = all_dist_data[i].parent_id;
        if (part_id === this_city_reg_id) {
          let reg_id = all_dist_data[i].region_id;
          let reg_name = all_dist_data[i].region_name;
          regionData.dist_data.region_ids.push(reg_id);
          regionData.dist_data.region_names.push(reg_name);
        }
      }
      this.setData({
        regionData: regionData
      })
    },
    //带值初始化
    InitRegionData:function(data){
      //data中，省reg_id，市reg_id，区reg_id
      let prov_id = data.province;
      let city_id = data.city;
      let dist_id = data.district;
      let allData = this.data.allData;
      let all_prov_data = allData.prov_data;
      let all_city_data = allData.city_data;
      let all_dist_data = allData.dist_data;
      let selectVal = this.data.selectVal;
      let prov_index = 0, city_index = 0, dist_index = 0;
      //初始化
      let regionData = {
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
      for(let i = 0,len=all_prov_data.length;i<len;i++){
        let region_id = all_prov_data[i].region_id;
        let region_name = all_prov_data[i].region_name;
        if (region_id == prov_id){
          prov_index = parseInt(i);
        }
        regionData.prov_data.region_ids.push(region_id);
        regionData.prov_data.region_names.push(region_name);
      } 
      //市
      let this_prov_reg_id = regionData.prov_data.region_ids[prov_index]; //省的prov_index默认为0(第一个)
      let j = 0;
      for(let i = 0,len=all_city_data.length;i<len;i++){
        let part_id = all_city_data[i].parent_id;
        if (part_id === this_prov_reg_id) { //匹配parent_id （匹配prov_index对应的region_id
          let reg_id = all_city_data[i].region_id;
          let reg_name = all_city_data[i].region_name;
          regionData.city_data.region_ids.push(reg_id);
          regionData.city_data.region_names.push(reg_name);
          //
          if (reg_id === city_id){
            city_index = j;
          }
          j++;
        }
      }  
      //区
      let this_city_reg_id = regionData.city_data.region_ids[city_index]; //市的city_index默认为0(第一个)
      let k = 0; 
      for(let i = 0,len=all_dist_data.length;i<len;i++){
        let part_id = all_dist_data[i].parent_id;
        if (part_id === this_city_reg_id) { //匹配parent_id （匹配city_index对应的region_id
          let reg_id = all_dist_data[i].region_id;
          let reg_name = all_dist_data[i].region_name;
          regionData.dist_data.region_ids.push(reg_id);
          regionData.dist_data.region_names.push(reg_name);
          if (reg_id === dist_id){
            dist_index = k;
          }
          k++;
        }
      }
      let currVal = [prov_index, city_index, dist_index];
      selectVal = currVal;
      this.setData({
        regionData: regionData,
        currVal: currVal,
        selectVal: selectVal
      })
    },
    /**
     * 
    */
    confirmSelectArea:function(){
      let selectVal = this.data.selectVal;
      let prov_index = selectVal[0];
      let city_index = selectVal[1];
      let dist_index = selectVal[2];
      let regionData = this.data.regionData;
      let selectArea = {
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
})
