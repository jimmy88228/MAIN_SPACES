<template>
    <div class="dimension-dropDown-area">
        <Dropdown class="dimension-dropDown" :class="[warnShow?'warn':'']" trigger="custom" :visible="isVisible" :transfer="transfer" @on-visible-change="visibleChange" @on-clickoutside="clickoutside">
            <div class="dimension-dropDown-input"  ref="" :class="{ 'multiple-dropDown-input': multiple && selectView.length, 'is-focus': isFocus }" @click="getFocus">
                <span v-if="multiple">
                    <span class="inline-b" v-for="(item, index) in selectView" :key="index">
                        <Tag :fade="false" class="m-r-5 m-b-5" closable  @on-close="removeValue(item.id)">{{item[typeData.nameKey]}}</Tag>
                    </span>
                </span>
                <!--为了避免form验证直接验证下面筛选框，增加Select去验证-->
                <template>
                    <Select v-model="value" :multiple="multiple" v-show="false"></Select>
                </template>
                <Input 
                :disabled="disabled"
                :class="{'multiple-input': multiple && selectView.length}" ref="dropInputRef" :size="size" :placeholder="(multiple && selectView.length) ? '' : placeholder" :value="selectView[typeData.nameKey]" 
                :style="inputStyle()"
                @on-focus="visibleChange(true)" 
                @on-change="screentData" 
                @on-blur="screentBlur"></Input>
                <div class="dropdown-icons">
                    <Icon v-if="selectView.id && !disabled" :size="16" class="dropdown-icon dropdown-close" @click.stop="clearData()" style="margin-right: -15px;" type="md-close-circle" />
                    <Icon class="dropdown-icon" :class="{'rotated': isVisible}" type="ios-arrow-down"></Icon>
                </div>
            </div>
            <DropdownMenu slot="list" class="dimension-dropDownMenu">
                <vue-scroll class="dropDown-scroll" v-bar :style="viewStyle">
                    <div>
                        <DropdownItem 
                        v-for="(item, index) in dimensionData" 
                        :key="item.id" 
                        v-show="!item.isHide && setShowData(item)" 
                        :name="item.id"
                        :class="{'selected': setSelect(item)}">
                            <div class="dropdown-item" @click.stop="selectDrop(item)">
                            <span class="w-break"> {{item[typeData.nameKey]}}</span>
                            <Icon class="select-icon" :size="18" type="md-checkmark" />
                            </div>
                        </DropdownItem>
                        <div v-if="showNum == 0" class="invalid text-c" style="padding: 30px 0px;">
                            暂无{{typeData.name}}，可自行添加
                        </div>
                    </div>
                </vue-scroll>
                <DropdownItem divided name="add" v-if="canEdit">
                    <div class="add-area" @click.stop="">
                        <div class="add-input-area" @click="addEdit">
                            编辑与创建
                        </div>
                    </div>
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
        <editDimension :id="id" :type="type" ref="editDimensionRef"></editDimension>
    </div>
</template>

