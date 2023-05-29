<template>
  <vue-scroll class="tickets-scroll">
    <div class="">
      <div class="set-item">
        <div class="set-item-t">问卷设置</div>
        <div class="set-item-c">
          <Poptip placement="right" class="start-poptip" v-model="startPop">
              <div class="choose-item flex-b-c">
                <div class="choose-l">开始时间</div>
                <div class="choose-r">{{start_text}}</div>
                <Icon class="choose-arrow" type="ios-arrow-forward" />
              </div>
              <div slot="content" class="poptip-start-area">
                <Form label-position="top">
                  <FormItem label="选择类型">
                    <Select v-model="editStart.start_type">
                      <Option :value="item.key" v-for="(item, index) in startSelect" :key="item.key">{{item.label}}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="选择时间点" v-if="editStart.start_type == 'custom'">
                    <date-time :afterNow="true" :limitDate="editEnd.end_time ? 'after ' + editEnd.end_time: ''" v-model="editStart.begin_time"></date-time>
                  </FormItem>
                </Form>
                <div class="text-r">
                  <Button @click="startPop = false">取消</Button>
                  <Button type="primary" @click="confrimStart()">确定</Button>
                </div>
              </div>
          </Poptip>
          <Poptip placement="right" class="start-poptip" v-model="endPop">
            <div class="choose-item flex-b-c">
              <div class="choose-l">结束时间</div>
              <div class="choose-r">{{endText}}</div>
              <Icon class="choose-arrow" type="ios-arrow-forward" />
            </div>
            <div slot="content" class="poptip-start-area">
                <Form label-position="top">
                  <FormItem label="选择类型">
                    <Select v-model="editEnd.end_type">
                      <Option :value="item.key" v-for="(item, index) in endSelect" :key="item.key">{{item.label}}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="选择时间点" v-if="editEnd.end_type == 'custom'">
                    <date-time format="yyyy-MM-dd 23:59" :afterNow="true" :limitDate="editStart.begin_time ? 'before ' + editStart.begin_time: ''" :value="editEnd.end_time" @change="(date)=>changeEndTime(date)"></date-time>
                  </FormItem>
                </Form>
                <div class="text-r">
                  <Button @click="endPop = false">取消</Button>
                  <Button type="primary" @click="confrimEnd()">确定</Button>
                </div>
              </div>
          </Poptip>
          <Poptip placement="right" class="start-poptip" v-model="limitPop">
            <div class="choose-item flex-b-c">
              <div class="choose-l">每人限参与</div>
              <div class="choose-r">{{limitText}}</div>
              <Icon class="choose-arrow" type="ios-arrow-forward" />
            </div>
            <div slot="content" class="p-t-10">
              <Form label-position="top">
                <FormItem label="选择参与限制">
                  <Select v-model="ticketsInfo.join_limit">
                    <Option :value="item.key" v-for="(item, index) in limitSelect" :key="item.key">{{item.label}}</Option>
                  </Select>
                </FormItem>
              </Form>
            </div>
          </Poptip>
          <div class="choose-item flex-b-c" style="padding-right: 0px;">
            <div class="choose-l">回收目标</div>
            <div class="choose-r">
              <custom-input v-model="ticketsInfo.aim_count" class="text-c choose-input" placeholder="输入目标" type="number" style="width: 75px;"></custom-input>
            </div>
          </div>
          <p class="desc-notice C_B2">达到目标后自动暂停活动</p>
        </div>
      </div>
      <div class="set-item">
        <div class="set-item-t">题目设置</div>
        <div class="set-item-c p-l-10">
          <Checkbox v-model="ticketsInfo.is_random" :true-value="1" :false-value="0">题目随机展示</Checkbox>
        </div>
      </div>
    </div>
  </vue-scroll>
</template>

