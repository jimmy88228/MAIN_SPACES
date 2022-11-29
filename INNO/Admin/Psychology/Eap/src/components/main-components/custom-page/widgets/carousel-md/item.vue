<template>
    <div class="item-box" ref="itemBox">
        <div class="item flex-c-c" ref="item" :style="carouselStyle">
            {{textData}}
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            textData: {
                type: String,
                default: ""
            },
            duration:{
                type: Number,
                default: 1000
            }
        },
        data() {
            return {
                carouselStyle:"",
                pxPerSecond:50,
                timeoutId:null,
            }
        },
        methods: {
            start() {
                clearTimeout(this.timeoutId);
                this.carouselStyle = "";
                let item = this.$refs.item;
                let itemBox = this.$refs.itemBox;
                let itemW = this._getDomProperty(item,'width');
                let itemBoxW = this._getDomProperty(itemBox,'width');
                this.setAnim(itemW-itemBoxW,itemBoxW); 
            },
            setAnim(diff,itemBoxW){
                let duration = 0,late = 1.5;
                // console.log('diff',diff,itemBoxW)
                if(diff>0){
                    this.carouselStyle = `transform:translateX(${(itemBoxW).toFixed(1)}px);`;
                    duration = Math.ceil(Math.max(diff/this.pxPerSecond,1)); 
                    this.$nextTick(()=>{
                        this.carouselStyle = `transform:translateX(-${(diff).toFixed(1)}px);transition: transform ${duration}s linear;`;
                    })
                }
                this.$nextTick(()=>{
                    this.timeoutId = setTimeout(() => {
                        this.$emit('over');
                        setTimeout(() => {
                            this.carouselStyle = "";
                        }, (this.duration + 500));
                    }, ((duration+late)*1000));
                })
            }
        }, 
    }
</script>

<style lang="less" scoped>
.item-box{
    position: relative;
    width:100%;
    height: 100%; 
} 
.item{
    position: absolute;
    white-space: nowrap;
    word-break: break-all;
    left: 0;
    top: 0;
    height: 100%; 
}
.img-box{
    padding-right: 10px;
    flex-shrink: 0;
    height: 100%;
}  
</style>