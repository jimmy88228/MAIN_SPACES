<template>
  <div id="main-header" class="main-header ">
    <div class="pointer-trigger" v-if="isLogin">
      <Icon type="ios-arrow-down" class="pointer" :size="22" color="#fff" />
    </div>
    <div class="main-header-cont flex-b-c">
      <div class="flex-s-c header-platform">
          <img class="logo-img" :src="_loginAdmin.logo || _mainData.logo || logoImg" />
          <div class="flex-c-s flex-col text-box">
              <div v-if="_getReqStructureName" class="logo-name">{{_getReqStructureName}} <span v-if="_structureType == 'edu_school' && _loginAdmin.school_code">(ID: {{_loginAdmin.school_code}})</span></div>
              <a class="logo-txt">{{ _mainData.customer_name || title }}</a>
          </div> 
      </div>
      <div class="flex-s-c">
          <template v-if="isLogin">
              <Menu
                  id="main-menu"
                  mode="horizontal"
                  @on-select="onMenuSelect"
                  :active-name="menuSelect"
                  :open-names="[]"
              >
                  <Submenu name="User" key="User" class="main-menu-btn">
                      <template slot="title">
                          <div class="admin-user flex-s-c">
                              <span class="user-header m-r-10">{{userInfos.adminName && userInfos.adminName.slice(-2)}}</span>
                              <div class="user-name m-r-10">{{userInfos.adminName}}</div>
                          </div>
                      </template>
                      <MenuItem name="change-pwd" v-if="!_isNeedResetPwd">
                          <div class="main-menu-item">修改密码</div>
                      </MenuItem>
                      <MenuItem name="Exit">
                          <div class="main-menu-item">退出登录</div>
                      </MenuItem>
                  </Submenu>
              </Menu>
          </template>
      </div>
    </div>
    <changePWD ref="changePWDRef"></changePWD>
    
</div>
</template>

<script>
import LM from "@/helper/manager/login-manager";
import changePWD from "@/models/components/change-pwd/index.vue";
import logoImg from "@/assets/logo.png";
import Conf from "@/config";
export default {
  components: { changePWD },
  data(){
    return {
      title: Conf.TITLE,
      menuSelect: '',
      logoImg
    }
  },
  computed: {
    isLogin() {
        return LM.isLogin;
    },
    userInfos() {
        return LM.userInfos || {};
    }
  },
  methods: {
    onMenuSelect(name) {
      if (this.matchedPath === name) {
          return;
      }
      if (name === "Exit") {
          LM.logout().then(() => this.$router.push({ name: "Login" }));
          return;
      }
      if (name === "change-pwd") {
          this.$refs["changePWDRef"] && this.$refs["changePWDRef"].showModal();
          return;
      }
    },
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/css/variables.less";
.main-header-cont{
    width:100%;
    background-color: @bg-cp-color;
    display: flex;
    padding: 0px 18px 0px 15px;
    box-sizing: border-box;
    height: 80px;
    flex-direction: row;
    align-items: center;
    flex: none;
    font-size: 14px;
    color: #7F7F7F;
    border-bottom: 1px solid #EFEFEF;
}
.pointer-trigger{
  display: none;
  position: absolute;
  top:0px;
  left: 0px;
  width: 100%;
  height: 20px;
  background: linear-gradient(180deg, #aaaaaa 0%, transparent 100%);
  text-align: center;
}
.main-header-cont a{
    font-size: 14px;
    display: inline-block;
    color: #7F7F7F;
}
.text-box{
    line-height: 22px;
}
.main-logo{
    display: flex;
    align-items: center;
    margin-top:15px;
}
.logo-img{
    width: 50px;
    height: 50px;
    display:block;
    margin-right:14px;
    border-radius: 50%;
    background-color: #efefef;
}
.header-platform {
    .logo-name{
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: bold;
        color: #333333;
        line-height: 18px;
        margin-bottom: 5px;
    }
    .logo-txt{
        font-size: 10px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #7F7F7F;
        line-height: 14px;
    }
}
.user-header{
    width: 40px;
    height:40px;
    display:flex;
    background-color: #70CBC2;
    border-radius: 100%;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 16px;
    color:#fff;
}
#main-menu{
    text-align: center;
    z-index: unset;
    flex: none;
    height: 100%;
    margin-left: 30px;
    .main-menu-btn {
        min-width: 120px;
        border: 0 none;
        z-index: unset;
        /deep/.ivu-select-dropdown{
            min-width: 100px !important;
            left: auto !important;
            right: 20px;
            z-index: 1010;
        }
    }
    /deep/.ivu-menu-submenu-title{
       .ivu-menu-submenu-title-icon{ display: none; } 
    }
    /deep/.main-menu-item{
        padding: 0px 5px;
        font-size: 14px;
        i {
          margin-right: 10px;
      }
    }
}
#main-menu::after{
  display: none !important;
}

@media screen and (max-height:600px){
  .main-header{
    position: relative;
    z-index: 2;
  }
  .pointer-trigger{
    display:block;
    .pointer{
      animation: pointer 1s ease-in-out infinite;
    }
  }
  .main-header-cont{
    position: absolute;
    top:0px;
    left:0px;
    width: 100%;
    transition: all .35s;
    transform: translateY(-100%);
  }
  .main-header:hover .main-header-cont{
    transform: translateY(0);
    box-shadow: 0px 5px 5px #efefef;
  }
}
@keyframes pointer {
  0% {
    transform: translateY(0%);
  }
  25% {
    transform: translateY(-20%);
  }
  75%{
    transform: translateY(20%);
  }
  100%{
    transform: translateY(0%);
  }
}
</style>