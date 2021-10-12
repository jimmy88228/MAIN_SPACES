<template>
  <div class="watermark-list">
    <Card>
      <Row>
        <Col span="16">
          <SearchForm ref="search" @on-search="searchPage"></SearchForm>
        </Col>
        <Col span="8" class="btn-group">
          <Button type="primary" icon="md-add" @click="openManagener">商品打水印管理</Button>
          <Button type="primary" v-if="canCreate.cat" @click="catModal=true" >水印分类</Button>
          <Button type="primary" v-if="canCreate.config"  @click="configModal=true">显示配置</Button>
        </Col>
      </Row>
      <Table :loading="tableLoading" :height="tableHeight" :columns="columns" :data="tableData" ref="myTable">
        <template slot-scope="{ row }" slot="image_url">
          <div class="img_list_wrap">
            <div class="img_fixed">
              <img :src="row.image_url" v-if="row.image_url" :alt="row.goods_name" v-viewer/>
              <img src="@rs/images/default-img.jpg" :alt="row.goods_name" v-viewer v-else></img>
            </div>
          </div>
        </template>
        <template slot-scope="{ row }" slot="img_url">
          <div class="img_list_wrap">
            <div class="img_fixed">
              <img :src="row.img_url" v-if="row.img_url" :alt="row.goods_name" v-viewer/>
              <img src="@rs/images/default-img.jpg" :alt="row.goods_name" v-viewer v-else></img>
            </div>
          </div>
        </template>
        <template slot-scope="{ row }" slot="update_time">
          <p>{{row.update_time | initDate}}</p>
          <p>{{row.update_time | initTime}}</p>
        </template>
        <template slot-scope="{ row }" slot="handle">
          <span v-show="row.handle.edit" @click="editWaterMark(row)"><a>编辑</a></span>
          <Divider type="vertical" v-show="row.handle.edit && row.handle.remove"/>
          <span v-show="row.handle.remove" @click="delItem(row, '删除提示', '确定删除商品水印吗？')"><a>删除</a></span>
        </template>
      </Table>
      <div v-show="pageTotal" class="list_page">
        <Page
          :total="pageTotal"
          :page-size="pageSize"
          :current="currentPage"
          :page-size-opts="pageSizeOpts"
          @on-change="e => changePage(e)"
          @on-page-size-change="ps => handlePageSize(ps)"
          show-elevator
          show-total
          show-sizer></Page>
      </div>
    </Card>
    <!-- 选择水印 -->
    <WaterMarkForm ref="waterMarkForm" @on-success="onFormSuccess"></WaterMarkForm>


     <Modal v-model="catModal" title="水印分类" :mask-closable="false" :width="65" footer-hide>
	    	<Button @click="addCat">+新增分类</Button>
	    	<Table :columns="catCol" :data="watermark_cat">
	    		<template slot-scope="{row,index}" slot="catCode">
	    			<Input v-model.trim="row.value" v-if="!row.cat_id && row.value!='WM' && row.value!='BRAND'" @on-blur="changeName('code',index,row)"></Input>
	    			<div v-else>{{row.value}}</div>
	    		</template>
	    		<template slot-scope="{ row,index }" slot="catName">
					<Input v-model.trim="row.label" @on-blur="changeName('name',index,row)"></Input>
				</template>
	    	</Table>
	    	<Spin v-show="spinShow" fix></Spin>
	    </Modal>

    <!--配置弹层-->
		<Modal v-model="configModal" title="显示配置" :mask-closable="false" :width="65" footer-hide>
			<template>
				<div style="margin-bottom: 20px;">
					<Button style="cursor: inherit;" type="success">开启</Button> <span style="color: red;">*当前为显示水印状态</span>
					<Button style="margin-left: 35px; cursor: inherit;" type="info">关闭</Button> <span style="color: red;">*当前为隐藏水印状态</span>
				</div>
			</template>
	    	<Table :columns="configCol" :data="waterConfig">
	    		<template slot-scope="{row,index}" slot="cfgRemark">
	    			<div>{{row.cfg_remark}}</div>
	    		</template>
	    		<template slot-scope="{ row,index }" slot="cfgValue">
					<!--<Input v-model.trim="row.label" @on-blur="changeName('name',index,row)"></Input>-->
					<!--<Switch v-model="row.cfg_value ==0 ? false : true" @on-change="change" />-->
					<!--<Switch v-model="true" @on-change="change" />-->
					<!--<div>{{row.cfg_value}}</div>-->
					<div v-if="row.cfg_value == 0"><Button type="info" @click="change(index, row)">关闭</Button></div>
					<div v-else><Button type="success" @click="change(index, row)">开启</Button></div>
				</template>
	    	</Table>
	    	<Spin v-show="spinShow" fix></Spin>
	    </Modal>
  </div>
</template>
<script>
import SearchForm from './search-form';
import Mixin from './mixin.js';
import WaterMarkForm from './watermark-form';
import PageHelper from '@/libs/page-helper.js';

