<template>
    <div>
        <ul>
            <li v-for="(item,index) in vForObjArr" :key="index">{{index}},{{item}},{{item.id}},{{item.val}}</li>
        </ul>
        <div>
            <p ref="p">hello</p>
            <!-- `vm.$refs.child` will be the child component instance -->
            <child-component ref="child"></child-component>
        </div>

        <div>
            <component v-bind:is="currentView"></component>
        </div>
    </div>
</template>

<script>
    import childComponent from '@/components/component.vue'; 
    export default {
        components: {
            'child-component':childComponent,
        },
        data() {
            return {
                vForObjArr:[{
                    id:'b1',
                    val:'jimmy'
                },{
                    id:'c1',
                    val:'jimmy2'
                }],
                currentView:'child-component'
            }
        },
        mounted () {
            console.log('refs',this.$refs);
        },
    }
</script>

<style lang="less" scoped>

</style>