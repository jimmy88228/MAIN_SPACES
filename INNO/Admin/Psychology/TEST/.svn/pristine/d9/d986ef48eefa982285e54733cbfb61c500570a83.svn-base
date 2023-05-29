<template>
  <div class="class-linkage-view">
    <div class="flex-s-c choose-title C_B2 text-flow">
      <div class="w-nowrap flex-s0 choose-title-str text-flow" :title="_getReqStructureName">{{_getReqStructureName}}</div>
      <div class="flex-s-c flex1 text-flow">
        <span class="inline-b p-l-5 p-r-5">&gt;</span>
        <Dropdown class="campus-dropdown text-flow flex1" placement="bottom-start" @on-click="changeCampus">
            <a class="inline-b text-flow" style="width:100%;" :title="chooseCampus.campus_name">{{chooseCampus.campus_id ? chooseCampus.campus_name : '选择校区'}}</a>
            <DropdownMenu slot="list">
                <DropdownItem v-for="(item, index) in campusList" :key="item.campus_id" :name="index" :selected="chooseCampus.campus_id == item.campus_id">{{item.campus_name}}</DropdownItem>
            </DropdownMenu>
        </Dropdown>
      </div>
    </div>
    <div class="grade-tree-area">
      <vue-scroll>
        <div class="select-all-area" v-if="isCheckMode && gradeTreeData.length">
          <Checkbox :value="checkAll" @on-change="checkAllEvent">全选</Checkbox>
        </div>
        <Tree 
        :class="{ 'is-view':  !isCheckMode}"
        :data="gradeTreeData" 
        :check-strictly="true"
        @on-select-change="handleSelect" 
        empty-text="暂无班级数据"></Tree>
      </vue-scroll>
      <Spin fix v-if="getDataing"></Spin>
    </div>
  </div>
</template>

