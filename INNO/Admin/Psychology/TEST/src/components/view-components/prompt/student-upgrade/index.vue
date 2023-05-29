<template>
  <div class="upgrade-modal " :class="{ 'animate': isShowModal == 1}" >
    <div class="upgrade-modal-body">
      <div class="bold upgrade-modal-title">
        <Icon type="ios-undo" :size="30" class="m-r-5 pointer" @click="dismiss"/>更新年级
      </div>
      <div class="upgrade-body">
        <div class="upgrade-steps-area" v-if="stepsArr.length > 1">
          <div class="upgrade-steps">
            <div class="upgrade-step" v-for="(item, index) in stepData" :key="item.key" :class="{'active': step == item.key}">
              <span>{{stepsArr.indexOf(item.key) + 1}}</span>
              <p class="step-title w-nowrap">{{item.title}}</p>
            </div>
          </div>
        </div>
        <div class="upgrade-step-view">
          <vue-scroll class="">
            <template v-if="updateData.length || graduateData.length">
              <div v-show="step == 1" >
                <div class="area-item area-item-title">共{{updateCount}}个年级待更新</div>
                <div class="area-item">

                  <div class="update-item" v-for="(cItem, cIndex) in updateData" :key="cItem.id">
                    <div class="item-t">{{cItem.name}}</div>
                    <div class="item-c">
                      <div class="item-c-i" v-for="(item, index) in cItem.data" :key="item.id">
                        <reCheckbox class="update-checkbox operate-checkbox" v-model="item.selected" @on-change="(state)=>changeCheck(state, item)">
                          <div class="flex-b-c p-l-20 bold" style="width: 350px;">
                            <p class="m-l-10">{{item.grade}}<span class="m-l-10">({{item.school_year}}级)</span></p>
                            <p class="turn-tip-area">
                              <span class="inline-b m-l-10 m-r-10 turn-tip">更新后为</span>
                            </p>
                            <p class="m-r-10">{{updateClassName(item.grade)}}<span class="m-l-10">({{item.school_year}}级)</span></p>
                          </div>
                        </reCheckbox>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
              <div v-show="step == 2">
                <div class="area-item">
                  <div class="area-item-title">共{{graduateCount}}个年级待毕业</div>
                  <p class="area-item-cont">年级毕业后，该年级有关的预警数据将不在进行统计，系统将关闭教师端相关班级的数据，同时不能再对其进行测评活动的关联。</p>
                </div>
                <div class="area-item">

                  <div class="graduate-item" v-for="(cItem, cIndex) in graduateData" :key="cItem.id">
                    <div class="item-t">{{cItem.name}}</div>
                    <div class="item-c">
                      <div class="item-c-i" v-for="(item, index) in cItem.data" :key="item.id">
                        <reCheckbox class="graduate-checkbox operate-checkbox" v-model="item.selected" @on-change="(state)=>changeCheck(state, item)">
                          <div class="flex-c-c p-l-20 bold" style="width: 350px;">
                            <p class="m-l-10">{{item.grade}}<span class="m-l-10">({{item.school_year}}级)</span></p>
                          </div>
                        </reCheckbox>
                      </div>
                    </div>
                  </div>
                  
                </div>
              </div>
              <div v-show="step == 3">
                <div class="area-item text-c">
                  <div class="load-area">
                    <loadAnimate 
                    :state="submitState"
                    class="load-animate"
                    :width="138"
                    ref="loadAnimateRef"
                    fromColor="#496CDE"
                    ></loadAnimate>
                    <div class="load-state" :class="{'fail-state' : submitState == 2}">
                      <template v-if="submitState == 1">设置成功</template>
                      <template v-else-if="submitState == 2">设置失败</template>
                      <template v-else>更新中</template>
                    </div>
                  </div>
                  <Button class="close-update" :disabled="!submitState" type="primary" @click="dismiss()">关闭</Button>
                </div>
              </div>
            </template>
            <div class="empty-area" v-if="updateData.length == 0 && graduateData.length == 0 && this.stepsArr.length < 2">
              暂无可升级年级
            </div>
          </vue-scroll>
          <Spin fix v-if="pageLoading"></Spin>
        </div>
        <div class="upgrade-step-operate flex-b-c" v-if="step != 3">
          <div>
            <reCheckbox 
            class="operate-checkbox" 
            :valuesKey="[false, true]" 
            :disabled="(step == 1 && !selectUpdateCount) || (step == 2 && !selectGraduateCount)"
            :value="confirmCheckValue" 
            @on-disabled="disabledConfirmCheck"
            @on-change="changeConfirmCheck">更新勾选的年级</reCheckbox>
            <reCheckbox class="operate-checkbox" :valuesKey="[false, true]" :value="unHandleValue" @on-change="changeUnHandle">暂不处理</reCheckbox>
          </div>
          <div>
            <Button class="operate-btn" v-if="hasPrev" @click="getPrev()">上一步</Button>
            <Button 
            class="operate-btn" 
            type="primary" 
            :disabled="!((confirmCheckValue && ((step == 1 && selectUpdateCount) || (step == 2 && selectGraduateCount))) || unHandleValue)" 
            @click="confirmUpdate">{{stepsArr[stepsArr.indexOf(step) + 1] == 3 ? '完成设置' : '下一步'}}</Button>
          </div>
        </div>
        <Spin fix v-if="isLoading"></Spin>
      </div>
      <div></div>
    </div>
  </div>
