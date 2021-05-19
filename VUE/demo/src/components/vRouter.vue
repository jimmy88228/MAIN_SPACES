<template>
    <div>
        <div>params:{{$route.params.id}}</div>
        <div>query:{{$route.query.type}}</div>
        <button @click="jump(0,$event)">INDEX</button>
        <button @click="jump(1,$event)">JUMP</button>
        <button @click="jump(2,$event)">JUMP2</button>
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
        // props:['id'], //数组形式
        props: { //对象形式
            id: {
                type:String,
                default:"",
                required:true,
                validator: function (n,o) {
                    console.log('validator',n,o,typeof(n),n>=0);
                    return n >= 0
                } 
            }, 
        },
        data() {
            return {
            }
        },
        methods: {
            jump(type) {
                if(type){
                this.$router.push({path:`/vRouter/001/vRouterJumpChildren${type==2?type:""}`,query:{type:'vRouterJumpChildren'}})
                }else{
                    this.$router.push({path:`/vRouter/${441}`,query:{type:'jimmy'}})
                }
            }
        },
        mounted () {
            console.log('mounted',this.props,this.id,typeof(this.id));
        },
        watch: {
            id(newValue, oldValue) {
                console.log('id',newValue,oldValue)
            },
            $route(to,from){
                console.log('$route',this.id,to,from)
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