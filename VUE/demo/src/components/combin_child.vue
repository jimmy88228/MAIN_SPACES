<template>
    <div>
        <div>
            comb_child
        </div>
        <div class="box">
            <slot name="child_head"></slot>
            <slot></slot>
            <slot name="child_footer" :slotData="child_str" :slotObj="child_obj"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name:"comb_child",
        data() {
            return {
                child_str: 'child_data 被调用',
                child_obj:{
                    a:1,
                    b:2
                }
            }
        },
        mounted(){
            this.getParent();
            this.getChild();
            console.log('child_slots',this.$slots,'\nchild_scopedSlots',this.$scopedSlots,'\n')
            console.log('listeners2',this.$listeners)
        },
        methods: {
            getParent() {
              console.log('comb_child getParent',this.$parent);  
            },
            getChild() {
              console.log('comb_child getChild',this.$children); 
            },
        },
        
    }
</script>

<style lang="less" scoped>

</style>