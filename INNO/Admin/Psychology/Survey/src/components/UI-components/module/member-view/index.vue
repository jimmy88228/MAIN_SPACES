<template>
    <Modal v-model="isShowModal" :title="title" :width="945" class-name="member-view-modal">
        <div v-if="!isHideTabs">
          <Tabs type="card" :value="_currentTab" @on-click="changeTab">
            <TabPane label="老师" name="teacher" v-if="hideTabs.indexOf('teacher') == -1"></TabPane>
            <TabPane label="学生" name="student" v-if="hideTabs.indexOf('student') == -1"></TabPane>
          </Tabs>
        </div>
        <div class="member-area">
            <div class="o-area-l">
                <div class="area-title flex-b-c">
                    <p>选择人员</p>
                    <div>
                        <rewrite-search v-model="keyWord" @search="getData" placeholder="搜索人员"></rewrite-search>
                    </div>
                </div>
                <div class="area-cont">
                    <div class="school-tree-area" :class="{ 'no-padding': _structureType != 'edu_area' }">
                        <div class="choose-tip flex-s-c"  v-if="_structureType == 'edu_area'">
                          <div class="m-r-10 w-nowrap">选择学校:</div>
                          <div class="text-flow">
                            <template >
                              <data-select 
                              :value="currentSchool.school_id" 
                              type="school" 
                              @changeData="chooseSchool"
                              :params="{area_id: _structureId }"
                              valueKey="school_id"
                              nameKey="school_name"
                              >
                              <Option :value="0">请选择</Option>
                              </data-select>
                            </template>
                            <!-- <template v-else> -->
                              <!-- <span :title="_structureName" class="text-flow ">{{_structureName}}</span> -->
                            <!-- </template> -->
                          </div>
                        </div>
                        <div class="tree-area" v-bar v-show="_currentTab == 'student'">
                            <classOrganizeView 
                            ref="classOrganizeRef"
                            :isShowSearch="false" 
                            :showCheckbox="false"
                            :expandNode="false"
                            @on-select-change="selectClassOrganize"
                            ></classOrganizeView>
                        </div>
                        <div class="empty-area" v-show="_currentTab == 'teacher'">暂无上级可选</div>
                    </div>
                    <div class="student-table">
                        <div class="check-all" v-if="multiple">
                          <Checkbox :value="isCheckAll" @on-change="checkAll">全选</Checkbox>
                        </div>
                        <div class="student-table-cont">
                          <hold-layout :isFull="true" v-bar>
                              <div class="search-result-box">
                                  <div v-for="(item,index) in memberViewData" :key="index" class="check-box-box">
                                      <Checkbox :disabled="item._disabled" :value="ids.indexOf(item._id) != -1" @on-change="(state)=>checkUser(state, item)">
                                        <span class="text-flow m-l-5 inline-b">{{item.name}}</span>
                                      </Checkbox>
                                  </div>
                                  <div class="empty-area" v-if="!memberViewData || memberViewData.length == 0">暂无数据</div>
                              </div>
                          </hold-layout>
                          <Spin fix v-if="pageLoading"></Spin>
                        </div>
                    </div>
                </div>
            </div>
            <div class="o-area-m flex-c-c">
                <img :src="rightRrrow" class="icon" />
            </div>
            <div class="o-area-r">
                <p class="area-title">已选人员：</p>
                <div class="area-cont" v-bar>
                    <div>
                      <div class="select-item flex-b-c" v-for="(item, index) in selectUser" :key="index">
                          <p>{{item.name}}</p>
                          <Icon type="md-close" v-if="!item._disabled" class="close-icon" @click="removeSelect(index)" />
                      </div>
                    </div>
                </div>
            </div>
        </div>
        <rewrite-page style="margin-top:-12px;" slot="footer" :total="total" :current="page" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-change="e=>loadData(e)" @on-page-size-change="handlePageSizeChange" show-sizer show-elevator show-total transfer></rewrite-page>
        <div slot="footer">
            <Button type="default" @click="isShowModal = false">取消</Button>
            <Button type="primary" @click="confirm">确定</Button>
        </div>
    </Modal>
</template>

