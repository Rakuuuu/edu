<template>
  <div class="login_bg">
    <div class="login_main">
      <div class="login-form">
        <div class="login-header">
          <div class="logo">
            <img :alt="$CONFIG.APP_NAME" src="img/logo.png">
            <label>{{ $CONFIG.APP_NAME }}</label>
          </div>
        </div>
        <password-form></password-form>
        <!--				<template v-if="$CONFIG.MY_SHOW_LOGIN_OAUTH">-->
        <!--					<el-divider>{{ $t('login.signInOther') }}</el-divider>-->
        <!--&lt;!&ndash;					<div class="login-oauth">&ndash;&gt;-->
        <!--&lt;!&ndash;						<el-button type="success" icon="sc-icon-wechat" circle @click="wechatLogin"></el-button>&ndash;&gt;-->
        <!--&lt;!&ndash;					</div>&ndash;&gt;-->
        <!--				</template>-->
      </div>
    </div>
  </div>
  <!--	<el-dialog v-model="showWechatLogin" :title="$t('login.wechatLoginTitle')" :width="400" destroy-on-close>-->
  <!--		<div class="qrCodeLogin">-->
  <!--			<sc-qr-code class="qrCode" :text="WechatLoginCode" :size="200"></sc-qr-code>-->
  <!--			<p class="msg">{{$tc('login.wechatLoginMsg', 1)}}<br/>{{$tc('login.wechatLoginMsg', 2)}}</p>-->
  <!--			<div class="qrCodeLogin-result" v-if="isWechatLoginResult">-->
  <!--				<el-result icon="success" :title="$tc('login.wechatLoginResult', 1)" :sub-title="$tc('login.wechatLoginResult', 2)"></el-result>-->
  <!--			</div>-->
  <!--		</div>-->
  <!--	</el-dialog>-->
</template>

<script>
import passwordForm from './components/passwordForm'
import phoneForm from './components/phoneForm'

export default {
  components: {
    passwordForm,
    phoneForm
  },
  data() {
    return {
      config: {
        lang: this.$TOOL.data.get('APP_LANG') || this.$CONFIG.LANG,
        dark: this.$TOOL.data.get('APP_DARK') || false
      },
      lang: [
        {
          name: '简体中文',
          value: 'zh-cn',
        },
        {
          name: 'English',
          value: 'en',
        }
      ],
      WechatLoginCode: "",
      showWechatLogin: false,
      isWechatLoginResult: false
    }
  },
  watch: {
    'config.dark'(val) {
      if (val) {
        document.documentElement.classList.add("dark")
        this.$TOOL.data.set("APP_DARK", val)
      } else {
        document.documentElement.classList.remove("dark")
        this.$TOOL.data.remove("APP_DARK")
      }
    },
    'config.lang'(val) {
      this.$i18n.locale = val
      this.$TOOL.data.set("APP_LANG", val)
    }
  },
  created: function () {
    this.$TOOL.cookie.remove("TOKEN")
    this.$TOOL.data.remove("USER_INFO")
    this.$TOOL.data.remove("MENU")
    this.$TOOL.data.remove("PERMISSIONS")
    this.$TOOL.data.remove("DASHBOARDGRID")
    this.$TOOL.data.remove("grid")
    this.$store.commit("clearViewTags")
    this.$store.commit("clearKeepLive")
    this.$store.commit("clearIframeList")
    console.log('%c SCUI %c Gitee: https://gitee.com/lolicode/scui', 'background:#666;color:#fff;border-radius:3px;', '')
  },
  methods: {
    configDark() {
      this.config.dark = this.config.dark ? false : true
    },
    configLang(command) {
      this.config.lang = command.value
    },
    wechatLogin() {
      this.showWechatLogin = true
      this.WechatLoginCode = "SCUI-823677237287236-" + new Date().getTime()
      this.isWechatLoginResult = false
      setTimeout(() => {
        this.isWechatLoginResult = true
      }, 3000)
    }
  }
}
</script>