<script>
import editDimension from "./edit-data.vue";
import StringH from "@/helper/utils/string-util.js";
import dimensionH from "./list-data.js";
export default {
    components: { editDimension },
    data() {
        return {
            isVisible: false,
            isAdd: false,
            isAddTxt: false,
            addLoading: false,
            keyWord: "",
            dimensionData: [],
            selectValue: 0,
            isFocus: false
        };
    },
    model: {
        prop: "value",
        event: "change",
    },
    props: {
        type:String,
        multiple: {
            type: Boolean,
            default: false
        },
        value: {
            type: String | Number | Array,
            default() {
                return 0;
            },
        },
        id: {
            type: Number | String,
            default: 0,
        },
        transfer: {
            type: Boolean,
            default: false
        },
        placeholder: String,
        size: {
            type: String,
            default: "default" 
        },
        disabled: Boolean,
        canEdit: {
            type: Boolean,
            default: true
        },
        showData: {
            type: Array,
            default:()=>{
                return []
            }
        },
        defaultEmpty:{
            type: Boolean,
            default:()=>{
                return true
            }
        },
        warnShow:{
            type: Boolean,
            default:()=>false
        },
    },
    computed:{
        helperData(){
            return dimensionH.dimensionData || {};
        },
        selectView(){
            let selectValue = this.selectValue;
            let selectView = null;
            let dimensionData = this.dimensionData || [];
            if(this.multiple){
                selectView = [];
                if(selectValue instanceof Array && selectValue.length){
                    selectValue = JSON.parse(JSON.stringify(selectValue));
                    for(let i = 0; i < dimensionData.length; i++){
                        let result = selectValue.indexOf(dimensionData[i].id);
                        if(result != -1){
                            selectView.push({
                                dimension_id: dimensionData[i].id,
                                id: dimensionData[i].id,
                                name: dimensionData[i][this.typeData.nameKey],
                                ...dimensionData[i]
                            });
                            selectValue.splice(result, 1);
                        }
                        if(!selectValue || selectValue.length == 0){
                            break;
                        }
                    }
                }
            } else {
                selectView = {};
                if(selectValue || selectValue == 0){
                    for(let i = 0; i < dimensionData.length; i++){
                        if(dimensionData[i].id == selectValue){
                            selectView = {
                                dimension_id: dimensionData[i].id,
                                id: dimensionData[i].id,
                                name: dimensionData[i][this.typeData.nameKey],
                                ...dimensionData[i]
                            };
                            break;
                        }
                    }
                }
                if(!selectView[this.typeData.nameKey]){
                    selectView[this.typeData.nameKey] = '';
                }
            }
            console.log("selectView", selectView)
            return selectView; 
        },
        showNum(){
            let dimensionData = this.dimensionData || [];
            let num = 0;
            dimensionData.map((item)=>{
                if(!item.isHide){
                    num++;
                }
            })
            return num;
        },
        viewStyle(){
            let dimensionData = this.dimensionData || [];
            let itemH = 42, num = 0;
            dimensionData.map((item)=>{
                if(!item.isHide){
                    num++;
                }
            })
            return num ? `height: ${ itemH * num }px` : '';
        },
        typeData() {
            return dimensionH.typeData && dimensionH.typeData[this.type] || {}
        }
    },
    methods: {
        setShowData(item){
            let showData = this.showData || []
            if(showData.length){
               return showData.indexOf(item.id) != -1
            } else {
                return true
            }
        },
        setSelect(item){
            if(this.multiple){
                if(item.id && (this.selectValue.indexOf(item.id) != -1)){
                    return true
                }
            } else {
                if(item.id && this.selectValue == item.id){
                    return true
                }
            }
        },
        clickoutside(event){
            this.visibleChange(false)
        },
        getFocus(){
            if(this.disabled) return;
            this.$refs["dropInputRef"] && this.$refs["dropInputRef"].focus();
            this.isFocus = true;
        },
        visibleChange(visible) {
            this.isVisible = visible;
            this.isFocus = false;
        },
        addEdit(){
            this.$refs["editDimensionRef"] && this.$refs["editDimensionRef"].showModal({
                editData: this.dimensionData
            });
        },
        removeValue(id){
            if(id && this.selectValue instanceof Array){
                let index = this.selectValue.indexOf(id);
                if(index != -1){
                  this.selectValue.splice(index, 1);
                    this.$nextTick(()=>{
                        this.$emit("change", this.selectValue, this.selectView);
                    })  
                }
            }
        },
        clearData(){
            if(this.multiple){
                this.selectValue = [];
            } else {
                this.selectValue = 0;
            }
            this.$nextTick(()=>{
                this.$emit("change", this.selectValue, this.selectView);
            })
        },
        inputStyle(){
            let keyWord = this.keyWord;
            if(keyWord && this.multiple){
                let len = StringH.getStrLen(keyWord)
                let width = len * 14
                return `width: ${width}px;`
            } else {
                return ""
            }
        },
        screentData(e){ // 关键词筛选
            let keyWord = (e.target && e.target.value) || "";
            this.keyWord = keyWord;
            for(let i = 0; i < this.dimensionData.length; i++){
                let dimensionItem = this.dimensionData[i] || {}
                let name = dimensionItem[this.typeData.nameKey];
                let isHide = false;
                if(name.indexOf(keyWord) != -1 || keyWord.indexOf(name) != -1){
                    isHide = false;
                } else {
                    isHide = true;
                }
                if(isHide != this.dimensionData[i].isHide){
                    this.$set(this.dimensionData[i], "isHide", isHide);
                }
            }
        },
        screentBlur(e){ // 输入关键词后恢复选择项
            if(this.multiple) { return; } 
            try {
                if(!this.keyWord){
                    let dropInputRef = this.$refs['dropInputRef'] || {};
                    dropInputRef.$refs['input'].value = this.selectView[this.typeData.nameKey];
                    dropInputRef.$refs['input']._value = this.selectView[this.typeData.nameKey];
                }
            } catch (error) {  
            }
        },
        selectDrop(item){
            if(this.multiple){
                let index = this.selectValue.indexOf(item.id);
                if(index != -1){
                    this.selectValue.splice(index, 1);
                } else if(item.id){
                    this.selectValue.push(item.id)
                }
            } else {
                this.selectValue = item.id
            }
            this.$nextTick(()=>{
                this.$emit("change", this.selectValue, this.selectView);
                if(!this.multiple){
                    this.visibleChange(false)
                }
            })
        }
    },
    watch: {
        id: {
            handler(nV) {
                if (Number(nV)) {
                    dimensionH.loadData(nV,this.type)
                } else {
                    this.dimensionData = [];
                }
            },
            immediate: true,
        },
        helperData:{
            handler(nV) {
                this.dimensionData = nV;
            },
            deep: true,
            immediate: true,
        },
        value: {
            handler(nV) {   
                if(nV instanceof Array){
                    for(let i = 0; i < nV.length; i++){
                       if(nV[i] == 0){
                            nV[i] = nV[i] + ''
                        } 
                    }
                } else {
                    if(nV == 0){
                        nV += '';
                    }
                }
                if(!nV){
                    nV = this.multiple ? [] : '0'
                }
                this.selectValue = nV;
            },
            deep: true,
            immediate: true,
        },
        multiple: {
           handler(nV) { 
               if(nV && !(this.selectValue instanceof Array)){
                   this.selectValue = [];
               }
            },
           immediate: true
        }
    },
};
</script>

