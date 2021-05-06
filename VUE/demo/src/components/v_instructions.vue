<template>
    <div>
        <div>
            <span v-text="vText"></span>
            <span>{{vText}}</span>
            <div v-html="vHtml"></div>
            <div v-show="vIfShowBool.show">{{vIfShowText.show}}</div>
            <div v-if="vIfShowBool.if">{{vIfShowText.if}}</div>
            <div v-else-if="!vIfShowBool.if">v-else-if</div>
            <div v-else>v-else</div>
            <div v-for="(item,index) in vForArr" :key="index">{{index}},{{item}}</div>
            <div v-for="(item) in vForObj" :key="item.id">{{item.id}},{{item.val}}</div>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                vText:'v-text ',
                vHtml:`<div>v-html</div>`,//更新元素的 innerHTML。注意：内容按普通 HTML 插入 - 不会作为 Vue 模板进行编译。如果试图使用 v-html 组合模板，可以重新考虑是否通过使用组件来替代。
                vIfShowBool:{show:true,if:false},
                vIfShowText:{show:"v-show",if:"v-if"},
                vForArr:['a','b','c'],
                vForObj:[{
                    id:'1',
                    val:'jimmy'
                }]
            }
        },
        mounted () {
            this.vShowSwitch();
        },
        beforeDestroy () {
            clearTimeout(this.vShowSwitchId);
        },
        methods: {
            vShowSwitch() {
                for(let item in this.vIfShowBool) {
                    this.vIfShowBool[item] = !this.vIfShowBool[item];
                }
                this.vShowSwitchId = setTimeout(() => {
                    this.vShowSwitch();
                }, 1000);
            }
        },
    }
</script>

<style lang="less" scoped>

</style>