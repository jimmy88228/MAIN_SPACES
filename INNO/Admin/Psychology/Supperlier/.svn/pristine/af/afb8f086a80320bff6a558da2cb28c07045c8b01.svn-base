<template>
  <div class="course-edit-area flex">
    <div class="left-box">
      <!-- <div class="mid-top-box flex-s-c">
        <Button class="btn-confirm" style="padding:0;font-size:13px;" type="primary" @click="confirm">保存数据</Button>
      </div> -->
      <div class="course-edit-cont" v-bar>
        <Form  :model="formData" ref="formDataRef" :rules="ruleValidate" label-position="top">
          <div class="p-l-20 font-12">
            <FormItem label="课程封面" class="large" prop="cover_pic">
              <img-view class="m-t-5" ref="coverPicImgRef" boxStyle="background:#F7F7F7;border:none;" :width="105" :img="formData.cover_pic" @delImg="formData.cover_pic = ''" @selectImg="(src)=>{ selectImg(src, 'cover_pic') }"></img-view>
            </FormItem>
            <FormItem label="课程名称" class="large" prop="title">
              <custom-input class="base-width" size="large" v-model="formData.course_name" :show-word-limit="true" :maxlength="30"></custom-input>
            </FormItem>
            <FormItem label="课程分组" class="large" prop="group_id">
              <div class="base-width">
                <data-select :defaultValue="0" type="course-group" valueKey="group_id" nameKey="group_name" size="large" v-model="formData.group_id"></data-select>
              </div>
            </FormItem>
            <FormItem label="快速设置" class="p-t-20 large" style="margin-bottom:16px;"></FormItem>
            <FormItem label="学习顺序" prop="group_id">
              <RadioGroup v-model="formData.limit_order" vertical>
                <Radio :label="1" class="m-b-10">
                      <Icon type="social-apple"></Icon>
                      <span>按照课程顺序解锁</span>
                </Radio>
                <Radio :label="0">
                    <Icon type="social-apple"></Icon>
                    <span>不限制</span>
                </Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="视频学习时长" prop="group_id">
              <RadioGroup @on-change="radioChange('video','limit_time',$event)" v-model="formData.limit_time" vertical>
                <Radio :label="1" class="m-b-10">
                  <Icon class="v-m" type="social-apple"></Icon>
                  <span class="v-m">不少于</span>
                  <InputNumber :precision="0" :min="0" :max="99999" @on-focus="onFocus(formData.min_learn_time)" @on-change="onChange('video','min_learn_time',$event,formData.min_learn_time)" @on-blur="radioChange('video','min_learn_time')" style="width:62px;" class="m-l-20 v-m" v-model="formData.min_learn_time" ></InputNumber>
                  <span class="v-m p-l-5">分钟</span>
                </Radio>
                <Radio :label="0">
                  <Icon type="social-apple"></Icon>
                  <span>不限制</span>
                </Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="测验提交要求" prop="group_id">
              <RadioGroup @on-change="radioChange('exam','limit_counts',$event)" v-model="formData.limit_counts" vertical>
                <Radio :label="1" class="m-b-10">
                      <Icon class="v-m" type="social-apple"></Icon>
                      <span class="v-m">限制次数</span>
                      <InputNumber :precision="0" :min="0" :max="99999" @on-focus="onFocus(formData.max_exam_count)" @on-change="onChange('exam','max_exam_count',$event)"  @on-blur="radioChange('exam','max_exam_count')" style="width:62px;" class="m-l-20 v-m" v-model="formData.max_exam_count" ></InputNumber>
                      <span class="v-m p-l-5">次</span>
                </Radio>
                <Radio :label="0">
                    <Icon type="social-apple"></Icon>
                    <span>不限制</span>
                </Radio>
              </RadioGroup>
            </FormItem>
          </div>
        </Form>
      </div>
    </div>
    <div class="mid-box relative">
      <div class="mid-top-box flex-b-c">
        <Button class="btn-confirm" style="padding:0;font-size:13px;" type="primary" @click="confirm">保存数据</Button>
        <div class="flex-s-c pointer" @click="editNodes()">
          <Icon type="md-settings" size="14"/>
          <span class="m-l-5" style="font-size=11px;line-height:25px;">{{edit?'保存编辑':'编辑章节'}}</span>
          <!-- <template v-if="!edit">
            <Icon type="md-settings" size="14"/>
            <span class="m-l-5" style="font-size=11px;">{{edit?'保存':'编辑'}}章节</span>
          </template>
          <template v-else>
            <Button class="btn-confirm" style="padding:0;font-size:13px;" type="primary">保存章节</Button>
          </template> -->
        </div>
      </div>
      <div class="course-edit-cont" v-bar>
        <div class="course-list-box" :class="{edit:!!edit}">
          <draggable ghost-class="ghost" :list="courseData" :group="{name:'list_1'}" handle=".draggable" v-bind="dragOptions" @end="dragEnd">
            <div class="course-list" v-for="(item,index) in courseData" :key="'list_'+index">
              <!-- 章节 -->
              <div class="flex-b-c course-title pointer" :class="{active:(deep==1 && cur_f_index == index)}" @click="setContent(1,'chapter',index)">
                <div class="flex-s-c flex1 overflow-h relative">
                  <Icon v-if="!(item.id && formData.distribution_count)" @click.stop="delItem(1,'chapter',index)" type="ios-trash"  size="18" class="delete editShow translate-Y-50 pointer" title="删除"/>
                  <Icon type="md-apps" size="18" class="draggable editShow translate-Y-50 pointer" title="拖拽排序" />
                  <span class="pointer p-r-5">{{item.sort}}.</span>
                  <div class="flex-s-c W100" v-if="!item.edit && item.chapter_name">
                    <span @click.stop="handleChapter('chapter_'+index,item)" class="pointer text-overflow chapter_name">{{item.chapter_name}}</span>
                  </div>
                  <custom-input :maxlength="50" :ref="'chapter_'+index" placeholder="输入内容" class="chapter_input" v-if="!item.chapter_name || item.edit" v-model="item.chapter_name" @on-enter="item.edit = false" @on-focus="item.edit=true" @on-blur="item.edit=false" autofocus></custom-input>
                </div>
                <div @click.stop="addNode('chapter_data',index)" class="tip transform-Y-50">+ 增加小节</div>
              </div>
              <!-- 章节直属课程 -->
              <div class="border-box fst-course">
                <draggable ghost-class="ghost" :list="item.chapter_data" :group="{name:'list_1_'+index}" handle=".draggable" v-bind="dragOptions" @end="dragEnd">
                  <template v-for="(s_item,s_index) in item.chapter_data">
                    <template v-if="s_item.subsection_type != 'group'">
                      <div class="course-list-item flex-s-c" v-for="(t_item,t_index) in s_item.subsection_data" :key="'list_1_'+ index + '_' + s_index+ + '_'+ t_index">
                        <div class="flex-s-c W100 relative course">
                          <Icon v-if="!(t_item.id && formData.distribution_count)" @click.stop="delItem(1,'content',index,s_index,t_index)" type="ios-trash"  size="18" class="delete editShow translate-Y-50" title="删除"/>
                          <Icon type="md-apps" size="18" class="draggable editShow translate-Y-50" title="拖拽排序" />
                          <div class="label flex-shrink-0">{{contentType[t_item.content_type] && contentType[t_item.content_type].name||''}}</div>
                          <div @click="setContent(1,'content',index,s_index,t_index)" class="course-item-title pointer C_7f text-overflow-2">{{t_item.content_name}}</div>
                        </div>
                      </div> 
                    </template>
                  </template>
                </draggable>
              </div>
              <!-- 章小节 -->
              <div class="border-box"> 
                <draggable ghost-class="ghost" :list="item.chapter_data" :group="{name:'list_2_1_'+index}" handle=".draggable" v-bind="dragOptions" @end="dragEnd">
                  <template v-for="(s_item,s_index) in item.chapter_data"> 
                    <div v-if="s_item.subsection_type == 'group'" class="course-list" :style="s_item && s_item.subsection_data && s_item.subsection_data.length>0?'margin-bottom:0;':''" :key="'list_2_1_'+s_index">
                      <div class="flex-s-c">
                        <div class="flex-s-c course-title pointer" :class="{active:(cur_f_index == index && cur_s_index == s_index)}" @click="setContent(2,'chapter',index,s_index)">
                          <div class="flex-s-c W100 relative">
                            <Icon v-if="!(s_item.id && formData.distribution_count)" @click.stop="delItem(2,'chapter',index,s_index)" type="ios-trash"  size="18" class="delete editShow translate-Y-50" title="删除"/>
                            <Icon type="md-apps" size="18" class="draggable editShow translate-Y-50" title="拖拽排序" />
                            <span class="pointer p-r-5" @click.stop="handleChapter('chapter_'+index+'_'+s_index,s_item)">{{item.sort}}.{{s_item.group_sort}}</span>
                            <div class="flex-s-c W100" v-if="!s_item.edit && s_item.subsection_name">
                              <span @click.stop="handleChapter('chapter_'+index+'_'+s_index,s_item)" class="pointer text-overflow chapter_name">{{s_item.subsection_name}}</span>
                            </div>
                            <custom-input :maxlength="50" :ref="'chapter_'+index+'_'+s_index" placeholder="输入内容" v-if="!s_item.subsection_name || s_item.edit" class="chapter_input" v-model="s_item.subsection_name" @on-enter="s_item.edit=false" @on-focus="s_item.edit=true" @on-blur="s_item.edit=false" autofocus></custom-input>
                          </div>
                        </div>
                      </div>
                      <div class="p-l-5">
                        <draggable ghost-class="ghost" :list="s_item.subsection_data" :group="{name:'list_2_2_'+s_index}" handle=".draggable" v-bind="dragOptions" @end="dragEnd">
                          <div class="course-list-item flex-s-c" v-for="(t_item,t_index) in s_item.subsection_data" :key="'list_2_2_'+t_index">
                            <div class="flex-s-c W100 relative course">
                              <Icon v-if="!(t_item.id && formData.distribution_count)" @click.stop="delItem(2,'content',index,s_index,t_index)" type="ios-trash"  size="18" class="delete editShow translate-Y-50" title="删除"/>
                              <Icon type="md-apps" size="18" class="draggable editShow translate-Y-50" title="拖拽排序" />
                              <div class="label flex-shrink-0">{{contentType[t_item.content_type] && contentType[t_item.content_type].name}}</div>
                              <div @click="setContent(2,'content',index,s_index,t_index)" class="course-item-title pointer C_7f text-overflow-2">{{t_item.content_name}}</div>
                            </div>
                          </div>
                        </draggable>
                      </div>
                    </div>
                  </template>
                </draggable>
                
              </div> 
            </div>
          </draggable>
        </div>
      </div>
      <div class="new-node-box">
        <Button class="new-node" type="default" @click="addNode('chapter')">
          <div class="flex-c-c">
            <span class="font-28 m-r-5">+</span><span>新增章节</span>
          </div>
        </Button>
      </div>
    </div>
    <div class="right-box" v-if="deep>0">
      <div class="course-edit-cont" v-bar>
        <div class="content-box">
          <div class="content-title m-b-20 bold">
            {{cur_title}}
          </div>
          <div class="content-list C_7f font-12 m-b-20" v-for="(item,index) in curContent" :key="index">
            <div class="content-title-box flex-b-c p-l-10 p-r-10" :class="{pointer:!(item.id&&formData.distribution_count)}"  @click="addContent('set',index,item)">
              <div class="flex-s-c">
                <span class="label flex-shrink-0">{{contentType[item.content_type] && contentType[item.content_type].name}}</span><span class="content-title text-overflow-2">{{item.content_name}}</span>
              </div>
              <Icon v-if="!(item.id&&formData.distribution_count)" type="md-swap" color="#afafaf" class="switch font-16" />
            </div>
            <RadioGroup v-model="item.limitType" vertical>
              <Radio :label="1" class="m-b-10" v-if="item.content_type != 'audio'">
                    <Icon class="v-m" type="social-apple"></Icon>
                    <span class="font-12 v-m">{{item.content_type == 'exam'?'限制提交次数':'学习时长不少于'}}</span>
                    <InputNumber :precision="0" :min="0" :max="99999" style="width:62px;" class="m-l-20 v-m" v-model="item.limit_number_show" ></InputNumber>
                    <span class="font-12 v-m p-l-5">{{item.content_type == 'exam'?'次':'分钟'}}</span>
              </Radio>
              <Radio :label="0">
                  <Icon type="social-apple"></Icon>
                  <span class="font-12">{{item.content_type == 'exam'?'不限制提交次数':'不限制学习时长'}}</span>
              </Radio>
            </RadioGroup>
          </div>
          <Button v-show="type == 'chapter'" type="default" @click="addContent" class="btn-add-content">+添加内容</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import editor from "@/components/editor/index.vue"; 
