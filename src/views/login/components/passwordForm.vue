<template>
  <el-form ref="loginForm" :model="form" :rules="rules" label-width="0" size="large" @keyup.enter="login">
    <el-form-item prop="user">
      <el-input v-model="form.user" prefix-icon="el-icon-user" clearable
                :placeholder="$t('login.userPlaceholder')">
        <!--				<template #append>-->
        <!--					<el-select v-model="userType" style="width: 130px;">-->
        <!--						<el-option :label="$t('login.admin')" value="admin"></el-option>-->
        <!--						<el-option :label="$t('login.user')" value="user"></el-option>-->
        <!--					</el-select>-->
        <!--				</template>-->
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model="form.password" prefix-icon="el-icon-lock" clearable show-password
                :placeholder="$t('login.PWPlaceholder')"></el-input>
    </el-form-item>
    <el-form-item style="margin-bottom: 10px;">
      <el-col :span="24">
        <el-checkbox :label="$t('login.rememberMe')" v-model="form.autologin"></el-checkbox>
      </el-col>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" style="width: 100%;" :loading="islogin" @click="login">{{
          $t('login.signIn')
        }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      userType: 'admin',
      form: {
        user: "",
        password: "",
        autologin: false
      },
      rules: {
        user: [
          {required: true, message: this.$t('login.userError'), trigger: 'blur'},
          {
            message: '手机号格式不正确',
            validator: (rule, value, callback) => {
              // 判断输入框中是否输入手机号
              if (!value) {
                callback(new Error('手机号不能为空'))
              }
              //正则表达式进行验证手机号，从1开始，第二位是35789中的任意一位，以9数字结尾
              if (!/^1[35789]\d{9}$/.test(value)) {
                callback(new Error('手机号格式不正确'))
              }
              callback()
            },
            trigger: 'blur'
          }
        ],
        password: [
          {required: true, message: this.$t('login.PWError'), trigger: 'blur'}
        ]
      },
      islogin: false,
    }
  },
  watch: {
    userType(val) {
      if (val == 'admin') {
        this.form.user = 'admin'
        this.form.password = 'admin'
      } else if (val == 'user') {
        this.form.user = 'user'
        this.form.password = 'user'
      }
    }
  },
  mounted() {

  },
  methods: {
    async login() {
      try {
        const validate = await this.$refs.loginForm.validate().catch(() => {
        })
        if (!validate) {
          return false
        }

        this.islogin = true
        const data = {
          adminPhone: this.form.user,
          password: this.$TOOL.crypto.MD5(this.form.password)
        }
        const user = await this.$API.auth.login.post(data)
        if (user.code === 0) {
          //获取token
          this.$TOOL.cookie.set("TOKEN", user.data.token, {
            expires: this.form.autologin ? 24 * 60 * 60 : 0
          })
          console.log(user.data.userInfo)
          this.$TOOL.data.set("USER_INFO", user.data.userInfo)
          this.$router.push({
            path: '/'
          })
          this.$message.success("登录成功")
        } else {
          this.$message.warning(user.message)
          return false
        }
      } catch (e) {
        /* empty */
      } finally {
        this.islogin = false
      }
    },
  }
}
</script>

<style>
</style>
