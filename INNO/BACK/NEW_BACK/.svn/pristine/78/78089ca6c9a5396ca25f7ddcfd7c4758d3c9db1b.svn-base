<template>
	<div>
		<Modal v-model="isShowModal">
			<div slot="header">{{formItem.id ? '编辑分组' : '新增分组'}}</div>
			<Form ref="formValidate" :model="formItem" :rules="ruleValidate" :labelWidth="100" >
				<FormItem label="分组名称：" prop="name">
					<Input style="width:300px;" placeholder="请输入分组名称" v-model="formItem.name"></Input>
				</FormItem>
				<FormItem label="是否启用：" prop="is_enabled">
					<i-switch v-model="formItem.is_enabled" false-value="0" true-value="1" size="large">
						<span slot="open">启用</span>
						<span slot="close">关闭</span>
					</i-switch>
				</FormItem>

				<FormItem label="请选择店铺" prop="storeSelect" >
					<!--<store-select :data="formItem.storeSelect" type="checkbox" @del-tag="handleStoreTag">-->
						<Button type="dashed" @click="handleSelect('store', 'storeSelect')" class="basic_select">{{storeText}}</Button>
					<!--</store-select>-->
				</FormItem>

				<FormItem label="请选择商品" prop="goodsSelect" >
					<Button type="dashed" @click="handleSelect('goods', 'goodsSelect')" class="basic_select">{{goodsText}}</Button>
				</FormItem>
			</Form>
			<div slot="footer">
				<Button @click="isShowModal = false">返回</Button>
				<Button type="primary" @click="saveGroup">保存</Button>
			</div>
		</Modal>
		<goods-select :data="formItem.goodsSelect" type="checkbox" @del-tag="handleGoodsTag"></goods-select>
	</div>
</template>
<script>
    import StoreSelect from '@/views/my-components/list-component/index-edit';
    import goodsSelect from '@/views/my-components/goods-select/goods-select';
	export default{
        components: {
            StoreSelect, //门店插件
            goodsSelect,
        },
		data(){
			return {
				isShowModal: false,
				formItem:{
					id:0,
					name:'',
					is_enabled:'1',
                    storeSelect: [], //选择门店数据
                    goodsSelect: [], //选择商品
				},
				ruleValidate:{
					name:[{required: true, message: '分组名称不能为空', trigger: 'blur'}],
				}
			}
		},
        computed: {
            goodsText () {
                let goods_count = this.formItem.goods_count;
                const len =  Array.isArray(this.formItem.goodsSelect) ? this.formItem.goodsSelect.length : 0;
                return len > 0 ? `选择商品(已选${len}个)` : '点我选择商品';
            },
            storeText () {
                const len = Array.isArray(this.formItem.storeSelect) ? this.formItem.storeSelect.length : 0;
                return len > 0 ? `选择店铺(已选${len}个)` : `选择店铺`;
            }
        },
		methods:{
            handleSelect (mode, name) {
                this.$selectContent({
                    mode: mode,
                    type: 'checkbox',
                    data: this.formItem[name],
                    getList: (data) => {
                        this.$set(this.formItem, 'store_count', data.length);
                        this.$set(this.formItem, name, data);
                        if (mode === 'store') {
                            this.$refs.formValidate.validateField('storeSelect');
                        } else if (mode === 'goods') {
                            this.$refs.formValidate.validateField('goodsSelect');
                        } else if (mode === 'store') {
                            this.$refs.formValidate.validateField('storeSelect');
                        }
                    }
                })
            },
            handleStoreTag (data) {
                this.formItem.storeSelect = data; //选择门店信息
            },
            handleGoodsTag (data) {
                this.formItem.goodsSelect = data; //选择商品信息
            },
			//打开弹窗
			showModal(editInfo){
                console.log('打印：', editInfo);
                if (editInfo == undefined){
                    this.formItem = {
                        id:0,
                        name:'',
                        is_enabled:'0',
                        storeSelect: [], //选择门店数据
                        goodsSelect: [], //选择商品
					};
				} else if (editInfo && editInfo.id) {
                    this.formItem = {
						...this.formItem,
						...editInfo || {}
					};
                    this.$ajax.post(this.$api.pickupGoodsGroupMsg,{
                        id: editInfo.id,
                    }).then((response)=>{
                        let res = response.data || {};
                        if(res.code){
                            this.formItem.storeSelect = res.data.storeSelect || [];
                            this.formItem.goodsSelect = res.data.goodsSelect || [];
                        }
                        console.log('打印：', this.formItem, '数据：', res.data);
                    })
				}
				this.isShowModal = true;
			},
			//保存
			saveGroup(){
				this.$refs["formValidate"].validate((valid)=>{
					if(valid){
					    /*if (this.formItem.storeSelect.length <= 0){
					        this.$Message.error('请选择店铺！');return false;
						}
						if (this.formItem.goodsSelect.length <= 0){
					        this.$Message.error('请选择商品！');return false;
						}*/
						this.spinShow = true;
						let id = parseInt(this.formItem.id) || 0;
						let req = id ? 'pickupGoodsGroupEdit' : 'pickupGoodsGroupAdd'
						this.$ajax.post(this.$api[req],{
							id: id,
							name: this.formItem.name,
							is_enabled: this.formItem.is_enabled,
                            goods_id: this.formItem.goodsSelect.map(item => item.id).join(), //
                            store_id: this.formItem.storeSelect.map(item => item.id).join(), //
						}).then((response)=>{
							let res = response.data || {};
							if(res.code){
								this.$Message.success(res.message);
								this.isShowModal = false;
								this.$emit("saveCallback")
							}
						}).finally(()=>{
							this.spinShow = false;
						})
					}
				})
			}
		}
	}
</script>