</template>

<script>
import { GradeOrder } from "@/models/data/data-cockpit/components/data-sort.js";
import reCheckbox from "./components/re-checkbox.vue";
import loadAnimate from "./components/load-animate.vue";
import LM from "@/helper/manager/login-manager.js"
export default {
  components: { reCheckbox, loadAnimate },
  data(){
    return {
      isShowModal: null,
      defaultSteps: {
        1: {
          key: 1,
          title: "更新年级",
          confirmCheck: false,
          unHandle: false,
        },
        2: {
          key: 2,
          title: "设置毕业年级",
          confirmCheck: false,
          unHandle: false,
        },
        3: {
          key: 3,
          title: "完成"
        }
      },
      steps: {},
      step: 1,
      stepsArr: [],
      stepData: {},
      selectUpdateCount: 0,
      updateData: [],
      submitUpdateData:{},
      selectGraduateCount: 0,
      graduateData: [],
      submitGraduateData:{},
      studentInfo: {},
      graduateConf: ["六年级", "初三", "高三"],
      isConfirmUpdate: false,
      isConfrimGraduate: false,
      isLoading: false,
      submitState: '' // 0 pedding, 1 success, 2 fail 
    }
  },
  computed: {
    updateCount(){
      let count = 0, selectUpdateCount = 0, submitUpdateData = {};
      this.updateData.map((uItem)=>{
        count += uItem.dataStr.length || 0;
        uItem.data.map((item)=>{
          if(item.selected == 1){
            selectUpdateCount += 1
            if(!submitUpdateData[uItem.id]){
              submitUpdateData[uItem.id] = []
            }
            submitUpdateData[uItem.id].push({
              school_year: item.school_year,
              grade: item.grade
            })
          }
        })
      })
      this.selectUpdateCount = selectUpdateCount;
      this.submitUpdateData = submitUpdateData;
      return count;
    },
    graduateCount(){
      let count = 0, selectGraduateCount = 0, submitGraduateData = {};
      this.graduateData.map((gItem)=>{
        count += gItem.dataStr.length || 0;
        gItem.data.map((item)=>{
          if(item.selected == 1){
            selectGraduateCount += 1;
            if(!submitGraduateData[gItem.id]){
              submitGraduateData[gItem.id] = []
            }
            submitGraduateData[gItem.id].push({
              school_year: item.school_year,
              grade: item.grade
            })
          }
        })
      })
      this.selectGraduateCount = selectGraduateCount;
      this.submitGraduateData = submitGraduateData; 
      return count;
    },
    hasPrev(){
      let step = this.step;
      let stepsArr = this.stepsArr;
      let index = stepsArr.indexOf(step);
      if(index != -1){
        return stepsArr[index - 1]
      }
      return false;
    },
    confirmCheckValue(){
      return (this.steps[this.step] && this.steps[this.step].confirmCheck) || false;
    },
    unHandleValue(){
      return (this.steps[this.step] && this.steps[this.step].unHandle) || false;
    },

  },
  methods: {
    showModal(){
      this.isShowModal = 1;
      this.steps = JSON.parse(JSON.stringify(this.defaultSteps));
      this.getData().finally(()=>{
        this.initStep();
      })
    },
    initStep(){
      let steps = this.steps, step = this.step;
      let stepData = {}, stepsArr = [];
      for(let i in steps){
        if(i == 1 && (!this.updateData || this.updateData.length == 0)){
          continue;
        }
        if(i == 2 && (!this.graduateData || this.graduateData.length == 0)){
          continue;
        }
        stepsArr.push(parseInt(i))
        stepData[i] = steps[i] || {};
      }
      this.step = stepsArr[0];
      this.stepsArr = stepsArr;
      this.stepData = stepData;
    },
    updateClassName(name){ 
      let index = GradeOrder.indexOf(name);
      if(index != -1 && index < GradeOrder.length){
        return GradeOrder[index + 1]
      }
      return ""
    },
    changeStep(step){
      if(step){
        this.step = step;
      }
    },
    getPrev(){
      let step = this.step;
      let stepsArr = this.stepsArr;
      let index = stepsArr.indexOf(step);
      if(index != -1){
        this.changeStep(stepsArr[index - 1])
      }
    },
    changeCheck(state, item){
      let step = this.step;
      this.$nextTick(()=>{
        if(this.steps[step].unHandle){
          this.steps[step].unHandle = false;
          this.batchSelectHandle(step, 0, {
            selected: 2
          });
        }
        if(this.steps[step].confirmCheck && ((step == 1 && !this.selectUpdateCount) || step == 2 && !this.selectGraduateCount)){
          this.steps[step].confirmCheck = false;
        }
      })
    },
    disabledConfirmCheck(){
      let step = this.step;
      if(step == 1 && !this.selectUpdateCount){
        this.$Message.warning("请勾选更新年级");
      } else if(step == 2 && !this.selectGraduateCount){
        this.$Message.warning("请勾选毕业年级");
      }
    },
    changeConfirmCheck(state){
      let steps = this.steps;
      let step = this.step;
      this.steps[step].confirmCheck = !steps[step].confirmCheck;
      this.steps[step].unHandle = false;
    },
    changeUnHandle(){
      let steps = this.steps;
      let step = this.step;
      this.steps[step].unHandle = !steps[step].unHandle;
      this.steps[step].confirmCheck = false;
      this.batchSelectHandle(step, 2);
    },
    batchSelectHandle(step, selected, reset){
      if(step == 1){
        this.updateData.map((uItem)=>{
          uItem.data.map((item)=>{
            if((reset && reset.selected == item.selected) || !reset){
              item.selected = selected
            }
          })
        })
      } else if(step == 2){
        this.graduateData.map((gItem)=>{
          gItem.data.map((item)=>{
            if((reset && reset.selected == item.selected) || !reset){
              item.selected = selected
            }
          })
        })
      }
    },
    getData(){
      this.isLoading = true;
      return this.$MainApi.getStructureData({
        data: {
          school_id: this._getReqStructureId,
          school_name: this._getReqStructureName
        },
      }).then((res)=>{
        if(res.code){
          let data = res.data || {};
          let campus = data.children || [];
          let updateData = [], graduateData = [];
          campus.map((cItem)=>{
            let children = cItem.children || [];
            delete cItem.children;
            let uCData = {
              ...cItem,
              dataStr: [],
              data: []
            }, gCData = {
              ...cItem,
              dataStr: [],
              data: []
            }
            children.map((item)=>{
              let gradeStr = item.grade + item.school_year || "";
              if(uCData.dataStr.indexOf(gradeStr) == -1 && this.graduateConf.indexOf(item.grade) == -1){
                uCData.dataStr.push(gradeStr);
                uCData.data.push({
                  ...item,
                  selected: 1
                });
              }
              if(gCData.dataStr.indexOf(gradeStr) == -1 && this.graduateConf.indexOf(item.grade) != -1){
                gCData.dataStr.push(gradeStr);
                gCData.data.push({
                  ...item,
                  selected: 1
                });
              }
            })
            if(uCData.dataStr.length){
              updateData.push(JSON.parse(JSON.stringify(uCData)))
            }
            if(gCData.dataStr.length){
              graduateData.push(JSON.parse(JSON.stringify(gCData)))
            }
          })
          this.updateData = updateData;
          this.graduateData = graduateData;
        }
      }).catch(()=>{
        this.submitState = 2;
      }).finally(()=>{
        this.isLoading = false;
      })
    },
    dismiss(){
      this.isShowModal = 2;
    },
    // checkSelect(){
    //   let warn = "";
    //   if(this.updateData.length && this.selectUpdateCount == 0){
    //     warn = "请选择升级年级";
    //   } 
    //   if(!warn && this.selectUpdateCount == 0 && this.graduateData.length && this.selectGraduateCount == 0){
    //     warn = "请选择毕业年级";
    //   }
    //   if(warn){
    //     this.$Message.warning(warn);
    //     return false;
    //   }
    //   return true
    // },
    confirmUpdate(){
      let step = this.step;
      let stepsArr = this.stepsArr;
      let index = stepsArr.indexOf(step);
      if(stepsArr[index + 1] != 3){
        stepsArr[index + 1] && this.changeStep(stepsArr[index + 1])
      } else {
        // if(!this.checkSelect()){
        //   return;
        // }
        this.changeStep(3)
        this.submitState = 0;
        let upgrade_data = [], graduate_data = []; 
        for(let i in this.submitUpdateData){
          upgrade_data.push({
            campus_id: i,
            grade_data: this.submitUpdateData[i]
          });
        }
        for(let i in this.submitGraduateData){
          graduate_data.push({
            campus_id: i,
            grade_data: this.submitGraduateData[i]
          });
        }
        this.$MainApi.setSchoolUpgrade({
          data: {
            school_id: this._getReqStructureId,
            upgrade_data: upgrade_data,
            graduate_data: graduate_data
          },
          other:{
            isMsg: true
          }
        }).then((res)=>{
          return new Promise((rs, rj)=>{
            setTimeout(()=>{
              if(res.code){
                this.submitState = 1;
                this._adminUserInfos.is_upgrade = 0;
                LM.setUserInfos(this._adminUserInfos);
                return rs(res);
              } else {
                this.submitState = 2;
                return rj(res);
              }
            },350)
          })
        }).finally(()=>{
          if(!this.submitState){
            this.submitState = 2;
          }
        })
      }
    },
  }
}
</script>

