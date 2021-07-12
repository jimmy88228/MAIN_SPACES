<style lang="less">
  .machine{
    background-color: #fff;
    padding: 1rem;
    min-width: 1000px;
    width: 100%;
    .w_300{
      width: 300px;
    }
  }

  .page-cat-list{
    .table-topbar{
      .ivu-form-item{
        margin-bottom: 10px;
      }
      .ivu-input-icon-clear{
        right:50px;
      }
    }
  }

</style>

<template>
  <!--<div class="page-cat-list">
    <Card v-show="showList">
      <div class="table-topbar" style="margin-bottom: 10px;">
        <Row style="display:flex;">
          <Col style="flex:1 1 0%;"></Col>
          <Col style="width:210px;text-align: right;">
            <Button type="info" icon="md-add" @click="addCat">新增广告组</Button>
            <Button icon="md-refresh" @click="initData" shape="circle" title="刷新列表"></Button>
          </Col>
        </Row>
      </div>

      <Table :loading="tableLoading" :height="tableHeight" :columns="columns" :data="data"></Table>
      <div v-show="pageTotal>0" class="table-pager-footer">
        <div style="float: right;">
          <Page :total="pageTotal" :page-size="pageSize" :current="1" @on-change="changePage" show-total></Page>
        </div>
      </div>
    </Card>

    &lt;!&ndash;表单组件&ndash;&gt;
    <pageCatForm ref="page-cat-form" @on-close="closeForm" @on-save="onFormSave"></pageCatForm>
  </div>-->

  <div class="machine">
    <!-- 广告组维护 -->
    <div v-show="act=='group'">
      <div class="info" v-show="infoShow">
        <Form :model="group" :label-width="150" label-position="left" show-message>
          <FormItem label="广告组名称" prop="name">
            <Input v-model.trim="group.name" clearable></Input>
          </FormItem>
          <FormItem label="备注" prop="remark">
            <Input type="textarea" v-model.trim="group.remark" class="w_300">
            </Input>
          </FormItem>
        </Form>
        <Button @click.native="infoShow=false">返回</Button>
        <Button type="primary" @click.native="saveGroup">保存</Button>
      </div>
      <!-- 广告组列表 -->
      <div class="table-list" v-show="!infoShow">
        <div style="text-align:right;margin-bottom:10px;">
          <Button type="primary" @click.native="infoShow=true;editIndex=-1;group={}">+新增广告组</Button>
        </div>

        <div>
          <Table :loading="tableLoading" :columns="columns" :data="data"></Table>
          <div style="margin: 10px;overflow: hidden">
            <div style="float: right;margin:auto 10px;">
              <Page :total="pageTotal" :page-size="pageSize" :current="1" @on-change="changeGroupPage" show-total></Page>
            </div>
            <div style="float: right;">每页条数&nbsp;&nbsp;<InputNumber v-model="pageSize" :step="5" :min="1" :precision="0" :active-change="false" @on-change="changeGroupPage(-1)"></InputNumber></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 选择广告位（basci） -->
    <div class="table-list" v-show="act=='basic'">
      <div style="text-align:left;margin-bottom:10px;"><Button @click.native="act='group'">返回上一级</Button></div>

      <div style="margin:10px 0;">当前位置：<span style="font-size:14px;font-weight:bold;">{{group.name}}广告组 / 广告位</span></div>
      <Table :columns="basic_col" :data="basic_data"></Table>
    </div>

    <!-- 广告位->广告列表 -->
    <div v-show="act=='ads'">
      <div class="table-list" v-show="!infoShow">

        <div style="text-align:right;margin-bottom:10px;">
          <Button @click.native="act='basic'" class="fl" style="margin-right:10px;">返回上一级</Button>&nbsp;
          <Button @click.native="act='group'" class="fl">返回顶级</Button>&nbsp;
          <Button type="primary" @click.native="editAdsInfo(-1)">+新增广告</Button>
        </div>
        <div style="margin-bottom:10px;">当前位置：<span style="font-size:14px;font-weight:bold;">{{group.name}}广告组 / {{basic.name}}广告位 / 广告列表</span></div>
        <Table :loading="tableLoading" :columns="ads_col" :data="adsList"></Table>
        <div style="margin: 10px;overflow: hidden">

          <div style="float: right;margin:auto 10px;">
            <Page :total="ads_pageTotal" :page-size="pageSize" :current="1" @on-change="getAdsList" show-total></Page>

          </div>
          <div class="fr" style="float: right;">每页条数&nbsp;&nbsp;<InputNumber v-model="pageSize" :step="5" :min="1" :precision="0" :active-change="false" @on-change="getAdsList(-1)"></InputNumber></div>
        </div>
      </div>
      <!-- 广告位的广告维护 -->
      <div class="info" v-show="infoShow">
        <Form ref="formValidate" :model="formItem" :label-width="150" label-position="left" :rules="ruleValidate" show-message>
          <FormItem label="广告名称" prop="name">
            <Input v-model.trim="formItem.name" class="w_300" clearable></Input>
          </FormItem>
          <FormItem label="广告类型" prop="related_type">
            <Select v-model="formItem.related_type" class="w_300">
              <Option v-for="(vi,key) in ads_type" :value="key" :name="key" :key="key">{{vi}}</Option>
            </Select>
          </FormItem>
          <FormItem label="选择视频" prop="related_id" v-if="formItem.related_type=='VIDEO'">
            <Select v-model="formItem.related_id" class="w_300">
              <Option v-for="(vi,index) in videoList" :name="index" :key="index" :value="vi.value">{{vi.label}}</Option>
            </Select>
          </FormItem>

          <!-- 编辑才显示 -->
          <FormItem label="广告图片" prop="desc_img">
            <image-edit :img="formItem.desc_img" @selectImg="openImagesModal('desc_img', formItem.desc_img )" @delImg="handleDelImg">
              <p>建议尺寸：300X300像素，支持jpg、png两种格式，大小不超过500K。</p>
            </image-edit>
          </FormItem>
          <formItem label="广告绑定类型" prop="bind_type">
            <Select v-model="formItem.bind_type" class="w_300" @on-change="changeBind">
              <Option v-for="(item,key) in bind_type" :value="key" :name="key" :key="key">{{ item }}</Option>
            </Select>
          </formItem>
          <FormItem label="广告绑定内容" prop="bind_related_id" v-if="formItem.bind_type!='NONE'">
            <Cascader v-model="formItem.bind_related_id" :data="cat" filterable v-if="formItem.bind_type=='CA'" class="w_300" trigger="hover" change-on-select></Cascader>
            <Cascader v-model="formItem.bind_related_id" :data="vcat" filterable v-else-if="formItem.bind_type=='VC'" class="w_300" trigger="hover" change-on-select ></Cascader>
          </FormItem>
          <FormItem label="排序" prop="sort">
            <InputNumber :precision=0 :min="0" v-model="formItem.sort"></InputNumber>
          </FormItem>
          <FormItem label="广告时长" prop="advert_interval">
            <InputNumber :precision="0" :min="0" v-model="formItem.advert_interval"></InputNumber> &nbsp;秒
          </FormItem>
          <FormItem label="广告有效时间" prop="activeTime">
            <DatePicker type="datetimerange" v-model="formItem.activeTime" format="yyyy-MM-dd HH:mm" placeholder="选择时间" class="w_300"></DatePicker>
          </FormItem>
          <FormItem label="是否启用" prop="is_enable">

            <i-switch v-model="formItem.is_enable" size="large" trueValue="1" falseValue="0">
              <span slot="open">开启</span>
              <span slot="close">关闭</span>
            </i-switch>
          </FormItem>
        </Form>
        <Button @click.native="infoShow=false">返回</Button>
        <Button type="primary" @click.native="saveAdsInfo">保存</Button>
      </div>
    </div>

    <!-- 分配店铺 -->
    <div class="info" v-show="act=='store'">
      <div style="margin-bottom:10px;">当前位置：<span style="font-size:14px;font-weight:bold;">{{group.name}}广告组 / 分配店铺</span></div>
      <Transfer
              :data="storeList"
              :target-keys="store_id"
              :titles="['待选列表','已选列表']"
              :list-style="listStyle"
              filterable
              :filter-method="filterMethod"
              :render-format="renderItem"
              @on-change="handleChange2">
      </Transfer>
      <div style="margin-top:10px;">
        <Button @click.native="act='group'">返回</Button>
        <Button type="primary" @click.native="saveGroupStore">保存</Button>
      </div>
    </div>

    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>
    import util from '../../../libs/util.js';
    import ImageEdit from '@/views/my-components/image-edit/image-edit';
    /**
     * 广告管理
     */
    export default {
        name: 'adList',
        components: {
            ImageEdit
        },
        data(){
            const checkPeriod = (rule,value,callback) => {console.log(value)
                if(!this.formItem.activeTime[0]){
                    callback( new Error('请选择有效日期'));
                }else{
                    callback();
                }
            };
            return {
                spinShow:false,
                infoShow:false,
                tableLoading:false,
                pageSize:20,
                pageTotal:0,
                page: 1,
                act:'group',	// group:广告组，store:分配店铺，basic:广告位，ads:广告
                data:[],
                columns:[],
                // 广告组表单
                group:{
                    id:0,
                    is_default:'0',
                    name:'',
                    remark:'',
                },
                editIndex:-1,
                // 基础广告位
                basic:{},
                basic_col:[],
                basic_data:[],
                adsList:[],
                ads_col:[],
                ads_pageTotal:0,
                formItem:{
                    id:0,
                    group_id:0,
                    advert_id:0,
                    name:'',
                    related_type:'IMAGE',
                    related_id:'0',
                    desc_img:'',
                    bind_type:'NONE',
                    bind_related_id:[],
                    advert_interval:0,
                    sort:0,
                    is_enable:'0',
                    start_time:'',
                    end_time:'',
                    activeTime:[],
                },
                ads_type:[],
                bind_type:[],
                cat:[],
                vcat:[],
                videoList:[],
                storeList:[],
                store_id:[],
                listStyle: {
                    width: '450px',
                    height: '300px'
                },
                ruleValidate:{
                    name:[{required:true, message:'广告名称不允许空',trigger: 'blur'}],
                    desc_img:[{ required: true, message: '广告图片不能为空', trigger: 'blur' },],
                    activeTime:[{required:true,validator:checkPeriod,trigger:'blur'},],
                },

                // 上传图片
                imageUploadUrl:'',
                uploadExtData:{},
                cdnHost:util.cdnHost,
                imageViewWidth: 600,
                imageViewShow: false,
                imageViewUrl: '',
            }
        },
        methods: {
            handleDelImg () {
                this.formItem.desc_img = '';
            },
            // 调起图片选择器
            openImagesModal (name, url) {
                let that = this;
                this.$selectMaterial({
                    type: 'image',
                    selectedData: url,
                    getList (item) {
                        that.formItem.desc_img = item.src;
                    }
                });
            },
            init(){
                this.getBasicAds();
                this.initData();
            },
            // 获取基础广告位
            getBasicAds(){
                this.$ajax.post(this.$api.getMachineBasicList,{
                }).then((response)=>{
                    this.basic_data = response.data.data.items;
                    this.basic_col = response.data.data.column;
                    this.basic_col.push(new Object({'title':'操作','width':150,'align':'center'}));
                    this.basic_col[(this.basic_col.length-1)]['render'] = (h, params) => {
                        var buttons = [];

                        // 删除按钮
                        buttons.push( h('Button', {
                            props: {
                                type: 'text',
                                size: 'small'
                            },
                            style: {
                                color:'#28a5ff',
                                marginRight: '5px'
                            },
                            on: {
                                click: () => {
                                    this.basic = params.row;
                                    this.infoShow = false;
                                    this.act = 'ads';
                                    this.getAdsList(1);
                                    // this.editInfo(params.index, params.row)
                                }
                            }
                        }, '查看广告') );


                        return h('div',{style:{textAlign:'center'}},buttons);
                    }

                })
            },
            // 初始化方法
            initData() {
                // 动态计算表高度
                this.tableHeight = document.body.clientHeight - 200;

                this.tableLoading = true;
                // ajax 请求获取初始化数据
                this.$ajax.post( this.$api.adLists, {
                    isInit: 1,
                })
                 .then( (response) => {
                        this.tableLoading = false;
                        var res = response.data;
                        if( res.code ){
                            this.columns = res.data.columns;
                            this.columns[1]['render'] = (h,params) => {
                                const row = params.row;
                                const color = row.is_default == 1 ? '#18cd18' : 'red';
                                const type = row.is_default == 1 ? 'md-checkmark-circle-outline' : 'md-close-circle';

                                return h('Icon', {
                                    props: {
                                        type: type,
                                        color: color
                                    },
                                    style:{
                                        fontSize:'30px',
                                        cursor:'pointer'
                                    },
                                    on: {
                                        click: () => {
                                            this.setDefault(params.index, params.row)
                                        }
                                    }
                                });
                            };
                            // 操作按钮
                            this.columns[ (this.columns.length-1) ]['render'] = (h, params) => {
                                var buttons = [];
                                if( params.row.handle.store ){
                                    // 编辑按钮
                                    buttons.push(
                                        h('span',
                                            {
                                                attrs:{
                                                    title:'分配店铺'
                                                }
                                            },
                                            [ h('span', {
                                                class:'table-handle-button',
                                                on: {
                                                    click: () => {
                                                        //this.editItem(params.row);
                                                        this.act = 'store';
                                                        this.group = params.row;
                                                        this.groupStore();
                                                    }
                                                }
                                            }, '分配店铺') ]
                                        )
                                    );

                                }

                                if( params.row.handle.basic ){
                                    // 编辑按钮
                                    buttons.push(
                                        h('span',
                                            {
                                                attrs:{
                                                    title:'广告管理'
                                                }
                                            },
                                            [ h('span', {
                                                class:'table-handle-button',
                                                on: {
                                                    click: () => {
                                                        //this.editItem(params.row);
                                                        this.act = 'basic';
                                                        this.group = JSON.parse(JSON.stringify(params.row));
                                                    }
                                                }
                                            }, '广告管理') ]
                                        )
                                    );

                                }

                                if( params.row.handle.edit ){
                                    // 编辑按钮
                                    buttons.push(
                                        h('span',
                                            {
                                                attrs:{
                                                    title:'编辑'
                                                }
                                            },
                                            [ h('span', {
                                                class:'table-handle-button',
                                                on: {
                                                    click: () => {
                                                        //this.editItem(params.row);
                                                        this.infoShow = true;
                                                        this.editIndex = params.index;
                                                        this.group = JSON.parse(JSON.stringify(params.row));
                                                    }
                                                }
                                            }, '编辑') ]
                                        )
                                    );

                                }

                                if( params.row.handle.remove ){
                                    // 编辑按钮
                                    buttons.push(
                                        h('span',
                                            {
                                                attrs:{
                                                    title:'移除'
                                                }
                                            },
                                            [ h('span', {
                                                class:'table-handle-button',
                                                on: {
                                                    click: () => {
                                                        this.delGroup(params.index, params.row);
                                                    }
                                                }
                                            }, '移除') ]
                                        )
                                    );

                                }
                                return h('div',buttons);
                            }

                            // 初始化表数据
                            this.data = res.data.items;
                            this.pageTotal = Number( res.data.total );
                            this.pageSize = Number( res.data.pageSize );
                            this.canCreate = res.data.canCreate;

                            this.bind_type = res.data.bind_type;
                            this.ads_type = res.data.ads_type;
                            this.cat = res.data.cat;
                            this.vcat = res.data.vcat;
                            this.videoList = res.data.videoList;

                            //广告数据
                            this.ads_col = res.data.ads_col;
                            this.ads_col[ (this.ads_col.length-2) ]['render'] = (h,params) => {
                                const row = params.row;
                                const color = row.is_enable == 1 ? '#18cd18' : 'red';
                                const type = row.is_enable == 1 ? 'md-checkmark-circle-outline' : 'md-close-circle';

                                return h('Icon', {
                                    props: {
                                        type: type,
                                        color: color
                                    },
                                    style:{
                                        fontSize:'30px',
                                        cursor:'pointer'
                                    },
                                    on: {
                                        click: () => {
                                            this.setEnable(params.index, params.row)
                                        }
                                    }
                                });
                            };

                            this.ads_col[(this.ads_col.length-1)]['render'] = (h, params) => {
                                var buttons = [];
                                // 删除按钮
                                buttons.push( h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    style: {
                                        color:'#28a5ff',
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.editAdsInfo(params.index, params.row)
                                        }
                                    }
                                }, '修改') );

                                // 删除按钮
                                buttons.push( h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    style: {
                                        color:'#28a5ff',
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.delGroupAds(params.index, params.row)
                                        }
                                    }
                                }, '移除') );


                                return h('div',{style:{textAlign:'center'}},buttons);
                            }
                        }
                    });

            },
            //分配店铺
            groupStore(){
                this.spinShow = true;
                this.$ajax.post( this.$api.getGroupStore,{
                    group_id:this.group.id,
                }).then( (response)=>{
                    this.spinShow = false
                    if (response.data.code==1) {
                        this.store_id = response.data.data.store;
                        this.storeList = response.data.data.storeList;
                    }else{
                        this.act = 'group';
                    }
                })
            },
            saveGroupStore(){
                //保存分配店铺
                this.$ajax.post( this.$api.saveGroupStores,{
                    group_id:this.group.id,
                    store_id:this.store_id
                }).then( (response)=>{
                    this.spinShow = false;
                    if (response.data.code==1) {
                        this.act = 'group';
                        this.$Message.success(response.data.msg);
                    }else{
                        this.$Message.error(response.data.msg);
                    }
                })
            },
            // 保存广告组信息
            saveGroup(){
                if (this.group.name=='') {
                    this.$Message.error('广告组名称不能为空！');
                    return false;
                }
                this.spinShow = true;
                this.$ajax.post( this.$api.saveGroupAds,this.group)
                    .then( (response)=>{
                        this.spinShow = false;
                        if (response.data.code==1) {
                            this.infoShow = false;
                            if (this.editIndex>=0) {
                                this.$set(this.data[this.editIndex],'name',this.group.name);
                                this.$set(this.data[this.editIndex],'remark',this.group.remark);
                            }else{
                                this.data.unshift(response.data.data);
                            }
                            this.$Message.success(response.data.msg);
                        }else{
                            this.$Message.error(response.data.msg);
                        }
                    })
            },
            // 设置默认广告组
            setDefault(index,items){
                if (items.is_default>0) {
                    this.$Message.info('请设置其他广告组为默认，即可取消当前广告组的默认值');
                    return false;
                }
                this.tableLoading = true;
                this.$ajax.post( this.$api.setDefaultGroup,{
                    id:items.id
                }).then( (response)=>{
                    if (response.data.code==1) {
                        this.$Message.success('设置成功！');
                        this.changeGroupPage(this.page);
                    }else{
                        this.tableLoading = false;
                        this.$Message.error(response.data.msg);
                    }
                })
            },
            // 切换分页
            changeGroupPage ( page ) {
                this.tableLoading = true;
                // ajax 请求获取数据
                this.$ajax.post( this.$api.adLists, {
                    page:page,
                })
                  .then( (response) => {
                      this.tableLoading = false;
                      var res = response.data;
                      if( res.code ){
                          // 初始化表数据
                          this.data = res.data.items;
                          this.pageTotal = Number( res.data.total );
                          this.pageSize = Number( res.data.pageSize );
                      }
                  });
            },
            //获取分组下的广告数据
            getAdsList(page){
                this.tableLoading = true;
                this.pageSize = !this.pageSize? 1: this.pageSize;
                this.$ajax.post( this.$api.getAdsList,{
                    advert_id:this.basic.id,
                    group_id:this.group.id,
                    page:page,
                    pageSize:this.pageSize,
                }).then( (response)=>{
                    this.tableLoading = false;
                    if (response.data.code==1) {
                        this.adsList = response.data.data.items;
                        this.ads_pageTotal = response.data.data.total;
                    }else{
                        this.$Message.error(response.data.msg);
                    }
                })
            },
            //广告按钮开关
            setEnable(index,items){
                if (items.id>0) {
                    var val = (items.is_enable>0)? 0: 1;
                    this.tableLoading = true;
                    this.$ajax.post(this.$api.setEnable,{
                        id:items.id,
                        group_id:items.group_id,
                        val:val
                    }).then((response)=>{
                        this.tableLoading = false;
                        if (response.data.code==1) {
                            this.$Message.success(response.data.msg);
                            this.$set(this.adsList[index],'is_enable',val);
                        }else{
                            this.$Message.error(response.data.msg);
                        }
                    })
                }else{
                    this.$Message.error('参数错误，请刷新重试！');
                }
            },
            //广告编辑
            editAdsInfo(index,items){
                this.$refs['formValidate'].resetFields();
                this.infoShow = true;
                this.editIndex = index;
                if (index >= 0) {
                    this.spinShow = true;
                    this.$ajax.post(this.$api.getAdsInfo,{
                        id:items.id,
                        group_id:items.group_id
                    }).then( (response)=>{
                        this.spinShow = false;
                        if (response.data.code==1) {
                            this.formItem = response.data.data;
                        }else{
                            this.$Message.error(response.data.msg);
                            this.infoShow = false;
                        }
                    })
                }else{
                    this.formItem.id = 0;
                }
            },
            //保存广告数据
            saveAdsInfo(){
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        this.spinShow = true;
                        this.formItem.group_id = this.group.id;
                        this.formItem.advert_id = this.basic.id;
                        console.log(this.formItem);
                        this.$ajax.post( this.$api.saveAdsInfos,this.formItem)
                            .then( (response)=>{
                                this.spinShow = false;
                                if (response.data.code==1) {
                                    this.infoShow = false;
                                    if (this.editIndex==-1) {
                                        this.adsList.unshift(response.data.data);
                                    }else{
                                        this.$set(this.adsList,this.editIndex,response.data.data);
                                    }
                                    this.$Message.success(response.data.msg);
                                }else{
                                    this.$Message.error(response.data.msg);
                                }
                            })
                    }
                })
            },
            delGroupAds(index,items){
                if (items.id>0) {
                    this.tableLoading = true;
                    this.$ajax.post(this.$api.delAds,{
                        id:items.id,
                        group_id:items.group_id,
                    }).then((response)=>{
                        this.tableLoading = false;
                        if (response.data.code==1) {
                            this.$Message.success(response.data.msg);
                            this.$delete(this.adsList,index);
                        }else{
                            this.$Message.error(response.data.msg);
                        }
                    })
                }else{
                    this.$Message.error('参数错误，请刷新重试！');
                }
            },

            // 搜索
            searchPage(){
                this.tableLoading = true;
                // ajax 请求获取数据
                this.$ajax.post( this.$api.goodsPageCatList, {
                    searchq: this.formSearch.searchq,
                })
                    .then( (response) => {
                        this.tableLoading = false;
                        var res = response.data;
                        if( res.code ){
                            // 初始化表数据
                            this.data = res.data.items;
                            this.pageTotal = Number( res.data.total );
                            this.pageSize = Number( res.data.pageSize );
                        }
                    });
            },
            // 编辑按钮
            editItem(row){
                //this.showList = false;
                //this.$refs['page-cat-form'].openModal(row);
                this.infoShow = true;
                this.editIndex = params.index;
                this.group = JSON.parse(JSON.stringify(params.row));
            },
            // 删除广告组信息
            delGroup(index,items){
                if (items.is_default>0) {
                    this.$Message.error('默认广告组不允许删除，请先设置默认广告组');
                    return false;
                }
                var that = this;
                this.$Modal.confirm({
                    title: '广告组删除',
                    content:'确定要删除‘'+items.name+'’广告组吗？其广告数据也会清除，数据将不可恢复，请谨慎操作，点‘确定’继续删除',
                    onOk: ()=> {
                        this.tableLoading = true;
                        this.$ajax.post( this.$api.delAdsGroup,{
                            id:items.id
                        }).then( (response)=>{
                            that.tableLoading = false;
                            if (response.data.code==1) {
                                that.$delete(that.data,index);
                                this.$Message.success('删除成功！');
                            }else{
                                this.$Message.error(response.data.msg);
                            }
                        })
                    }
                })
            },
            // 删除按钮
            removeItem(row){
                this.$Modal.confirm({
                    title: '操作提示',
                    content: '确定删除微页面分类吗？只有未关联任何页面的分类才会删除成功。',
                    okText: '确定删除',
                    cancelText: '取消',
                    onOk: () => {
                        this.tableLoading = true;
                        // ajax 请求获取数据
                        this.$ajax.post( this.$api.goodsPageCatRemove, {
                            id: row.id,
                        })
                            .then( (response) => {
                                this.tableLoading = false;
                                var res = response.data;
                                if( res.code ){
                                    this.$Message.success( res.message );
                                    // 初始化表数据
                                    this.initData();
                                }
                            });
                    },
                });
            },
            // 添加客服分组
            addCat(){
                this.showList = false;
                this.$refs['page-cat-form'].openModal( {id:0} );
            },
            // 回调关闭表单
            closeForm( obj ){
                this.showList = true;
            },
            // 添加用户成功
            onFormSave(){
                // 重新刷新页面
                this.initData();
            },
            handleChange2 (newTargetKeys) {
                this.store_id = newTargetKeys;console.log(this.store_id)
            },
            filterMethod (data, query) {
                return data.name.indexOf(query) > -1 || data.code.indexOf(query)>-1;
            },
            renderItem (item) {
                var str = item.name + '['+item.code+']';
                if (item.group_id) {
                    str += '<span style="color:red;">（组：'+item.group_name+'）</span>';
                }
                return str;
            },

            // 图片上传处理
            handleMaxSize (file) {
                this.$Notice.warning({
                    title: '超过了最大文件限制',
                    desc: '文件  ' + file.name + ' 超过了 2M，请控制在2M以内.'
                });
            },
            handleFormatError(file){
                this.$Notice.warning({
                    title: '上传文件格式错误',
                    desc: '文件 ' + file.name + ' 格式不正确, 请选择 jpg/png 图片文件'
                });
            },
            // ajax上传前
            handleBeforeUpload(){
                this.uploadList = this.$refs.upload.fileList;

            },
            // 文件上传成功
            uploadSuccess(res, file){
                if( res.code ){
                    this.formItem.desc_img = res.data.imageUrl;

                    console.log(this.formItem)
                }
                else{

                    // 上传失败
                    this.$Notice.warning({
                        title: '上传文件失败',
                        desc: res.message
                    });
                }
            },
            // 预览图片
            handleView (url) {
                this.imageViewUrl = url;
                this.imageViewShow = true;
            },
            // 删除图片
            handleRemove (type) {
                this.formItem.desc_img = '';
            },
            changeBind(val){
                console.log(this.formItem.bind_related_id);
                this.formItem.bind_related_id = [];
            },
        },
        mounted () {
            this.init();
        },
    }
</script>