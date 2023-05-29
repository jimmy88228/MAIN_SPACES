<template>
  <custom-modal ref="modal" class="choose-organize-modal" :footerHide="false" :isSlotFooter="true" :width="530" :closable="true">
    <div class="organize-modal-title">选择组织进入</div>
    <div class="select-tip-view flex">
      <!-- <div v-for="(item, index) in chooseData" class="flex m-l-5 m-r-5" :key="item.id">
        <span class="m-r-5 pointer text-flow" @click="changeCurr(index)">{{item.structure_name}}</span>
        <span class="flex-s0" v-if="item.children && item.children.length">&gt;</span>
        <span class="m-l-5" v-if="(item.children && item.children.length) && (index + 1) == chooseData.length">{{nextTxt[item.structure_type] || '请选择下级组织'}}</span>
      </div> -->
      <div>
        <span class="m-r-5" v-if="selectData.id">已选择</span>
        <span >{{selectData.id ? selectData.structure_name : '请选择组织'}}</span>
      </div>
    </div>
    <div class="organize-list-area" >
      <div class="organize-list-view">
        <div class="organize-lists" :style="'transform: translateX(' + currView * -100 + '%);'">
          <div class="organize-list" v-bar v-for="(lItem, lIndex) in viewData" :key="lIndex">
            <div class="">
              <div class="flex-b-c list-item" v-for="(item, index) in lItem" :key="item.id" @click.stop="chooseOrganize(item, lIndex)">
                <div class="item-checkbox" @click.stop="_func">
                  <Checkbox size="large" :value="selectData.id == item.id" @on-change="(state)=>{selectOrganize(item, state)}">
                  </Checkbox>
                </div>
                <div class="item-l flex-s-c">
                  <div class="item-img-area">
                    <img v-if="item.logo" :src="imgPath + item.logo"  class="item-img"/>
                    <img v-else src="@/assets/images/organize.bg.png" class="item-img"/>
                  </div>
                  <div class="item-name">{{item.structure_name}}</div>
                </div>
                <div class="item-r w-nowrap pointer"  v-if="item.children && item.children.length > 0">
                  <img src="@/assets/images/sub.png" />下级
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div slot="footer">
      <div class="flex-b-c">
        <div >
          <Button v-if="currView" @click="changeCurr(currView - 1)">返回上一级</Button>
        </div>
        <div>
          <Button @click="dismiss()">取消</Button>
          <Button type="success" @click="confirmSelect">确认</Button>
        </div>
      </div>
    </div>
    <Spin v-if="pageLoading" fix></Spin>
  </custom-modal>
</template>

<script>
export default {
  name: "choose-organize-modal",
  props: {
    chooseCustomerId: Number | String,
    imgPath: String
  },
  data(){
    return {
      viewData: [],
      chooseIds: [],
      chooseData: [],
      currView: 0,
      selectData: {},
      organizeData: [],
      pageLoading: false,
      nextTxt: {
        edu_area: "请选择街道",
        edu_street: "请选择学校"
      }
    }
  },
  methods: {
    dismiss() {
      this.$refs.modal.dismiss();
    },
    showModal({ organizeData }) {
      organizeData = JSON.parse(JSON.stringify(organizeData || []));
      this.initData(organizeData);
      this.organizeData = organizeData
      this.$refs.modal.show();
    },
    changeCurr(index){
      this.currView = Number(index) || 0;
    },
    chooseOrganize(selectItem, index){
      selectItem = JSON.parse(JSON.stringify(selectItem));
      if(selectItem.children && selectItem.children.length){
        this.currView = Number(index) + 1;
      } else {
        this.currView = index;
      }
      this.chooseIds.splice(index, (this.chooseIds.length - index), selectItem.id);
      this.chooseData.splice(index, (this.chooseData.length - index), selectItem);
      this.initData(this.organizeData);
    },
    selectOrganize(item, state){
      this.selectData = state ? item : {};
    },
    confirmSelect(){
      let selectData = this.selectData || {};
      if(!Number(selectData.id)) {
        this.$Message.warning("无效ID");
        return;
      }
      this.pageLoading = true;
      return this.$MainApi
        .selectStructureLogin({
          data: {
            id: this.chooseCustomerId || 0,
            structure_id: selectData.id
          },
          other: {
            isErrorMsg: true
          }
        })
        .then((res) => {
          if (res.code) {
            this.dismiss();
            this.$nextTick(()=>{
              this.$emit("callback", {
                ...res,
                chooseorganize: selectData.id
              });
            })
          }
        })
        .finally(() => {
          this.pageLoading = false;
        });
    },
    initData(organizeData){
      let selectIndexs = JSON.parse(JSON.stringify(this.selectIndexs || []));
      let chooseIds = JSON.parse(JSON.stringify(this.chooseIds || []));
      if(organizeData[0]){
        this.viewData = [organizeData]
      }
      this.loopData(organizeData, chooseIds, selectIndexs);
    },
    loopData(data, chooseIds){
      if(data.length){
        for(let i = 0; i < data.length; i++){
          let item = data[i] || {};
          let id = data[i].id;
          if(item.children && item.children.length > 0){
            if(chooseIds[0] == id){
              this.viewData.push(item.children);
              chooseIds.splice(0, 1);
            }
            this.loopData(item.children, chooseIds);
          }
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.choose-organize-modal{
  .organize-modal-title{
    font-size: 18px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #333333;
    line-height: 25px;
    padding-top: 10px;
    padding-bottom: 14px;
    padding-left: 20px;
  }
  .select-tip-view{
    padding-left: 20px;
    padding-bottom: 23px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #7f7f7f;
    line-height: 20px;
  }
  .organize-list-area{
    width:100%;
    height:300px;
    
  }
  .organize-list-view{
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .organize-lists{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    transition: transform .35s;
  }
  .organize-list{
    padding-right: 15px;
    width: 100%;
    height: 100%;
    flex-shrink: 0;
    padding-top: 1px;
  }
  .list-item{
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 22px;
    height: 76px;
    border-top:1px solid #F1F1F1;
    border-bottom:1px solid #F1F1F1;
    margin-top: -1px;
    padding: 10px;
    padding-left: 50px;
    background-color:#fff;
    position: relative;
    .item-l{
      .item-img-area{
        position:relative;
        border-radius: 100%;
        overflow: hidden;
        width: 44px;
        height: 44px;
        margin-right: 11px;
        flex-shrink: 0;
        background-color:#efefef;
      }
      .item-img{
        width:100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      .item-name{

      }
    }
    .item-r{
      padding: 10px;
      display: flex;
    }
  }
  .list-item:hover{
    background-color:#f7f7f7;
  }
  .item-checkbox{
    position: absolute;
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
  }
  
}
</style>
<style lang="less">
.choose-organize-modal{
  .ivu-checkbox-wrapper{
    .ivu-checkbox-inner{
      border-radius: 100%;
      width: 22px;
      height: 22px;
    }
    .ivu-checkbox-inner::after{
      width: 6px;
      height: 11px;
      top: 4px;
      left: 7px;
    }
    .ivu-checkbox-checked{
      .ivu-checkbox-inner{
        border-color:#28BE6E;
        background-color:#28BE6E;
      }
    }
  }
  .ivu-checkbox-inner{
    border-color: #b2b2b2;
  }
}
</style>