<style lang="less" scoped>
.upgrade-modal{
  width: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: #fff;
  z-index: 1005;
  opacity: 0;
  transition: all .7s ease;
  transform: translate(0, -100%);
}
.animate{
  opacity: 1;
  transform: translate(0, 0);
}
.area-item{
  padding: 27px;
  background-color:#FBFBFB;
  border-radius: 11px;
  margin-bottom: 15px;
}
.area-item-title{
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: bold;
  color: #333333;
  line-height: 20px;
}
.area-item-cont{
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #B2B2B2;
  line-height: 17px;
  margin-top: 10px;
}
.upgrade-modal-title{
  padding: 35px 10px 0px 40px;
  font-size: 22px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #171717;
  line-height: 30px;
}
.upgrade-modal-body{
  display: flex;
  justify-content: space-between;
  width: 100%;
  height:100%;
}
.upgrade-body{
  width: 100%;
  max-width: 580px;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.upgrade-steps-area{
  padding: 0px 50px;
}
.upgrade-steps{
  display: flex;
  justify-content: space-between;
  position:relative;
  padding: 20px 0px;
  margin-bottom: 30px;
  flex-shrink: 0;
}
.upgrade-steps::before{
  position:absolute;
  left: 0px;
  top: 50%;
  transform: translateY(-50%);
  content: "";
  width: 100%;
  height:1px;
  border: 1px dashed #F3F3F3;
}
.upgrade-step{
  border-radius: 100%;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #F0F0F0;
  position:relative;
  color: #fff;
  cursor: pointer;
}
.step-title{
  display: block;
  position: absolute;
  left: 50%;
  bottom: -10px;
  transform: translate(-50%, 100%);
  color:#B2B2B2;
}
.upgrade-step.active{
  background-color:#55A2FB;
  .step-title{
    color:#333333;
  }
}

.upgrade-step-view{
  position: relative;
  flex: 1;
  overflow: hidden;
}
.update-item, .graduate-item{
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 15px 0px;
}
.item-t{
  width: 60px;
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: bold;
  color: #333333;
  line-height: 20px;
}
.item-c{
  padding-left: 30px;
  position:relative;
}
.item-c::before{
  width: 1px;
  height: 100%;
  content: "";
  background-color:#EBEBEB;
  position:absolute;
  top: 0;
  left: 0;
}
.item-c-i{
  z-index: 2;
  position:relative;
  margin: 8px 0px;
}
.item-c-i::before{
  content: "";
  width: 16px;
  height: 1px;
  background-color:#EBEBEB;
  position:absolute;
  top: 50%;
  left: -30px;
  transform: translate(0, -50%);
}
.item-c-i:first-child{
  margin-top: 0px;
}
.item-c-i:last-child{
  margin-bottom: 0px;
}
.item-c-i:first-child::after{
  content: "";
  width: 1px;
  height: 50%;
  background-color:#FBFBFB;
  position:absolute;
  top: 0;
  left: -30px;
}
.item-c-i:last-child::after{
  content: "";
  width: 1px;
  height: 50%;
  background-color:#FBFBFB;
  position:absolute;
  top: 50%;
  left: -30px;
}
.upgrade-step-operate{
  flex-shrink: 0;
  padding: 15px 0px;
}
.operate-checkbox, .operate-radio{
  height: 44px;
  background: #EEF7FF;
  border-radius: 6px;
  padding: 0px 20px 0px 16px;
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #3686D8;
  line-height: 20px;
  white-space: nowrap;
  /deep/.ivu-checkbox, /deep/.ivu-radio, /deep/.re-checkbox{
    display: inline-flex;
    margin-right: 5px;
  }
  /deep/.ivu-checkbox-inner,/deep/.ivu-radio-inner, /deep/.re-checkbox-inner{
    width: 20px;
    height: 20px;
    border-color: #D1E6FF;
    border-radius: 100%;
  }
  /deep/.ivu-checkbox-inner:after,/deep/.ivu-radio-inner:after, /deep/.re-checkbox-inner:after{
    position:absolute;
    top: 45%;
    left: 50%;
    width: 35%;
    height: 55%;
    border-right: 2px solid #fff;
    border-bottom: 2px solid #fff;
    background: none;
    border-radius: 0;
    transform: translate(-50%, -50%) rotate(45deg) scale(0);
  }
  /deep/.ivu-checkbox-checked, /deep/.ivu-radio-checked, /deep/.re-checkbox-checked{
    .ivu-checkbox-inner, .ivu-radio-inner, .re-checkbox-inner{
      border-color:#4E8DF4;
      background-color:#4E8DF4;
    }
    .ivu-checkbox-inner:after,.ivu-radio-inner:after,.re-checkbox-inner:after{
      transform: translate(-50%, -50%) rotate(45deg) scale(1);
    }
  }
  /deep/.re-checkbox-indeterminate{
    .re-checkbox-inner{
      border-color:#ADAAB4;
      background-color:#ADAAB4;
    }
    .re-checkbox-inner:after{
        content: "";
        width: 60%;
        height: 2px;
        transform: translate(-50%, -50%) scale(1);
        position: absolute;
        left: 50%;
        top: 50%;
    }
  } 
}
.operate-btn{
  width: 120px;
  height: 44px;
}
.turn-tip-area{
  flex: 1;
  display: flex;
  justify-content: center;
}
.turn-tip{
  width: 80px;
  height: 32px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 50px;
  text-align: center;
  background-color:#62A0B2;
  color: #BDEFFB;
  flex-shrink: 0;
}
.update-checkbox{
  background: linear-gradient(90deg, #3023AE 0%, #53A0FD 48%, #B4EC51 100%);
  color: #fff;
  font-size: 14px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #FFFFFF;
  line-height: 20px;
  // width: 400px;
  /deep/.ivu-checkbox-checked{
    .ivu-checkbox-inner{
      border-color: #31CFB3;
      background-color:#31CFB3;
    }
  }
}
.graduate-checkbox{
  background: linear-gradient(90deg, #3023AE 0%, #53A0FD 100%);
  color: #fff;
  font-size: 14px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #FFFFFF;
  line-height: 20px;
  /deep/.ivu-checkbox-checked{
    .ivu-checkbox-inner{
      border-color:#31CFB3;
      background-color:#31CFB3;
    }
  }
}
.load-area{
  padding: 80px 0px;
  text-align: center;
}
.load-animate{
  margin: 0 auto;
}
.load-state{
  margin-top: 20px;
  font-size: 16px;
  font-weight: bold;
  font-family: PingFangSC-Semibold, PingFang SC;
  color: #487AE5;
  line-height: 22px;
}
.fail-state{
  color:#d62d20;
}
.close-update{
  width: 120px;
  height: 40px;
  font-size: 15px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  line-height: 21px;
  margin-bottom: 40px;
  background-color:#496CDE;
}
.empty-area{
  padding: 0px;
  position: absolute;
  top:0px;
  left:0px;
  width:100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color:#FBFBFB;
}
</style>