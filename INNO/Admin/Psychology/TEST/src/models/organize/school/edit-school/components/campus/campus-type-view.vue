<template>
  <div class="campus-type-view">
    <div class="select-type-view">
      <span class="type-item" v-if="newEduType.indexOf(item.key) != -1" v-for="(item, index) in campusTypeList" :key="index">
        {{item.name}}
        <Icon class="type-item-remove" @click="removeChooseType(item.key)" v-if="eduType.indexOf(item.key) == -1" :size="18" type="ios-close-circle" />
      </span>
      <div class="C_B2" v-if="!newEduType || !newEduType.length">选择办学类型</div>
    </div>
    <Poptip placement="bottom-end" v-model="visible" @on-popper-show="showPopper">
      <div class="campus-type-add"><Icon color="#0077A9" type="md-add" /></div>
      <div slot="content" class="add-type-area">
        <div class="add-type-title">选择办学类型</div>
        <div class="add-type-cont">
          <CheckboxGroup v-model="chooseType">
            <Checkbox :label="item.key" :disabled="eduType.indexOf(item.key) != -1" v-for="(item, index) in campusTypeList" :key="item.key">
                <span>{{item.name}}</span>
            </Checkbox>
          </CheckboxGroup>
        </div>
        <div class="text-r">
          <Button type="primary" @click="confirmChooseType">确定</Button>
        </div>
      </div>
    </Poptip>
    
  </div>
</template>

<script>
import campusConf from "./campus.js";
export default {
  props: {
    eduType: {
      type: Array,
      default(){
        return []
      }
    },
    newEduType: {
      type: Array,
      default(){
        return []
      }
    }
  },
  data(){
    return {
      chooseType: [],
      visible: false
    }
  },
  computed: {
    campusTypeList(){
      return campusConf.campusTypeList
    }
  },
  methods: {
    removeChooseType(key){
      if(key){
        let index = this.newEduType.indexOf(key)
        if(index != -1){
          this.newEduType.splice(index, 1);
        }
      }
    },
    showPopper(){
      this.chooseType = JSON.parse(JSON.stringify(this.newEduType));
    },
    confirmChooseType(){
      this.newEduType = JSON.parse(JSON.stringify(this.chooseType));
      this.visible = false;
      this.$emit("confirm", this.newEduType)
    }
  },
  watch: {
  }
}
</script>

<style lang="less" scoped>
.campus-type-view{
  width: 100%;
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FCFCFC;
  border-radius: 0px 0px 2px 2px;
  border: 1px solid #E3E3E3;
  padding: 0px 10px;
  transition: all .35s;
  .select-type-view{
    flex: 1;
  }
  .type-item{
    padding: 2px 7px;
    display: inline-block;
    margin:4px 8px 4px 0px;
    min-width: 40px;
    background: #F8F8F8;
    border-radius: 3px;
    border: 1px solid #F1F1F1;
    position:relative;
    cursor: pointer;
  }
  .type-item-remove{
    position: absolute;
    top: 0px;
    right:0px;
    transform: translate(30%, -30%);
    transition: opacity .35s;
    opacity: 0;
    cursor: pointer;
  }
  .type-item:hover{
    box-shadow: 0px 0px 5px #efefef;
    .type-item-remove{
      opacity: 0.6;
    }
  }
  .campus-type-add{
    flex-shrink: 0;
    width:32px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #FFFFFF;
    border-radius: 3px;
    border: 1px solid #F1F1F1;
    cursor: pointer;
  }
}
.add-type-area{
  padding: 10px 0px 5px 0px;
}
.add-type-title{
  font-weight: bold;
  font-size: 16px;
}
.add-type-cont{
  padding: 20px 5px;
}
</style>