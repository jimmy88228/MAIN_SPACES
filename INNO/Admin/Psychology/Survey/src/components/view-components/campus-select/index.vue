<template>
    <Dropdown :class="['campus-dropDown',disabled && 'disabled']" trigger="click"  :transfer="transfer" @on-visible-change="visibleChange" @on-click="selectDrop">
        <div class="campus-dropDown-input" v-if="!disabled">
            <Input ref="dropInputRef" :placeholder="placeholder" :value="valueName" @on-change="screentData" @on-blur="screentBlur"></Input>
            <Icon class="dropdown-icon" :class="{'rotated': isVisible}" type="ios-arrow-down"></Icon>
        </div>
        <div style="padding-top:1px" v-else>{{valueName}}</div>
        <DropdownMenu slot="list" class="campus-dropDownMenu">
            <div class="dropDown-scroll" v-bar :style="viewStyle">
                <div>
                    <DropdownItem 
                    v-for="(item, index) in dropData" 
                    :key="item.campus_id" 
                    v-show="!item.isHide" 
                    :name="item.campus_id"
                    :class="{'selected': value == item.campus_id}">
                        <div class="dropdown-item ">
                            <template v-if="item.isEdit">
                                <div class="item-line" @click.stop="">
                                    <custom-input regType="validate" class="item-input" :ref="'dropInput' + item.campus_id" v-model="item.campus_name" @on-enter="confirmEditItem(item, index)" @on-blur="confirmEditItem(item, index)"></custom-input>
                                </div>
                            </template>
                            <template v-else>
                                <div class="item-line">
                                    <div class="item-input-view w-break">{{item.campus_name}}</div>
                                    <Icon v-if="!hideEdit" class="item-icon f-shrink0" type="md-create" @click.stop="editItem(index)" />
                                </div>
                            </template>
                        </div>
                    </DropdownItem>
                    <div v-if="showNum == 0" class="invalid text-c" style="padding-top: 70px;">
                        暂无数据，可自行添加
                    </div>
                </div>
            </div>
            <DropdownItem divided name="add" v-if="!hideEdit">
                <div class="add-area" @click.stop="">
                    <div class="add-input-area">
                        <custom-input regType="validate" type="textarea" v-model="addData.campusName" class="add-input" :class="{'hide':!isAdd}" placeholder=""></custom-input>
                        <a class="add-btn" :class="{ 'is-add': isAdd }" @click="addEvent">{{isAddTxt ? '确定' : '+添加'}}</a>
                    </div>
                </div>
            </DropdownItem>
        </DropdownMenu>
    </Dropdown>
</template>

<script>
export default {
    data() {
        return {
            isVisible: false,
            isAdd: false,
            isAddTxt: false,
            addLoading: false,
            keyWord: "",
            dropData: [],
            loadDataHold: null,
            addData: {
                campusName: ""
            },
            showNum: 0,
        };
    },
    model: {
        prop: "value",
        event: "change",
    },
    props: {
        value: {
            type: String | Number,
            default() {
                return 0;
            },
        },
        schoolId: {
            type: Number,
            default: 0,
        },
        transfer: {
            type: Boolean,
            default: false
        },
        placeholder: String,
        hideEdit:{
            type:Boolean,
            default:false
        },
        disabled:{
            type:Boolean,
            default:false
        }
    },
    computed:{
        valueName(){
            let value = this.value;
            let name = "";
            if(value && value != 0){
                for(let i = 0; i < this.dropData.length; i++){
                    if(this.dropData[i].campus_id == value){
                        name = this.dropData[i].oldName || "";
                        break;
                    }
                }
            }
            return name; 
        },
        viewStyle(){
            let dropData = this.dropData || [];
            let itemH = 42, num = 0;
            dropData.map((item)=>{
                if(!item.isHide){
                    num++;
                }
            })
            this.showNum = num;
            return num ? `height: ${ itemH * num }px` : '';
        }
    },
    methods: {
        visibleChange(visible) {
            this.isVisible = visible;
        },
        addEvent() {
            this.isAdd = !this.isAdd;
            if (this.isAdd) {
                setTimeout(() => {
                    this.isAddTxt = true;
                }, 350);
            } else {
                let campusName = this.addData.campusName || "";
                this.addCampus(campusName).finally(()=>{
                    this.addData.campusName = "";
                    this.isAddTxt = false;
                })
            }
        },
        editItem(editIndex) {
            this.dropData.map((item, index)=>{
                if(index == editIndex){
                    item.isEdit = true;
                } else {
                    item.isEdit = false;
                }
                return item;
            })
        },
        confirmEditItem(item, index) {
            console.log('item, index',item.campus_name,item, index)
            this.updateCampus(item, index).finally(()=>{
                this.$set(this.dropData[index], "isEdit", false);
            })
        },
        screentData(e){ // 关键词筛选
            console.log('ee',e)
            let keyWord = e.target.value || "";
            this.keyWord = keyWord;
            for(let i = 0; i < this.dropData.length; i++){
                let campusItem = this.dropData[i] || {}
                let campus_name = campusItem.campus_name;
                let isHide = false;
                if(campus_name.indexOf(keyWord) != -1 || keyWord.indexOf(campus_name) != -1){
                    isHide = false;
                } else {
                    isHide = true;
                }
                if(isHide != this.dropData[i].isHide){
                    this.$set(this.dropData[i], "isHide", isHide);
                }
            }
        },
        screentBlur(e){ // 输入关键词后恢复选择项
            try {
               let dropInputRef = this.$refs['dropInputRef'] || {};
                dropInputRef.$refs['input'].value = this.valueName;
                dropInputRef.$refs['input']._value = this.valueName; 
            } catch (error) {
                
            }
            
        },
        selectDrop(id){
            if(id == 'add') return;
            this.$emit("change", id || 0);
            let data = this.dropData.filter((item)=>{
                return item.campus_id == id
            })
            this.$emit("changeData", data[0] || {});
        },
        onLoadData(schoolId) {
            if (!schoolId) return Promise.reject();
            if (this.loadDataHold) {
                return this.loadDataHold;
            }
            this.loadDataHold = this.$MainApi
                .adminCampusData({
                    data: {
                        school_id: schoolId,
                    },
                })
                .then((res) => {
                    if (res.code) {
                        let data = res.data || {};
                        let items = data.items || [];
                        for(let i = 0; i < items.length; i++){
                            items[i].oldName = items[i].campus_name;
                            items[i].isEdit = false;
                            items[i].loading = false;
                        }
                        this.dropData = items;
                    }
                });
            return this.loadDataHold;
        },
        addCampus(campus_name) {
            if(!campus_name) return Promise.reject();
            if(!Number(this.schoolId)) return Promise.reject();
            return this.$MainApi
                .addCampus({
                    data: {
                        school_id: this.schoolId,
                        campus_name: campus_name
                    },
                })
                .then((res) => {
                    if (res.code) {
                        let data = res.data || {};
                        let campus_id = data.campus_id || 0;
                        if(campus_id){
                            this.dropData.push({
                                campus_id: campus_id,
                                campus_name: campus_name,
                                oldName:campus_name,
                                isEdit:false,
                                loading:false,
                            })
                            this.$Message.success(res.message || "添加成功")
                        }
                    } else {
                        this.$Message.warning(res.message || "添加失败")
                    }
                });
        },
        updateCampus(row, index) {
            if(!row.campus_name) {
                this.$Message.warning("名称不能为空");
                return Promise.reject();
            } else if(row.campus_name == row.oldName){// 未改变，不做变更
                return Promise.resolve();
            }
            if(!Number(this.schoolId)) return Promise.reject();
            return this.$MainApi
                .updateCampus({
                    data: {
                        school_id: this.schoolId,
                        campus_id: row.campus_id,
                        campus_name: row.campus_name
                    },
                })
                .then((res) => {
                    if (res.code) {
                        this.$Message.success(res.message || "编辑成功")
                        this.$set(this.dropData[index], "oldName", row.campus_name);
                    } else {
                        this.$Message.warning(res.message || "编辑失败")
                        this.$set(this.dropData[index], "campus_name", row.oldName);
                    }
                });
        },
    },
    watch: {
        schoolId: {
            handler(nV) {
                if (nV) {
                    this.onLoadData(nV);
                } else {
                    this.dropData = [];
                }
            },
            immediate: true,
        },
    },
};
</script>

