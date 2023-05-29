<template>
    <div>
        <rewrite-drawer v-model="drawerShow" :inner="true" :width="420">
            <div class="bold" slot="header">{{title}}</div>
            <div class="edit-cont-area">
                <Form :label-width="70" :model="classInfo" ref="formDataRef" :rules="ruleValidate">
                    <drawerForm>
                        <div slot="title">
                            班级信息
                        </div>
                        <div slot="content">
                            <FormItem label="所属学校">{{classInfo.school_name}}</FormItem>
                            <FormItem :label="'校区'" prop="campus_id">
                                <campusSelect class="base-320" :hideEdit="true" v-model="classInfo.campus_id"
                                    :schoolId="classInfo.school_id" @changeData="getChangeCampus"></campusSelect>
                            </FormItem>
                            <!-- <FormItem label="年级" prop="grade_id">
                                <Select class="base-320" v-model="classInfo.grade_id" @on-change="changeGrade">
                                    <Option :value="id" v-for="(item, id) in gradeData" :key="id">{{item}}</Option>
                                </Select>
                            </FormItem> -->
                            <FormItem label="年级" prop="grade_index">
                                <Select class="base-320" v-model="classInfo.grade_index" @on-change="changeGrade">
                                    <Option :value="id" v-for="(item, id) in gradeData" :key="id">{{item.grade}}（{{item.school_year}}）</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="班级" prop="class_name">
                                <div class="input-box">
                                    <custom-input isInt class="base-320" :value="classInfo.class_name" type="number"
                                        @on-change="changeClass"></custom-input>
                                    <div class="class_name">班</div>
                                </div>
                            </FormItem>
                            <FormItem label="班主任" v-if="classInfo.class_id">
                                <div class="admin-area flex-s-c base-320">
                                    <div class="admin-list f-wrap">
                                        <div class="admin-item" v-for="(item, index) in adminList" :key="index">
                                            {{item.name}}
                                        </div>
                                    </div>
                                    <a class="add-admin" @click="bindAdmin()">更改</a>
                                </div>
                            </FormItem>
                        </div>
                    </drawerForm>
                </Form>
            </div>
            <div slot="footer">
                <Button class="m-r-10" type="primary" @click="checkClassInfo">保存</Button>
                <Button @click="confirmUpdate">取消</Button>
            </div>
        </rewrite-drawer>
        <!-- <Drawer :transfer="false" class="page-drawer-area" :inner="true" :closable="false" v-model="drawerShow" :width="430">
            <div class="class-edit-area" :style="'padding-top:' +  _pageScrollTop + 'px;'" v-bar>
                <div>
                    <div class="edit-title bold">{{title}}</div>
                    <div class="edit-cont">
                        <div class="edit-cont-area">
                            <Form :label-width="70" :model="classInfo" ref="formDataRef" :rules="ruleValidate">
                                <FormItem label="所属学校">{{classInfo.school_name}}</FormItem>
                                <FormItem label="年级" prop="grade_id">
                                    <Select class="base-320" v-model="classInfo.grade_id" @on-change="changeGrade">
                                        <Option :value="id" v-for="(item, id) in gradeData" :key="id">{{item}}</Option>
                                    </Select>
                                </FormItem>
                                <FormItem label="班级" prop="class_name">
                                    <div class="input-box">
                                        <custom-input isInt class="base-320" :value="classInfo.class_name" type="number" @on-change="changeClass"></custom-input>
                                        <div class="class_name">班</div>
                                    </div>
                                </FormItem>
                                <FormItem :label="'校区'" prop="campus_id">
                                    <campusSelect class="base-320" 
                                    v-model="classInfo.campus_id" :schoolId="classInfo.school_id" @changeData="getChangeCampus"
                                    ></campusSelect>
                                </FormItem>
                                <FormItem label="班主任" v-if="classInfo.class_id">
                                    <div class="admin-area flex-s-c base-320">
                                        <div class="admin-list f-wrap">
                                            <div class="admin-item" v-for="(item, index) in adminList" :key="index">
                                                {{item.name}}
                                            </div>
                                        </div>
                                        <a class="add-admin" @click="bindAdmin()">更改</a>
                                    </div>
                                </FormItem>
                            </Form>
                            <div class="edit-foot">
                                <Button class="m-r-10" type="primary" @click="checkClassInfo">保存</Button>
                                <Button @click="confirmUpdate">取消</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Drawer> -->
        <bindAdmin ref="bindAdminRef"></bindAdmin>
    </div>
