<template>
  <common-page title="修改密码" v-loading="isLoading">
    <el-steps :active="stepActive" simple finish-status="success">
      <el-step title="填写新密码"/>
      <el-step title="完成修改"/>
    </el-steps>
    <el-form v-if="stepActive==0" ref="form" :model="form" :rules="rules" :label-width="120">
      <el-form-item label="当前密码" prop="oldpw">
        <el-input v-model="form.oldpw" show-password placeholder="请输入当前密码"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newpw">
        <el-input v-model="form.newpw" show-password placeholder="请输入新密码"></el-input>
        <sc-password-strength v-model="form.newpw"></sc-password-strength>
      </el-form-item>
      <el-form-item label="确认新密码" prop="newpw2">
        <el-input v-model="form.newpw2" show-password placeholder="请再一次输入新密码"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="save">提交</el-button>
      </el-form-item>
    </el-form>
    <el-result v-if="stepActive==1" icon="success" title="密码修改成功"
               sub-title="下次登陆即可使用新密码">
      <template #extra>
        <el-button type="primary" @click="$router.back()">返回</el-button>
      </template>
    </el-result>
  </common-page>
</template>

<script>
import commonPage from './components/commonPage'
import scPasswordStrength from '@/components/scPasswordStrength/index.vue'

export default {
  components: {
    commonPage, scPasswordStrength
  },
  data() {
    return {
      isLoading: false,
      stepActive: 0,
      form: {
        oldpw: "",
        newpw: "",
        newpw2: ""
      },
      rules: {
        oldpw: [
          {required: true, message: '请输入当前密码'}
        ],
        newpw: [
          {required: true, message: '请输入新密码'}
        ],
        newpw2: [
          {required: true, message: '请再次输入新密码'},
          {
            validator: (rule, value, callback) => {
              if (value !== this.form.newpw) {
                callback(new Error('两次输入密码不一致'));
              } else {
                callback();
              }
            }
          }
        ],
      },
    }
  },
  methods: {
    async save() {
      try {
        await this.$refs.form.validate()
        this.isLoading = true
        await this.$API.user.common.updateAdminPassword.post({
          newPassword: this.$TOOL.crypto.MD5(this.form.newpw),
          oldPassword: this.$TOOL.crypto.MD5(this.form.oldpw)
        })
        this.stepActive = 1
      } catch (err) {
        //
      } finally {
        this.isLoading = false
      }
    },
  }
}
</script>

<style scoped>


</style>
