<template>
    <div class="linkage-select-area">
        <div class="flex-c-c">
            <FormItem label="所在区" v-if="_structureLimit(['edu_customer']) && checkIsShow('area')" :label-width="70">
                <data-select style="width: 100px;" v-model="searchForm.area_id" class="screen-item" valueKey="area_id" nameKey="area_name" @change="changeSelect('adminArea')"  type="adminArea"></data-select>
            </FormItem>
            <FormItem label="街道" v-if="_structureLimit(['edu_customer', 'edu_area']) && checkIsShow('street')" :label-width="50">
                <data-select v-model="searchForm.street_id" :params="{ area_id: searchForm.area_id }" ref="streetSelectRef" class="screen-item" valueKey="street_id" nameKey="street_name" @change="changeSelect('street')" type="street"></data-select>
            </FormItem>
            <FormItem label="学校" v-if="_structureLimit(['edu_customer', 'edu_area', 'edu_street']) && checkIsShow('school') && !pageQuery.schoolId" :label-width="50">
                <data-select 
                v-model="searchForm.school_id" 
                :params="{ area_id:  (_structureType == 'edu_area' ? _getReqStructureId : searchForm.area_id) || 0, street_id: (_structureType == 'edu_street' ? _getReqStructureId : searchForm.street_id) || 0}" 
                class="screen-item" 
                type="school" 
                ref="schoolSelectRef" 
                valueKey="school_id" 
                nameKey="school_name" 
                @change="changeSelect('school')"></data-select>
            </FormItem>
            <FormItem label="校区" v-if="_structureLimit(['edu_customer', 'edu_area' , 'edu_street', 'edu_school', 'edu_class']) && checkIsShow('campus') && !pageQuery.campusId" :label-width="50">
                <data-select v-model="searchForm.campus_id" :params="{ school_id:  searchForm.school_id}" class="screen-item" ref="campusSelectRef" type="campus" valueKey="campus_id" nameKey="campus_name" @change="changeSelect('campus')"></data-select>
            </FormItem>
            <FormItem label="学段" v-if="_structureLimit(['edu_customer','edu_area' , 'edu_street', 'edu_school', 'edu_class']) && checkIsShow('grade-type') && !pageQuery.gradeId" :label-width="50">
                <data-select style="width: 80px;" v-model="searchForm.grade_type" :params="{ school_id:  searchForm.school_id}" class="screen-item" ref="gradeTypeSelectRef" type="grade-type" valueType="string" valueKey="type" nameKey="name" @change="changeSelect('grade-type')"></data-select>
            </FormItem>
            <FormItem label="年级" v-if="_structureLimit(['edu_customer','edu_area' , 'edu_street', 'edu_school', 'edu_class']) && checkIsShow('grade') && !pageQuery.gradeId" :label-width="50">
                <Select class="screen-item-grade" v-model="gradeIndex" clearable @on-change="changeSelect('grade')">
                    <Option v-for="(item,id) in grade_data" :key="id" :value="id">{{item.grade}}（{{item.school_year}}）</Option>
                </Select> 
            </FormItem>
            <FormItem label="班级" v-if="_structureLimit(['edu_customer','edu_area' , 'edu_street', 'edu_school', 'edu_class']) && checkIsShow('class') && !pageQuery.gradeId" :label-width="50">
                <Select class="screen-item" style="width: 100px;" v-model="searchForm.class_name" clearable @on-change="changeSelect('class')">
                    <Option v-for="(item,id) in class_data" :key="id" :value="item.class">{{item.class}}</Option>
                </Select> 
            </FormItem>
        </div>
    </div>
</template>