<style lang="less">
@import "@/assets/css/variables.less";
.dimension-dropDown-area{
}
.dimension-dropDown {
    width: 100%;
    position: relative;
    &.warn{
        border: 1px solid red;
    }
    .dimension-dropDown-input {
        background-color:#fff;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding-right: 35px;
        transition: all .35s;
        .dropdown-icons {
            position: absolute;
            top: 50%;
            right: 0px;
            transform: translateY(-50%);
            color: #808695;
        }
        .dropdown-icon{
            cursor: pointer;
            padding: 9px;
            transition: transform 0.35s;
        }
        .dropdown-close{
            opacity: 0;
            transition: opacity 0.35s;
        }
        .rotated {
            transform: rotate(180deg);
        }
        .ivu-input{
            border: 0 none;
            outline:none;
            box-shadow: unset;
        }
        .multiple-input{
            max-width: 100%;
            width: 20px;
            // .ivu-input{
            //     outline:none;
            //     box-shadow: unset;
            // }
        }
        .ivu-tag{
            width: auto;
            height: auto;
            min-height: 22px; 
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 5px 0px;
            margin-right: 5px;
        }
        .ivu-tag-text{
            word-break: break-all;
            word-wrap: break-word;
            white-space: pre-wrap;
        }
    }
    .dimension-dropDown-input.is-focus{
        box-shadow: 0 0 0 2px rgb(45 140 240 / 20%);
    }
    .dimension-dropDown-input:hover{
        .dropdown-close{
            opacity: 1;
        }
    }
    .multiple-dropDown-input{
        padding-left: 10px;
    }
    
       
    .ivu-select-dropdown {
        width: 100%;
        left: 0px !important;
        top: 100% !important;
        padding: 0px;
        .ivu-dropdown-menu {
            .ivu-dropdown-item{
                padding: 0px;
            }
            .ivu-dropdown-item.selected{
                background-color:#fff;
                color: @link-color;
            }
            .ivu-dropdown-item-divided{
                background-color: #fff;
                margin-top: 0px;
                border: 0 none;
                border-radius: 4px;
                padding: 5px;
            }
            .ivu-dropdown-item-divided::before{
                margin: 0px;
                height: 0px;
            }
        }
    }
    
    .dropdown-item {
        padding:10px;
        display: flex;
        justify-content: space-between;
        .select-icon{
            display: none;
        }
    }
    .selected{
        .select-icon{
            display: block;
        }
    }
    .add-area {
        .add-input-area {
            display: flex;
            position: relative;
            width: 100%;
            height: 40px;
            background: #ECF8FE;
            border-radius: 4px;
            font-size: 13px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #008ACB;
            align-items: center;
            justify-content: center;
        }
        .add-btn-area.is-add {}
    }
    .dropDown-scroll{
        min-height: 50px;
        max-height: 200px;
    }
}
// .dimension-select-area{
//     .ivu-select-dropdown{

//     }
// }
</style>