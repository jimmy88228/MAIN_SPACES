<template>
    <div class="main">
        <div class="header">
            <slot name="header"></slot>
        </div>
        <div class="content">
            <slot name="content"></slot>
        </div>
        <div class="footer">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        
    }
</script>

<style lang="less" scoped>
.header{
    color: red;
}
.content{
    color:cyan;
}
.footer{
    color:darkgoldenrod;
}
</style>