<template>
  <div class="date-picker-box" :style="boxStyle">
    <DatePicker 
      :class="['date-picker',type]"
      :style="customStyle"
      :type="type"
      :value="dateRange"
      :placeholder="placeholder"
      :format="format"

      :options="options"
      :multiple="multiple"
      :disabled="disabled"
      :clearable="clearable"
      :readonly="readonly"
      :size="size"
      :start-date="startDate"
      @on-change="onChange"
      @on-open-change="onOpenChange"
      @on-ok="onOk"
      @on-clear="onClear"
      @on-clickoutside="onClickoutside"
    ></DatePicker>
  </div>
</template>

<script>
  const invalid = /^(1900)+|^(1901)+/g;
  export default {
    name: 'customDatePicker',
    props: {
      value: [Array,String],
      boxStyle:{
        type:String,
        default:""
      },
      customStyle:{
        type:String,
        default:""
      },
      type:{
        type:String, 
      	default(){
					return 'date' //date,daterange,datetime,datetimerange,year,month
				}
      },
      placeholder:{
        type:String, 
      	default(){
					return '请选择时间'
				}
      },
      format:{
        type:String, 
      	default(){
          return 'yyyy-MM-dd HH:mm:ss'
				}
      }, 
      options:{
        type:Object, 
        default(){
          return {}
        }
      },
      multiple:{
        type:Boolean, 
        default(){
          return false
        }
      }, 
      disabled:{
        type:Boolean, 
        default(){
          return false
        }
      },
      clearable:{
        type:Boolean, 
        default(){
          return false
        }
      },
      readonly:{
        type:Boolean, 
        default(){
          return false
        }
      },
      size:String,
      startDate:Date,
    },
		data(){
			return {
				dateRange: [],
        init:false
			}
		},
    methods: {
      onChange(data) {
        this.dateRange = data;
        this.$emit('on-change',this.dateRange);
      },
      onOpenChange(data) {
        this.$emit('on-open-change',this.dateRange);
      }, 
      onOk(data) {
        this.$emit('on-ok',this.dateRange);
      }, 
      onClear(data) {
        this.$emit('on-clear',this.dateRange);
      }, 
      onClickoutside(data) {
        this.$emit('on-clickoutside',this.dateRange);
      },
      getDateVal(){
        return this.dateRange
      },
    },
    watch:{
			value:{ //双向绑定目前无效?
					handler(nV) {
          let value = nV;
          if(!this.init){
            if(typeof(nV) == 'string'){ //判断非法时间
              value && (this.init = true);
              invalid.test(value) && (value = '');
            }else if(Array.isArray(value)){
              value.length > 0 && (this.init = true);
              value.some(item=>invalid.test(item)) && (value = []);
            }
          }
					this.dateRange = value;
				},
				immediate: true,
        deep: true
			},
    } 
  }
</script>

<style lang="less" scoped>
.date-picker-box{
  .date-picker{
    width:220px;
    &.daterange,&.datetimerange{
      width: 334px;
    }
  } 
}
</style>