<script>
import organizeSelectedDef from "@/assets/images/organize.selected.def.png";
import { GradeOrder } from "@/models/data/data-cockpit/components/data-sort.js";
export default {
  props: {
    dataType: Number,
    isCheckMode: Boolean,
    multiple: Boolean,
    islimitChild: Boolean
  },
  data() {
    return {
      campusList: [],
      chooseCampus: {},
      gradeTreeData: [],
      getDataing: false,
      checkData: [],
      checkAll: false,
    };
  },
  computed: {
    ids(){
      let ids = [];
      this.checkData.map((item) => {
          if (item.id) {
              ids.push(item.id);
          }
      });
      return ids || [];
    }
  },
  methods: {
    getView(checkData, extra = {}){
      this.checkData = JSON.parse(JSON.stringify(checkData));
      this.chooseCampus = {};
      this.isCheckMode && this.getCampus();
    },
    handleSelect(group, data){
      this.$emit("select", {
        selectData: data.selected ? data : {},
        extraData: {
          selectCampus: this.chooseCampus
        }
      });
    },
    intSelect(){
      this.handleTreeData(this.gradeTreeData, {}, {
        initSelected: true
      });
    },
    getCampus() {
      this.$MainApi
        .adminCampusData({
          data: {
            school_id: this._getReqStructureId,
          },
        })
        .then((res) => {
          if (res.code) {
            let data = res.data || [];
            let items = data.items || [];
            // 筛选本部
            for (let i = 0; i < items.length; i++) {
              items[i].campus_index = i;
              if (items[i].campus_name == "本部") {
                this.chooseCampus = items[i] || {};
                break;
              }
            }
            // 没有本部，有校区时，默认选择第一个
            if(!this.chooseCampus.campus_id && items.length){
              items[0].campus_index = 0;
              this.chooseCampus = items[0] || {};
            }
            this.campusList = items;
          }
        });
    },
    getGradeData() {
      this.getDataing = true;
      let chooseCampus = this.chooseCampus || {};
      if(!chooseCampus.campus_id){
        return;
      };
      return this.$MainApi
        .adminGradeData({
          data: {
            campus_id: chooseCampus.campus_id,
            type: 0, // 0 按照权限，1 全部数据
            state: this.dataType // 1 为已毕业数据, 0为正常数据, 2: 全部数据
          },
        })
        .then((res) => {
          if (res.code) {
            let data = res.data || {};
            let grade_data = data.grade_data || [];
            let class_data = data.class_data;
            let firstItem = null;
            // 根据年级和年份排序
            if(grade_data.length){
              grade_data.sort((a, b)=>{
                if(a.grade == b.grade){
                  return b.school_year - a.school_year;
                } else {
                  return GradeOrder.indexOf(a.grade) - GradeOrder.indexOf(b.grade)
                }
              })
            }
            let classJson = {}
            for (let i in class_data) {
              let item = class_data[i];
              item.map((classItem) => {
                classItem.title = classItem.class;
                classItem.id = classItem.class_id;
                classItem.expand = true;
                classItem.checked = false;
                classItem.selected = false;
                classItem.disabled = false;
                classItem.disableCheckbox = false;
                classItem.showed = true;
                classItem.campus_id = chooseCampus.campus_id
                classItem.campus_name = chooseCampus.campus_name
              });
              classJson[chooseCampus.campus_id+i] = item;
            }
            for (let i = 0; i < grade_data.length; i++) {
              grade_data[i].id =
                chooseCampus.campus_id + grade_data[i].grade + grade_data[i].school_year;
              grade_data[i].title = grade_data[i].grade + "(" + grade_data[i].school_year + "级)";
              grade_data[i].expand = true;
              grade_data[i].checked = false;
              grade_data[i].selected = false;
              grade_data[i].disabled = this.isCheckMode ? false : true;
              grade_data[i].disableCheckbox = false;
              grade_data[i].showed = true;
              grade_data[i].campus_id = chooseCampus.campus_id
              grade_data[i].campus_name = chooseCampus.campus_name
              if (classJson[grade_data[i].id]) {
                if(!firstItem && classJson[grade_data[i].id][0] && !this.isCheckMode){
                  try {
                    classJson[grade_data[i].id][0].selected = true;
                  } catch (error) {
                    
                  }
                  firstItem = classJson[grade_data[i].id][0]
                }
                grade_data[i].children = classJson[grade_data[i].id];
              }
            }
            if(firstItem){
              this.handleSelect(null, firstItem);
            } else {
              this.handleSelect(null, {});
            }
            this.gradeTreeData = this.initTreeData(grade_data, [chooseCampus.campus_id]);
            this.handleTreeData(this.gradeTreeData);
            console.log("gradeTreeData", this.gradeTreeData);
          }
        }).finally(()=>{
          this.getDataing = false;
        })
    },
    initTreeData(data, parentIds = []) {
      let _parentIds = parentIds || [];
      if (data instanceof Array) {
        for (let i = 0; i < data.length; i++) {
          let id = data[i].id;
          data[i]._parentIds = _parentIds;
          data[i].checked = (this.ids.indexOf(id) != -1) ? true : false;
          data[i].render = (h, { root, node, data }) => {
            return h(
              "div",
              {
                style: {
                  width: "100%",
                  display: "flex",
                  "align-items": "center",
                  paddingLeft:
                    !this.isCheckMode ? '0px' :  (data.children && data.children.length && this.isCheckMode ? "0px" : "20px"),
                },
                on: {
                  click:()=>{
                    if(!this.isCheckMode){
                      data.expand = !data.expand;
                    }
                  }
                }
              },
              [
                h("Icon", {
                  style: {
                    display: (data.children && data.children.length ? "flex" : "none"),
                    "align-items": "center",
                    "transition": "transform .35s",
                    "transform": "rotate(" + (data.expand ? 90 : 0) + "deg)",
                    "padding": "4px"
                  },
                  attrs: {
                    type: "ios-arrow-forward",
                  },
                  on: {
                    click: () => {
                      event.stopPropagation();
                      data.expand = !data.expand;
                    },
                  },
                }),
                h("div", {
                  style: {
                    display: this.isCheckMode ? 'block' : 'none'
                  },
                  on: {
                    click:()=>{
                      event.stopPropagation();
                    }
                  }
                },[
                  h("Checkbox", {
                    style: {
                      margin: "0px 5px 0px 5px",
                    },
                    props: {
                      value: data.checked,
                      disabled: data.disableCheckbox,
                    },
                    on: {
                      "on-change": (state) => {
                        this.toggleCheck(!data.checked, data);
                      },
                      
                    },
                  }),
                ]),
                h(
                  "span",
                  {
                    style: {
                      display: this.isCheckMode ? "inline-block" : "none",
                      width: "24px",
                      height: "24px",
                      padding: "3px",
                      borderRadius: "100%",
                      backgroundColor: "#E1F3FD",
                      marginRight: "5px"
                    },
                  },
                  [
                    h("img", {
                      attrs: {
                        src: organizeSelectedDef,
                      },
                      style: {
                        width: "100%",
                      },
                    }),
                  ]
                ),
                h("p", data.title),
              ]
            );
          };
          if (data[i].children && data[i].children.length) {
            this.initTreeData(data[i].children, [..._parentIds, data[i].id]);
          }
        }
      }
      return data;
    },
    removeCheck(state, data){
      if(data.id){
        this.checkData = this.checkData.filter((item)=>{
          return !((item.id == data.id) || (item._parentIds.indexOf(data.id) != -1));
        })
        this.toggleCheck(state, data);
      }
    },
    toggleCheck(state, data) {
      data = JSON.parse(JSON.stringify(data || {}));
      data.checked = state || false;
      this.$nextTick(()=>{
        this.handleTreeData(this.gradeTreeData, data);
      })
    },
    checkAllEvent(state){
      this.checkAll = state;
      this.handleTreeData(this.gradeTreeData, {
        id: this.chooseCampus.campus_id,
      },{
        parentChecked: state
      })
    },
    handleTreeData(data, curr, extra = {}){
      this.$nextTick(()=>{
        let { allChildChecked } = this.handleTreeDataLoop(data, curr, extra);
        if(this.checkAll != allChildChecked){
          this.checkAll = allChildChecked;
        }
      })
      
    },
    handleTreeDataLoop(data, curr, extra = {}) {
      let parentChecked = extra.parentChecked;
      let limitChild = extra.limitChild;
      let initSelected = extra.initSelected;
      let allChildChecked = true;
      curr = curr || {};
      if (data instanceof Array) {
        for (let i = 0; i < data.length; i++) {
          let item = data[i] || {};
          item.disableCheckbox = item._disableCheckbox || (this.multiple && limitChild) || false;
          item.showed = !limitChild;
          typeof(initSelected) == 'boolean' && initSelected && (item.selected = !initSelected)
          let idIndex = this.ids.indexOf(item.id);
          idIndex != -1 && (this.checkData[idIndex].showed = item.showed);
          if(this.multiple){
            if(item.id == curr.id){ // 同操作元素
              item.checked = curr.checked;
              // item.selected = curr.selected;
              if(curr.checked && idIndex == -1){
                this.checkData.push(JSON.parse(JSON.stringify(item)));
              }
              if(!curr.checked && idIndex != -1) {
                this.checkData.splice(idIndex, 1);
              }
            } else if((item._parentIds.indexOf(curr.id) != -1)){ // 操作元素同父级
              item.checked = parentChecked;
              if(parentChecked && idIndex == -1){
                this.checkData.push(JSON.parse(JSON.stringify(item)));
              }
              if(!parentChecked && idIndex != -1) {
                this.checkData.splice(idIndex, 1);
              }
            } else if(idIndex != -1){ // 同步选择数据和UI
              !item.checked && (item.checked = true);
            } else{
              item.checked = false;
              if(idIndex != -1){
                this.checkData.splice(idIndex, 1);
              }
            }
          } else { // 单选
            if(item.id == curr.id){
              item.checked = curr.checked;
              this.checkData = curr.checked ? [JSON.parse(JSON.stringify(item))] : [];
            } else {
              item.checked = false;
              if(idIndex != -1){
                this.checkData.splice(index, 1);
              }
            }
          }
          if (item.children && item.children.length > 0) {
            let returnChildData = this.handleTreeDataLoop(
              item.children,
              curr,
              extra = {
                parentChecked: item.checked,
                limitChild: item.checked && this.islimitChild,
                initSelected
              }
            )
            // 反向操作父级checked
            if((item.checked != returnChildData.allChildChecked) && (item._parentIds.indexOf(curr.id) == -1 && item.id != curr.id) && !this.islimitChild){
              item.checked = !!returnChildData.allChildChecked;
              let index = this.ids.indexOf(item.id);
              if(item.checked && index == -1){
                if(this.multiple){
                  this.checkData.push(JSON.parse(JSON.stringify(item)));
                } else {
                  this.checkData = [JSON.parse(JSON.stringify(item))];
                }
              }
              if(!item.checked && index != -1){
                this.checkData.splice(index, 1);
              }
            }
          }
          if(!item.checked && allChildChecked){
            allChildChecked = false;
          }
        }
        return {
          allChildChecked,
          data,
        };
      }
    },
    changeCampus(index) {
      this.chooseCampus = this.campusList[index];
    },
  },
  mounted() {
    !this.isCheckMode && this.getCampus();
  },
  watch: {
    "chooseCampus.campus_id": {
      handler(nV) {
        if (parseInt(nV)) {
          this.getGradeData();
        } else {
          this.gradeTreeData = [];
        }
      },
      deep: true,
      immediate: true,
    },
    "checkData": {
      handler(nV) {
        this.$emit("on-checkData", JSON.parse(JSON.stringify(nV)));
      },
      deep: true,
      immediate: true,
    }
  },
};
</script>

