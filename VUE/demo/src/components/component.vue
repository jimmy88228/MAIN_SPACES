<!-- functional  使组件无状态 (没有 data) 和无实例 (没有 this 上下文)。他们用一个简单的 render 函数返回虚拟节点使它们渲染的代价更小。 -->
<template functional>
    <div>
        <div>
            <div v-for="(item,index) in props.items" :key="index">
                {{index}},{{item}}
            </div>
            <div v-for="(item,index) in props.obj" :key="index">
                {{index}},{{item}}
            </div>
            <div v-for="(val,index) in props.objArr" :key="'i'+index">  <!-- key要有区分 -->
                <div v-for="(val2,index) in val" :key="'j'+index">
                    {{index}},{{val2}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name:"complt",
        
    }
</script>

<style lang="less" scoped>

</style>