<script>
import dateUtil from "@/helper/utils/date-util.js";
export default {
  props: {
    ticketsInfo: {
      type: Object,
      default(){
        return {}
      }
    }
  },
  data(){
    return {
      isRandom: false,
      startPop: false,
      endPop: false,
      limitPop: false,
      editStart: {},
      editEnd: {},
      startSelect: [
        {
          key: "immediate",
          label: "发布即生效"
        },
        {
          key: "custom",
          label: "自定义时间"
        }
      ],
      endSelect: [
        {
          key: "eternal",
          label: "一直有效"
        },
        {
          key: "custom",
          label: "自定义时间"
        }
      ],
      limitSelect: [
        {
          key: 1,
          label: "限一次"
        },
        {
          key: 0,
          label: "不限制"
        }
      ]
    }
  },
  computed: {
    start_text(){
      let ticketsInfo = this.ticketsInfo || {};
      if(ticketsInfo.start_type == 'custom'){
        return ticketsInfo.begin_time
      } else {
        for(let i = 0; i < this.startSelect.length; i++){
          if(this.startSelect[i].key == ticketsInfo.start_type){
            return this.startSelect[i].label
          }
        }
        return '';
      }
    },
    endText(){
      let ticketsInfo = this.ticketsInfo || {};
      if(ticketsInfo.end_type == 'custom'){
        return ticketsInfo.end_time;
      } else {
        for(let i = 0; i < this.endSelect.length; i++){
          if(this.endSelect[i].key == ticketsInfo.end_type){
            return this.endSelect[i].label
          }
        }
        return '';
      }
    },
    limitText(){
      let ticketsInfo = this.ticketsInfo || {};
      for(let i = 0; i < this.limitSelect.length; i++){
        if(this.limitSelect[i].key == ticketsInfo.join_limit){
          return this.limitSelect[i].label
        }
      }
      return ""
    }
  },
  methods: {
    confrimStart(){
      if(this.editStart.start_type == 'custom' && !this.editStart.begin_time){
        this.$Message.warning("请选择自定义开始时间")
        return;
      }
      this.ticketsInfo.start_type = this.editStart.start_type;
      this.ticketsInfo.begin_time = this.editStart.begin_time;
      this.startPop = false;
    },
    confrimEnd(){
      if(this.editEnd.end_type == 'custom' && !this.editEnd.end_time){
        this.$Message.warning("请选择自定义结束时间")
        return;
      }
      this.ticketsInfo.end_type = this.editEnd.end_type;
      this.ticketsInfo.end_time = this.editEnd.end_time;
      this.endPop = false;
    },
    changeEndTime(date){
      
      this.editEnd.end_time = dateUtil.format(new Date(date), "yyyy-MM-dd 23:59")
    }
  },
  watch: {
    ticketsInfo: {
      handler(nV){
        this.editStart = {
          start_type: nV.start_type,
          begin_time: nV.begin_time,
        }
        this.editEnd = {
          end_type: nV.end_type,
          end_time: nV.end_time,
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="less" scoped>
.tickets-scroll{
  width: 100%;
  height: 100%;
  overflow: unset !important;
  /deep/.__panel{
    overflow: unset !important;
  }
}
.set-item{
  padding:0px 20px;
}
.set-item-t{
  font-size: 14px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #333333;
  line-height: 20px;
  padding: 26px 0px 18px 10px;
}
.choose-item{
  width: 230px;
  height: 46px;
  background: #FFFFFF;
  border-radius: 3px;
  border: 1px solid #F4F4F4;
  margin-bottom: 9px;
  position: relative;
  padding: 0px 30px 0px 14px;
  cursor: pointer;
}
.choose-l{
  font-size: 13px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #B2B2B2;
  line-height: 18px;
}
.choose-r{
  color: #575757;
}
.choose-arrow{
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
}
.choose-input{
  /deep/.ivu-input{
    border-color: transparent;
    box-shadow: unset;
  }
}
.start-poptip{
  /deep/.ivu-poptip-body-content{
    overflow: unset;
  }
  /deep/.ivu-poptip-inner{
    width: auto;
  }
}
.poptip-start-area{
  padding-top: 20px;
  /deep/.ivu-form{
    width: auto;
    .ivu-form-item-label{
      
    }
  }
}
</style>