<style lang="less" scoped>
.class-linkage-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.choose-title {
  padding: 5px 0px 5px 5px;
  flex-shrink: 0;
  /deep/.ivu-menu-horizontal {
    line-height: 20px;
    height: 20px;
    z-index: 2;
    .ivu-menu-submenu {
      padding: 0px 5px;
      border: 0 none;
    }
  }
  /deep/.ivu-menu-horizontal::after {
    content: "";
    display: none;
  }
  /deep/.ivu-menu-submenu-title {
    .ivu-icon-ios-arrow-down {
      display: none;
    }
  }
  .campus-dropdown{
    
  }
  /deep/.ivu-dropdown-rel{
    display: flex;
    align-items: center;
  }
}
.choose-title-str{
  max-width: 75%;
}
.select-all-area{
  position:sticky;
  top: 0px;
  left: 0px;
  width: 100%;
  padding: 8px;
  z-index: 2;
  background-color: #FBFBFB;
}
.grade-tree-area {
  flex: 1;
  position: relative;
  overflow: hidden;
  /deep/.ivu-tree{
    border-top: 1px solid #fff;
    border-bottom: 1px solid #fff;
  }
  /deep/.ivu-tree-arrow {
    display: none;
  }
  /deep/.ivu-tree-empty{
    text-align: center;
    padding: 100px 0px 50px 0px;
    color: #b2b2b2;
  }
  /deep/.ivu-tree-title {
    width: 100%;
    min-height: 44px;
    display: flex;
    align-items: center;
  }
  /deep/.ivu-tree-children {
  }
  .is-view{
    /deep/.ivu-tree-children{
      padding: 0px;
    }
  }
}
</style>