<script>
export default {
    name: "linkage-select",
    props: {
        searchForm: {
            type: Object,
            default: () => {
                return {};
            },
        },
        hideSelect: {
            // 手动限制显示
            type: Array,
            default: () => {
                return ['area', 'school_year']
            },
        },
    },
    data() {
        return {
            area_id: 0,
            timer: null,
            grade_data:[],
            gradeIndex:"",
            class_data:[],
        };
    },
    methods: {
        initData() {
            let type = this._structureType;
            let id = this._structureId;
            if(this.pageQuery.schoolId){
                type = 'edu_school';
                id = this.pageQuery.schoolId;
            }
            if (type) {
                switch (type) {
                    case "edu_area":
                        this.$set(
                            this.searchForm,
                            "area_id",
                            id
                        );
                        this.changeSelect("adminArea", true);
                        break;
                    case "edu_street":
                        this.$set(
                            this.searchForm,
                            "street_id",
                            id
                        );
                        this.changeSelect("street", true);
                        break;
                    case "edu_school":
                        this.$set(
                            this.searchForm,
                            "school_id",
                            id
                        );
                        this.changeSelect("school", true);
                        break;
                    case "edu_class":
                        let structure_pid = this._loginAdmin.structure_pid;
                        if(structure_pid){
                            this.$set(
                                this.searchForm,
                                "school_id",
                                structure_pid
                            );
                            this.changeSelect("school", true);
                        }
                        break;
                }
            }
        },
        // 获取年级和班级
        getAdminGdClassData(){
            let school_id = this.searchForm.school_id;
            this.$MainApi['adminGdClassData']({
            data: {
                school_id,
                state: 1, //0: 正常年级， 1：包含毕业班级
            }
            }).then((res) => {
                if(res.code){
                    let items = res.data?.items
                    if(!(items instanceof Array) && items instanceof Object){
                        for(let i in items){
                            // class_data 和 grade_data
                            this[i] = items[i]
                        }
                    }
                }
            })
        },
        checkIsShow(type){
            if(this.hideSelect.length > 0){
               return this.hideSelect.indexOf(type) == -1
            } else { return true }
        },
        changeSelect(type, isInit) { // 初始化时不初始化传进来的值
            this.$nextTick(() => {
                switch (type) {
                    case "adminArea":
                        this.$refs["schoolSelectRef"] &&
                            this.$refs["schoolSelectRef"].getData();
                        !isInit && this.$set(this.searchForm, "school_id", 0);
                        this.$refs["streetSelectRef"] &&
                            this.$refs["streetSelectRef"].getData();
                        !isInit && this.$set(this.searchForm, "street_id", 0);
                        break;
                    case "street":
                        this.$refs["schoolSelectRef"] &&
                            this.$refs["schoolSelectRef"].getData();
                        !isInit && this.$set(this.searchForm, "school_id", 0);
                        break;
                    case "school":
                        this.$refs["campusSelectRef"] &&
                            this.$refs["campusSelectRef"].getData();
                        !isInit && this.$set(this.searchForm, "campus_id", 0);

                        this.$refs["gradeTypeSelectRef"] &&
                            this.$refs["gradeTypeSelectRef"].getData();
                            
                        this.getAdminGdClassData()
                        break;
                    case "grade-type":
                        console.log(this.searchForm.grade_type,"this.searchForm.grade_typ")
                        this.$set(this.searchForm, "grade_type", this.searchForm.grade_type)
                        break;
                    case "campus":
                        this.$refs["gradeSelectRef"] &&
                            this.$refs["gradeSelectRef"].getData();
                        !isInit && this.$set(this.searchForm, "grade_id", 0);
                        break;
                    case "grade":
                        let gradeIndex = this.gradeIndex;
                        let grade_data = this.grade_data;
                        let {school_year,grade} = grade_data[gradeIndex] || {}
                        this.$set(this.searchForm, "school_year", school_year || '')
                        this.$set(this.searchForm, "grade_name", grade || '')
                        break;
                    case "class":
                        this.$set(this.searchForm, "class_name", this.searchForm.class_name)
                        break;
                    default:
                        break;
                }
                if(!isInit){
                    if(this.timer){
                        clearTimeout(this.timer);
                        this.timer = null;
                    }
                    this.timer = setTimeout(()=>{
                        this.$emit("on-change", this.searchForm);
                        this.timer = null;
                    }, 300);
                }
            });
        },
        changeSchoolYear(){
            this.$emit("on-change");
        }
    },
    mounted() {
        this.initData();
    }
};
</script>

<style lang="less" scoped>
.linkage-select-area {
    display: inline-block;
    vertical-align: middle;
    .screen-item {
        width: 150px;
    }
    .screen-item-grade {
        width: 160px;
    }
}
</style>