</template>

<script>
    import drawerForm from "@/components/view-components/drawer-form/index.vue";
    import campusSelect from "@/components/view-components/campus-select/index";
    import bindAdmin from "./bind-admin/index";
    export default {
        name: "editClassMaint",
        components: {
            drawerForm,
            campusSelect,
            bindAdmin,
        },
        props: {
            title: {
                type: String,
                default: "标题",
            },
            // gradeData: {
            //     type: Array,
            //     default: () => {
            //         return [];
            //     },
            // },
        },
        computed: {
            className() {
                let name = this.classInfo && this.classInfo.class_name || "";
                name = name.indexOf('班') == -1 ? name + '班' : name
                return name
            }
        },
        data() {
            return {
                drawerShow: false,
                adminList: [],
                classInfo: {
                    grade_id: 0,
                    class_id: 0,
                    school_id: 0,
                    grade_name: "",
                    class_name: "",
                    campus_id: 0,
                    campus_name: "",
                    school_year:0,
                    grade_index:"",
                },
                ruleValidate: {
                    grade_index: [{
                        required: true,
                        validator: this._checkInt,
                        trigger: "change",
                        message: "请选择年级",
                    }, ],
                    class_name: [{
                        required: true,
                        validator: this._checkString,
                        message: "请填写班级",
                        trigger: "blur",
                    }, ],
                    campus_id: [{
                        required: true,
                        validator: this._checkThanInt,
                        trigger: "change",
                        message: "请选择校区",
                    }, ],
                    school_year: [{
                        required: true,
                        validator: this._checkThanInt,
                        trigger: "change",
                        message: "请选择学年",
                    }, ],
                },
                gradeData:[],
            };
        },
        provide: {
            classInfo: () => {
                return this.classInfo;
            },
        },
        methods: {
            showDrawer(classInfo = {}) {
                this.drawerShow = true;
                this.$refs["formDataRef"] && this.$refs["formDataRef"].resetFields();
                let _classInfo = {
                    ...classInfo,
                    grade_id: typeof (classInfo.grade_id) == 'undefined' ? '' : classInfo.grade_id,
                    school_id: classInfo.school_id || this._getReqStructureId,
                    get_admin: classInfo.get_admin || [],
                    school_name: classInfo.school_name || this._structureName,
                    campus_name: classInfo.campus || "",
                    grade_name: classInfo.grade || "",
                    class_name: classInfo.class || "",
                    campus_id: classInfo.campus_id || 0,
                    school_year: classInfo.school_year || 0,
                }
                this.classInfo = _classInfo;
                this.adminList = this.installAdmin(this.classInfo.get_admin);
            },
            installAdmin(data) {
                let arr = [];
                for (let i = 0; i < data.length; i++) {
                    let get_user = data[i].get_user || {};
                    let item = {
                        id: data[i].admin_id,
                        name: get_user.user_name,
                    };
                    arr.push(item);
                }
                return arr;
            },
            loadSchoolGradeData(){
                return this.$MainApi
                .getSchoolGradeData({
                    data: {
                        school_id:this.classInfo.school_id,
                        campus_id:this.classInfo.campus_id
                    },
                })
                .then((res) => {
                    if (res.code) {
                        let data = res.data || {};
                        this.gradeData = data.items || [];
                        return data.items
                    }
                });
            },
            changeGrade(data) {
                let grade_index = this.classInfo?.grade_index;
                let gradeData = this.gradeData || [];
                let {school_year,grade} = gradeData[grade_index] || {}
                console.log(grade_index,gradeData,"school_year,grade")
                console.log(school_year,grade,"school_year,grade")
                this.$nextTick(()=>{
                    this.$set(this.classInfo, "school_year", school_year || '')
                    this.$set(this.classInfo, "grade_name", grade || '')
                })
            },
            getChangeCampus(data) {
                this.classInfo.campus_name = data.campus_name || "";
                this.loadSchoolGradeData()
            },
            changeClass(data) {
                this.classInfo.class_name = typeof (data) == 'string' ? data : data + "";
            },
            removeAdmin() {},
            bindAdmin() {
                this.$refs["bindAdminRef"] &&
                    this.$refs["bindAdminRef"].showModal({
                        classId: this.classInfo.class_id || 0,
                        className: this.className || "",
                        // className: this.classInfo.class_name || "",
                        confirm: (data) => {
                            this.bindAdminEvent(data);
                        },
                    });
            },
            bindAdminEvent(data) {
                if (data.length > 0) {
                    let arr = [];
                    for (let i = 0; i < data.length; i++) {
                        arr.push({
                            id: data[i].admin_id,
                            name: data[i].admin_name,
                        });
                    }
                    this.adminList = arr;
                } else {
                    this.adminList = [];
                }
            },
            checkClassInfo() {
                this.$refs["formDataRef"].validate((valid) => {
                    if (valid) {
                        this.updateclassInfo();
                    } else {
                        this.$Message.warning("请完善信息");
                    }
                });
            },
            updateclassInfo() {
                let classInfo = this.classInfo || {};
                !Number(classInfo.class_id) && delete classInfo.class_id;
                let req = Number(classInfo.class_id) ?
                    "updateClassMaint" :
                    "addClassMaint";
                this.pageLoading = true;
                return this.$MainApi[req]({
                        data: {
                            class_id: classInfo.class_id,
                            school_id: classInfo.school_id,
                            grade_name: classInfo.grade_name,
                            class_name: this.className,
                            campus_id: classInfo.campus_id,
                            campus_name: classInfo.campus_name,
                            school_year: classInfo.school_year,
                        },
                    })
                    .then((res) => {
                        if (res.code) {
                            this.$Message.success(res.message || "操作成功");
                            this.confirmUpdate();
                        } else {
                            this.$Message.warning(res.message || "操作失败");
                        }
                    })
                    .finally(() => {
                        this.pageLoading = false;
                    });
            },
            confirmUpdate() {
                this.drawerShow = false;
                this.$emit("confirm");
            },
        },
        mounted() {},
    };
</script>

<style lang="less" scoped>
    @import "@/assets/css/variables.less";

    .page-drawer-area {
        .edit-cont-area {
            border: 0 !important;
        }

        .admin-area {
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 5px;
            min-height: 32px;
            line-height: 1.5;
            padding: 4px 7px;

            .admin-list {
                display: flex;
                width: 100%;
                padding-right: 10px;
                min-height: 100%;

                .admin-item {
                    padding: 0px 10px;
                    line-height: 1.5;
                    color: @primary-color;
                    border: 1px solid fade(@primary-color, 30%);
                    border-radius: @default-radius;
                    background-color: fade(@primary-color, 10%);
                    position: relative;
                    margin: 2px;

                    .admin-close {
                        position: absolute;
                        top: 0px;
                        right: 0px;
                        transform: translate(50%, -50%);
                        cursor: pointer;
                        opacity: 0;
                        transition: opacity @transition-time;
                    }
                }

                .admin-item:hover .admin-close {
                    opacity: 1;
                }
            }

            .add-admin {
                flex-shrink: 0;
            }
        }

        .input-box {
            position: relative;
        }

        .class_name {
            color: #7f7f7f;
            position: absolute;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
        }
    }
</style>