export default {
  components: {
    SearchForm,
    WaterMarkForm
  },
  data () {
    return {
      canCreate: {},
      condition: {
        searchq: '',
        type: 1,
        goods_type: 1,
        water_type: 0
      },
      catModal:false,
            configModal:false,
            // catList:[],
            catCol:[
            	{title:'水印分类代码',key:'cat_code',align:'center',slot:'catCode'},
            	{title:'水印分类名称',key:'cat_name',align:'center',slot:'catName'},
            ],
			configCol:[
            	{title:'总配置名称',key:'cfg_remark',align:'center',slot:'cfgRemark'},
            	{title:'总配置值',key:'cfg_value',align:'center',slot:'cfgValue'},
            ],
      waterConfig:[],
        	catList:[],
          watermark_cat:[],
          spinShow:false,
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    clearOptions () {
      this.condition = {
        searchq: '',
        type: 1,
        goods_type: 1,
        water_type: 0
      };
      this.$refs.search.clearOptions();
    },
    onLoadData (page, data) {
      let params = Object.assign({}, data, this.condition);
      return this.$ajax.post(this.$api.goodsWatermarkList, params)
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.data = res.data;
          this.canCreate = (res.data && res.data.canCreate) || {};
          this.watermark_cat = (res.data && res.data.watermark_cat) || {};
          this.watermark_list = (res.data && res.data.watermark_list) || [];
          this.waterConfig = (res.data && res.data.watermark_config) || {};
        }
      });
    },
    searchPage (searchData) {
      this.condition = searchData;
      this.loadData();
    },
    openModal (row) {
      this.$refs.waterMarkForm.openModal(row, this.watermark_cat, this.watermark_list);
    },
    openManagener () {
      this.$router.push({
        name: 'watermark-manager'
      });
    },
    editWaterMark (row) {
      this.openModal(row);
    },
    onDelItem (row) {
      return this.$ajax.post(this.$api.goodsWatermarkRemove, {
        goods_id: row.goods_id,
        watermark_id: row.watermark_id || 0
      });
    },
    change (index,item) {
            this.$Modal.confirm({
                title:'设置配置',
                content:'设置配置，'+item.cfg_remark,
                okText:'确定',
                onOk:() => {
					this.$ajax.post(this.$api.goodsWatermarkWaterUpdateConfig,{id:item.id, cfg_value:item.cfg_value, cfg_remark: item.cfg_remark})
					.then( (response)=>{
						console.log(response.data);
						if (response.data.code==1) {
							let config = response.data.data;
              console.log(config)
              console.log(this.waterConfig)
              console.log(index)
							this.$set(this.waterConfig[index],'cfg_value',config.cfg_value);
							this.$set(this.waterConfig[index],'cfg_remark',config.cfg_remark);
              console.log(this.waterConfig)
							this.$Message.success('保存成功！');
						}else{
							this.$Message.error(response.data.msg);
						}
					})
       	 		},
				cancelText:'取消',
				onCancel:() => {
					this.$Message.info('用户已取消修改！')
				 }
        	})
        },
        addCat(){
            this.watermark_cat.unshift({'cat_id':0,'cat_name':'','label':'','value':'','cat_code':''});
        },
        changeName(type='name',index,item){
          console.log(item)
          let msg = '';
          if (!item.cat_id) {
            if (item.value=='') {
              this.$Message.warning('请输入水印分类代码！');
              return false;
            }else if (item.label=='') {
              this.$Message.warning('请输入水印分类名称！');
              return false
            }
            msg = '确定要添加水印分类代码‘'+item.value+'’，名称为：'+item.label+'吗？点确定添加！'
          }else{
            msg = '确定修改水印分类代码‘'+item.value+'’的名称为：‘'+item.label+'’吗？点确定修改！';
          }

          this.$Modal.confirm({
            title:'水印分类',
            content:msg,
            okText:'确定',
            onOk:() => {
              this.$ajax.post(this.$api.goodsWatermarkWaterUpdateCat,{cat_id:item.cat_id,cat_code:item.value,cat_name:item.label})
              .then( (response)=>{
                console.log(response.data);
                if (response.data.code) {
                  let cat = response.data.data;
                  this.$set(this.watermark_list[index],'cat_name',cat.cat_name);
                  this.$set(this.watermark_list[index],'label',cat.cat_name);
                  if (item.cat_id==0) {
                    this.$set(this.watermark_list[index],'cat_id',cat.cat_id);
                    this.$set(this.watermark_list[index],'cat_code',cat.cat_code);
                    this.$set(this.watermark_list[index],'value',cat.cat_code);
                  }else{
                    // this.onLoadData(this.currentPage);
                  }
                  console.log(cat,this.watermark_list)
                  this.$Message.success('保存成功！');
                }else{
                  console.log(item,this.watermark_list)
                  if (item.cat_id==0) {
                    this.$delete(this.watermark_list,0);
                  }else{
                    this.$set(this.watermark_list[index],'label',item.cat_name);
                    this.$set(this.watermark_list[index],'value',item.cat_code);
                  }
                  this.$Message.error(response.data.msg);
                }
              })
            },
            cancelText:'取消',
            onCancel:() => {
              console.log(item,this.watermark_list)
              if (item.cat_id==0) {
                this.$delete(this.watermark_list,0);
              }else{
                this.$set(this.watermark_list[index],'label',item.cat_name);
                this.watermark_list = this.watermark_list;
              }
              this.$Message.info('用户已取消修改！')
            }
          })
			
		},
  },
  mounted () {
    this.loadData();
  }
}
</script>
<style lang="less" scoped>
.watermark-list{
  .btn-group{
    text-align: right;
  }
}
</style>
