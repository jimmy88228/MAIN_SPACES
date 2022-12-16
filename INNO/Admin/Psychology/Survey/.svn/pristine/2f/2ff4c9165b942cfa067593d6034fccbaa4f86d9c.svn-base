<template>
    <div class="count-info flex-s-c">
        <template v-if="type == 'list'">
            <div @click="clickTap(item)" v-for="(item,index) in listData" :key="index" class="count-item flex flex-col">
                <div class="title flex-b-c">
                    <div>
                        {{item.title}}
                    </div>
                    <!-- <span class="relativeClass text-arrow-radius">查看</span> -->
                </div>
                <dir class="flex-s-c msg-box">
                    <div class="msg">
                        <div class="tip">
                            人数
                        </div>
                        <div class="counts">
                            {{customInfoData[item.user_counts]||(inited?0:'--')}}
                        </div>
                    </div>
                    <div class="msg">
                        <div class="tip">
                            记录数
                        </div>
                        <div class="counts">
                            {{customInfoData[item.record_counts]||(inited?0:'--')}}
                        </div>
                    </div>
                </dir>
                <span class="text-arrow-radius">查看</span> 
            </div>
        </template>
        <template v-else-if="type == 'detail'">
            <rewrite-area boxStyle="width: 100%;">
                <div class="flex-s-c">
                    <div class="m-r-20">列表内容：{{currState.name}}</div>
                    <div class="m-l-20">共<span class="bold">{{baseInfoSto.total || (inited?0:'--')}}</span>条记录，共<span class="bold">{{baseInfoSto.user_count || (inited?0:'--')}}</span>人</div>
                </div>
            </rewrite-area>
        </template>
    </div>
</template>

<script>
    export default { 
        data() {
            return {
                listData:[{
                    title:"总预警情况",
                    key:"-1",
                    user_counts:"all_user",
                    record_counts:"all_record",
                },{
                    title:"待审核记录",
                    key:"0",
                    user_counts:"to_audit_user",
                    record_counts:"to_audit",
                },{
                    title:"已审核记录",
                    key:"1",
                    user_counts:"success_audit_user",
                    record_counts:"success_audit",
                },{
                    title:"已复核记录",
                    key:"2",
                    user_counts:"not_pass_user",
                    record_counts:"not_pass",
                },],
                customInfoData:{},
                inited:false,
                baseInfoSto:{},
            }
        },
        props: {
            type:String, // list， detail
            infoData: {
                type: Object,
                default: ()=>({})
            },
            baseInfo: {
                type: Object,
                default: ()=>({})
            },
            currState: {
                type: Object,
                default: ()=>({})
            },
            isRefresh:{
                type:Boolean,
                default:()=>true
            }
        },
        computed: {
            currData(){
                let currData = {}
                if(this.type == "detail"){
                    for(let i = 0; i < this.listData.length; i++){
                        if(this.currState.id == this.listData[i].key){
                            currData = this.listData[i]
                            break;
                        }
                    }
                }
                return currData
            },
            curBaseInfo(){ 
                return this.baseInfoSto[this.currState.id] || {};
            }
        },
        watch:{
            infoData:{
                handler(nV){
                    if(nV){
                        let obj = {
                            all_record:0,
                        };
                        for(let key in nV){
                            if(key.indexOf('user') == -1){
                                obj.all_record += nV[key];
                            }
                        }
                        this.customInfoData = {
                            ...nV,
                            ...obj
                        };
                        this.inited = true;

                    }
                },
            },
            baseInfo:{
                handler(nV){
                    try{
                        if(nV){ 
                            if(this.isRefresh){
                                this.baseInfoSto = nV
                            }
                            this.inited = true;
                        }
                    }catch(e){}
                },
            },
        },
        methods: {
            clickTap(row) {
                this.$emit('clickTap',row.key)
            }
        },
    }
</script>

<style lang="less" scoped>
.count-info{
    // padding: 0 40px;
    flex-wrap: nowrap;
    .count-item{
        position: relative;
        border-radius: 12px;
        background-color: #fff;
        padding: 22px 13px 25px 25px;
        width:240px;
        flex-shrink: 0;
        margin-right: 10px;
        height: 160px;
        &:last-child{
            margin-right: 0;
        }
        &:hover{
            cursor: pointer;
            box-shadow: 0px 0px 10px #e0e0e0;
        }
    }
    .title{
        width: 100%;
        font-size: 16px;
        margin-bottom: 15px;
    }
    .msg-box{
        width: 100%;
    }
    .msg{
        &:first-child{
            padding-right: 60px;
            min-width: 100px;
        }
    }
    .tip{
        font-size: 14px;
        color:#b2b2b2;
        margin-bottom: 10px;
    }
    .counts{
        font-size: 26px;
    }
    // .relativeClass{
    //     position: relative;
    //     left: unset;
    //     right: unset;
    //     top: unset;
    //     bottom: unset;
    // }
}
</style>