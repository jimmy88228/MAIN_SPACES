<template>
  <div class="material-center">
		<template v-show="isPopup">
			<Modal
					v-model="isVisible"
					:title="title"
					:width="defaultWidth"
					:mask-closable="false"
					:class-name="uid"
					transfer>
					<Tabs :value="currTabName" @on-click="changeTab">
						<TabPane name="image" label="我的图片" v-if="showImageTab">
							<material-list
								:tab-type="currTabName"
								:maxSize="_maxSize"
								:format="_format"
								@getSeletedList="getSeletedList"></material-list>
						</TabPane>
						<TabPane name="video" label="我的视频" v-if="showVideoTab">
							<material-list
								:tab-type="currTabName"
								:maxSize="_maxSize"
								:format="_format"
								@getSeletedList="getSeletedList"></material-list>
						</TabPane>
					</Tabs>
					<div slot="footer">
						<Button type="text" size="large" @click.native="onCancel">取消</Button>
						<Button type="primary" size="large" @click.native="onOk">确定</Button>
					</div>
			</Modal>
		</template>
		<template v-show="!isPopup">
			<Tabs :value="currTabName" @on-click="changeTab">
				<TabPane name="image" label="我的图片">
					<material-list
						tab-type="image"
						:height="height"
						:maxSize="_maxSize"
						:format="_format"
						@getSeletedList="getSeletedList"></material-list>
				</TabPane>
				<TabPane name="video" label="我的视频">
					<material-list
						tab-type="video"
						:height="height"
						:maxSize="_maxSize"
						:format="_format"
						@getSeletedList="getSeletedList"></material-list>
				</TabPane>
			</Tabs>
		</template>
  </div>
</template>

<script>
import MaterialList from './material-list';

export default {
  name: 'MaterialCenter',
  components: {
    MaterialList
  },
  provide () {
    return {
      multi: this.multi,
      selectedData: this.selectedData || [],
			isPopup: this.isPopup,
      // maxSize: this._maxSize,
      // format: this._format,
			maximum: this.maximum
    }
  },
  props: {
    multi: {
      type: [Number, String, Boolean],
      default: 0
    },
    type: {
      validator (value) {
				value = value && value.toLowerCase();
        return ['image', 'video'].findIndex(item => item === value) !== -1;
      },
    },
    selectedData: {
      type: [String, Array],
      default: ''
    },
    maxSize: {
      type: Number,
    },
    format: {
      type: Array,
    },
    // 设置唯一标识，配合PopTip使用
    uid: {
      type: String
    },
		isPopup: {
			type: Boolean,
			default: true
		},
		height: {
			type: Number,
			default: 0
		}
  },
  data () {
    return {
      isVisible: false,
      defaultWidth: 950,
      resultData: null,
			currTabName: 'image'
    }
  },
  computed: {
    title () {
      return this.multi ? '选择素材-多选模式' : '选择素材-单选模式';
    },
    showImageTab () {
				return this.type === 'image';
    },
    showVideoTab () {
				return this.type === 'video';
    },
		_maxSize(){
			if(this.maxSize){
				return this.maxSize;
			}
			return this.currTabName === 'video' ? 20480 : 2048;
		},
		_format(){
			if(this.format){
				return this.format;
			}
			return this.currTabName === 'video' ? ['mp4'] : ['jpg', 'png', 'gif', 'jpeg'];
		}
  },
  methods: {
		changeTab(name){
			this.currTabName = name;
		},
    onOk () {
      if (!this.resultData || this.resultData.length === 0) {
        this.$Message.error('请选择素材！');
        this.isVisible = true;
        return false;
      } else {
        this.isVisible = false;
      }
      this.$emit('handleList', this.resultData);
    },
    onCancel () {
      this.isVisible = false;
    },
    getSeletedList (list) {
      this.resultData = list;
    }
  },
	watch:{
		type:{
			handler(nV){
				this.currTabName = nV;
			},
			immediate: true
		}
	}
}
</script>
