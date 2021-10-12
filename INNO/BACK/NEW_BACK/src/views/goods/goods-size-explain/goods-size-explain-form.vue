<template>
  <PageTopBase isSave @save="confirm">
    <div class="goods_size-explain">
      <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="140">
        <FormItem label="尺码图名称" prop="name">
          <Input v-model="formItem.name" placeholder="请输入尺码图名称" class="basic_input basic_input_fixed" :maxlength="30" show-word-limit/>
        </FormItem>

        <FormItem label="尺码图分类" prop="cat_id">
          <Select v-model="formItem.cat_id" style="width:300px;" filterable clearable>
            <Option value="0">请选择分类</Option>
            <Option :value="item.id" v-for="item in formItem.cat_list" :key="item.id">{{item.name}}</Option>
          </Select>
        </FormItem>

        <FormItem label="关联商品品牌">
            <Select v-model="formItem.related_goods_brands" placeholder="请选择商品品牌" class="basic_select" multiple>
                <!-- <Option :value="0">全部</Option> -->
                <Option v-for="item in formItem.goods_brand" :value="item.goods_brand_id" :key="item.goods_brand_id">{{ item.goods_brand_name }}</Option>
            </Select>
        </FormItem>

        <FormItem label="关联商品标准分类" prop="related_cat_ids">
            <!-- <p class="class_name">标准分类</p> -->
            <div class="class_tree">
                <Tree :data="formItem.catData" @on-check-change="(arr)=>changeTree(arr, 'related_cat_ids')" show-checkbox multiple empty-text="暂无标准分类"></Tree>
            </div>
        </FormItem>


        <FormItem label="尺码图1" prop="size_img1">
          <image-edit :img="formItem.size_img1" @selectImg="openImagesModal('size_img1', formItem.size_img1 )" @delImg="handleDelImg('size_img1')">
            <!-- <p class="strong_tips">活动图片宽度会自动满屏显示，图片尺寸最佳是640*1008，格式为 jpg 或 png，图片大小控制在200KB</p> -->
          </image-edit>
        </FormItem>

        <FormItem label="尺码图2" prop="size_img2">
          <image-edit :img="formItem.size_img2" @selectImg="openImagesModal('size_img2', formItem.size_img2 )" @delImg="handleDelImg('size_img2')">
            <!-- <p class="strong_tips">活动图片宽度会自动满屏显示，图片尺寸最佳是640*1008，格式为 jpg 或 png，图片大小控制在200KB</p> -->
          </image-edit>
        </FormItem>

       <FormItem label="示例效果图">
            <img src="@rs/images/example_img.png" style="width: 350px;" alt="示例效果图">   
        </FormItem>    

        

        <!-- <FormItem label="活动时间" prop="activityDate">
          <DatePicker v-model="formItem.activityDate" type="datetimerange" placeholder="请选择活动时间" class="time_range"  @on-change="handleTimeRange"></DatePicker>
        </FormItem>

        <FormItem label="是否启用" prop="is_enabled">
          <i-switch v-model="formItem.is_enabled" true-value="1" false-value="0">
            <span slot="open">启用</span>
            <span slot="close">关闭</span>
          </i-switch>
        </FormItem>

        <FormItem label="活动页面" prop="page_id">
          <Select v-model="formItem.page_id" style="width:300px;" filterable clearable>
            <Option value="0">请选择页面</Option>
            <Option :value="item.page_id" v-for="(ind,item) in formItem.pageList" :key="ind">{{item.page_name}}</Option>
          </Select>
        </FormItem> -->

      


      </Form>
      <Spin size="large" fix v-if="spinShow"></Spin>
    </div>
  </PageTopBase>
</template>

