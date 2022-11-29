<template>
  <Modal v-model="isShowModal"  :title="title" :width="700" class-name="organize-view-modal">
    <div class="organize-area">
      <div class="o-area-l">
        <p class="area-title">选择组织：</p>
        <div class="area-cont">
          <organizeView 
          ref="organizeRef" 
          :type="organizeType" 
          :multiple="multiple" 
          :isShowAdd="isShowAdd"
          :isRelation="isRelation"
          @on-change="selectChange" 
          :isModal="true"
          :selectData="selectData"
          :isLImitMain="isLImitMain"
          :isShowAllBtn="isShowAllBtn"
          :isOnlyCanSel="isOnlyCanSel"
          :onlyCanSelArr="onlyCanSelArr"
          >
          </organizeView>
        </div>
      </div>
      <div style="width:10px;height:100%;"></div>
      <div class="o-area-r">
        <p class="area-title">已选组织：</p>
        <div class="area-cont" v-bar>
          <div class="p-r-10">
            <div class="select-item flex-b-c" v-for="(item, index) in selectData" :key="item.id" v-show="(isRelation && !item.pChecked) || !isRelation">
              <p class="text-flow text-r text-rtl" :title="item._parentName && item._parentName.join('/') + '/' + item.title">
                {{item.reverseTitle}}<span v-for="(nItem, nindex) in item.reversePName" :key="nindex">&nbsp;/&nbsp;{{nItem}}</span>
              </p>
              <Icon v-if="!item.disabled" type="md-close" class="close-icon" @click="removeSelect(index)" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div slot="footer">
      <Button type="default" @click="isShowModal = false">取消</Button>
      <Button type="primary" @click="confirm">确定</Button>
    </div>
  </Modal>
</template>

<script>
import organizeView from "@/components/view-components/organize-view/index"
export default {
  name: "organizeModal",
  components: { organizeView },
  props: {
    title: {
      type: String,
      default: "选择组织",
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    isShowAdd: {
      type: Boolean,
      default: false,
    },
    isRelation: {
      type: Boolean,
      default: false
    },
    isCanDel: {
      type: Boolean,
      default: true
    },
    organizeType: String | Number, // 请求数据：1.代表获取全部组织架构，2.获取管理员有权限的组织架构
    isLImitMain: { // 手动限制选择主体
      type: Boolean | String,
      default: ""
    },
    isShowAllBtn: Boolean,
    isOnlyCanSel:Boolean,
    onlyCanSelArr:Array,
  },
  data() {
    return {
      isShowModal: false,
      selectData: [],
    };
  },
  methods: {
    showModal(selectData) {
      this.isShowModal = true;
      this.$refs["organizeRef"] && this.$refs["organizeRef"].getData(selectData);
    },
    selectChange(data) {
      this.selectData = data;
    },
    removeSelect(index){
      this.$refs["organizeRef"] && this.$refs["organizeRef"].removeSelect(index)
    },
    getData(){
      let selectData = this.selectData || [];
      if(this.isRelation){ // 只返回父级ID
       return selectData.filter((item)=>{
          return !item.pChecked && ((this.isLImitMain && item.id != 0) || !this.isLImitMain)
        })
      } else {
        return selectData
      }
      
    },
    confirm() {
      this.isShowModal = false;
      this.$emit("success", this.getData());
    },
  }
};
</script>

<style lang="less" scoped>
.organize-view-modal {
  .organize-area {
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