<template> 
    <div class="custom-swiper">
        <div :style="animStyle" ref="swiperRef" :class="[className,settings.direction]" class="swiper-box" @mousedown="s" @mouseup="e">
            <slot/>
        </div>
    </div>
</template>

<script>
const baseSetting={
    autoPlay:true,
    duration:500,
    interval:2000,
    direction:"horizontal",
    isCanTouch:true,
}
export default {
    name:"customSwiperName",
    props: {
        settings: {
            type: Object,
            default:()=>({}) 
        }, 
    },
    data() {
        return {
            current:0, 
            className:"",
            swiper:null,
            slideDoms:{},
            backupSetting:this._deepCopy(baseSetting),
            timerId:null,
            animStyle:"",
            sliding:false,
            curX:0,
        }
    },
    components: { 
    },  
    mounted() {
        this.className = `custom_swiper_${Math.random().toFixed(3) * 1000}`;
        setTimeout(() => { 
            this._starDom();
        }, 50)
    },
    computed:{
    },
    watch:{
        settings:{
            handler(nV,oV){
                if(nV && typeof nV == 'object'){
                    this.backupSetting = {
                        ...baseSetting,
                        ...nV
                    }
                }
            },immediate:true,deep:true
        },
    },
    methods: { 
        _starDom() {
            let doms = this._getDoms(); 
            this.$emit('init');
            if(doms.length>1 && this.backupSetting.autoPlay){
                this._setTime(this.current+1);
            }
        },
        _setTime(current,type) {
            if(this.sliding)return;
            clearTimeout(this.timerId);
            if(type == 'immediate'){
                this._wh(current);
                return
            }
            this.timerId = setTimeout(() => {
                this._wh(current);
            }, this._getSet('interval'))
        },
        _wh(current) {
            if(this.sliding)return;
            this.$emit('beforeChange', this.current , current);
            this.current = current;
            this._setTransform();
            setTimeout(() => {
                if(this.sliding)return;
                this.$emit('afterChange', this.current)
                if (this._getSet('autoPlay')) {
                    this._setTime(this._nextSlide())
                }
            }, this._getSet('duration'))
        },
        _setTransform(){
            let swiper = this._getSwiper();
            let width = this._getDomProperty(swiper,'width');
            let height = this._getDomProperty(swiper,'height');
            if(this._getSet('direction') == 'horizontal'){
                this.animStyle = `transform:translate3d(-${width * this.current}px,0,0);transition: all ${this._getSet('duration')}ms linear;`
            }else{
                this.animStyle = `transform:translate3d(0,-${height * this.current}px,0);transition: all ${this._getSet('duration')}ms linear;`
            }
        },
        s(e){
            if(!this._getSet('isCanTouch'))return
            this.sliding = true;
            this.curX = e.clientX||0;
        },
        e(e){
            if(!this._getSet('isCanTouch'))return
            let endX = e.clientX||0;
            let newCurrent = this.current; 
            this.sliding = false;
            if(this.curX!=endX){
                if(this.curX>endX){//滑动切下一个
                    console.log('滑动切下一个')
                    newCurrent=this._nextSlide();
                }else{ //上一个
                    console.log('滑动切上一个')
                    newCurrent=this._preSlide();
                }
            }
            this.slideTo(newCurrent)
        },
        _nextSlide(){
            return (this.current+1)%this._getDoms().length;
        },
        _preSlide(){
            return (this.current-1)%this._getDoms().length;
        },
        _getSwiper(){
            this.swiper = this._getRef('swiperRef');
            return this.swiper;
        },
        _getDoms(){
            this.slideDoms = document.querySelector('.' + this.className).getElementsByClassName('slide-box');
            return this.slideDoms||{};
        },
        _getSet(property){
            return property ? this.backupSetting[property] : this.backupSetting;
        },

        //暴露的方法
        init(){
            this._starDom();
        },
        slideTo(current){
            this._setTime(current,'immediate');
        },
        
    }, 
}
</script>
<style lang="less">
 
</style>
<style lang="less" scoped> 
.custom-swiper {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 1;
    overflow: hidden;
    width: 100%;
    .swiper-box{
        position: absolute;
        left: 0;
        top: 0;
        display: flex;
        min-width: 100%;
        height: 100%;
        flex-wrap: nowrap;
        transform: translate3d(0,0,0);
        // transform: translateX(0);
        &.vertical{
            flex-direction: column;
        }
    }
}
</style>