<script>
    import PageTopBase from '@/views/my-components/page-top-base/index';
    import CouponSelect from '@/views/my-components/list-component/index-edit';
    import ImageEdit from '@/views/my-components/image-edit/image-edit';


    export default {
        props: ['id'],
        components: {
            PageTopBase,
            CouponSelect,
            ImageEdit
        },
        data () {
            const checkPrize = (rule,value,callback) => {
                console.log(value);
                if(value.length==0){
                    callback( new Error('奖励还没设置哦！'));
                }else{
                    var member = 0;
                    var error_msg = '';
                    for(var k in value){
                        var i = parseInt(k)+1;
                        if(!value[k]['rule_name'] || value[k]['rule_name']==''){
                            error_msg += '\r 第'+i+"级奖励名称不能为空！ \r\n";
                        }
                        if(member>0 && value[k]['member']<=member){
                            error_msg +=　"\r 第"+i+"级奖励条件不能小于等于上级奖励条件哦！\n\r";
                        }
                        console.log(value[k]['bonusArr'])
                        if ((JSON.stringify(value[k]['bonusArr']) === '{}') || value[k]['bonusArr'].length===0) {
                            error_msg += '\r 第'+i+'级的奖励为空哦！'; // 如果为空,返回false
                        }
                        member = parseInt(value[k]['member']);
                    }
                    if(error_msg !=''){
                        callback( new Error(error_msg));
                    }else{
                        callback();
                    }
                }
            };
            const checkDay = (rule, value, callback) => {
                if (this.formItem.send_rule == 2) {
                    if (!value) {
                        callback(new Error('天数不能为空'))
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            };
            const checkMonth = (rule, value, callback) => {
                if (this.formItem.send_rule == 3) {
                    if (!value) {
                        callback(new Error('天数不能为空'))
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            };
            return {
                formItem: {
                    id: this.id,
                    active_name: '',
                    activityDate: [],
                    is_enabled: '0',
                    page_id:'0',
                    rewardArr:{},
                    pageList:[],
                    couponData: [],
                    related_cat_ids: [],
                    cat_list: [],
                    cat_id: 0,
                    goods_brand: [],
                    catData: [],
                    /*rankData: [],
                    send_rule: '1',
                    day: 1,
                    month: 1,
                    integral: 0*/
                },
                catData: [],
                vcatData: [],
                
                ruleValidate: {
                    name: [{
                        required: true, message: '名称不能为空', trigger: 'blur'
                    }],
                    // day: [{
                    //     validator: checkDay, trigger: 'blur', type: 'number'
                    // }],
                    // page_id:[{ required: true,  message:'请选择页面', trigger:'change', type: 'number'}],
                    // rewardArr:[{validator:checkPrize,trigger:'blur'}],
                    // month: [{
                    //     validator: checkMonth, trigger: 'blur', type: 'number'
                    // }],
                    // rankData: [
                    //     {required: true, message: '优惠会员等级不能为空', trigger: 'change', type: 'array', min: 1}
                    // ]
                },
                rewardArr:[
                    {id: 0, rule_name:'',member:1,bonusIds:'',bonusArr:{}}
                ],
                spinShow: false
            }
        },
        computed:{
			limitIdsJson:{
				get(){
					let limit_ids = this.formItem.related_cat_ids || [];
					let ids = {};
					for(let i = 0; i < limit_ids.length; i++){
						ids[limit_ids[i]] = {}
					}
					return ids;
				},
				set(){}
			}
		},
        methods: {
            loadData (page, data) {
                this.rewardArr = [];
                this.spinShow = true;
                let params = Object.assign({}, data);
                return this.$ajax.post(this.$api.goodsSizeExplainInfo, {
                    id: this.id || 0
                })
                .then(response => {
                    const res = response.data;
                    if (res.code) {
                        let data = res.data;
                        console.log('返回数据222：', data);
                        // if (this.id) {
                            this.formItem = data;
                            this.installSelectTreeData(data);
                            // console.log(formItem)
                            // let rewardArr = data.rewardArr;
                            // for (let i = 0; i < rewardArr.length; i++) {
                            //     rewardArr[i].member = Number(rewardArr[i].member)
                            // }
                            // this.rewardArr = rewardArr;
                        // }else {
                        //     this.formItem.catData = data.catData;
                        //     this.formItem.cat_list = data.cat_list;
                        //     this.formItem.goods_brand = data.goods_brand;
                        //     this.installSelectTreeData(data);
                        //     // this.formItem.pageList = data.pageList;
                        // }
                        this.spinShow = false;
                    }
                });
            },
            handleTimeRange ([from_time, to_time]) {
                this.formItem.from_time = from_time;
                this.formItem.to_time = to_time;
            },
            handleChange () {
                this.$refs.day.validateState = '';
                this.$refs.month.validateState = '';
            },
            confirm() {
                console.log(2312312312)
                this.$refs.formValidate.validate(valid => {
                    console.log(valid)
                    if (valid) {
                        this.spinShow = true;
                        this.$ajax.post(this.$api.goodsSizeExplainSave, {
                            id: this.id || 0,
                            name: this.formItem.name,
                            related_cat_ids: this.formItem.related_cat_ids,
                            size_img1: this.formItem.size_img1,
                            size_img2: this.formItem.size_img2,
                            cat_id: this.formItem.cat_id,
                            related_goods_brands: this.formItem.related_goods_brands
                            // activityDate: this.formItem.activityDate,
                            // is_enabled: this.formItem.is_enabled,
                            // page_id: this.formItem.page_id,
                            // rewardArr: newReward,
                            // couponData: this.formItem.couponData
                        })
                            .then(response => {
                                const res = response.data;
                                if (res.code) {
                                    this.$Message.success(res.message);
                                    this.$router.go(-1);
                                }
                                this.spinShow = false;
                            });
                    }
                })
            },
            openImagesModal (name, url) {
                this.$selectMaterial({
                    type: 'image',
                    selectedData: url,
                    getList: (item) => {
                    this.formItem[name] = item.src;
                    this.$refs.formValidate.validateField(name);
                    }
                });
            },
            handleDelImg (name) {
                this.formItem[name] = '';
            },
            changeTree(arr, name){
				console.log("arr", arr)
				let _arr = []
				for(let i = 0; i < arr.length; i++){
					let value = arr[i].cat_id || 0;
					if(value){
						_arr.push(value)
					}
				}
                // console.log(_arr)
				this.$set(this.formItem, name, _arr);
                // console.log(this.formItem)
			},
            installSelectTreeData(data){
                console.log('lxj')
                console.log(this.limitIdsJson)
                console.log(this.formItem.catData)
                //  this.loadExtraData();
				this.formItem.catData = this.installClassData(this.formItem.catData, true, this.limitIdsJson);
                console.log(this.formItem.catData)
			},
            installClassData(data, expand, idsJson = {}){
					for(let i = 0; i < data.length; i++){
						data[i].expand = expand;
						if(idsJson[data[i].cat_id]){
							data[i].checked = true;
						} else {
							data[i].checked = false;
						}
						let children = data[i].children || []
						if(children.length > 0){
							this.installClassData(children, expand, idsJson);
						}
					}
					return data;
			},
            loadExtraData() {
				this.$ajax.all(
					[
						this.$ajax.post(this.$api.catTree),
						this.$ajax.post(this.$api.vcatTree)
					]
				).then(
					this.$ajax.spread((catData, vcatData) => {
						let catRes = catData.data;
						if (catRes.code) {
							this.catData = catRes.data;
						}
                        console.log(this.catData)
						let vcatRes = vcatData.data;
						if (vcatRes.code) {
							this.vcatData = vcatRes.data;
						}
					})
				);
			},
        },
        mounted () {
            // this.loadExtraData();
            this.loadData();
            
        }
    }
</script>

<style lang="less" scoped>
  .goods_size-explain{
    .ivu-switch-large {
      width: 56px;
    }
    .w_200 {
      width: 200px;
    }
    .basic_input_fixed, .basic_textarea{
      max-width: 420px;
    }
    .time_range{
      width: 340px;
    }
    .content{
      display: inline-block;
      vertical-align: bottom;
    }
    .radio_item{
      margin-bottom: 24px;
    }
    .form_item{
      margin-bottom: 20px;
      &:last-child{
        margin-bottom: 0;
      }
    }
    .class_tree{
			width: 400px;
			height: 250px;
			overflow-y: auto;
			overflow-x: hidden;
			background-color:#efefef;
			padding-left:10px;
		}
  }
</style>