<style lang="less">
@import "@/assets/css/variables.less";
.campus-dropDown {
    position: relative;
    .campus-dropDown-input {
        .dropdown-icon {
            position: absolute;
            top: 50%;
            right: 0px;
            transform: translateY(-50%);
            color: #808695;
            padding: 9px;
            transition: transform 0.35s;
        }
        .rotated {
            transform: translateY(-50%) rotate(180deg);
        }
    }
    .ivu-select-dropdown {
        width: 100%;
        left: 0px !important;
        padding: 0px;
        .ivu-dropdown-menu {
            .ivu-dropdown-item{
                padding: 5px 15px;
            }
            .ivu-dropdown-item.selected{
                background-color:#F2F2F2;
                color: @link-color;
            }
            .ivu-dropdown-item-divided{
                background-color: #F2F2F2;
                margin-top: 0px;
            }
            .ivu-dropdown-item-divided::before{
                margin: 0px;
                height: 0px;
            }
        }
    }
    
    .dropdown-item {
        .item-line {
            width: 100%;
            display: flex;
            align-items: center;
            .item-input {
                flex: 1;
                margin-right: 5px;
            }
            .item-input-view{
                flex: 1;
                line-height: 32px;
                margin-right: 5px;
            }
            .item-icon {
                padding: 0px 10px;
                line-height: 22px;
            }
        }
    }
    .add-area {
        margin: 0px -5px;
        .add-input-area {
            display: flex;
            position: relative;
            width: 100%;
            padding-right: 55px;
            .add-input {
                width: 100%;
                &.hide{
                    width: 0;
                    opacity: 0;
                }
                .ivu-input {
                    height: 32px;
                    min-height: 32px;
                }
            }
            .add-btn {
                position: absolute;
                top: 0px;
                right: 0px;
                width: 100%;
                height: 32px;
                background-color: #F2F2F2;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.35s;
                border: 1px solid #F2F2F2;
                border-radius: 4px;
            }
            .add-btn.is-add {
                width: 50px;
                border-color: #ddd;
                background-color:#fff;
            }
        }
        // .add-btn-area{
        //     position:absolute;
        //     top:0px;
        //     left:0px;
        //     background-color:#fff;
        //     width:100%;
        //     height:100%;
        //     .add-btn{
        //         position:absolute;
        //         top: 50%;
        //         left: 50%;
        //         transform: translate(-50%, -50%);
        //         border: none;
        //     }
        // }
        .add-btn-area.is-add {}
    }
    .dropDown-scroll{
        height: calc(100vh - 700px);
        min-height: 190px;
        max-height: calc(100vh - 500px);
    }
}
</style>