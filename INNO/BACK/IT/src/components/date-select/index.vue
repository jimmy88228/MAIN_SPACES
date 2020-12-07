<template>
  <div class="date_select">
    <DatePicker :type="dateType" :disabled="disableStart" :placeholder="startPlaceholder" v-model="startTime" :options="startOptions" class="basic_select" transfer @on-change="handleStart"></DatePicker>
    <span class="split">至</span>
    <DatePicker :type="dateType" :disabled="disableEnd" :placeholder="endPlaceholder" v-model="endTime" :options="endOptions" class="basic_select" transfer @on-change="handleEnd"></DatePicker>
    <ButtonGroup v-if="extra" class="btn-group">
      <Button @click="handleOrderDay(item.type, null, 'click')" v-for="(item, index) in timeRange" :key="index" :type="currentType === item.type ? 'primary' : 'default'">{{ item.name }}</Button>
    </ButtonGroup>
  </div>
</template>

<script>
export default {
  props: {
    extra: {
      type: Boolean,
      default: false
    },
    valueTime:{
      type: Array,
      default(){
        return [];
      }
    },
    startTime: {
      type: String,
      default:""
    },
    endTime: {
      type: String,
      default:""
    },
    isHandleLimit: {
      type: Boolean,
      default:""
    },
    dateType: {
      type: String,
      default(){
        return "datetime"
      }
    },
    limitTime:{
      type: Array,
      default(){
        return [];
      }
    },
    startPlaceholder:{
      type: String,
      default: '开始时间'
    },
    endPlaceholder:{
      type: String,
      default: '结束时间'
    }
  },
  name: 'dateSelect',
  data () {
    const that = this;
    return {
      startTime: '',
      endTime: '',
      currentType: '',
      startOptions: {
        disabledDate (date) {
          return date && that.endTime && date.valueOf() > that.endTime.valueOf();
        }
      },
      endOptions: {
        disabledDate (date) {
          return date && that.startTime && date.valueOf() < that.startTime.valueOf();
        }
      },
      defTimeRange:[
        {type:"today", name:"今"},
        {type:"yesterday", name:"昨"},
        {type:"week", name:"近7天"},
        {type:"month", name:"近30天"}
      ],
      disableStart: false,
      disableEnd: false
    }
  },
  watch: {
    isHandleLimit(nval, oval){
      if(nval){
        let nowDate = new Date();
        let startTime = new Date(this.startTime);
        let endTime = new Date(this.endTime);
        if(nowDate.getTime() >= endTime.getTime()){
          this.disableStart = true;
          this.disableEnd = true;
        } else if(nowDate.getTime() <= startTime.getTime()){
          this.disableStart = false;
          this.disableEnd = false;
        } else {
          this.disableStart = true;
          this.disableEnd = false;
        }
      }
    }
  },
  computed:{
    timeRange:{
      get(){
        if(this.limitTime.length > 0){
          let limitTimeStr = "," + this.limitTime.join(",") + ",";
          let newTime = [];
          for(let i = 0; i < this.defTimeRange.length; i++){
            let type = this.defTimeRange[i].type;
            if(limitTimeStr.indexOf("," + type + ",") == -1){
              newTime.push(this.defTimeRange[i]);
            }
          }
          return newTime;
        }
        return this.defTimeRange;
      },
      set(val){}
    }
  },
  mounted(){
    if(this.valueTime.length == 2){
      this.handleOrderDay("custom",this.valueTime);
    }
  },
  methods: {
    reset () {
      this.startTime = '';
      this.endTime = '';
    },
    handleStart () {
      this.$emit('sT', this.startTime);
    },
    handleEnd () {
      this.$emit('eT', this.endTime);
    },
    handleExtra(){
      this.$emit("extra", this.currentType);
    },
    handleOrderDay (type, customDate = [], handle) {
      this.currentType = type;
      const startTime = new Date();
      startTime.setHours(0, 0, 0);
      const endTime = new Date();
      endTime.setHours(23, 59, 59);
      switch (type) {
        case 'today':
          break;
        case 'yesterday':
          startTime.setTime(startTime.getTime() - 3600 * 1000 * 24);
          endTime.setTime(endTime.getTime() - 3600 * 1000 * 24);
          break;
        case 'week':
          startTime.setTime(startTime.getTime() - 3600 * 1000 * 24 * 6);
          break;
        case 'month':
          startTime.setTime(startTime.getTime() - 3600 * 1000 * 24 * 30);
          break;
        // 自定义日期
        case 'custom':
          startTime.setTime( Date.parse( new Date(customDate[0]) ) );
          endTime.setTime( Date.parse( new Date(customDate[1]) ) );
          break;
        default:
            break;
      }
      this.startTime = this.$util.format(startTime, 'yyyy-MM-dd HH:mm:ss');
      this.handleStart();
      this.endTime = this.$util.format(endTime, 'yyyy-MM-dd HH:mm:ss');
      this.handleEnd();
      if(handle == "click"){
        this.handleExtra();
      }
    }
  },
}
</script>

<style lang="less" scoped>
.date_select{
  display:flex;
  align-items: center;
  .split{
    display: inline-block;
    margin: 0 10px;
  }
  .basic_select{
    width:200px;
  }
  .btn-group{
    margin-left:5px;
    display: flex;
  }
}
</style>
