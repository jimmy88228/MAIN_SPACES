<template>
    <div class="linkage-select-area">
        <div class="flex-c-c">
            <!-- <FormItem label="组织" v-if="(_structureLimit(['structure']) && checkIsShow('structure'))" :label-width="50">
                <data-select v-model="searchForm.structure_id" :params="{ structure_id:  searchForm.structure_id}" class="screen-item" type="structure" ref="structureRef" valueKey="area_id" nameKey="area_name" @change="changeSelect('structure')"></data-select>
            </FormItem> -->
            <FormItem label="组织" v-if="(_structureLimit(['structure']) && checkIsShow('structure'))" :label-width="50">
                <data-cascader ref="organizeCascader" class="base-320 organize" type="organize" v-model="searchForm.prent_structure_ids" valueKey="id" labelKey="structure_name" @change="changeOrganize" @dismiss="dismiss"></data-cascader>
            </FormItem>
            <!-- <FormItem label="城区" v-if="false" :label-width="50">
                <data-select v-model="searchForm.area_id" class="screen-item" valueKey="area_id" nameKey="area_name" @change="changeSelect('adminArea')" :initCallback="initArea" type="adminArea"></data-select>
            </FormItem>
            <FormItem label="学校" v-if="_structureLimit(['edu_area']) && checkIsShow('school')" :label-width="50">
                <data-select v-model="searchForm.school_id" :params="{ area_id:  searchForm.area_id}" class="screen-item" type="school" ref="schoolSelectRef" valueKey="school_id" nameKey="school_name" @change="changeSelect('school')"></data-select>
            </FormItem>
            <FormItem label="校区" v-if="_structureLimit(['edu_area', 'edu_school']) && checkIsShow('campus')" :label-width="50">
                <data-select v-model="searchForm.campus_id" :params="{ school_id:  searchForm.school_id}" class="screen-item" ref="campusSelectRef" type="campus" valueKey="campus_id" nameKey="campus_name" @change="changeSelect('campus')"></data-select>
            </FormItem>
            <FormItem label="班级" v-if="_structureLimit(['edu_area', 'edu_school', 'edu_class']) && checkIsShow('grade')" :label-width="50">
                <data-select v-model="searchForm.grade_id" :params="{ campus_id:  searchForm.campus_id}" class="screen-item" type="grade" valueKey="class_id" nameKey="class_name" ref="gradeSelectRef" @change="changeSelect('grade')"></data-select>
            </FormItem> -->
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
                return {
                    // area_id: 0,
                    // school_id: 0,
                    // campus_id: 0,
                    // grade_id: 0,
                    structure_id:0
                };
            },
        },
        hideSelect: {
            // 手动限制显示
            type: Array,
            default: () => {
                return []
            },
        },
    },
    data() {
        return {
            area_id: 0,
            timer: null
        };
    },
    methods: {
        initData() {
            let _structureType = this._structureType;
            if (_structureType) {
                switch (_structureType) {
                    // case "edu_area":
                    //     this.$set(
                    //         this.searchForm,
                    //         "area_id",
                    //         this._structureId
                    //     );
                    //     this.changeSelect("adminArea", true);
                    //     break;
                    // case "edu_school":
                    //     this.$set(
                    //         this.searchForm,
                    //         "school_id",
                    //         this._structureId
                    //     );
                    //     this.changeSelect("school", true);
                    //     break;
                    // case "edu_class":
                    //     this.$set(
                    //         this.searchForm,
                    //         "grade_id",
                    //         this._structureId
                    //     );
                    //     // this.changeSelect("grade", true);
                    //     break;
                    case "structure":
                        this.$set(
                            this.searchForm,
                            "structure_id",
                            this._structureId
                        );
                        // this.changeSelect("grade", true);
                        break;
                }
            }
        },
        checkIsShow(type){
            if(this.hideSelect.length > 0){
               return this.hideSelect.indexOf(type) == -1
            } else { return true }
        },
        changeSelect(type, isInit) { // 初始化时不初始化传进来的值
            console.log("changeSelect", type);
            this.$nextTick(() => {
                switch (type) {
                    case "structure":
                        this.$refs["structureRef"] &&
                            this.$refs["structureRef"].getData();
                        !isInit && this.$set(this.searchForm, "structure_id", 0);
                        break;
                    // case "adminArea":
                    //     this.$refs["schoolSelectRef"] &&
                    //         this.$refs["schoolSelectRef"].getData();
                    //     !isInit && this.$set(this.searchForm, "school_id", 0);
                    //     break;
                    // case "school":
                    //     this.$refs["campusSelectRef"] &&
                    //         this.$refs["campusSelectRef"].getData();
                    //     !isInit && this.$set(this.searchForm, "campus_id", 0);
                    //     break;
                    // case "campus":
                    //     this.$refs["gradeSelectRef"] &&
                    //         this.$refs["gradeSelectRef"].getData();
                    //     !isInit && this.$set(this.searchForm, "grade_id", 0);
                    //     break;
                    // case "grade":
                    //     // this.$refs["gradeSelectRef"] &&
                    //     //     this.$refs["gradeSelectRef"].getData();
                    //     this.$set(this.searchForm, "class_id", this.searchForm.grade_id)
                    //     console.log("切换", this.searchForm);
                    //     break; 
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
        changeOrganize(data) {
            if(data instanceof Array){
                let id = data.slice(-1)[0] || 0;
                this.$set(this.searchForm, "structure_id", id)
                console.log('changeOrganize',id,data,this.searchForm);
                this.timer = setTimeout(()=>{
                    this.$emit("on-change", this.searchForm);
                    this.timer = null;
                }, 300);
            }
        },
        dismiss(){
            console.log('link dismiss',this.searchForm)
            this.$emit("dismiss", this.searchForm);
        },
    },
    mounted() {
        this.initData();
    },
};
</script>

<style lang="less" scoped>
.linkage-select-area {
    display: inline-block;
    vertical-align: middle;
    .screen-item {
        width: 150px;
    }
    .organize{
        // min-width: 300px;
    }
}
</style>