<style scoped>
.login_bg {
  width: 100%;
  height: 100%;
  background: #fff;
  display: flex;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.login_bg::before {
  z-index: -1;
  position: absolute;
  content: '';
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-size: 75%;
  background-position: center left;
  background-repeat: no-repeat;
  background-image: url("/public/img/logo.png");
  filter: blur(150px);
  animation: rotating linear 60s infinite;
}

@keyframes rotating {
  0% {
    transform: rotate(0deg);
  } 50% {
      transform: rotate(180deg);
    } 100% {
        transform: rotate(360deg);
      }
}

.login_adv {
  width: 33.33333%;
  position: relative;
  z-index: 10;
}

.login_adv__title {
  color: var(--el-text-color-secondary);
  padding: 40px;
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  z-index: 2;
}

.login_adv__title h2 {
  font-size: 40px;
}

.login_adv__title h4 {
  font-size: 18px;
  margin-top: 10px;
  font-weight: normal;
}

.login_adv__title p {
  font-size: 14px;
  margin-top: 10px;
  line-height: 1.8;
  color: var(--el-text-color-secondary);
}

.login_adv__title div {
  margin-top: 10px;
  display: flex;
  align-items: center;
}

.login_adv__title div span {
  margin-right: 15px;
}

.login_adv__title div i {
  font-size: 40px;
}

.login_adv__title div i.add {
  font-size: 20px;
  color: var(--el-text-color-secondary);
}

.login_adv__bottom {
  position: absolute;
  left: 0px;
  right: 0px;
  bottom: 0px;
  color: var(--el-text-color-secondary);
  padding: 40px;
  z-index: 3;
}

.login_adv__mask {
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  background: rgba(255, 255, 255, 0.2);
  z-index: 1;
}

.login_main {
  flex: 1;
  overflow: auto;
  display: flex;
  position: relative;
  z-index: 10;
}

.login-form {
  width: 400px;
  margin: auto;
  padding: 20px 0;
  z-index: 10;
}

.login-header {
  margin-bottom: 40px;
}

.login-header .logo {
  display: flex;
  align-items: center;
}

.login-header .logo img {
  width: 40px;
  height: 40px;
  vertical-align: bottom;
  margin-right: 10px;
}

.login-header .logo label {
  font-size: 26px;
  font-weight: bold;
}

.login-oauth {
  display: flex;
  justify-content: space-around;
}

.login-form .el-divider {
  margin-top: 40px;
}

.login-form {
}

.login-form:deep(.el-tabs) .el-tabs__header {
  margin-bottom: 25px;
}

.login-form:deep(.el-tabs) .el-tabs__header .el-tabs__item {
  font-size: 14px;
}

.login-form:deep(.login-forgot) {
  text-align: right;
}

.login-form:deep(.login-forgot) a {
  color: var(--el-color-primary);
}

.login-form:deep(.login-forgot) a:hover {
  color: var(--el-color-primary-light-3);
}

.login-form:deep(.login-reg) {
  font-size: 14px;
  color: var(--el-text-color-primary);
}

.login-form:deep(.login-reg) a {
  color: var(--el-color-primary);
}

.login-form:deep(.login-reg) a:hover {
  color: var(--el-color-primary-light-3);
}

.login_config {
  position: absolute;
  top: 20px;
  right: 20px;
}

.login-form:deep(.login-msg-yzm) {
  display: flex;
  width: 100%;
}

.login-form:deep(.login-msg-yzm) .el-button {
  margin-left: 10px;
  --el-button-size: 42px;
}

.qrCodeLogin {
  text-align: center;
  position: relative;
  padding: 20px 0;
}

.qrCodeLogin img.qrCode {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
}

.qrCodeLogin p.msg {
  margin-top: 15px;
}

.qrCodeLogin .qrCodeLogin-result {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  text-align: center;
  background: var(--el-mask-color);
}

@media (max-width: 1200px) {
  .login-form {
    width: 340px;
  }
}

@media (max-width: 1000px) {
  .login_main {
    display: block;
  }

  .login_main .login_config {
    position: static;
    padding: 20px 20px 0 20px;
    text-align: right;
  }

  .login-form {
    width: 100%;
    padding: 20px 40px;
  }

  .login_adv {
    display: none;
  }
}
</style>
