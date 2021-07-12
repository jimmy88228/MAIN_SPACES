<style lang="less">
	@import '../main.less';
</style>

<template>
	<div ref="scrollCon" @DOMMouseScroll="handlescroll" @mousewheel="handlescroll" class="tags-outer-scroll-con">
		<div class="left-btn" @click="toScroll(240)">
			<Icon type="ios-arrow-back" size="18"></Icon>
		</div>
		<div class="right-btn" @click="toScroll(-240)">
			<Icon type="ios-arrow-forward" size="18"></Icon>
		</div>
		<div class="close-all-tag-con">
			<Dropdown transfer @on-click="handleTagsOption">
				<Icon type="ios-arrow-down" size="18"></Icon>
				<DropdownMenu slot="list">
					<DropdownItem name="clearAll">关闭所有</DropdownItem>
					<DropdownItem name="clearOthers">关闭其他</DropdownItem>
				</DropdownMenu>
			</Dropdown>
		</div>
		<div ref="scrollBody" class="tags-inner-scroll-body" :style="{left: tagBodyLeft + 'px'}">
			<transition-group name="taglist-moving-animation">
				<Tag 
				v-for="(item, index) in pageTagsList" :key="item.name" :name="item.name"
				ref="tagsPageOpened"
				size="medium"
				title="滚动鼠标滑轮,可左右滚动"
				:closable="item.name==='home_index'?false:true"
				:color="item.children ? (item.children[0].name===currentPageName?'primary':'default'):(item.name===currentPageName ? 'primary' : 'default')"
				:style="'cursor: pointer;'+(item.name===currentPageName ?'':'border:1px solid #ddd;background:#fff;')"
				@on-close="closePage" 
				@click.native="linkTo(item)">
				<Icon v-if="item.name==='home_index'" type="md-home" size="18"/>
				{{ itemTitle(item) }}</Tag>
			</transition-group>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue';
	import VueI18n from 'vue-i18n';
	Vue.use(VueI18n);
	export default {
		name: 'tagsPageOpened',
		data() {
			return {
				currentPageName: this.$route.name,
				tagBodyLeft: 0,
				refsTag: [],
				tagsCount: 1
			};
		},
		props: {
			pageTagsList: Array,
			beforePush: {
				type: Function,
				default: (item) => {
					return true;
				}
			}
		},
		computed: {
			title() {
				return this.$store.state.app.currentTitle;
			},
			tagsList() {
				return this.$store.state.app.pageOpenedList;
			}
		},
		methods: {
			itemTitle(item) {
				if (typeof item.title === 'object') {
					return this.$t(item.title.i18n);
				} else {
					return item.title;
				}
			},
			closePage(event, name) {
				let pageOpenedList = this.$store.state.app.pageOpenedList;
				let lastPageObj = pageOpenedList[0];
				if (this.currentPageName === name) {
					const len = pageOpenedList.length;
					for (let i = 1; i < len; i++) {
						if (pageOpenedList[i].name === name) {
							if (i < (len - 1)) {
								lastPageObj = pageOpenedList[i + 1];
							} else {
								lastPageObj = pageOpenedList[i - 1];
							}
							break;
						}
					}
				}
				this.$store.commit('removeTag', name);
				this.$store.commit('closePage', name);
				pageOpenedList = this.$store.state.app.pageOpenedList;
				window.localStorage.pageOpenedList = JSON.stringify(pageOpenedList);
				if (this.currentPageName === name) {
					this.linkTo(lastPageObj);
				}
			},
			linkTo(item) {
				const routerObj = {};
				routerObj.name = item.name;
				if (item.argu) {
					routerObj.params = item.argu;
				}
				if (item.query) {
					routerObj.query = item.query;
				}
				if (this.beforePush(item)) {
					this.$router.push(routerObj);
				}
			},
			handlescroll(e) {
				let type = e.type;
				let delta = 0;
				if (type === 'DOMMouseScroll' || type === 'mousewheel') {
					delta = (e.wheelDelta) ? e.wheelDelta : -(e.detail || 0) * 40;
				}
				let left = 0;
				if (delta > 0) {
					left = Math.min(0, this.tagBodyLeft + delta);
				} else {
					if (this.$refs.scrollCon.offsetWidth - 100 < this.$refs.scrollBody.offsetWidth) {
						if (this.tagBodyLeft < -(this.$refs.scrollBody.offsetWidth - this.$refs.scrollCon.offsetWidth + 100)) {
							left = this.tagBodyLeft;
						} else {
							left = Math.max(this.tagBodyLeft + delta, this.$refs.scrollCon.offsetWidth - this.$refs.scrollBody.offsetWidth -
								100);
						}
					} else {
						this.tagBodyLeft = 0;
					}
				}
				this.tagBodyLeft = left;
			},
			toScroll (offset) {
				const outerWidth = this.$refs.scrollCon.offsetWidth;
				const bodyWidth = this.$refs.scrollBody.offsetWidth;
				
				if (offset > 0) {
					this.tagBodyLeft = Math.min(0, this.tagBodyLeft + offset);
				} else {
					if (outerWidth < bodyWidth) {
						if (this.tagBodyLeft < -(bodyWidth - outerWidth)) {
							this.tagBodyLeft = this.tagBodyLeft
						} else {
							this.tagBodyLeft = Math.max(this.tagBodyLeft + offset, outerWidth - bodyWidth)
						}
					} else {
						this.tagBodyLeft = 0
					}console.log( this.tagBodyLeft );
				}
			},
			handleTagsOption(type) {
				if (type === 'clearAll') {
					this.$store.commit('clearAllTags');
					this.$router.push({
						name: 'home_index'
					});
				} else {
					this.$store.commit('clearOtherTags', this);
				}
				this.tagBodyLeft = 0;
			},
			moveToView(tag) {
				if (tag.offsetLeft < -this.tagBodyLeft) {
					// 标签在可视区域左侧
					this.tagBodyLeft = -tag.offsetLeft + 10;
				} else if (tag.offsetLeft + 10 > -this.tagBodyLeft && tag.offsetLeft + tag.offsetWidth < -this.tagBodyLeft + this.$refs
					.scrollCon.offsetWidth - 100) {
					// 标签在可视区域
				} else {
					// 标签在可视区域右侧
					this.tagBodyLeft = -(tag.offsetLeft - (this.$refs.scrollCon.offsetWidth - 100 - tag.offsetWidth) + 20);
				}
			}
		},
		mounted() {
			this.refsTag = this.$refs.tagsPageOpened;
			if( this.refsTag != null ){
				this.$nextTick(() => {
					this.refsTag.forEach((item, index) => {
						if (this.$route.name === item.name) {
							const tag = this.refsTag[index].$el;
							this.moveToView(tag);
						}
					});
				});
			}
			this.tagsCount = this.tagsList.length;
		},
		watch: {
			'$route'(to) {
				this.currentPageName = to.name;
				this.$nextTick(() => {
					this.refsTag.forEach((item, index) => {
						if (to.name === item.name) {
							const tag = this.refsTag[index].$el;
							this.moveToView(tag);
						}
					});
				});
				this.tagsCount = this.tagsList.length;
			}
		}
	};
</script>
