<template>
  <div class="setting-table">
    <Table
      :border="true"
      ref="tableRef"
      class="full-table border"
      :columns="columns[type]"
      :loading="isLoading"
      :data="list"
      :no-data-text="type == 'dimension' ? '暂无维度' : '暂无结果'"
    >
        <template slot="statistics" slot-scope="{ row }">
            <div class="box">
                <div class="item">
                    {{(row.rule_info && row.rule_info.rule_name && statisticsType[row.rule_info.rule_type] && statisticsType[row.rule_info.rule_type].name) || '--'}}
                </div>
            </div> 
        </template>
        <template slot="dimension" slot-scope="{ row }">
            <div class="box">
                <div class="item">
                    {{row.rule_info && row.rule_info.dimension_rule_data && row.rule_info.dimension_rule_data.name}}
                </div>
            </div> 
        </template>
        <template slot="score" slot-scope="{ row }">
            <div class="box">
                <div class="item flex-c-c" v-for="item in (row.range_list || [])" :key="item.id">
                    <span class="bold">{{Number(item.min_value||0)}}</span>
                    <div class="p-l-5">
                        ≤
                    </div>
                    <div class="p-l-5 p-r-5">
                        得分
                    </div>
                    <div class="p-r-5">
                        &lt;
                    </div>
                    <span class="bold">{{Number(item.max_value||0)}}</span>
                </div>
            </div> 
        </template>
        <template slot="conclusion" slot-scope="{ row }">
            <div class="box">
                <div class="item" v-for="item in (row.range_list || [])" :key="item.id">
                    <div class="ellipsis-2" :class="item.range_name.length>12?'cursor-default':''" :title="item.range_name.length>12?item.range_name:''">
                        {{item.range_name}}
                    </div>
                </div>
            </div> 
        </template>
        <template slot="shortDesc" slot-scope="{ row }">
            <div class="box">
                <div class="item" v-for="item in (row.range_list || [])" :key="item.id">
                    <div class="ellipsis-2" :class="item.short_desc.length>12?'cursor-default':''" :title="item.short_desc.length>12?item.short_desc:''">
                        {{item.short_desc}}
                    </div>
                </div>
            </div> 
        </template>
        <template slot="describe" slot-scope="{ row }">
            <div class="box">
                <div class="item" v-for="item in (row.range_list || [])" :key="item.id">
                    <div class="ellipsis-2" :class="item.description.length>12?'cursor-default':''" :title="item.description.length>12?item.description:''">
                        {{item.description}}
                    </div>
                </div>
            </div> 
        </template>
        <template slot="isRed" slot-scope="{ row }">
            <div class="box">
                <div class="item" v-for="item in (row.range_list || [])" :key="item.id">
                    <div class="warning" :class="{active:item.is_red == 1}" @click="edit(item, row, 'isRed')"></div>
                </div>
            </div> 
        </template>
        <template slot="isWarn" slot-scope="{ row }">
            <div class="box">
                <div class="item" v-for="item in (row.range_list || [])" :key="item.id">
                    <div class="warning" :class="{active:item.is_warn == 1}" @click="edit(item, row, 'isWarn')"></div>
                </div>
            </div>
        </template>
        <template slot="isShow" slot-scope="{ row }">
            <div class="box">
                <div class="item">
                    <div class="warning" :class="{active:(row.rule_info && row.rule_info.is_show == 1)}" @click="edit({}, row, 'isShow')"></div>
                </div>
            </div>
        </template>
        <template slot="handle" slot-scope="{ row }">
            <div class="box">
                <div class="item operate-area" v-for="item in (row.range_list || [])" :key="item.id">
                    <a
                        @click="edit(item,row,'edit')"
                        class="operate"
                        :class="{disabled}"
                        v-hasAction="true"
                        >编辑</a
                    >
                    <a 
                        @click="edit(item,row,'delete')"
                        class="operate"
                        :class="{disabled}"
                        v-hasAction="true"
                        >删除</a
                    >
                </div>
            </div> 
        </template>
    </Table>
  </div>
</template>

<script>
import mixins from "./mixin.js";
export default {
  mixins: [mixins],
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    type: {
      type: String,
      default: "",
    },
    isLoading:{
        type:Boolean,
        default:()=>false
    },
    disabled:{
        type:Boolean,
        default:()=>false
    },
    statisticsType: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    edit(item,row,type) {
        item = item || {};
        console.log("edit item", item)
        if(!this.disabled){
            let rule_info = row.rule_info || {};
            item.addDimension = rule_info.dimension_id || 0;
            item.rule_name = rule_info.rule_name || "";
            item.range_name = item.range_name || rule_info.range_name || "";
            item.rule_type = rule_info.rule_type;
            item.ruleDescription = rule_info.description || ""
            item.rule_id = item.rule_id || rule_info.id;
            
            this.$set(item, 'is_show', rule_info.is_show);
            // this.$set(item, 'warningArea', rule_info.is_warn);
            // if(type == 'warningArea') { // 是否预警补充缺失字段
            //     this.$set(item, 'warningArea', (rule_info.is_warn == 1) ? 0 : 1);
            // }
            if(type == 'isWarn'){ // 是否预警补充缺失字段
                item.is_warn = (item.is_warn == 1) ? 0 : 1
            }
            if(type == 'isRed'){ // 是否标红补充缺失字段
                item.is_red = (item.is_red == 1) ? 0 : 1
            }
            if(type == 'isShow'){ // 是否标红补充缺失字段
                this.$set(item, 'is_show', (rule_info.is_show == 1) ? 0 : 1);
            }
        }
        this.$emit('edit',item,type);
    },
  },
};
</script>

<style lang="less" scoped> 
.setting-table{
    .box{
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .item{ 
        min-height: 45px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0; 
        border-bottom: 1px solid #e8eaec;
        padding: 0 10px;
        &:last-child{
            border-bottom: 0;
        }
    }
    .warning{
        width: 14px;
        height: 14px;
        background: #FFFFFF;
        border-radius: 2px;
        border: 1px solid #B2B2B2;
        cursor: pointer;
        position: relative;
        &.active{
            background: #3598D2;
            &::after{
                content:"";
                width: 60%;
                height: 5px;
                border-left: 2px solid #fff;
                border-bottom: 2px solid #fff;
                position: absolute;
                left: 50%;
                top: calc(50% - 1px);
                transform: translate(-50%,-50%) rotate(-45deg);
            }
        }
    }
    .disabled{
        color: #7f7f7f;
        opacity: 0.7; 
    }
}
</style>
<style lang="less" scoped>
.setting-table{
    // padding-bottom: 20px;
}
</style>
<style lang="less"> 
.setting-table{
    .ivu-table-border td{
        border-right: 1px;
        border-color: #e8eaec;
        border-right-style:solid;
    }  
    .ivu-table-border:after {
        width: 0;
    } 
    .ivu-table-header thead tr th{
        background-color: #F6F6F6;
        color: #7f7f7f;
    }
    .ivu-table-cell{
        padding-top: 0;
        padding-bottom: 0;
        padding-left: 0;
        padding-right: 0; 
    }
}
</style>