<script>
import organizeBg from "@/assets/images/organize.bg.png";
import classOrganizeView from "@/components/view-components/class-organize-view/index";
import ListMixin from "@/helper/mixin/list-mixin";
export default {
    name: "memberView",
    mixins: [ListMixin],
    props: {
        title: {
            type: String,
            default: "选择人员",
        },
        memberKey: {
          type: String,
          default: "id"
        },
        multiple: {
            type: Boolean,
            default: false,
        },
        currentTab: {
          type: String,
          default: "teacher"
        },
        isHideTabs: {
          type: Boolean,
          default: true
        },
        hideTabs: {
          type: Array,
          default: ()=>{
            return [];
          }
        }
    },
    components: {
      classOrganizeView
    },
    data() {
        return {
            isShowModal: false,
            _currentTab: "",
            topLevel: {
                title: "",
                id: 0,
            },
            schoolData: [],
            studentData: [],
            currentSchool: {
              school_id: 0,
              school_name: ""
            },
            currentClassOrganize: {},
            currentStudent: [],
            rightRrrow: require("@/assets/images/right-arrow.png"),
            keyWord: "",
            selectUser: [],
            isCheckAll: false,
            organizeBg: organizeBg,
            reqMemberParams: {},
            reqConf: {
              "teacher": {
                req: "getEduTeacher"
              },
              "student": {
                req: "schoolStudentData"
              }
            }
        };
    },
    computed:{
      ids(){ // 由于存在老师，学生两个列表数据id一样的情况，已 _id == {type} + -id 为唯一标识key
        let selectUser = this.selectUser || [];
        let ids = [];
        for(let i = 0; i < selectUser.length; i++){
          let item = selectUser[i] || {};
          if(item._id){
            ids.push(item._id)
          }
        }
        return ids;
      },
      memberViewData(){
        let list = this.list || {};
        let viewData = [], isCheckAll = true;
        for(let i = 0; i < list.length; i++){
          let item = list[i] || {};
          let index = this.ids.indexOf(item._id);
            viewData.push(item)
          // 判断全选
          if(index == -1){
            if(isCheckAll) isCheckAll = false
          } else {
            item._disabled = this.selectUser[index]._disabled
          }
        }
        if(isCheckAll && list.length == 0){
          isCheckAll = false;
        }
        this.isCheckAll = isCheckAll;
        return viewData;
      }
    },
    methods: {
        showModal({ selectData }) {
            this.isShowModal = true;
            this.topLevel = {
                title: this._structureName,
                id: this._structureId,
            };
            this.selectUser = this.initSelectData(selectData || []);
            this.init();
        },
        initSelectData(data){
          if(data.length){
            for(let i = 0; i < data.length; i++){
              let item = data[i] || {};
              if(item.type){
                item._id = item.type + '-' + item[this.memberKey]
              }
            }
          }
          return data || [];
        },
        init() {
            if (this._structureType == "edu_school") {
                let item = {
                    school_id: this._structureId,
                    school_name: this._structureName,
                };
                this.schoolData = [item];
                this.currentSchool = item;
                this.keyWord = "";
                this.reqMemberParams = { school_id: item.school_id };
                if(this._currentTab == 'teacher'){ // 教师
                  this.getData();
                } else { // 学生
                  this.$refs["classOrganizeRef"] && this.$refs["classOrganizeRef"].showModal({
                    extra:{
                      expandHold: true,
                      reqParams: item
                    }
                  })
                  this.getData();
                }
            }
        },
        getSchoolData() {
            return this.$MainApi
                .adminSchoolData({
                    data: {
                        area_id: this._structureId,
                    },
                })
                .then((res) => {
                    if (res.code) {
                        let data = res.data || {};
                        let items = data.items || [];
                        this.schoolData = items;
                    }
                });
        },
        selectClassOrganize(detail){
          let row = detail.row || {};
            this.currentClassOrganize = row;
            let reqData = {};
            if(row.type == "school"){
              reqData.school_id = row.id
            } else if(row.type == "campus"){
              reqData.school_id = this.currentSchool.school_id
              reqData.campus_id = row.id
            } else if(row.type == "class"){
              reqData.school_id = this.currentSchool.school_id
              reqData.class_id = row.id
            }
            this.reqMemberParams = reqData;
            this.keyWord = "";
            this.getData();
        },
        chooseSchool(item) {
          this.currentSchool = item
          this.schoolChangeHandle(item);
        },
        schoolChangeHandle(item){
          if(item && Number(item.school_id)){
            if(this._currentTab == 'student'){
              this.$refs["classOrganizeRef"] && this.$refs["classOrganizeRef"].showModal({
                extra:{
                  expandHold: true,
                  reqParams: this.currentSchool
                }
              })
            }
            this.reqMemberParams = {school_id: item.school_id};
            this.keyWord = "";
            this.getData();
          } else {
            this.data.list = [];
          }
        },
        getData() {
            this.loadData();
        },
        onLoadData(page, extraData) {
          this.pageLoading = true;
          let _currentTab = this._currentTab;
          if(!_currentTab) return Promise.reject();
          let req = this.reqConf[_currentTab].req || ''
          if(!req) return Promise.reject();
            return this.$MainApi[req]({
                    data: {
                        ...this.reqMemberParams,
                        searchq: this.keyWord,
                        ...extraData,
                    },
                })
                .then((res) => {
                  this.pageLoading = false;
                  if (res.code) {
                      let data = res.data || {};
                      let items = data.items || [];
                      items.map((item)=>{
                        item.type = _currentTab;
                        item.id = item[this.memberKey] || 0,
                        item._id = _currentTab + '-' + item[this.memberKey] || 0,
                        item.name = item.name || item.student_name || ""
                      })
                      this.data = {
                          total: data.total || 0,
                          list: items,
                      };
                  }
                }).catch(()=>{
                  this.pageLoading = false;
                })
        },
        changeTab(name){
          this._currentTab = name;
          this.schoolChangeHandle(this.currentSchool);
        },
        checkUser(state, item){
          if(this.multiple){
            if(state){
              if(this.ids.indexOf(item._id) == -1){
                this.selectUser.push(item);
              }
            } else {
              let index = this.ids.indexOf(item._id);
              if(index != -1) this.selectUser.splice(index, 1);
            }
          } else {
            if(state){
              if(this.ids.indexOf(item._id) == -1){
                this.selectUser = [item];
              }
            } else {
              this.selectUser = [];
            }
          }
        },
        removeSelect(index){
          this.selectUser.splice(index, 1);
        },
        checkAll(state){
          let list = this.data.list || [];
          for(let i = 0; i < list.length; i++){
            let item = list[i] || {};
            let index = this.ids.indexOf(item._id);
            if(state){
              if(index == -1 && !item._disabled){
                this.selectUser.push(item)
              }
            } else {
              if(index != -1 && !item._disabled){
                this.selectUser.splice(index, 1)
              }
            }
          }
          this.isCheckAll = state;
        },
        confirm() {
            this.isShowModal = false;
            this.$emit("success", this.selectUser);
        },
    },
    watch:{
      currentTab:{
        handler(nV, oV){
          this._currentTab = nV;
        },
        immediate: true
      }
    }
};
</script>

