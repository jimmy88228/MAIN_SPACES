<template>
    <Form class="edit-activity" :label-width="140" ref="actDetailForm" :model="actDetail" :rules="ruleValidate">
        <FormItem label="活动标题" prop="activity_name">
            <Input :disabled="!isCanEdit('activity_name')" style="width: 320px;" v-model="actDetail.activity_name" type="text" placeholder="" maxlength="30" :show-word-limit="true"></Input>
        </FormItem>
        <FormItem label="宣传图片">
            <div class="relative">
                <img-view uploadType="activity" :img="actDetail.activity_image" @selectImg="selectActImg" @delImg="removeImage"></img-view>
                <span class="notice">建议尺寸200*200px</span>
                <div v-if="!isCanEdit('activity_image')" class="fixed_click"></div>
            </div>
        </FormItem>
        <FormItem label="开始时间" prop="start_time">
            <date-time :disabled="!isCanEdit('startTime')" style="width:320px;" type="datetime" :multiple="false" v-model="actDetail.start_time"></date-time>
        </FormItem>
        <FormItem label="结束时间" prop="end_time">
            <date-time :disabled="!isCanEdit('endTime')" style="width:320px;" type="datetime" :multiple="false" v-model="actDetail.end_time"></date-time>
        </FormItem>
        <FormItem label="活动引语">
            <Input :disabled="!isCanEdit('description')" class="base-320 base-textarea" v-model="actDetail.description" type="textarea" placeholder="" maxlength="150" :show-word-limit="true"></Input>
        </FormItem>
        <FormItem label="测评量表" prop="model_id">
            <data-select :disabled="!isCanEdit('model_id')" type="inventory" v-model="actDetail.model_id" class="base-320"></data-select>
        </FormItem>
        <FormItem label="活动状态">
            <i-switch :disabled="!isCanEdit('state')" v-model="actDetail.state" size="large" :true-value="1" :false-value="0">
                <span slot="open">开启</span>
                <span slot="close">关闭</span>
            </i-switch>
        </FormItem>
        <!-- <FormItem label="指导语" prop="instruction">
            <Input :disabled="!isCanEdit('instruction')" style="width: 320px;" v-model="actDetail.instruction" type="text" placeholder="" maxlength="40" :show-word-limit="true"></Input>
        </FormItem> -->
        <FormItem label="谁可以参与" prop="join_data">
            <div class="radio-box flex-s-c">
                <div v-for="item in join_data" :key="item.key" class="radio flex-c-c pointer" :class="[actDetail.join_type == item.key?'active':'',!isCanEdit('join_data') && actDetail.join_type != item.key?'bg_f3':'']" @click="radioClick(item.key,'join_type')">
                    <div class="radio-cir"></div>
                    <div class="radio-name">{{item.name}}</div>
                </div>
            </div>
        </FormItem>
        <FormItem :label="joinName" v-show="actDetail.join_type == 'STRUCTURE' || actDetail.join_type == 'MEMBER'">
            <organizeInput
                :tagData="actDetail.join_type == 'MEMBER' ? actDetail.join_data_member :  actDetail.join_data_stc"
                :nameKey="actDetail.join_type == 'MEMBER' ? 'member_name' : 'structure_name'"
                :disabled-del="!isCanEdit('delOrgns')"
                :disabled-sel="!isCanEdit('addOrgns')"
                @handleSelect="handleSelect"
                @handleDeleteTag="handleDeleteTag">
            </organizeInput>
        </FormItem> 
        <FormItem label="报告结果是否公开">
            <div class="radio-box flex-s-c">
                <div v-for="item in is_report_open" :key="item.key" class="radio flex-c-c pointer" :class="[actDetail.is_report_open == item.key?'active':'',!isCanEdit('is_report_open') && actDetail.is_report_open != item.key?'bg_f3':'']" @click="radioClick(item.key,'is_report_open')">
                    <div class="radio-cir"></div>
                    <div class="radio-name">{{item.name}}</div>
                </div>
            </div>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="save">保 存</Button>
        </FormItem>
    </Form>
</template>

