<template>
  <Modal v-model="isShowModal"  :title="'选择'+title" :width="700" class-name="list-view-modal">
    <div class="list-area">
      <div class="o-area-l">
        <p class="area-title">选择{{title}}：</p>
        <div class="area-cont">
            <!-- <list-mod :list="dataList" :limitCount="limitCount" :multiple="multiple" :sumList="dataList" :selectData="selectData" :valueKey="valueKey" :nameKey="nameKey"></list-mod> -->
            <component 
            :is="componentsName" 
            :list="dataList" 
            :params="params"
            :limitCount="limitCount" 
            :multiple="multiple" 
            :sumList="dataList" 
            :selectData="selectData" 
            :valueKey="valueKey" 
            :nameKey="nameKey"
            @chooseSchoolEvent="chooseSchoolEvent"
            />
        </div>
      </div>
      <div style="width:10px;height:100%;"></div>
      <div class="o-area-r">
        <p class="area-title">已选{{title}}：</p>
        <div class="area-cont" v-bar>
          <div class="p-r-10">
            <div class="select-item flex-b-c" v-for="(item, index) in selectData" :key="item[valueKey]">
              <p class="text-flow text-r">
                {{item[nameKey]}}
              </p>
              <Icon v-if="!item.disabled" type="md-close" class="close-icon" @click="removeSelect(index)" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div slot="footer" class="flex-e-c">
        <p class="warn-notice m-r-10" v-if="limitCount  && limitCount < selectData.length">*选择的数量不能大于{{limitCount}}个</p>
        <Button type="default" @click="isShowModal = false">取消</Button>
        <Button type="primary" :disabled="limitCount && limitCount < selectData.length" @click="confirm">确定</Button>
    </div>
  </Modal>
</template>

<script>
import listMod from './list.vue';
import schoolGradeList from './school-grade-list.vue';
import DataH from "./data-handle.js";

