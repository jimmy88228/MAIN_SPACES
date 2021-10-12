<template>
	<div class="lever-import">
		<Modal
				v-model="modalShow"
				title="批量修改会员等级"
				@on-ok="asyncOK"
				:footer-hide=true
		>
			<p>
				<BatchImport ref="batchImport2" :data="params" :can-upload="attrUpload" @on-success="">
					<template v-slot:header>
						<div class="batch-select">
							<label>将会员变动到的等级：</label>
							<Select v-model="attrValue" class="basic_select select_fixed" @on-change="handleAttrChange">
								<Option v-for="item in attrList" :value="item.rank_id" :key="item.rank_id">{{ item.rank_name }}</Option>
							</Select>
						</div>
					</template>
				</BatchImport>
			</p>
		</Modal>
	</div>
</template>

<script>
	import utils from '@/libs/vue-utils';
    import BatchImport from './batch-import';
    // import BatchImport from '@/views/my-components/batch-import/batch-import';

	export default {
		props: ['id'],
		components: {
            utils,
            BatchImport
		},
		data() {
			return {
			    modalShow: false,
                footerHide: false,
                attrList: [],
                attrValue: 0,
                params: {
                    rank_id: 0
                }
			}
		},
		computed: {
            attrUpload () {
                return this.params.rank_id !== 0;
            },
		},
		methods: {
            getLerverData(){
                return this.$ajax.post(this.$api.userRankData, {
                })
				.then(response => {
					const res = response.data;
					if (res.code) {
						this.attrList = res.data;
					}
				});
            },
            showModal(){
                this.modalShow = true;
                this.$refs.batchImport2.paseParamModal(this.params.rank_id, this.$api.userRankImport, this.$api.userRankDownload);
			},
            asyncOK(){
				if (this.attrValue == 0) {
                    this.$Message.error('请选择会员变动到的等级！');
                    return false;
				}
			},
            handleAttrChange () {
                this.params.rank_id = this.attrValue;
            }
		},
		mounted() {
			// alert('oksksksk');
		},
		watch: {
			'params.rank_id': function (newVal,oldVal) {
                this.$refs.batchImport2.paseParamModal(newVal, this.$api.userRankImport, this.$api.userRankDownload);
            },
		}
	}
</script>
<style lang="less" scoped>
	.batch-select{
		margin-bottom: 30px;
	}
</style>

