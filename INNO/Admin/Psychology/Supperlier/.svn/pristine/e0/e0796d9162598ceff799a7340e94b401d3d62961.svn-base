<template>
  <custom-modal class="hold-modal-zindex" :isSlotHeader="true" :isSlotFooter="true" ref="modal" :width="700" :closable="true">
    <div class="count-modal-title" slot="header">编辑时段</div>
    <div class="set-time-content">
      <div class="p-t-10 p-b-10">
        <div class="time-class-item flex" v-for="(gItem, gIndex) in timeTemplate" :key="gIndex">
          <div class="class-item-tip flex-c-c">
            <div>
              <p>{{gIndex}}</p>
            </div>
          </div>
          <div class="time-list">
            <timeItem :selected="ids.indexOf(item.itemId) != -1" :fullBooked="!!item.appointment_id" v-for="(item, index) in gItem" :key="index" @select="selectItem(item)">
              <p>{{item.beginTime}}</p>-<p>{{item.endTime}}</p>
            </timeItem>
          </div>
        </div>
      </div>
      <Spin fix v-if="pageLoading"></Spin>
    </div>
    <div class="flex-b-c p-5" slot="footer">
      <div>
        <div>
          <div class="item-radio flex-s-c" :class="{'selected': isSelectAll}" @click="selectAll">
            <span class="item-radio-inner "></span>
            <span class="m-l-5">全选</span>
          </div>
        </div>
      </div>
      <div>
        <Button @click="dismiss()">取消</Button>
        <Button type="primary" @click="confirm()">保存</Button>
      </div>
    </div>
  </custom-modal>
</template>

<script>
import timeItem from "./items/time-item.vue";
export default {
  components: {
    timeItem
  },
  props: {
    chooseData: {
      type: Object,
      default(){
        return {}
      }
    },
    scheduleData: { // 库里面已经存在的时间点
      type: Object,
      default(){
        return {}
      }
    },
  },
  data(){
    return {
      pageLoading: false,
      isBatch: false,
      timeTemplate: [],
      canSelectAllData: [],
      selectData: [],
      isSelectAll: false
    }
  },
  computed:{
    ids(){
      let ids = [];
      let selectData = this.selectData || []
      for(let i = 0; i < selectData.length; i++){
        if(selectData[i].itemId){
          ids.push(selectData[i].itemId)
        }
      }
      // 判断是否全选
      if(this.canSelectAllData.length > ids.length && this.isSelectAll){
        this.isSelectAll = false;
      } 
      if(this.canSelectAllData.length <= ids.length && !this.isSelectAll){
        this.isSelectAll = true;
      } 
      return ids;
    },
    dataBaseTime(){
      if(this.isBatch){
        return [];
      } else {
        let singleDate = this.chooseData.singleDate || {};
        if(singleDate.schedule_day){
          let selectTime = this.scheduleData[singleDate.schedule_day] || [];
          return selectTime;
        }
      }
    },
    dataBaseIds(){
      let dataBaseTime = this.dataBaseTime || [];
      let ids = [];
      for(let i = 0; i < dataBaseTime.length; i++){
        ids.push(dataBaseTime[i].itemId)
      }
      return ids;
    }
  },
  methods: {
    dismiss() {
      this.$refs.modal.dismiss();
    },
    showModal(detail){
      this.isBatch = detail.isBatch;
      this.selectData = JSON.parse(JSON.stringify(detail.selectData || []));
      this.isSelectAll = false;
      this.getReservationTimeview();
      this.$refs.modal.show();
    },
    getReservationTimeview(){
      this.pageLoading = true
      return this.$MainApi
        .getReservationTimeview({
          data: {},
        })
        .then((res) => {
          if (res.code) {
            let data = res.data || {};
            let items = data.items || {};
            let canSelectAllData = [];
            for(let i in items){
              let item = items[i] || [];
              for(let j = 0; j < item.length; j++){
                delete item[j].id;
                if(item[j].begin_time){
                  let beginTimeArr = item[j].begin_time.split(":");
                  beginTimeArr.length > 2 && beginTimeArr.splice(-1, 1);
                  item[j].beginTime = beginTimeArr.join(":")
                }
                if(item[j].end_time){
                  let endTimeArr = item[j].end_time.split(":");
                  endTimeArr.length > 2 && endTimeArr.splice(-1, 1);
                  item[j].endTime = endTimeArr.join(":")
                }
                item[j].itemId = item[j].beginTime + '-' + item[j].endTime;
                let selectIndex = this.dataBaseIds.indexOf(item[j].itemId);
                // 检测是否约满
                if(selectIndex == -1){
                  canSelectAllData.push(item[j]);
                } else {
                  item[j].appointment_id = this.dataBaseTime[selectIndex].appointment_id;
                  item[j].id = this.dataBaseTime[selectIndex].id || 0;
                  if(!item[j].fullBooked){
                    canSelectAllData.push(item[j]);
                  }
                }
              }
            }
            this.canSelectAllData = canSelectAllData;
            this.timeTemplate = items || [];
            // console.log("timeTemplate", this.timeTemplate)
          }
        }).finally(()=>{
          this.pageLoading = false;
        })
    },
    selectItem(item){
      let index = this.ids.indexOf(item.itemId)
      if(index == -1){
        this.selectData.push(item);
      } else {
        this.selectData.splice(index, 1)
      }
    },
    selectAll(selected){
      let isBoolean = typeof(selected) == 'boolean';
      if((!isBoolean && this.isSelectAll) || (isBoolean && !selected)){
        this.isSelectAll = false;
        this.selectData = this.selectData.filter((item)=>{
          return item.appointment_id
        });
      } else if((!isBoolean && !this.isSelectAll) || (isBoolean && selected)){
        this.isSelectAll = true;
        this.selectData = JSON.parse(JSON.stringify(this.canSelectAllData));
      }
    },
    confirm(){
      if(this.isBatch && this.selectData.length == 0){
        this.$Message.warning("请选择时间点！")
        return;
      }
      this.$emit('confirm', {
        isBatch: this.isBatch,
        selectData: this.selectData
      })
      this.dismiss();
    }
  }
}
</script>

<style lang="less" scoped>
.set-time-content{
  margin: -30px 0px;
  min-height: 300px;
  .time-class-item{
    padding-top: 20px;
  }
  .class-item-tip{
    width: 80px;
    height: 80px;
    text-align: center;
    font-size: 15px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #222222;
    line-height: 26px;
  }
  .item-tip-sub{
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #B2B2B2;
    line-height: 15px;
  }
  .time-list{
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 20px;
    border-bottom: 1px solid #DDD;
  }
}
.item-radio{
  padding: 6px;
  cursor: pointer;
}
.item-radio-inner{
  display: block;
  width: 15px;
  height: 15px;
  background-color: #fff;
  border: 1px solid #B2B2B2;
  border-radius: 100%;
  position:relative;
}
.selected .item-radio-inner{
  background: #049ED1;
  border-color: #049ED1;
}
.selected .item-radio-inner:after{
  content: "";
  border: 2px solid #fff;
  width: 40%;
  height: 60%;
  position: absolute;
  top: 45%;
  left: 50%;
  border-top: none;
  border-left: none;
  transform: translate(-50%, -50%) rotate(45deg);
}
</style>