export default {
  name: "organizeModal",
  components: { listMod, schoolGradeList },
  props: {
    title: {
      type: String,
      default: "",
    },
    multiple: {
      type: Boolean,
      default: true,
    },
    valueKey: {
      type: String,
      default: "id",
    },
    nameKey: {
      type: String,
      default: "name",
    },
    type:String,
    isPaging: Boolean,
    params:{
      type: Object,
      default(){
        return {}
      }
    },
    min:{
      type:Number,
      default:0
    },
    max:{
      type:Number,
      default:0
    },
    limitCount: Number
  },
  data() {
    return {
      isShowModal: false,
      selectData: [],
      dataList:[],
      sumList:[],
      chooseSchool: {}
    };
  },
  computed: {
    componentsName(){
      let componentJson = {
        inventory: "listMod",
        overViewSchoolGrade: "schoolGradeList"
      }
      return componentJson[this.type] || componentJson.inventory
    }
  },
  methods: {
    showModal(selectData) {
      this.isShowModal = true;
      this.selectData = JSON.parse(JSON.stringify(selectData || []));
      this.loadData();
    },
    removeSelect(index){
        this.$delete(this.selectData,index);
    },
    getData(){
        let selectData = this.selectData || []; 
        return selectData 
    },
    confirm() {
      this.checkSelNum();
      this.isShowModal = false;
      this.$emit("success", this.getData(), { chooseSchool: this.chooseSchool });
    },
    checkSelNum(){
      let error = "";
      if(this.min && this.selectData.length < this.min){
        error = `需至少选中${this.min}项`
      }else if(this.max && this.selectData.length > this.max){
        error = `选中最多不超过${this.min}项`
      }
      if(error){
        this.$Message.info(error);
        throw new Error(error);
      };
    },
    loadData() {
        if (this.type) {
            let req = "",
                params = this.params || {};
            switch (this.type) {
                case "inventory":
                    req = "inventoryComponentList"; 
                    break; 
                case "overViewSchoolGrade": //团报
                    req = "appraisalScheduleReportSchool"; 
                    break; 
                default:
                    break;
            }
            this.getDataReq(req, params).then(res=>{
                this.sumList = this.dataList||[];
                if(this.isPaging){
                    params.pageIndex = 1;
                    params.pageSize = 2000;
                    this.getDataReq(req, params, 'all').then(res=>{
                        this.sumList = res||[];
                    })
                }
            });
        }
    }, 
    refactor(){
        if(this.selectData.length>0){ 
            let obj = {};
            this.sumList.forEach(item=>{
                obj[item[this.valueKey]] = {...item};
            })
            this.selectData = this.selectData.map(item=>{
              if(obj[item[this.valueKey]]){ 
                return {
                  ...obj[item[this.valueKey]],
                  ...item,
                }
              }else{
                return {}
              }
            })
        }
    },
    getDataReq(req, params,dataType) {
        console.log('getDataReq',this.type,req,params)
        this.loading = true;
        return DataH.getDataReq(this.type)
            .then((data) => {
                let items = data.items || [];
                return this.handleData(items);
            })
            .catch(() => {
                return this.getDataHold(req, params)
                    .then((res) => {
                        if (res.code) {
                            let items = [];
                            let data = res.data;
                            if (data instanceof Array) {
                                items = data || [];
                            } else if (data.items) {
                                items = data.items || [];
                            }
                            return this.handleData(items, "init",dataType);
                        } else {
                            return Promise.reject();
                        }
                    })
                    .finally(() => {
                        delete DataH.dataReq[this.type + "List"];
                        this.loading = false;
                    });
            });
    }, 
    getDataHold(req, params) {
        // 防抖访问
        if (DataH.dataReq[this.type + "List"]) {
            return DataH.dataReq[this.type + "List"];
        } else {
                DataH.dataReq[this.type + "List"] = typeof this.$MainApi[req] == "function"
                    ? this.$MainApi[req]({ data: params })
                    : Promise.reject();
            return DataH.dataReq[this.type + "List"];
        }
    },
    handleData(items, type,dataType) {
        let _items = [];
        if (type == "init") {
            if (!(items instanceof Array) && items instanceof Object) {
                for (let i in items) {
                    let item = {};
                    item[this.valueKey] = i;
                    item[this.nameKey] = items[i][this.nameKey] || items[i] || "";
                    _items.push(item);
                }
            } else {
                _items = items;
            }
            for (let i = 0; i < _items.length; i++) {
                _items[i][this.valueKey] =
                    parseInt(_items[i][this.valueKey]) || 0;
            }
        } else {
            _items = items;
        }
        dataType != 'all' && (this.dataList = _items);
        console.log('this.dataList',this.dataList)
        return _items
    },
    // getGroupReportItems(items){
    //   let arr = items && items.map((item,index)=>{
    //     return {
    //       id:index,
    //       name:item.grade
    //     }
    //   });
    //   return arr||{};
    // },
    chooseSchoolEvent(data){
      this.chooseSchool = data;
    },
    setSelectData(data) {
      this.selectData = data;
    },
  },
};
</script>

<style lang="less" scoped>
.list-view-modal {
  .list-area {
    padding: 25px;
    padding-top: 32px;
    display: flex;
    .o-area-l {
      width: 60%;
    }
    .o-area-r {
      width: 40%;
      .area-cont {
        padding: 5px;
      }
    }
    .area-title {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 22px;
      margin-bottom: 12px;
    }
    .area-cont {
      background: rgba(216, 216, 216, 0.11);
      border-radius: 4px;
      border: 2px solid #f2f2f2;
      height: 438px;
      padding: 13px;
      display: flex;
      flex-direction: column;
      position: relative;
      .select-item {
        border-radius: 5px;
        overflow: hidden;
        margin-bottom: 5px;
        padding: 5px;
        padding-right: 0px;
        .close-icon {
          font-size: 20px;
          margin-left: 5px;
          cursor: pointer;
        }
      }
      .select-item:hover {
        background-color: #fff;
      }
    }
  }
}
</style>