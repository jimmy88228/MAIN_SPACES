<template>
<div class="edit-activity-area">
    <div class="edit-activity-cont">
        <rewrite-tabs :data="tabsData" :currTab="currTab" @changeTab="changeTab">
            <template slot="base">
                <baseForm :timeState="timeState" :actDetail="actDetail" :initStartTime="initStartTime" ref="baseRef" @saveCallback="initData"></baseForm>
            </template>
        </rewrite-tabs>
    </div>
    <div class="operate-area">
        <Button type="primary" @click="save" :loading="pageLoading">保 存</Button>
    </div>
</div>
</template>

<script>
import baseForm from "./base.vue";
// import dateUtil from "@/helper/utils/date-util.js";
export default {
    mixins: [],
    components: { baseForm },
    data() {
        return {
            tabsData: [
                {
                    name: 'base',
                    label: '基础信息'
                },
            ],
            actDetail: {
                id: 0,
                name: "",
                start_time: "",
                end_time: "",
                type: "", // offline 线下 online 线上
                sign_bg: "",
                organizer: "",
                lecturer: "",
                get_structure: {},
                bind_structure_id: 0,
                lecture_content_id: 0,
                lecture_content_title: "",
                join_type: "",
                join_ids: [],
                structure_list: [],
                member_list: [],
                group_list: [],
                course_data: {}
            },
            actSetting: {
                detail_bg_img: '',
                detail_bg_color: '',
                answer_bg_img: ''
            },
            initStartTime: "",
            currTab: "",
            timeState: 0
        };
    },
    methods: {
        initData(){
            let id = Number(this.pageQuery.id) || 0;
            if(!id){
                let type = this.pageQuery.type;
                this.actDetail.type = type;
                // this.actDetail.join_type = type == 'online' ? 'everyone' : '';
            } else {
                this.loadData();
            }
        },
        getTimeState(actDetail){
            // 0：未开始， 1：进行中， 2：已结束
            actDetail = actDetail || {};
            if(!actDetail.id){ // 新建活动，默认活动未开始，全可以调整
                return 0;
            }
            if(actDetail.limit_time == 1){ // 不限制时，默认进行中，可新增，不可改动数据
                return 1;
            }
            let start_time = actDetail.start_time;
            let end_time = actDetail.end_time;
            let nowDate = new Date(actDetail.to_time);
            if(!start_time || !end_time){
                return 0;
            }
            if(nowDate.getTime() <= new Date(start_time).getTime()){
                return 0;
            }
            if(new Date(start_time).getTime() < nowDate.getTime() && nowDate.getTime() <= new Date(end_time).getTime()){
                return 1;
            }
            return 2;
        },
        loadData() {
            let id = Number(this.pageQuery.id) || 0;
            if (!id) return;
            let req = "specialLectureInfo";
            return this.$MainApi[req]({
                data: {
                    id: id,
                },
                other: {
                    isShowLoad: true,
                },
            }).then((res) => {
                if (res.code) {
                    let data = res.data || {};
                    let items = data.items || {};
                    items.time = [items.start_time || '', items.end_time || ''];
                    items.structure_list = [];
                    items.member_list = [];
                    this.timeState = this.getTimeState(items);
                    if(this.timeState > 0 && items.join_data instanceof Array){
                        items.join_data.map((item)=>{
                            item.disabled = true;
                        })
                    }
                    if(items.join_type == "structure"){
                        items.structure_list = items.join_data;
                    }
                    if(items.join_type == "member"){
                        items.member_list = items.join_data;
                    }
                    this.actDetail = items;
                }
            });
        },
        getRef(name){
            if(this.$refs[name]){
                return this.$refs[name]
            } else {
                return {}
            }
        },
        save() {
            this.$store.commit("setPageLoading", true);
            this.$refs["baseRef"] && this.$refs["baseRef"].save().then(()=>{
                this.$nextTick(()=>{
                    // this.$refs["customRef"] && this.$refs["customRef"].save().then(()=>{
                        // let isReplace = this.pageQuery.$isReplace;
                        this.$Message.warning(!Number(this.pageQuery.id) ? "新增成功" : "编辑成功");
                        setTimeout(()=>{
                            this.$router.back();
                        })
                    // }).finally(()=>{
                    //         this.$store.commit("setPageLoading", false);
                    //     })
                })
            }).catch(()=>{
                this.currTab = "base";
            }).finally(()=>{
                this.$store.commit("setPageLoading", false);
            })
        },
        changeTab(name){
            this.currTab = name;
            this.$refs[name +'Ref'] && this.$refs[name +'Ref'].initData();
        }
    },
    mounted() {
        this.initData();
    },
};
</script>

<style lang="less" scoped>
.edit-activity-area{
    display: flex;
    width:100%;
    height:100%;
    flex-direction: column;
    .edit-activity-cont{
        flex: 1;
        overflow: hidden;
    }
    .operate-area{
        padding: 5px 0px;
        padding-left: 140px;
        background-color:#fff;
    }
}
</style>