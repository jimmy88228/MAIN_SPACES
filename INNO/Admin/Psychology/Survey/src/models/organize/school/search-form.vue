<template>
<rewrite-area class="flex-b-c">
    <Form :label-width="50" class="no-tip flex-b-c" inline>
        <div class="flex-c-c">
            <rewrite-search v-model="searchForm.searchq" @search="search" placeholder="请输入关键字"></rewrite-search>
            <template>
                <FormItem label="区" v-if="_structureLimit(['edu_customer'])">
                    <data-select ref="areaSelectRef" :initCallback="initAreaData" v-model="searchForm.area_id" style="max-width:150px;" type="adminArea" valueKey="area_id" nameKey="area_name" @changeData="changeAreaData"></data-select>
                </FormItem>
                <FormItem label="街道" v-if="_structureLimit(['edu_customer', 'edu_area'])">
                    <data-select ref="streetSelectRef" :params="{ area_id: getAreaId }" v-model="searchForm.street_id" style="max-width:150px;" type="street" valueKey="street_id" nameKey="street_name" @changeData="changeStreetData"></data-select>
                </FormItem>
            </template>
        </div>
        <div class="flex-c-c">
           <Button @click="create()" icon="md-add" v-hasAction="'school_maintenance_add'">创建学校</Button>&nbsp;
            <Button @click="create(true)" icon="md-cloud-upload" v-hasAction="'school_maintenance_batch_import'">批量创建学校</Button>
            <Button @click="removeIds()" v-hasAction="'school_maintenance_batch_remove'">导出管理员名单</Button> 
        </div>
    </Form>
    </rewrite-area>
</template>

<script>
export default {
    name: "actIndexSearchForm",
    data() {
        return {};
    },
    props: {
        searchForm: {
            type: Object,
            default: () => {},
        },
    },
    computed:{
        getAreaId(){
            if(this._structureType == 'edu_customer'){
                return this.searchForm.area_id || 0;
            } else if(this._structureType == 'edu_area'){
                return this._structureId;
            } else {
                return 0
            }
        }
    },
    methods: {
        search() {
            this.$emit("search");
        },
        create(isBatch) {
            this.$emit("create", { isBatch: isBatch });
        },
        removeIds() {
            this.$emit("removeIds");
        },
        changeArea(){
            this.$nextTick(()=>{
                this.$refs["streetSelectRef"] && this.$refs["streetSelectRef"].getData();
                this.search();
            }) 
        },
        changeAreaData(data){
            this.searchForm.area_id = data.area_id;
            this.searchForm.structure_type = data.structure_type;
            this.searchForm.area_name = data.area_name;
            this.$nextTick(()=>{
                this.$refs["streetSelectRef"] && this.$refs["streetSelectRef"].getData();
                this.search();
            })
        },
        changeStreetData(data){
            this.searchForm.street_id = data.street_id;
            this.searchForm.street_name = data.street_name;
            this.searchForm.structure_type = data.structure_type;
            this.search();
        },
        initAreaData(data){
            // 设置默认
            // if(data.length){
            //    this.searchForm.area_id =  data[0].area_id;
            //    this.searchForm.area_name = data[0].area_name;
            //    this.searchForm.structure_type = data[0].structure_type;
            //    this.$nextTick(()=>{
            //         this.$refs["streetSelectRef"] && this.$refs["streetSelectRef"].getData();
            //         this.search();
            //     })
            // }
        }
    },
};
</script>

<style>
</style>