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
            <br/>
            <div>vForArr:</div>
            <div v-for="(item,index) in vForArr" :key="index">item：{{item}}，index：{{index}}</div> 
            <br/>
            <div>vForObj:</div>
            <div v-for="(val,key,index) in vForObj" :key="key">val：{{val}}，key：{{key}}，index：{{index}}</div>
            <br/>
            <div>vForObjArr 单for:</div>
            <div v-for="(item,index) in vForObjArr" :key="item.id">item：{{item}}，index：{{index}}</div>
            <br/>
            <div>vForObjArr 双for:</div>
            <div v-for="(item) in vForObjArr" :key="item.id">
                <div v-for="(cItemVal,cItemKey,cItemIndex) in item" :key="cItemKey">val：{{cItemVal}}，key：{{cItemKey}}，index：{{cItemIndex}}</div>
            </div>
            <br/>
            <diy-cmpt :fromType="':prop'" @click.native="nativeClick" @emitTap="handleEmit(441,$event)"></diy-cmpt>
            <div>
                <!-- 内联语句、动态事件 -->
                <button @[event]="inlineTap('hello', $event)">inline</button>
            </div>
            <div @click="clickTap2">
                <!-- 停止冒泡 、回调只触发一次 -->
                <button @click.stop.once="clickTap">BTN</button>
            </div>
            <div @click="clickTap2">
                <!-- 停止冒泡 、阻止默认行为 -->
                <button @click.stop.prevent="clickTap">BTN</button>
            </div>
            <div>
                <!-- 键修饰符，键别名 -->
                <input type="text" @keyup="keyup" @keyup.enter="onEnter">
            </div>
            <div>
                <!-- 对象语法 (2.4.0+) -->
                <button v-on="{ mousedown: downTap, mouseup: upTap }">mouse</button>
            </div>
                <!-- .left .right -->
            <div @click.left="mouseClick('left',$event)">leftClick</div>
            <div @click.right="mouseClick('right',$event)">rightClick</div>

                <!-- 绑定一个 attribute、动态 attribute :[key]、缩写 -->
            <img src="../assets/logo.png" alt="441" :[classKey]="'img1'">
            <img :src="imgPath" alt="441" class="img1">
                <!-- 内联字符串拼接 -->
            <img :src="'../assets/logo.png'" alt="441" class="img1">

                <!-- class 绑定 -->
            <div :class="{ red: isRed }">{ red: isRed }</div>
            <div :class="[classA, classB]">[classA, classB]</div>
            <div :class="[classA, { classB: isB, classC: isC }]">[classA, { classB: isB, classC: isC }]</div>

                <!-- style v-bind对象绑定 -->
            <div :style="{ fontSize: size + 'px' }">{ fontSize: size + 'px' }</div>
                <!-- 数组语法可以将多个样式对象应用到同一个元素上 -->
            <div :style="[styleObjectA, styleObjectB]">[styleObjectA, styleObjectB]</div>

                <!-- 绑定一个全是 attribute 的对象 -->
            <div v-bind="{ id: id, 'class': classB }">{ id: id, 'class': classB }</div> 

                <!-- 通过 $props 将父组件的 props 一起传给子组件 -->
            <!-- <child-component v-bind="$props"></child-component> -->
            
            <!-- 父组件监听事件并根据需要更新一个本地的数据 fromType -->
            <!-- <diy-cmpt
                v-bind:fromType="fromType"
                v-on:update:fromType="fromType = $event"
            ></diy-cmpt> -->
            <!-- 等同于.sync -->
            <diy-cmpt v-bind:fromType.sync="fromType"></diy-cmpt>
            <div>父组件 {{fromType}}</div>

            <v-slot>
                <template v-slot:header>
                    <div>header</div>
                </template>
                <template v-slot:content>
                    <div>content</div>
                </template>
                <template v-slot:footer>
                    <div>footer</div>
                </template>
            </v-slot>
        </div>
    </div>
</template>

<script>
    import diyCmpt from '@/components/instance_emit.vue'
    import vSlot from '@/components/vSlot.vue'
    export default {
        name: "vInstructions",
        components: {
            'diyCmpt':diyCmpt, //diyCmpt等于diy-cmpt
            'v-slot':vSlot
        },
        data(){
            return {
                vText:'v-text ',
                vHtml:`<div>v-html</div>`,//更新元素的 innerHTML。注意：内容按普通 HTML 插入 - 不会作为 Vue 模板进行编译。如果试图使用 v-html 组合模板，可以重新考虑是否通过使用组件来替代。
                vIfShowBool:{show:true,if:false},
                vIfShowText:{show:"v-show",if:"v-if"},
                vForArr:['a','b','c'],
                vForObj:{
                    id:'a1',
                    val:'jimmy'
                },
                vForObjArr:[{
                    id:'b1',
                    val:'jimmy'
                },{
                    id:'c1',
                    val:'jimmy2'
                }],
                event:'click',
                imgPath:'../assets/logo.png',
                classKey:"class",
                isRed:true,
                isB:true,
                isC:true,
                classA:'_classA',
                classB:'_classB',
                size:'30',
                styleObjectA:{
                    color:'red'
                },
                styleObjectB:{
                    fontSize:'32px'
                },
                id:"jimmy",
                fromType:'fromTypefromType'
                
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
                // this.vShowSwitchId = setTimeout(() => {
                //     this.vShowSwitch();
                // }, 1000);
            },
            handleEmit(val,e){
                console.log('handleEmit',val,e)
            },
            inlineTap(val,e){
                console.log('inlineTap',val,e)
            },
            clickTap(e){
                console.log('clickTap1',e)
            },
            clickTap2(e){
                console.log('clickTap2',e)
            },
            onEnter(e){
                console.log('onEnter',e)
            },
            keyup(e){
                console.log('keyup',e)
            },
            downTap(e){
                console.log('downTap',e)
            },
            upTap(e){
                console.log('upTap',e)
            },
            nativeClick(e){ //捕捉组件里面button的点击事件
                console.log('nativeClick',e)
            },
            mouseClick(val,e){
                console.log('rightClick',val,e)
            },
        },
    }
</script>

<style lang="less" scoped>
.img1{
    width: 40px;
    height: 40px;
}
.red{
    color: red;
}
._classA{
    font-size: 20px;
}
._classB{
    color:chocolate;
}
.classB{
    color: cyan;
}
.classC{
    transform: scale(1.3);
}
</style>