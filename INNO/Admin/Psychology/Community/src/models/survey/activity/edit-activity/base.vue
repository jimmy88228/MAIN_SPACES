<template>
    <div>
        <Form class="edit-activity" :label-width="140" ref="actDetailForm" :model="actDetail" :rules="ruleValidate" @click="adjust('toggleClose')">
            <FormItem label="活动标题" prop="activity_name">
                <!--:disabled="!isCanEdit('activity_name')"-->
                <custom-input size="large" style="width: 320px;" v-model="actDetail.activity_name" type="text" placeholder="" maxlength="30" :show-word-limit="true"></custom-input>
            </FormItem>
            <FormItem label="宣传图片">
                <div class="relative">
                    <img-view uploadType="activity" :img="actDetail.activity_image" @selectImg="selectActImg" @delImg="removeImage"></img-view>
                    <span class="notice">建议尺寸200*200px</span>
                    <!-- <div v-if="!isCanEdit('activity_image')" class="fixed_click"></div> -->
                </div>
            </FormItem>

            <FormItem label="时间限制">
                <div class="radio-box flex-s-c">
                    <div v-for="item in limitType" :key="item.key" class="radio flex-c-c pointer" :class="[actDetail.limit_time == item.key?'active':'']" @click="radioClick(item.key, 'limit_time')">
                        <div class="radio-cir"></div>
                        <div class="radio-name">{{item.name}}</div>
                    </div>
                </div>
            </FormItem>
            <template v-if="actDetail.limit_time == 1">
                <FormItem label="开始时间" prop="start_time">
                    <date-time size="large" placeholder="请选择开始时间" :limitDate="'after ' + actDetail.end_time" :disabled="!isCanEdit('startTime')" style="width:320px;" type="datetime" :multiple="false" v-model="actDetail.start_time"></date-time>
                </FormItem>
                <FormItem label="结束时间" prop="end_time">
                    <date-time size="large" placeholder="请选择结束时间" :limitDate="'before ' + actDetail.start_time" :disabled="!isCanEdit('endTime')" style="width:320px;" type="datetime" :multiple="false" v-model="actDetail.end_time"></date-time>
                </FormItem>
            </template>
            <FormItem label="测评须知">
                <custom-input size="large" :disabled="!isCanEdit('description')" class="base-260 base-textarea" v-model="actDetail.description" type="textarea" placeholder="" maxlength="150" :show-word-limit="true"></custom-input>
            </FormItem>
            <FormItem label="测评量表" prop="selectData">
                <Button :disabled="!isCanEdit('selectData')" class="m-b-20" type="default" @click="addModelList">+添加量表</Button>
                <draggable ghost-class="ghost" :list="actDetail.selectData" :group="{name:'selectData'}" handle=".drag-name" v-bind="dragOptions">
                    <div v-for="(item,index) in actDetail.selectData" :name="index" :key="index" class="drag-box flex-s-c">
                        <div class="label flex-c-c">{{index+1}}</div>
                        <div class="drag-name flex-s-c">
                            <img :src="item.cover_pic||noneCoverImg" class="img-gauge">
                            <div class="msg-box">
                                <div class="">{{item.name}}</div>
                                <div v-if="item.cover_pic" @click="chooseCover(item)" class="use-tip" :class="[actDetail.activity_image==item.cover_pic?'used':'']">{{actDetail.activity_image==item.cover_pic?'已绑定封面':'使用该封面'}}</div>
                            </div>
                            <div class="delete" @click="removeSelect(index)" v-if="isCanEdit('selectData')">
                                <div class="row"></div>
                                <div class="col"></div>
                            </div>
                        </div>
                    </div>
                </draggable>
            </FormItem>
            <!-- <FormItem label="测评量表" prop="model_id">
                <data-select :max="5" size="large" :disabled="!isCanEdit('model_id')" type="inventory" v-model="actDetail.model_id" multiple :isShowAll="false" class="base-320"></data-select>
            </FormItem> -->
            <FormItem label="活动状态">
                <i-switch :disabled="!isCanEdit('state')" v-model="actDetail.state" size="large" :true-value="1" :false-value="0">
                    <span slot="open">开启</span>
                    <span slot="close">关闭</span>
                </i-switch>
            </FormItem>
            <!-- <FormItem label="指导语" prop="instruction">
                <custom-input size="large" :disabled="!isCanEdit('instruction')" style="width: 320px;" v-model="actDetail.instruction" type="text" placeholder="" maxlength="40" :show-word-limit="true"></custom-input>
            </FormItem> -->
            <FormItem label="谁可以参与" prop="join_data">
                <div class="radio-box flex-s-c">
                    <div v-for="item in selectJoinDataView" :key="item.key" class="radio flex-c-c pointer" :class="[actDetail.join_type == item.key?'active':'',!isCanEdit('join_data') && actDetail.join_type != item.key?'bg_f3':'']" @click="radioClick(item.key,'join_type')">
                        <div class="radio-cir"></div>
                        <div class="radio-name">{{item.name}}</div>
                    </div>
                </div>
            </FormItem>
            <FormItem :label="joinName" v-show="actDetail.join_type == 'STRUCTURE' || actDetail.join_type == 'MEMBER'">
                <organizeInput :tagData="actDetail.join_type == 'MEMBER' ? actDetail.join_data_member :  actDetail.join_data_stc" :nameKey="actDetail.join_type == 'MEMBER' ? 'member_name' : 'structure_name'" :disabled-del="!isCanEdit('delOrgns')" :disabled-sel="!isCanEdit('addOrgns')" @handleSelect="handleSelect" @handleDeleteTag="handleDeleteTag">
                </organizeInput>
            </FormItem>
            <FormItem label="参与次数设置" :prop="isShowJoinMembers?'join_count':''" v-if="isShowJoinMembers">
                <template v-if="!actDetail.order_data || (actDetail.order_data && !actDetail.order_data.targetId)">
                    <div class="flex-s-c">
                        <data-select style="width:212px;" v-model="actDetail.targetId" :customData="joinMembersData" nameKey="targetName" valueKey="targetId" :isShowAll="false" size="large" :type="joinMembersData.length>0?'joinCounts':''" @changeData="changeJoinTarget"></data-select>
                        <div class="m-l-10">{{getCurJoinMsg}}</div>
                    </div>
                    <div class="flex-s-c m-t-10">
                        <custom-input :min="0" :max="(curJoinMsg && curJoinMsg.restCount)||0" size="large" style="width:212px;" v-model="actDetail.join_count" placeholder="输入可参与次数" type="number"></custom-input>
                        <div class="C_7f m-l-10">不能大于可分配量，用户先测先得</div>
                    </div>
                </template>
                <template v-else>
                    <div class="m-b-15">{{actDetail.order_data && actDetail.order_data.targetName||""}}&nbsp;&nbsp;{{getCurJoinMsg}}</div>
                    <div class="join-count-box">
                        <div class="join-count-msg flex-s-c">
                            <div class="join-count-cur">当前消耗 {{actDetail.get_limit&&actDetail.get_limit.used_count||0}}/{{actDetail.join_count||0}}</div>
                            <Button class="btn-adjust" type="default" v-if="actDetail.order_data.isOverdue != 1 && actDetail.get_limit.is_return != 1" @click="adjust('toggle')">调整</Button>

                            <div class="adjust-bg-box anim-fade-in" v-if="isShowAdjustBox">
                                <div class="adjust-box flex-c-c">
                                    <custom-input :min="0" :max="curMax" class="m-r-10 adjust-input" size="large" v-model="actDetail.input_join_count" placeholder="请输入调整的次数" type="number"></custom-input>
                                    <!-- <custom-input :min="actDetail.get_limit&&actDetail.get_limit.used_count||0" :max="curMax" class="m-r-10 adjust-input" size="large" v-model="actDetail.input_join_count" placeholder="请输入调整的次数" type="number"></custom-input> -->
                                    <Button class="btn-confirm" type="primary" :loading="$store.state.app.pageLoading" @click="adjust('confirm')">确认</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </FormItem>
            <FormItem label="报告结果是否公开">
                <div class="radio-box flex-s-c">
                    <div v-for="item in is_report_open" :key="item.key" class="radio flex-c-c pointer" :class="[actDetail.is_report_open == item.key?'active':'',!isCanEdit('is_report_open') && actDetail.is_report_open != item.key?'bg_f3':'']" @click="radioClick(item.key,'is_report_open')">
                        <div class="radio-cir"></div>
                        <div class="radio-name">{{item.name}}</div>
                    </div>
                </div>
            </FormItem>
            <FormItem label="人口学信息收集" v-if="demographicList && demographicList.length">
                <CheckboxGroup v-model="actDetail.demographic_data" class="graphic-checkboxs">
                    <Checkbox class="m-r-20 graphic-checkbox" :label="item.id" :disabled="!isCanEdit('demographic')" v-for="(item, index) in demographicList" :key="item.id">{{item.name}}</Checkbox>
                </CheckboxGroup>
            </FormItem>
            <!-- <FormItem>
                <Button type="primary" @click="save" :loading="$store.state.app.pageLoading">保 存</Button>
            </FormItem> -->
        </Form>
    </div>