<script>
import organizeInput from '@/components/view-components/organize-input/index.vue';
export default {
    mixins: [],
    components: {
        organizeInput
    },
    data() {
        return {
            actDetail: {
                id: 0,
                state: 1,
                is_state:0,
                activity_name: "",
                dateTime: [],
                model_id: 0,
                activity_image: "",
                description: "",
                instruction: "",
                join_data:[],
                join_data_member:[],
                join_data_stc:[],
                join_type:"EVERYONE",
                is_report_open:1,
            },
            init_state:1,
            join_data:[{name:'所有人',key:'EVERYONE'},{name:'指定组织',key:'STRUCTURE'},{name:'指定人',key:'MEMBER'}],
            members_data:[],
            is_report_open:[{name:'公开',key:1},{name:'不公开',key:0}],
            ruleValidate: {
                activity_name: [
                    {
                        required: true,
                        validator: this._checkString,
                        message: "活动名称不能为空",
                        trigger: "blur",
                    },
                ],
                // instruction: [
                //     {
                //         required: true,
                //         validator: this._checkString,
                //         message: "指导语不能为空",
                //         trigger: "blur",
                //     },
                // ],
                start_time: [
                    {
                        required: true,
                        validator: this._checkString,
                        message: "请选择开始时间",
                        trigger: "change",
                    },
                ],
                end_time: [
                    {
                        required: true,
                        validator: this._checkString,
                        message: "请选择结束时间",
                        trigger: "change",
                    },
                ],
                // dateTime: [
                //     {
                //         required: true,
                //         type: "array",
                //         validator: this._checkArray,
                //         message: "活动时间不能为空",
                //         trigger: "change",
                //     },
                // ],
                model_id: [
                    {
                        required: true,
                        validator: this._checkThanInt,
                        message: "活动测评量表不能为空",
                        trigger: "blur",
                    },
                ],
                join_data: [
                    {
                        required: true,
                        validator: (rule, value, callback)=>{
                            const {
                                field
                            } = rule;
                            if(this.actDetail.join_type == 'EVERYONE' || (value.length > 0 && (value[0] || value[0] == 0))){
                                callback();
                            } else {
                                callback(field.message || '值不能为空');
                            }
                        },
                        message: `请先选择指定内容`,
                        trigger: "blur",
                    },
                ],

            },
            
        };
    },
    computed:{
        joinName(){
            return this.actDetail.join_type == "STRUCTURE" ? "指定组织" : "指定人"
        },
        // canEdit(){
        //     return this.pageQuery.id == 0 || this.actDetail.is_state == 1 || (this.actDetail.is_state != 1 && this.init_state == 0);
        // },
    },
    methods: {
        isCanEdit(type){
            let bool = true;
            if(this.pageQuery.id != 0){
                if(this.actDetail.is_state == 1){
                    bool = type == 'startTime' || type == 'endTime' || type == 'state' || type == 'addOrgns' || type == 'delOrgns' || false;
                }else if(this.actDetail.is_state == 2){
                    bool = type == 'endTime' || type == 'state' || type == 'addOrgns' ||  false;
                }else {
                    bool = false
                }
            }
            return bool
        },
        loadData() {
            let id = Number(this.pageQuery.id) || 0;
            if (!id) return;
            let req = 'appraisalActInfo'
            return this.$MainApi[req]({
                    data: {
                        id: id,
                    },
                    other: {
                        isShowLoad: true,
                        isErrorMsg: true
                    },
                })
                .then((res) => {
                    if (res.code) {
                        let data = res.data || {};
                        this.actDetail = Object.assign({},data,{dateTime:[data.start_time || "",data.end_time || ""]});
                        this.init_state = data.state;
                        this.actDetail = Object.assign(
                            {},
                            data,{dateTime:[data.start_time || "",data.end_time || ""]},
                            {   join_data_stc:data.join_type == 'STRUCTURE' ? this.filterJoinData(data.join_data,data.join_type) : [],
                                join_data_member:data.join_type == 'MEMBER' ? this.filterJoinData(data.join_data,data.join_type) : []
                            }
                        )
                        // console.log('this.actDetail',this.actDetail);
                    }
                });
        },
        filterJoinData(data,type){
            data && data.forEach(item=>{
                item.disabled = !this.isCanEdit('delOrgns');
                item.disableDel = !this.isCanEdit('delOrgns');
            })
            console.log('filterJoinData',type,data)
            return data;
        },
        save() {
            this.$refs["actDetailForm"].validate((valid) => {
                if (valid) {
                    let req = Number(this.pageQuery.id)
                        ? 'appraisalActUpdate'
                        : 'appraisalActAdd'
                    this.$MainApi[req]({
                        data: {
                            id: this.actDetail.id||0,
                            activity_name: this.actDetail.activity_name,
                            state:  this.actDetail.state,
                            model_id:  this.actDetail.model_id,
                            activity_image:  this.actDetail.activity_image||'',
                            description:  this.actDetail.description,
                            instruction: this.actDetail.instruction,
                            join_data:this.actDetail.join_type == 'EVERYONE' ? [] : this.getCurJoinData(),
                            join_type: this.actDetail.join_type,
                            is_report_open: this.actDetail.is_report_open,
                            startTime: this.actDetail.start_time,
                            endTime: this.actDetail.end_time,
                        },
                        other: { isShowLoad: true },
                    }).then((res) => {
                        if (res.code) {
                            this.$Message.success(res.message);
                            setTimeout(()=>{
                                this.$router.go(-1);
                            },500)
                        } else {
                            this.$Message.warning(res.message);
                        }
                    });
                } else {
                    this.$Message.info("请完善活动信息");
                }
            });
        },
        selectActImg(img){
            this.checkCanEdit('activity_image');
            this.actDetail.activity_image = img;
        },
        removeImage(){
            this.checkCanEdit('activity_image');
            this.actDetail.activity_image = ""; 
        },
        handleSelect(){
            let mode = '',join_type = this.actDetail.join_type;
            let props = {};
            if(join_type == 'MEMBER'){
                mode = "member-view";
                props.multiple=true;
            }else{
                mode = "organize-modal";
                props.isShowAllBtn = true;
            }
            this.$UIModule({
                mode,
                props,
                options: this.getCurJoinData('temp'),
                success:(data)=>{
                    if(data instanceof Array){
                        this.actDetail[`${join_type == 'MEMBER' ? 'join_data_member':'join_data_stc'}`] = JSON.parse(JSON.stringify(data));
                        this.actDetail.join_data = join_type == 'MEMBER' ? this.actDetail.join_data_member :  this.actDetail.join_data_stc;
                    }
                    console.log('success',data)
                }
            });
        },
        getCurJoinData(type){
            let temp = this.actDetail.join_type == 'MEMBER' ? this.actDetail.join_data_member :  this.actDetail.join_data_stc;
            if(type == 'temp'){
                return temp
            }
            return temp.map(item=>Number(item.id))
        },
        handleDeleteTag(data){
            this.checkCanEdit('delOrgns');
            this.actDetail[`${this.actDetail.join_type == 'MEMBER' ? 'join_data_member':'join_data_stc'}`] = data;
            this.actDetail.join_data = this.getCurJoinData();
        },
        radioClick(cur,key){
            this.checkCanEdit('is_report_open');
            this.actDetail[key] = cur;
            if(key == 'join_type'){
                this.actDetail.join_data = this.getCurJoinData();
            }
        },
        checkCanEdit(type=''){
            if(!this.isCanEdit(type)){
                throw new Error('不可编辑该内容');
            }
        }
    },
    mounted() {
        this.loadData();
    },
};
</script>

<style lang="less" scoped>
.edit-activity{
    .ivu-input{
        padding-right: 45px;
    } 
    .radio{
        padding: 2px 10px;
        border-radius: 2px;
        background-color: #fff;
        transition: all 0.2s;
        border: 1px solid #DDDDDD;
        margin-right: 10px;
        .radio-cir{
            width: 16px;
            height: 16px;
            background-color: #FFFFFF;
            border: 1px solid #B2B2B2;
            position: relative;
            border-radius: 50%;
            margin-right: 10px;
        }
        &.active{
            background-color: #EFFAFF;
            color: #008ACB;
            .radio-cir{
                background-color: #008ACB;
                border: 1px solid #008ACB;
                position: relative;
                &::after{
                    content: "";
                    position: absolute;
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%,-50%);
                    background-color: #fff;
                }
            }   
        }
    }
    .bg_f3{
        background: #f3f3f3;
        div{
            opacity: 0.5;
            color: #7f7f7f;
        }
    }
    .fixed_click{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 2;
    }
}
</style>