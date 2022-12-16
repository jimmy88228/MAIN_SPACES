<template> 
    <!-- <div class="custom-swiper" @touchmove="fn"> -->
    <div class="custom-swiper">
        <!-- <div ref="swiperRef" :class="className" class="swiper-box" @touchstart="s" @touchmove="m" @touchend="e"> -->
        <div :style="animStyle" ref="swiperRef" :class="[className,settings.direction]" class="swiper-box" >
            <slot/>
        </div>
    </div>
</template>

<script>
const baseSetting={
    autoPlay:true,
    duration:500,
    interval:2000,
    direction:"horizontal"
}
export default {
    name:"customSwiperName",
    props: {
        settings: {
            type: Object,
            default:()=>(this._deepCopy(baseSetting)) 
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
                    let temp = this._deepCopy(nV);
                    for(let key in baseSetting){
                        if(!nV.hasOwnProperty(key)){
                            temp[key] = baseSetting[key];
                        }
                    }
                    this.backupSetting = temp;
                }
            },immediate:true,deep:true
        },
        backupSetting:{
            handler(nV,oV){
            },immediate:true,deep:true
        }
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
            if(type == 'immediate'){
                clearTimeout(this.timerId);
                this._wh(current);
                return
            }
            this.timerId = setTimeout(() => {
                this._wh(current);
            }, this._getSet('interval'))
        },
        _wh(current) {
            this.$emit('beforeChange', this.current);
            this.current = current;
            this._setTransform();
            setTimeout(() => {
                this.$emit('afterChange', this.current)
                if (this._getSet('autoPlay')) {
                    this._setTime((this.current+1)%this._getDoms().length)
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