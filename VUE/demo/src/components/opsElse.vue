<!-- opsElse ： name,props,delimiters,this.$route.query,functional,v-model,model-->
<template>
    <div>
        <div>opsElse--{{paramsVal}}--{{que_val}}</div>
        <complt :items="funcVal" :obj="objVal" :objArr="objArr"></complt>

        <!-- <input v-model="message" placeholder="edit me"/>
        <p>Message is: {{ message }}</p> -->

        <!-- <span>Multiline message is:</span>
        <p style="white-space: pre-line;">{{ message }}</p>
        <textarea v-model="message" placeholder="add multiple lines"></textarea>
        <div>
            <input type="checkbox" id="checkbox" v-model="checked1">
            <label for="checkbox">{{ checked1 }}</label>
        </div> -->

        <my-checkbox v-model="checkBool" value="v-model 把value prop隔离出来"></my-checkbox>
        <div>checkBool外面:{{checkBool}}</div>
    </div>
</template>

<script>
    import complt from './component.vue';
    import Vue from 'vue';
    Vue.component('my-checkbox', {
        model: {
            prop: 'checked',
            event: 'change'
        },
        // inheritAttrs
        // comments  
        props: {
            // this allows using the `value` prop for a different purpose
            value: String,
            // use `checked` as the prop which take the place of `value`
            checked: {
                type: Number,
                default: 0
            }
        },
        data(){
            return {
                count:0
            }
        },
        template: '<div><input v-model="checked" placeholder="edit me"/><div>{{value}}:</div><p>my-checkbox is: {{ checked }}</p></div>'
    })
    export default {
        name:"",
        // delimiters: ['${', '}'], //??
        props:{
            paramsVal:{
                type:Number,
                default:0
            }
        },
        data() {
            return{
                que_val:0,
                funcVal:[11,22],
                objVal:{a:'33',b:'44'},
                objArr:[{'c':1,'c2':2},{'d':1,'d2':2}],
                message:"",
                checkBool:1, 
                checked1:false
            }
        },
        components: {
            complt,
        },
        mounted () {
            let route = this.$route || {};
            console.log('route',route)
            let query = this.$route.query || {};
            this.que_val = query.que_val || 0;
            console.log('thisthisA',this,this.cln_intvl)
            this.timerId = setInterval(() => {
                if(this.checkBool>=3){
                    this.cln_intvl();
                    return
                }
                this.checkBool += 1;
                console.log(this.checkBool)
            }, 1000);
        },
        destroyed () {
            this.cln_intvl();
        },
        methods: {
            cln_intvl(){
                clearInterval(this.timerId); 
            }
        },
         
    }
</script>

<style lang="less" scoped>

</style>