export default {
  components: { editor,draggable },
  data() {
    return {
      formData: {
        id:0,
        course_name: "",
        cover_pic: "", 
        group_id: 0,
        content_count:0,
        limit_order:0,
        limit_time:0,//不限制
        min_learn_time:0,
        limit_counts:0,//不限制
        max_exam_count:0,
      },
      ruleValidate: {
        course_name: [
          {
            required: true,
            validator: this._checkString,
            trigger: "blur",
            message: "请填写课程名称",
          },
        ],
        cover_pic: [
          {
            required: true,
            validator: this._checkString,
            trigger: "blur",
            message: "请上传课程封面图",
          },
        ],
      },
      courseData:[],
      dragOptions:{
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
      },
      edit:false,
      type:'',
      deep:0,
      cur_f_index:-1,
      cur_s_index:-1, 
      cur_t_index:-1, 
      contentType:{
        video:{
          key:"video",
          name:"视频",
          limitKey:'limit_time',
          limitValKey:'min_learn_time',
        },
        audio:{
          key:"audio",
          name:"音频"
        },
        // course:{
        //   key:"exam",
        //   name:"课程",
        //   limitKey:'limit_counts',
        //   limitValKey:'max_exam_count',
        // },
        exam:{
          key:"exam",
          name:"测验",
          limitKey:'limit_counts',
          limitValKey:'max_exam_count',
        },
      },
      focusData:0,
      acInfo:{}
    };
  },
  computed:{ 
    curContent:{
      get(){
        let data = this.courseData,deep=this.deep,type=this.type,f_index=this.cur_f_index,s_index=this.cur_s_index,t_index=this.cur_t_index;
        if(deep==1){
          if(type=='chapter'){
            let arr = [];
            data[f_index].chapter_data.filter(item=>{
              return item.subsection_type != 'group'
            }).forEach(c_item=>{
              arr = arr.concat(c_item.subsection_data);
            })
            return arr;
          }else{
            return [data[f_index].chapter_data[s_index].subsection_data[t_index]];
          }
        }else{
          if(type == 'chapter'){
            return data[f_index].chapter_data[s_index].subsection_data;
          }else{
            return [data[f_index].chapter_data[s_index].subsection_data[t_index]];
          }
        } 
      },
      set(e){
        return e;
      }
    },
    cur_title(){
      let data=this.courseData,deep=this.deep,f_index=this.cur_f_index,s_index=this.cur_s_index;
      if(deep==1){
        return data[f_index].sort + '.' + ' ' + data[f_index].chapter_name||""; 
      }else{
        return data[f_index].sort + '.' + (data[f_index].chapter_data[s_index].group_sort) + ' ' + data[f_index].chapter_data[s_index].subsection_name||""; 
      } 
    }
  },
  methods: {
    loadData(){
      let pageQuery = this.pageQuery || {};
      let id = Number(pageQuery.id) || 0;
      if(id){
        this.formData.id = id;
        this.$store.commit("setPageLoading", true);
        return this.$MainApi
        .courseManagementInfo({
          data: {
            id: id
          },
          other: {
            isErrorMsg: true
          }
        })
        .then((res) => {
          if (res.code) {
            let data = res.data && res.data.items || {};
            let formData = {
              id: id,
              course_name: data.course_name || "",
              cover_pic: data.cover_pic || "",
              group_id: Number(data.group_id) || 0,
              limit_order:data.limit_order,
              limit_counts:data.max_exam_count>0?1:0,
              max_exam_count:data.max_exam_count,
              limit_time:data.min_learn_time>0?1:0,
              min_learn_time:data.min_learn_time,
              distribution_count: data.distribution_count || 0
            } 
            this.formData = formData || {};
            let get_chapter = data.get_chapter||[];
            this.sortArr('init',get_chapter);
            this.initChapterData(1,get_chapter,{type:'init'});
            this.courseData = get_chapter;
            console.log('get_chapter',get_chapter);
          }
        }).finally(()=>{
          this.$store.commit("setPageLoading", false);
        })
      }
    },
    sortArr(type,data){
      data.sort((a,b)=>{
        if(a.sort>b.sort){
          return 1
        }else{
          return -1
        }
      })
      if(type == 'init'){
        data.forEach(item=>{
          this.sortArr('deep',item.get_subsection);
        })
      }
    },
    initChapterData(deep,data,extra={}){
      let sort=1,group_sort=1;
      data.forEach(item=>{
        if(deep == 1){
           item.sort = sort++;
          if(extra.type == 'init'){
            item.edit = false;
            item.chapter_data = JSON.parse(JSON.stringify(item.get_subsection||[]));
            delete item.get_subsection;
          }
          if(item.chapter_data.length>0){
            this.initChapterData(deep+1,item.chapter_data,extra);
          }
        }else if(deep == 2){
           item.sort = sort++;
          if(item.subsection_type == 'group'){
            item.group_sort = group_sort++;
          }
          if(extra.type == 'init'){
            item.edit = false;
            item.subsection_data = JSON.parse(JSON.stringify(item.get_content||[]));
            delete item.get_content;
          }
          if(item.subsection_data.length>0){
            extra.type == 'read' && (extra.content_count+=item.subsection_data.length);
            this.initChapterData(deep+1,item.subsection_data,extra);
          }else{
            return
          }
        }else if(deep == 3){
          item.sort = sort++;
          if(extra.type == 'init'){
            item.limitType = item.limit_number>0 ? 1:0;
            item.limit_number_show = item.content_type == 'exam' ? parseInt(item.limit_number) : (parseInt(item.limit_number/60)) || 0
          }
          if(extra.type == 'read'){
            item.limit_number = item.limitType == 0 ? 0 : (item.content_type == 'exam' ? item.limit_number_show : item.limit_number_show * 60);
            if(item.content_type == 'exam'){
              extra.exam_count+=1;
            }
          }
          if(extra.type && item.content_type == extra.type){ //重置数值
            item.limitType = this.formData[extra.type=='video'?'limit_time':'limit_counts'] 
            item.limit_number_show = item.limitType == 1 ? this.formData[extra.type=='video'?'min_learn_time' : 'max_exam_count'] : item.limit_number_show
          }
          return
        }
      })
    }, 
    setContent(deep,type='',f_index=-1,s_index=-1,t_index=-1){
      if(this.edit)return; 
      this.deep = deep;
      this.type = type;
      this.cur_f_index = f_index;
      this.cur_s_index = s_index;
      this.cur_t_index = t_index;
    }, 
    addContent(tapType,index,item){
      if(item&&item.id&&this.formData.distribution_count){
        return
      }
      let selectData = {
        video: [],
        audio: [],
        article: [],
        psychic: [],
        // course:[],
        exam: []
      };
      let formData = this.formData || {};
      let curContent = JSON.parse(JSON.stringify(this.curContent));
      console.log("curContent", this.curContent);
      let curType = '',delArr=[];
      let ids = curContent.map((item,c_index)=>{
        // 这里的item.id是小节元素的id，不是赋值后的related_id;
        item._disabled = !!(item.id && formData.distribution_count);
        item.id = item.related_id;
        if(tapType!= 'set' || (tapType == 'set' && index == c_index)){
          curType = item.content_type;
          // curType = item.content_type=='exam'?'course':item.content_type;
          selectData[curType].push(item);
        }
        return item.id
      })
      this.$UIModule({
        mode: "material-modal",
        options:{
          selectData,
        },
        props: {
          title:"添加内容",
          fromType: 'material',
          guideIndex:1,
          isShowTabs: true,
          isShowClassify: true,
          type: tapType == 'set' ? curType : 'video',
          isLimitTab: false,
          isMulti:tapType != 'set',
          showTab: ['video', 'audio', 'exam']
        },
        success:(data)=>{
          console.log("选择",JSON.parse(JSON.stringify(data)));
          let courseData = this.courseData,deep=this.deep,type=this.type,f_index=this.cur_f_index,s_index=this.cur_s_index,t_index=this.cur_t_index;
          let newIds=[],curData=[],curItem={},curChapterItem={},curIndex=type=='chapter'?index:t_index;
          if(deep==2){
            curData = this.courseData[f_index].chapter_data[s_index].subsection_data||[];
            curItem = tapType == 'set' ? courseData[f_index].chapter_data[s_index].subsection_data[curIndex]||{} : {};
          }else{
            curData = courseData[f_index].chapter_data||[];
            curChapterItem = curData[s_index]||{};
            curItem = tapType == 'set' ? curChapterItem.subsection_data && curChapterItem.subsection_data[0] || {} : {};
          }
          if(tapType != 'set'){
            for(let key in data){
              newIds = newIds.concat(data[key].map(item=>{
                return item.id
              }))
            }
            delArr = ids.filter(item=>!newIds.includes(item)); 
            console.log('delArr',delArr,tapType)
            delArr.forEach(delId=>{
              let delIndex;
              if(deep == 2){
                delIndex = curData.findIndex(s_item=>s_item.related_id == delId);
              }else{
                delIndex = this.curContent.findIndex(s_item=>s_item.related_id == delId);
              }
              delIndex>-1 && (this.$delete(curData,delIndex));
            })
          }
          for(let key in data){
            let arr = data[key]||[];
            let content_type = this.contentType[key] && this.contentType[key].key||"";
            console.log('curItem',this.contentType,content_type,this.contentType[content_type],key)
            let limitType = key == 'audio'?0: tapType == 'set' ? (curItem.limitType||0) : content_type&&this.formData[this.contentType[content_type].limitKey]||0;
            let limit_number_show = tapType == 'set' ? (curItem.limit_number_show||0) : content_type&&this.formData[this.contentType[content_type].limitValKey]||0;
            arr.length>0 && arr.forEach(item=>{
              if(deep == 2){
                let cusParams = {
                  ...curItem,
                  id:curItem.id||0,
                  related_id:item.id||0,
                  content_type,
                  content_name:item.title||item.course_name||item.content_name||"",
                  limitType,
                  limit_number_show,
                  sort:curItem.sort||curData.length+1
                }
                if(tapType == 'set'){
                  this.$set(curData,curIndex,{...cusParams})
                  // console.log('进来1',curData)
                }else{
                  if(!ids.includes(item.id)){ //增加新内容
                    curData.push({...cusParams});
                  }
                  // console.log('进来2',curData)
                }
              }else{
                let cusParams = {
                    ...curChapterItem,
                    id:curChapterItem.id||0,
                    subsection_name:item.title||"",
                    subsection_type:content_type,
                    sort:curChapterItem.sort||1,
                    group_sort: curChapterItem.group_sort||1,
                    subsection_data:[{
                      ...curItem,
                      id:curItem.id||0,
                      related_id:item.id||0,
                      content_type:content_type,
                      content_name:item.title||"",
                      limitType,
                      limit_number_show,
                      sort:curItem.sort||1
                    }]
                }
                if(tapType == 'set'){
                  this.$set(curData,curIndex,{
                    ...cusParams
                  })
                  // console.log('进来3',curData)
                }else{
                  if(!ids.includes(item.id)){
                    let label = 0;
                    for(let i = 0,len=curData.length;i<len;i++){
                      if(curData[i].subsection_type != 'group'){
                        label = i+1; //排序到最后一个非group类型
                      }else{
                        break;
                      }
                    };
                    cusParams.sort=label+1;
                    curData.splice(label,0,{ //新增插入
                      ...cusParams
                    })
                  }
                  // console.log('进来4',curData)
                }
              }
            })
          }
          console.log('courseData',this.courseData)
          this.initChapterData(1,this.courseData);
        }
      })
    },
    addNode(type,index){
      let data = this.courseData;
      if(type == 'chapter'){
        data.push({
          id: 0,
          sort:data.length+1,
          chapter_name: "",   
          edit:true,
          chapter_data:[]
        })
      }else{
        let group_sort = 0;
        let item = data[index].chapter_data||[]
        for(let i = 0,len=item.length;i<len;i++){
          if(item[i].subsection_type == 'group'){
            group_sort += 1; //过滤排序
          }
        }
        item.push({
          id:0,
          edit:true,
          subsection_name:"",
          subsection_type:'group',
          sort:item.length+1,
          group_sort:group_sort+1,
          subsection_data:[],
        })
      }
      console.log('addNode',this.courseData)
    }, 
    editNodes(){
      this.edit = !this.edit;
      if(this.edit){
        this.type='';
        this.deep=-1;
        this.cur_f_index=-1;
        this.cur_s_index=-1; 
        this.cur_t_index=-1;
      }
    },
    selectImg(src, key){
      this.formData[key] = src;
    },
    confirm() {
      this.$refs["formDataRef"].validate((valid) => {
        if (valid) {
          this.confirmReq();
        } else {
          this.$Message.error("请完善相关信息");
        }
      });
    },
    confirmReq(){
      let formData = this.formData;
      let req = Number(formData.id) ? 'courseManagementUpdate' : 'courseManagemenAdd';
      this.$store.commit("setPageLoading", true);
      let extra = {type:'read',content_count:0,exam_count:0};
      this.initChapterData(1,this.courseData,extra);
      console.log('formDataformData',formData,this.courseData,extra);
      return this.$MainApi[req]({
          data: {
            ...formData,
            exam_count:extra.exam_count||0,
            content_count:extra.content_count||0,
            max_exam_count:formData.limit_counts==0?0:formData.max_exam_count,
            min_learn_time:formData.limit_time==0?0:formData.min_learn_time,
            course_data:this.courseData||[],
          },
        })
        .then((res) => {
          if (res.code) {
            this.$Message.success(res.message || (Number(formData.consultant_id) ? '编辑成功' : '添加成功'))
            this.$router.back();
          } else {
            this.$Message.warning(res.message || (Number(formData.consultant_id) ? '编辑失败' : '添加失败'))
          }
        }).finally(()=>{
          setTimeout(()=>{
            this.$store.commit("setPageLoading", false);
          }, 350)
        })
    },
    delItem(deep,type,f_index=-1,s_index=-1,t_index=-1){
      let temp = this.courseData[f_index]||{};
      let sort='',item={},delItem={},delIndex=-1;
      if(type == 'chapter'){
        if(deep == 1){
          item = temp;
          sort=f_index+1+".";
          delIndex = f_index;
          delItem = this.courseData;
        }else{
          item = temp.chapter_data[s_index];
          sort=f_index+1+"."+(s_index+1);
          delIndex = s_index;
          delItem = temp.chapter_data;
        }
      }else{
        if(deep == 1){
          item = temp.chapter_data[s_index].subsection_data[0]; 
          delIndex = s_index;
          delItem = temp.chapter_data;
        }else{
          item = temp.chapter_data[s_index].subsection_data[t_index];
          delIndex = t_index;
          delItem = temp.chapter_data[s_index].subsection_data;
        }
      }
      let tipTitle = `是否删除${type=='chapter'?'('+sort+(deep==1?item.chapter_name:item.subsection_name)+')下的所有内容' : item.content_name}`;
      this.modalTipPop({content:tipTitle}).then(()=>{
        this.$delete(delItem,delIndex);
        this.initChapterData(1,this.courseData);
      })
    },
    handleChapter(ref,item){
      item.edit = true;
      this.$nextTick(()=>{
        this.$refs[ref] && this.$refs[ref][0] && this.$refs[ref][0].focus({
           cursor: 'end'
        })
      })
    },
    dragEnd(){
      this.$nextTick(()=>{
        this.initChapterData(1,this.courseData);
      })
    },
    radioChange(type,key,e){
      console.log('radioChange',key,e);
      if(key == 'min_learn_time' || key == 'max_exam_count'){
        this.isFocus = false;
        if(key == 'min_learn_time' && this.formData.limit_time == 0){
          return
        }
        if(key == 'max_exam_count' && this.formData.limit_counts == 0){
          return
        }
        if(this.formData[key] == this.focusData){
          return
        }
      }
      this.modalTipPop({content:`该操作将会重置所有课程的${type=='video'?"视频学习时长":"测验提交次数"}`}).then(()=>{
        this.initChapterData(1,this.courseData,{type});
      }).catch(()=>{
        if(key == 'min_learn_time' || key == 'max_exam_count'){
          this.formData[key] = this.focusData;
        }else{
          this.formData[key] = e == 1 ? 0:1;
        }
      })
    },
    onFocus(e){
      console.log('onFocus',e)
      this.isFocus = true;
      this.focusData = e;
    },
    onChange(type,key,e,e2){
      console.log('change',this.isFocus,type,key,e,e2);
      if(!this.isFocus){
        this.radioChange(type,key);
        this.focusData = e;
      }
    }

  },
  mounted(){
    this.loadData();
  }
};
</script>
<style lang="less">
.course-edit-area{
  .ivu-form {
    .large{
      .ivu-form-item-label{
        font-size: 13px;
        color:#171717;
        font-weight: bold;
      }
    }
    .ivu-form-item-label{
      font-size: 12px;
      color: #050404;
    }
  } 
  .ivu-radio-group-vertical .ivu-radio-wrapper{
    color:#7f7f7f;
    font-size: 12px;
  }  
  .ivu-input,.ivu-select-large .ivu-select-input{
    font-size: 14px;
    color: #171717;
  }
  .custom-input-box .showWordLimitClass .ivu-input,.ivu-select-selection,.ivu-input-number-input{
    background: #FCFCFC;
  }
  .ivu-input-number{
    border-color: transparent;
    &:hover{
      box-shadow: 0 0 0 2px rgba(45,140,240,.2);
    }
  }
}
</style>
<style lang="less" scoped>
.course-edit-area {
  min-height: auto;
  height: 100%;
  padding-bottom: 10px;
  .editShow{
    display: none;
  }
  .edit{
    .editShow{
      display: block;
    }
  }
  .chapter_name{
    max-width:80%;
    line-height:25px;
  }
  .chapter_input{
    width: 77%;
    line-height:25px;
  }
  .left-box,.mid-box,.right-box{
    height: 100%;
    padding: 0 20px;
    margin-right: 10px;
  }
  .left-box{
    width: 25%;
    // .course-edit-cont {
    //   height: calc(100% - 46px);
    // }
  }
  .mid-box{
    width: 45%; 
    padding: 0 0 46px 20px;
    .course-edit-cont {
      height: calc(100% - 46px);
    }
  }
  .right-box{
    width: calc(30% - 20px);
    margin-right: 0;
    padding: 10px 14px 0 14px;
    max-width: 288px;
  }
  .mid-top-box{
    height: 36px;
    padding-right: 25px;
    margin-bottom: 10px;
  }
  .content-box{
    padding-left: 14px;

  }
  .course-edit-cont {
    width: 100%;
    height: 100%;
    .editor-area {
      margin-left: 10%;
      flex: 1;
      border-radius: 2px;
      .editor {
        width: 100%;
      }
    }
  }
  .new-node-box{
    width: 100%;
    position: sticky;
    bottom: 0px;
  }
  .new-node{
    width: 100%;
    height: 46px;
    background: #F8F8F8;
    border: none;
  }
  .base-width{
    width:170px;
    background: #FCFCFC;
  }
  .course-list-box{
    font-size: 13px;
    padding-right: 25px;
  }
  .course-list{
    margin-bottom: 20px;
    position: relative;
    .draggable,.delete{
      position: absolute;
      right: 10px;
      z-index: 2;
      cursor: move;
      color: rgb(205, 205, 205);
    }
    .delete{
      right: 46px;
      cursor: pointer;
    }
    .course-list{ 
      .course-title {
         margin-bottom: 0;
      }
    }
    .fst-course{
      .course-list-item{
        &:first-child{
          // padding-top: 2px;
          align-items: flex-start;
          min-height: 38px;
          margin-top: 16px;
          .course-item-title{ 
            line-height: normal;
          }
        }
      }
    }
  }
  .course-title{
    position: relative;
    background: #F8F8F8;
    border-radius: 6px;
    height: 46px;
    padding:0 10px 0 14px;
    margin-bottom: 14px;
    width: 100%;
    border: 2px solid transparent;
    &:hover{
      .tip{
        display: block;
      }
    }
    &.active{
      border: 2px solid #00ADFF;
    }
  }
  .edit{
    .course-title{
      &:hover{
      .tip{
          display: none;
        }
      }
    }
  }
  .border-box{
    padding-left: 20px;
    position: relative;
    border-left: 1px solid #EFEFEF;
  }
  .course-list-item{
    min-height: 54px;
    border:1px solid transparent;
    box-sizing: border-box;
    border-bottom-color:#EFEFEF;
    padding-right: 10px;
    &:last-of-type{
      border-bottom-color: transparent;
    } 
  }
  .course{
    
  }
  .label{
    margin-right: 6px;
    font-size: 10px;
    padding: 2px 4px;
    border-radius: 3px;
    color: #60A512;
    background: #E2EDCF;
  }
  .course-item-title{
    line-height: 25px;
  }
  .tip{
    line-height: 25px;
    display: none;
    flex-shrink: 0;
    position: absolute;
    right: 10px;
  }
  .content-title-box{
    width: 240px;
    box-sizing: border-box;
    min-height: 46px;
    // padding: 14px 0 14px 10px;
    background: rgba(239, 239, 239, 0.6);
    border-radius: 6px;
    margin-bottom: 20px;
  }
  .content-title{
    font-size: 13px;
  }
  .btn-add-content{
    width: 240px;
    height: 40px;
    position: sticky;
    bottom: 0;
    border-color: #ECECEC;
  }
  .btn-confirm{
    width: 85px;
    height: 32px;
  }
  .ghost{
    opacity: 0.5;
  }
  .desc-notice{
    width: 180px;
  }
}
</style>