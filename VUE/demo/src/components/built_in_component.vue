<template>
    <div> 
        <div>
            <div>
                <component v-bind:is="currentView"></component>
            </div>
            <div>
                <component v-bind:is="currentView2"></component>
            </div>
            <div>
                <component v-bind:is="$options.components.childComponent"></component>
            </div>
        </div>
    </div>
</template>

<script>
    import childComponent from '@/components/component.vue'; 
    export default {
        components: {
            'child-component':childComponent,//A
            'childComponent':childComponent,//B
        },
        data() {
            return { 
                currentView:'child-component', //A
                currentView2:'childComponent' //B
            }
        },
        mounted () {
        },
    }
</script>

<style lang="less" scoped>

</style>