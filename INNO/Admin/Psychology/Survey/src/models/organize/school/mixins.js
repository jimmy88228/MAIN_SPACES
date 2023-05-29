export default{
  data(){
    return {
      columns: [
        {
          title: "ID",
          slot:"school_code",
          minWidth: 150
        },
        {
          title: "学校名称",
          key:"structure_name",
          minWidth: 150
        },
        {
          title: "学校类型",
          slot:"edu_type_data",
          minWidth: 100
        },
        {
          title: "班级数量",
          key:"class_count",
          minWidth: 100
        },
        {
          title: "校区",
          slot:"campous_data",
          minWidth: 150
        },
        {
          title: "联系人",
          slot: "contact",
          minWidth: 150
        },
        {
          title: "操作",
          slot: "handle",
          width: 150  
        }
      ],
    }
  },
  computed:{
    getAreaId(){
      if(this._structureType == 'edu_customer'){
          return this.searchForm.area_id || 0;
      } else if(this._structureType == 'edu_area'){
          return this._structureId;
      } else {
          return 0
      }
    },
    screenData(){
      let screenData = {
        base: [
          {
            noFormItem: true,
            type: "search",
            placeholder: "请输入关键字"
          }
        ],
        extra: []
      }
      // 区
      if(this._structureLimit(['edu_customer'])){
        screenData.base.push({
          type: "select",
          label: "区",
          key: "area_id",
          isCustom: true,
          labelWidth: 30,
          cell: {
            type: "adminArea",
            valueKey: "area_id",
            nameKey: "area_name",
          },
          active:(data)=>{
            this.changeAreaData(data)
          }
        })
      }
      // 街道
      if(this._structureLimit(['edu_customer', 'edu_area'])){
        screenData.base.push({
          type: "select",
          label: "街道",
          key: "street_id",
          isCustom: true,
          cell: {
            type: "street",
            valueKey: "street_id",
            nameKey: "street_name",
            params: {
              area_id: this.getAreaId
            }
          },
          active:(data)=>{
            this.changeStreetData(data)
          }
        })
      }
      // 
      if(this._actionCodeMap["school_maintenance_add"] && this._actionCodeMap["school_maintenance_add"].isAction == 1 ){
        screenData.extra.push({
          type: "button",
          noFormItem: true,
          icon: "md-add",
          label: "创建学校",
          active: this.createSchool
        })
      }
      //
      if(this._actionCodeMap["school_maintenance_batch_import"] && this._actionCodeMap["school_maintenance_batch_import"].isAction == 1 ){
        screenData.extra.push({
          type: "button",
          noFormItem: true,
          icon: "md-cloud-upload",
          label: "批量创建学校",
          active:()=>{
            this.createSchool({
              isBatch: true
            })
          }
        })
      }
      //
      if(this._actionCodeMap["school_maintenance_batch_remove"] && this._actionCodeMap["school_maintenance_batch_remove"].isAction == 1 ){
        screenData.extra.push({
          type: "button",
          noFormItem: true,
          icon: "",
          label: "导出管理员名单",
          active: this.batchRemoveItem
        })
      }
      return screenData;
    }
  },
  methods: {
    changeAreaData(data){
      console.log("data", data)
        this.searchForm.area_id = data.area_id;
        this.searchForm.structure_type = data.structure_type;
        this.searchForm.area_name = data.area_name;
        this.$nextTick(()=>{
            this.$refs["streetSelectRef"] && this.$refs["streetSelectRef"].getData();
            this.loadData();
        })
    },
    changeStreetData(data){
      this.searchForm.street_id = data.street_id;
      this.searchForm.street_name = data.street_name;
      this.searchForm.structure_type = data.structure_type;
      this.search();
  },
  }
}