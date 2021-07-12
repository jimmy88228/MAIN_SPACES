<template>
  <div class="date_select">
    <DatePicker
    v-model="startTime"
    type="datetime"
    :placeholder="startPlaceholder"
    :options="startOptions"
    class="basic_select"
    transfer
    @on-change="handleStart"></DatePicker>
    <span class="split">至</span>

    <DatePicker
    v-model="endTime"
    type="datetime"
    :placeholder="endPlaceholder"
    :options="endOptions"
    class="basic_select"
    transfer
    @on-change="handleEnd"></DatePicker>
    <ButtonGroup v-if="extra" class="btn-group">
      <Button
      v-for="(item, index) in timeRange" :key="index"
      :type="currentType === item.type ? 'primary' : 'default'"
      @click="handleOrderDay(item.type, null, 'click')">{{ item.name }}</Button>
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
    defaultTime:{
      type: String,
      default(){
        return "default";
      }
    },
    dateType: {//报表数据只到昨天, report => 只到昨天
      type: "",
      default(){
        return "";
      }
    },
    limitTime:{
      type: Array,
      default(){
        return [];
      }
    },
    customDate: {
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
        {type:"month", name:"近30天"},
				{type:"default", name:"不限时间"}
      ]
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
    if(this.defaultTime){
      this.handleOrderDay(this.defaultTime);
    }
  },
	watch: {
    customDate: {
      handler(nV) {
        if(this.isSetCustomDate){
          return;
        }
        if(nV.length > 1 && nV[0] && nV[1]){
          this.handleOrderDay("custom", nV);
        } else if(this.defaultTime){
          this.handleOrderDay(this.defaultTime);
        } else {
          this.reset();
        }
        this.isSetCustomDate = true;
  　　},
  　　immediate: true
  }

	},
  methods: {
    reset () {
      this.startTime = '';
      this.endTime = '';
			this.currentType = '';
    },
    handleStart (date) {
      //暂时针对报表，只拿onchange时间
      if(this.dateType == "report" && date){
        this.$emit('sT', date);
      } else {
        this.startTime = date;
        this.$emit('sT', this.startTime);
      }
    },
    handleEnd (date) {
      //暂时针对报表，只拿onchange时间
      if(this.dateType == "report" && date){
        this.$emit('eT', date);
      } else {
        this.endTime = date.replace('00:00:00','23:59:59');
        this.$emit('eT', this.endTime);
      }
    },
    handleExtra(){
      this.$emit("extra", this.currentType);
    },
    handleOrderDay (type, customDate = [], handle) {
      this.currentType = type;
      let startTime = new Date();
      startTime.setHours(0, 0, 0);
      let endTime = new Date();
      endTime.setHours(23, 59, 59);
      switch (type) {
        case 'today':
          break;
        case 'yesterday':
          startTime.setTime(startTime.getTime() - 3600 * 1000 * 24);
          endTime.setTime(endTime.getTime() - 3600 * 1000 * 24);
          break;
        case 'week':
          //
          if(this.dateType == "report"){
            startTime.setTime(startTime.getTime() - 3600 * 1000 * 24);
            endTime.setTime(endTime.getTime() - 3600 * 1000 * 24);
          }
          startTime.setTime(startTime.getTime() - 3600 * 1000 * 24 * 6);
          break;
        case 'month':
          if(this.dateType == "report"){
            startTime.setTime(startTime.getTime() - 3600 * 1000 * 24);
            endTime.setTime(endTime.getTime() - 3600 * 1000 * 24);
          }
          startTime.setTime(startTime.getTime() - 3600 * 1000 * 24 * 30);
          break;
        // 自定义日期
        case 'custom':
          startTime.setTime( Date.parse( new Date(customDate[0]) ) );
          endTime.setTime( Date.parse( new Date(customDate[1]) ) );
          break;
				case 'default':
				  startTime = "";
				  endTime = "";
				  break;
        default:
						this.currentType = "";
            break;
      }
			if(startTime){
				this.startTime = this.$util.format(startTime, 'yyyy-MM-dd HH:mm:ss');
			} else {
				this.startTime = "";
			}
			if(endTime){
				this.endTime = this.$util.format(endTime, 'yyyy-MM-dd HH:mm:ss');
			} else {
				this.endTime = "";
			}
      this.handleStart( this.startTime );
      this.handleEnd( this.endTime );
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
    width:180px;
  }
  .btn-group{
    margin-left:5px;
    display: flex;
  }
}
</style>
