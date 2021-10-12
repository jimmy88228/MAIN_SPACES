<style lang="less">
/*导入自定义的图标*/
@import '../../styles/myIcon.less';

body{
    font-family: '微软雅黑','宋体',Arial,sans-serif;
}
.register-switch{
	width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    position: relative;

    .reg-box{
    	display: flex;
        align-items: center;
        justify-content: center;
        padding-top:200px;

        .reg-row{
            width:400px;
            text-align: center;

            .reg-title{
            	font-size:16px;
            	margin-bottom: 30px;
            }
            .card-body{
            	margin-bottom:20px;
            	margin-top:20px;
            }
            .personal-user{
            	color:#19be6b;
            	font-size: 60px;
            	margin-bottom:30px;
            }
            .enterprise-user{
            	color:#2d8cf0;
            	font-size: 60px;
            	margin-bottom:30px;
            }
        }
    }
}
</style>

<template>
	<div class="register-switch">
		<div class="reg-box">
			<div class="reg-row">
				<div class="reg-title">请选择注册用户类型</div>
				<Row :gutter="20">
					<Col span="12">
						<Card>
							<div class="card-body">
								<Icon custom="ionmy ion-my-personal-user" class="personal-user"></Icon>
								<Button @click="goCuser" type="success">个人用户注册</Button>
							</div>
						</Card>
					</Col>
        			<Col span="12">
        				<Card>
        					<div class="card-body">
	        					<Icon custom="ionmy ion-my-enterprise-user" class="enterprise-user"></Icon>
	        					<Button @click="goBuser" type="primary">企业用户注册</Button>
        					</div>
        				</Card>
        			</Col>
				</Row>
			</div>
		</div>
	</div>
</template>

<script>
/**
 * 用户注册
 */
export default {
  components: {

  },
  data () {
    return {
    }
  },
  methods: {
    	init () {

    	},
    	goCuser () {
    		this.$router.push('/register-personal-user');
    	},
    	goBuser () {
    		this.$router.push('/register-enterprise-user');
    	}
  },
  mounted () {
    this.init();
  }
};
</script>