</template>

<script>
import organizeInput from "@/components/view-components/organize-input/index.vue";
import draggable from "vuedraggable";
import noneCoverImg from "@/assets/images/none-cover.png"
export default {
    mixins: [],
    components: {
        organizeInput,
        draggable,
    },
    props: {
        actDetail:{
            type: Object,
            default:()=>{
                return {
                    id: 0,
                    state: 1,
                    is_state: 0,
                    activity_name: "",
                    start_time: "",
                    end_time: "",
                    dateTime: [],
                    model_id: 0,
                    activity_image: "",
                    description: "",
                    instruction: "",
                    join_data: [],
                    join_data_member: [],
                    join_data_stc: [],
                    join_type: "EVERYONE",
                    is_report_open: 1,
                    targetId: 0,
                    targetKey: "",
                    join_count: 0,
                    selectData: [],
                    // 收集人口信息
                    demographic_data: [],
                    limit_time: 0, 
                }
            }
        },
        initStartTime: String
    },
    data() {
        return {
	        init_start_time: "",
            init_state: 1,
            selectJoinData: [
                { name: "所有人", key: "EVERYONE" },
                { name: "指定组织", key: "STRUCTURE" },
                { name: "指定人", key: "MEMBER" },
            ],
            members_data: [],
            is_report_open: [
                { name: "公开", key: 1 },
                { name: "不公开", key: 0 },
            ],
            ruleValidate: {
                activity_name: [
                    {
                        required: true,
                        validator: this._checkString,
                        message: "活动名称不能为空",
                        trigger: "blur",
                    },
                ],
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
                selectData: [
                    {
                        required: true,
                        validator: this._checkArray,
                        message: "活动测评量表不能为空",
                        trigger: "change",
                    },
                ],
                join_data: [
                    {
                        required: true,
                        validator: (rule, value, callback) => {
                            const { field } = rule;
                            if (
                                this.actDetail.join_type == "EVERYONE" ||
                                (value.length > 0 &&
                                    (value[0] || value[0] == 0))
                            ) {
                                callback();
                            } else {
                                callback(field.message || "值不能为空");
                            }
                        },
                        message: `请先选择指定内容`,
                        trigger: "blur",
                    },
                ],
                join_count: [
                    {
                        required: true,
                        validator: this._checkThanInt,
                        message: "请分配有效次数",
                        trigger: "blur",
                    },
                ],
            },
            isShowAdjustBox: false,
            isShowJoinMembers: false,
            joinMembersData: [],
            curJoinMsg: {},
            // 人口收集信息
            demographicList: [],
            limitType: [
                { key: 0, name: "不限制" },
                { key: 1, name: "限制" },
            ],
            noneCoverImg,
        };
    },
    computed: {
        joinName() {
            return this.actDetail.join_type == "STRUCTURE"
                ? "指定组织"
                : "指定人";
        },
        getCurJoinMsg() {
            let order_data = this.actDetail.order_data || {};
            let arr = this.joinMembersData || [],
                result = "可分配量：0";
            let targetItem = {};
            if (order_data.targetId) {
                targetItem = order_data;
            } else {
                arr.map((item) => {
                    if (item.targetId == this.actDetail.targetId) {
                        try {
                            item = {
                                ...item,
                                ...item.detailList[0],
                            };
                            targetItem = item || {};
                        } catch (error) {}
                        return;
                    }
                });
            }
            if (targetItem.targetId) {
                this.curJoinMsg = targetItem;
                let isOverdue = targetItem.isOverdue == 1;
                result = `可分配量：${
                    isOverdue ? 0 : targetItem.restCount || 0
                } ${
                    targetItem.endDate
                        ? "（有效期至 " + targetItem.endDate + "）"
                        : ""
                } ${isOverdue ? "（已过期）" : ""}`;
            } else {
                this.curJoinMsg = {};
                this.actDetail.join_count = 0;
            }
            return result;
        },
        selectJoinDataView() {
            let selectJoinData = this.selectJoinData || [];
            let selectJoinDataView = [];
            selectJoinData.map((item) => {
                if (this._isSuperIds == 1 && item.key == "EVERYONE") {
                    return;
                }
                selectJoinDataView.push(item);
            });
            return selectJoinDataView;
        },
        dragOptions() {
            return {
                animation: 200,
                group: "description",
                disabled: !this.isCanEdit("selectData"),
                ghostClass: "ghost",
            };
        },
        curMax() {
            let actDetail = this.actDetail || {};
            let restCount =
                (actDetail.order_data && actDetail.order_data.restCount) || 0;
            let total_count =
                (actDetail.get_limit && actDetail.get_limit.total_count) || 0;
            return restCount + total_count;
        },
    },
    methods: {
        initData(){},
        isCanEdit(type) {
            let bool = true;
            let actDetail = this.actDetail || {};
            if (this.pageQuery.id != 0) {
                if (actDetail.is_state == 1) {
                    bool =
                        type == "startTime" ||
                        type == "demographic" ||
                        type == "endTime" ||
                        type == "state" ||
                        type == "addOrgns" ||
                        type == "delOrgns" ||
                        type == "limit_time" ||
                        type == "description" ||
                        false;  
                } else if (actDetail.is_state == 2 || actDetail.is_state == 0) {
                    bool =
		    	        (type=='startTime' && !this.init_start_time) ||
                        type == "endTime" ||
                        type == "state" ||
                        type == "addOrgns" ||
                        type == "limit_time" ||
                        type == "description" ||
                        false;
                } else {
                    bool = type == "description" || false;
                }
            }
            return bool;
        },
        // loadData() {
        //     let id = Number(this.pageQuery.id) || 0;
        //     if (!id) return;
        //     let req = "appraisalActInfo";
        //     return this.$MainApi[req]({
        //         data: {
        //             id: id,
        //         },
        //         other: {
        //             isShowLoad: true,
        //         },
        //     }).then((res) => {
        //         if (res.code) {
        //             let data = res.data || {};
        //             this.actDetail = Object.assign({}, data, {
        //                 dateTime: [data.start_time || "", data.end_time || ""],
        //             });
        //             this.init_state = data.state;
        //             let get_model = data.get_model || [];
        //             this.actDetail = Object.assign({}, data, {
        //                 dateTime: [data.start_time || "", data.end_time || ""],
        //                 join_data_stc:
        //                     data.join_type == "STRUCTURE"
        //                         ? this.filterJoinData(
        //                               data.join_data,
        //                               data.join_type
        //                           )
        //                         : [],
        //                 join_data_member:
        //                     data.join_type == "MEMBER"
        //                         ? this.filterJoinData(
        //                               data.join_data,
        //                               data.join_type
        //                           )
        //                         : [],
        //                 join_count:
        //                     (data.get_limit && data.get_limit.total_count) || 0,
        //                 input_join_count:
        //                     (data.get_limit && data.get_limit.total_count) || 0,
        //                 orderId:
        //                     (data.get_limit && data.get_limit.order_id) || 0,
        //                 model_id: get_model.map((item) => item.model_id),
        //                 selectData: get_model.sort((a, b) => {
        //                     return a.sort - b.sort;
        //                 }),
        //             });
        //             this.$set(
        //                 this.actDetail,
        //                 "targetKey",
        //                 (data.order_data && data.order_data.targetKey) || ""
        //             );
        //         }
        //      this.init_start_time = this.actDetail.start_time;
        //     });
        // },
        loadDemographicList() {
            return this.$MainApi
                .getDemographicList({
                    data: {},
                    other: {
                        isErrorMsg: true,
                    },
                })
                .then((res) => {
                    if (res.code) {
                        this.demographicList =
                            (res.data && res.data.items) || [];
                    }
                });
        },
        filterJoinData(data, type) {
            data &&
                data.forEach((item) => {
                    item.disabled = !this.isCanEdit("delOrgns");
                    item.disableDel = !this.isCanEdit("delOrgns");
                });
            return data;
        },
        changeJoinTarget(data) {
            this.actDetail.targetKey = data.targetKey || "";
        },
        save() {
            return new Promise((rs, rj)=>{
              this.$refs["actDetailForm"].validate((valid) => {
                if (valid) {
                    let req = Number(this.pageQuery.id)
                        ? "appraisalActUpdate"
                        : "appraisalActAdd";
                    let actDetail = this.actDetail || {};
                    this.$MainApi[req]({
                        data: {
                            id: actDetail.id || 0,
                            activity_name: actDetail.activity_name,
                            state: actDetail.state,
                            model_id: actDetail.selectData.map(
                                (item) => item.id
                            ),
                            activity_image: actDetail.activity_image || "",
                            description: actDetail.description,
                            instruction: actDetail.instruction,
                            join_data:
                                actDetail.join_type == "EVERYONE"
                                    ? []
                                    : this.getCurJoinData(),
                            join_type: actDetail.join_type,
                            is_report_open: actDetail.is_report_open,
                            startTime: actDetail.start_time,
                            endTime: actDetail.end_time,
                            order_id:
                                this.curJoinMsg.orderId ||
                                actDetail.orderId ||
                                0,
                            order_total_count: actDetail.join_count || 0,
                            target_key:
                                actDetail.targetKey ||
                                (actDetail.order_data &&
                                    actDetail.order_data.targetKey) ||
                                "",
                            demographic_data: actDetail.demographic_data || [],
                            limit_time: actDetail.limit_time || 0,
                        },
                        other: { isShowLoad: true },
                    }).then((res) => {
                        if (res.code) {
                          let data = res.data || {};
                          if(data.id){
                            this.$router.replace({
                              name: this.$route.name,
                              query: {
                                    ...this.pageQuery,
                                    ...this.pageParams,
                                    id: data.id || 0,
                                    $isReplace: true
                                },
                            })
                            this.$emit("saveCallback", data)
                          }
                          return rs();
                        } else {
                          this.$Message.warning(res.message||"数据异常");
                          return rj();
                        }
                    }).catch(()=>{
                      return rj();
                    })
                } else {
                    this.$Message.info("请完善活动信息");
                    return rj();
                }
            });
          })
        },
        selectActImg(img) {
            this.actDetail.activity_image = img;
        },
        removeImage() {
            this.actDetail.activity_image = "";
        },
        handleSelect() {
            let mode = "",
                join_type = this.actDetail.join_type;
            let props = {};
            if (join_type == "MEMBER") {
                mode = "group-member-view";
                props.multiple = true;
            } else {
                mode = "organize-modal";
                props.isShowAllBtn = true;
                props.isLImitMain = true;
            }
            this.$UIModule({
                mode,
                props,
                options: this.getCurJoinData("temp"),
                success: (data) => {
                    if (data instanceof Array) {
                        this.actDetail[
                            `${
                                join_type == "MEMBER"
                                    ? "join_data_member"
                                    : "join_data_stc"
                            }`
                        ] = JSON.parse(JSON.stringify(data));
                        this.actDetail.join_data =
                            join_type == "MEMBER"
                                ? this.actDetail.join_data_member
                                : this.actDetail.join_data_stc;
                    }
                },
            });
        },
        getCurJoinData(type) {
            let temp =
                this.actDetail.join_type == "MEMBER"
                    ? this.actDetail.join_data_member
                    : this.actDetail.join_data_stc;
            if (type == "temp") {
                return temp;
            }
            return temp.map((item) => Number(item.id));
        },
        handleDeleteTag(data) {
            this.checkCanEdit("delOrgns");
            this.actDetail[
                `${
                    this.actDetail.join_type == "MEMBER"
                        ? "join_data_member"
                        : "join_data_stc"
                }`
            ] = data;
            this.actDetail.join_data = this.getCurJoinData();
        },
        radioClick(cur, key) {
            this.checkCanEdit(key);
            this.actDetail[key] = cur;
            if (key == "join_type") {
                this.actDetail.join_data = this.getCurJoinData();
            }
        },
        checkCanEdit(type = "") {
            if (!this.isCanEdit(type)) {
                this.$Message.warning("不可编辑该内容");
                throw new Error("不可编辑该内容");
            }
        },
        addModelList() {
            this.$UIModule({
                mode: "gauge-modal",
                props: {
                    multiple: true,
                    title: "量表",
                    type: "inventory",
                },
                options: this.actDetail.selectData,
                success: (data) => {
                    if(!this.actDetail.activity_image && data && data.length>0){
                        for(let i = 0,len=data.length;i<len;i++){
                            let item = data[i]||{};
                            if(item.cover_pic){
                                this.actDetail.activity_image = item.cover_pic;
                                break;
                            }
                        } 
                    }
                    this.actDetail.selectData = data;
                },
            });
        },
        removeSelect(index) {
            this.$delete(this.actDetail.selectData, index);
        },
        adjust(type) {
            let used_count =
                (this.actDetail.get_limit &&
                    this.actDetail.get_limit.used_count) ||
                0;
            let input_join_count = this.actDetail.input_join_count || 0;
            if (input_join_count < used_count) {
                this.$Message.warning(`调整的值不能小于${used_count}`);
                return;
            }
            if (type == "toggle") {
                this.isShowAdjustBox = !!!this.isShowAdjustBox;
            } else if (type == "toggleClose") {
                this.isShowAdjustBox = false;
            } else if (type == "confirm") {
                this.isShowAdjustBox = false;
                this.actDetail.join_count =
                    this.actDetail.input_join_count || 0;
            }
        },
        getActivityMemberConfig() {
            return this.$MainApi
                .getActivityMemberConfig({
                    data: {},
                    other: { isShowLoad: false },
                })
                .then((res) => {
                    if (res.code) {
                        let data = res.data || {};
                        if (data.isLimitCount == 1) {
                            this.isShowJoinMembers = true;
                            return res;
                        }
                    }
                    return Promise.reject();
                });
        },
        getActivityMemberList() {
            return this.$MainApi
                .getActivityMemberList({
                    data: {},
                    other: { isShowLoad: false },
                })
                .then((res) => {
                    if (res.code) {
                        let data = res.data || [];
                        this.joinMembersData = data;
                    }
                });
        },
        init() {
            if (this._isSuperIds == 1) {
                this.actDetail.join_type = "";
            }
            this.getActivityMemberConfig().then(() => {
                this.getActivityMemberList();
            });
        },
        chooseCover(item){
            if(item.cover_pic){
                this.actDetail.activity_image = item.cover_pic
            }
        }
    },
    mounted() {
        this.init();
        // this.loadData();
        this.loadDemographicList();
    },
    watch: {
        initStartTime:{
            handler:function(nV){
                this.init_start_time = nV;
            },
            immediate: true
        }
    }
};
</script>

