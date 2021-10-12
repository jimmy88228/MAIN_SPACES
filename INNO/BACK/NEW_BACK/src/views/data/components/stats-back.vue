<template>
    <div class="page-header m-bottom-15 flex f-align-center" v-show="showHead">
        <Tooltip content="返回" v-if="isBack">
            <Icon type="ios-arrow-dropleft" @click="goBack" style="cursor: pointer;" size="28"/>&nbsp;&nbsp;
        </Tooltip>
				<div class="brand-head" v-if="type == 'store'">
							当前店铺&nbsp;&nbsp;
							<Button type="dashed" @click="changeStore">
								<template v-if="data.length > 0">
									选择{{data.length}}个所属店铺
								</template>
								<template v-else>
									{{ data.id ? data.name : '选择所属店铺' }}
								</template>
							</Button>
				</div>
        <div class="brand-head" v-if="type == 'brand'">
					<template>当前查看品牌&nbsp;&nbsp;
						<Button type="dashed" @click="changeBrand">{{ data.id ? data.name : '选择品牌' }}</Button>
					</template>
        </div>
    </div>
</template>
<script>
export default {
    name: "statsBack",
    components: {},
    props: {
			showHead: {
				type: Boolean,
				default: true
			},
			isBack: true,
			type: String,
			data: [Object, Array]
		},
    data(){
        return {}
    },
    methods:{
        goBack(){
            this.$router.go(-1);
        },
				installData(data){
					if(data instanceof Object){
						if(!(data instanceof Array)){
							return [data];
						}
						return data
					}
					return []
				},
        changeBrand(){
					let that = this;
					this.$selectContent({
							mode: 'subbrand',
							type: 'radio',
							listKey: 'brandId',
							data: this.installData(this.data),
							getList: (data) => {
								that.$emit("on-changeData", data);
							}
					});
        },
				changeStore(){
					let that = this;
					this.$selectContent({
							mode: 'store',
							type: 'checkbox',
							listKey: '',
							data: this.installData(this.data),
							getList: (data) => {
								that.$emit("on-changeData", data);
							}
					});
				}
    }
}
</script>
<style lang="less">
    .page-header{
        .brand-head{
            font-size:15px;
        }
        
    }
</style>
