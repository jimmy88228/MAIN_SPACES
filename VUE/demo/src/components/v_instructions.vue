<template>
    <div>
        <div>
            <span v-text="msg"></span>
            <div v-html="htmlData"></div>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                msg:'from msg data',
                htmlData:`<div>from htmlData</div>`             

            }
        }
    }
</script>

<style lang="less" scoped>

</style>