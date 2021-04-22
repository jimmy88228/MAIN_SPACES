<!-- instance_data ：$watch,immediate,deep,set,delete -->
<template>
    <div>
        <div>InstanceData {{this.a+this.b}}</div>
        <div>{{someObject.a}},{{someObject2.a}},{{immediateData}}</div>
        <div>{{setDiyObj.a}}</div>
        <div>{{setDiyArr[0]}},{{setDiyArr[1]}}</div>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                a:1,
                b:1,
                c:0,
                someObject:{
                    a:1
                },
                someObject2:{
                    a:1
                },
                immediateData:0,
                setDiyObj:{},
                setDiyArr:[], 
            }
        },
        mounted(){
             this.init();
             this.init2();
        },
        methods: {
            init() {
                //监听function //??
                // this.$watch( 
                //     function () {
                //         // 表达式 `this.a + this.b` 每次得出一个不同的结果时
                //         // 处理函数都会被调用。
                //         // 这就像监听一个未被定义的计算属性
                //         return this.a + this.b
                //     },
                //     function (newVal, oldVal) {
                //         // 做点什么
                //     }
                // )
                // setTimeout(function () {
                //     this.a+=1;
                //     console.log('this.a',this,this.a)
                // }, 1000);
                // setTimeout(function () {
                //     this.a+=1;
                //     this.c = this.a + this.b;
                //     console.log('this.a',this,this.a)
                // }, 2000);
            },
            init2(){
                //1
                this.$watch('someObject',function(n,o) { //$watch
                    console.log('someObject callBack',n.a,o.a,n==o)
                },{deep:true})      //deep：true
                this.someObject.a = 441;      //响应
                setTimeout(()=>{
                    this.someObject.a = 442;  //响应
                },1000)
                setTimeout(()=>{
                    this.someObject.a=443;    //响应
                },2000)

                //2
                this.$watch('someObject2',function(n,o) {
                    console.log('someObject2 callBack',n,o)
                },{deep:false})           //deep：false
                this.someObject2.a = 441; //不会响应
                setTimeout(()=>{
                    this.someObject2.a = 442; //不会响应
                },1000)
                setTimeout(()=>{
                    this.someObject2 = {};//响应
                },2000)

                //3
                var _unwatch = this.$watch('immediateData', function(n,o) {
                    console.log('immediateData 进来',n,o)//带有immediate，不能在第一次回调时取消侦听,除非加个if (_unwatch) 
                    if (_unwatch) {
                        console.log('immediateData 进来 _unwatch')
                        _unwatch()
                    }
                }, {
                    immediate: true
                })
                this.immediateData = "miwa";
                setTimeout(() => {
                    this.immediateData = "miwa2"; //不会响应，因为unwatch()了
                }, 1500);

                //4
                this.$set(this.setDiyObj,'a','setDiyObj'); //$set
                setTimeout(() => {
                    this.setDiyObj.a = 'setDiyObj change';
                    console.log('setDiyObj after',this.setDiyObj.a,this.setDiyObj);
                }, 1000);

                //5
                this.$set(this.setDiyArr,1,'setDiyArr2'); //$set
                console.log('setDiyArr',this.setDiyArr); 
                setTimeout(() => {
                    this.setDiyArr[0] = 'setDiyArr1';
                    console.log('setDiyArr after',this.setDiyArr);
                    
                    this.$delete(this.setDiyArr,1);  //$delete
                    console.log('setDiyArr delete after',this.setDiyArr,this.setDiyArr[0],this.setDiyArr[1]);
                }, 1500);


                
            }
        },
        
    }
</script>

<style lang="less" scoped>

</style>