<style lang="less" scoped>
.member-view-modal {
    .member-area {
        height: 500px;
        padding: 25px;
        padding-top: 32px;
        padding-bottom: 0px;
        display: flex;
        .o-area-l {
            width: 550px;
            height: 100%;
            background-color: #fbfbfb;
            border: 1px solid #f2f2f2;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            border-radius: 6px;
            .area-cont {
                display: flex;
                flex: 1;
                height: 100%;
                overflow: hidden;
            }
        }
        .o-area-m {
            width: 65px;
            img {
                width: 32px;
                height: 23.2px;
            }
        }
        .o-area-r {
            width: 288px;
            height: 100%;
            background-color: #fbfbfb;
            border: 1px solid #f2f2f2;
            border-radius: 6px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            .area-cont {
                padding: 5px;
                flex: 1;
            }
        }
        .area-title {
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
            height: 63px;
            padding: 0px 18px;
            border-bottom: 1px solid #f2f2f2;
            display: flex;
            align-items: center;
        }
        .school-tree-area {
            width: 330px;
            height: 100%;
            padding-top: 40px;
            overflow: hidden;
            position: relative;
            .tree-area {
                width: 100%;
                height: 100%;
            }
            .choose-tip {
                position: absolute;
                top: 0px;
                left: 0px;
                background-color: #fff;
                padding: 8px;
                z-index: 2;
                width: 100%;
                box-shadow: 0px 0px 5px #ccc;
            }
            
            .tree-item {
                padding: 5px;
                cursor: pointer;
            }
            .tree-item:hover {
                background-color: #ebf5fe;
            }
            .tree-item.current-item {
                background-color: #d6e8fb;
            }
        }
        .no-padding{
            padding: 0px;
        }
        .student-table {
            position:relative;
            width: 260px;
            height: 100%;
            border-left: 1px solid #f2f2f2;
            display: flex;
            flex-direction: column;
        }
        .student-table-cont{
          flex: 1;
          overflow: hidden;
        }
        .check-all{
          padding: 5px;
          background-color:#fff;
          flex-shrink: 0;
        }
        .check-box-box{
          padding: 5px;
          .ivu-checkbox-wrapper{
            width:100%;
            display: flex;
            align-items: center;
          }
        }
        .select-item {
            padding: 5px;
            .close-icon {
                font-size: 20px;
                cursor: pointer;
            }
        }
        .search-empty {
            text-align: center;
            margin-top: 110px;
            color: #afafaf;
        }
    }
}
</style>