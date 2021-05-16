<template>
    <div>
        <div>{{$route.params.id}}</div>
        <div @click="jump(0,$event)">JUMP</div>
        <div @click="jump(2,$event)">JUMP2</div>
        <div class="router">
            <div class="rv">
                <router-view></router-view>
            </div>
            <div class="rv">
                <router-view name="second"/>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
            }
        },
        methods: {
            jump(type) {
                this.$router.push({path:`/vRouter/001/vRouterJump${type||""}`})
            }
        },
    }
</script>

<style lang="less" scoped>
.router{
    display: flex;
    align-items: center;
    height: 100%;
    width: 100%;
}
.rv{
    width: 50%;
    height: 100%;
}
</style>