<style lang="less" scoped>
.edit-activity {
    .ivu-input {
        padding-right: 45px;
    }
    .radio {
        padding: 2px 10px;
        border-radius: 2px;
        background-color: #fff;
        transition: all 0.2s;
        border: 1px solid #dddddd;
        margin-right: 10px;
        .radio-cir {
            width: 16px;
            height: 16px;
            background-color: #ffffff;
            border: 1px solid #b2b2b2;
            position: relative;
            border-radius: 50%;
            margin-right: 10px;
        }
        &.active {
            background-color: #effaff;
            color: #008acb;
            .radio-cir {
                background-color: #008acb;
                border: 1px solid #008acb;
                position: relative;
                &::after {
                    content: "";
                    position: absolute;
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    background-color: #fff;
                }
            }
        }
    }
    .bg_f3 {
        background: #f3f3f3;
        div {
            opacity: 0.5;
            color: #7f7f7f;
        }
    }
    .fixed_click {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 2;
    }
    .drag-box {
        margin-bottom: 8px;
    }
    .label {
        width: 49px;
        height: 49px;
        border: 1px solid #dddddd;
        margin-right: 7px;
    }
    .drag-name {
        // display: inline-block;
        position: relative;
        min-width: 180px;
        padding:0 5px;
        min-height: 49px;
        background: #effaff;
        border-radius: 2px;
        border: 1px solid #dddddd;
        color: #0083ce;
        line-height: normal;
        font-size: 13px;
        cursor: move;
        .delete {
            cursor: pointer;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background-color: rgba(0, 0, 0, 0.8);
            position: absolute;
            top: -6px;
            right: -8px;
            // transform: rotate(-45deg) translateY(-50%);
            .row,
            .col {
                top: 50%;
                left: 50%;
                transform:translate(-50%, -50%) rotate(45deg);
                background-color: #fff;
                position: absolute; 
            }
            .row {
                width: 70%;
                height: 1px;
            }
            .col {
                height: 70%;
                width: 1px;
            }
        }
        &:hover {
            .delete {
                display: block;
            }
        }
    }
    .img-gauge{
        width: 37px;
        height: 37px;
        margin-right: 6px;
    }
    .use-tip{
        cursor: pointer;
        text-decoration: underline;
        font-size: 12px;
        margin-top: 3px;
        &.used{
            cursor: unset;
            color:#7f7f7f;
            text-decoration: unset;
        }
    }
    .graphic-checkboxs {
        .graphic-checkbox {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #515a6e;
            line-height: 20px;
        }
    }
    .join-count-box {
        margin-top: 15px;
        height: 44px;
        position: relative;
    }
    .join-count-msg {
        position: relative;
        display: inline-flex;
        height: 100%;
        background: #ffffff;
        border-radius: 2px;
        border: 1px solid #dddddd;
        box-sizing: border-box;
        padding: 0 15px;
    }
    .join-count-cur {
        width: 170px;
    }
    .adjust-bg-box {
        z-index: 1;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 105%);
        background-color: rgba(0, 0, 0, 0.34);
        padding: 12px;
        border-radius: 4px;
        &::after {
            content: "";
            position: absolute;
            top: 0;
            right: 50px;
            transform: translateY(-97%);
            width: 0;
            height: 0;
            border: 8px solid transparent;
            border-bottom-color: rgba(0, 0, 0, 0.34);
        }
    }
    .adjust-box {
        background-color: #fff;
        padding: 7px 8px;
        border-radius: 6px;
    }
    .adjust-input {
        width: 170px;
        border: none;
        font-size: 14px;
    }
    .btn-confirm,
    .btn-adjust {
        width: 56px;
        height: 30px;
        border-radius: 2px;
        padding: 0;
    }
    .btn-adjust {
        // border: 1px solid #DDDDDD;
        color: rgb(45, 140, 240);
    }
}
</style>