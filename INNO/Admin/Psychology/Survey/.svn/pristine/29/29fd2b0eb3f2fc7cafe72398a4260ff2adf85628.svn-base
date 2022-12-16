<template>
    <div class="rewrite-choose" :style="customStyle">
        <div class="radio-box flex-s-c">
            <div v-for="(item, index) in data" :key="index" class="radio flex-c-c pointer" :class="[chooseValue == item.key || (multiple && chooseValue.indexOf(item.key) != -1) ? 'active' : '', item.disabled ? 'bg_f3' : '']" @click="chooseClick(item.key)">
                <div class="radio-cir"></div>
                <div class="radio-name">{{item.name}}</div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: "rewrite-choose",
        props: {
            "value": {
                type: String | Number | Array,
                default: 0,
            },
            "data": {
                type: Array,
                default(){
                    return [];
                }
            },
            "custom-style": String,
            "multiple": {
                type: Boolean,
                default: false,
            },
        },
        model: {
            prop: "value",
            event: "on-change",
        },
        data(){
            return {
                chooseValue: 0
            }
        },
        methods:{
            chooseClick(key){
                if(this.multiple){
                    let index = this.chooseValue.indexOf(key);
                    if(index == -1){
                        this.chooseValue.push(key)
                    } else {
                        this.chooseValue.splice(index, 1)
                    }
                } else {
                    this.chooseValue = key
                }
                this.$emit("on-change", this.chooseValue)
            }
        },
        watch: {
            value: {
                handler:function(nV){
                    this.chooseValue = nV
                },
                deep: true,
                immediate: true
            },
            multiple: {
                handler:function(nV){
                    if(!(this.chooseValue instanceof Array)){
                        this.chooseValue = this.chooseValue ? [this.chooseValue] : []
                    }
                },
                deep: true,
                immediate: true
            }
        }
    }
</script>
<style scoped lang="less">
.rewrite-choose{
    .radio{
        padding: 2px 10px;
        border-radius: 2px;
        background-color: #fff;
        transition: all 0.2s;
        border: 1px solid #DDDDDD;
        margin-right: 10px;
        transition: all .35s;
        .radio-cir{
            width: 16px;
            height: 16px;
            background-color: #FFFFFF;
            border: 1px solid #B2B2B2;
            position: relative;
            border-radius: 50%;
            margin-right: 10px;
            transition: all .35s;
        }
        &.active{
            background-color: #EFFAFF;
            color: #008ACB;
            border-color: #008ACB;
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
}
</style>
<style lang="less">

</style>
