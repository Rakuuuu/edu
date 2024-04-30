<template>
  <el-dialog :title="titleMap[mode]" v-model="visible" :width="500" destroy-on-close @closed="$emit('closed')">
    <el-form :model="form" :rules="rules" :disabled="mode=='show'" ref="dialogForm" label-width="100px">
      <el-form-item label="学院名称" prop="departmentName">
        <el-input v-model="form.departmentName" placeholder="请输入学院名称" clearable></el-input>
      </el-form-item>
      <!--      <el-form-item label="性别" prop="sex">-->
      <!--        <el-radio-group v-model="form.sex">-->
      <!--          <el-radio label="男">男</el-radio>-->
      <!--          <el-radio label="女">女</el-radio>-->
      <!--        </el-radio-group>-->
      <!--      </el-form-item>-->
<!--      <el-form-item label="手机号" prop="adminPhone">-->
<!--        <el-input v-model="form.adminPhone" placeholder="请输入手机号" clearable></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="邮箱" prop="adminEmail">-->
<!--        <el-input v-model="form.adminEmail" placeholder="请输入邮箱" clearable></el-input>-->
<!--      </el-form-item>-->
    </el-form>
    <template #footer>
      <el-button @click="visible=false">取 消</el-button>
      <el-button v-if="mode!='show'" type="primary" :loading="isSaveing" @click="submit()">保 存</el-button>
    </template>
  </el-dialog>
</template>

<script>
// import {emailReg, phoneReg} from "@/utils/regs";

export default {
  emits: ['success', 'closed'],
  data() {
    return {
      mode: "add",
      titleMap: {
        add: '新增',
        edit: '编辑',
        show: '查看'
      },
      visible: false,
      isSaveing: false,
      //表单数据
      form: {
        departmentName: "",
        // adminSex: "男",
        // adminPhone: "",
        // adminEmail: ""
      },
      //验证规则
      rules: {
        departmentName: [
          {required: true, message: '请输入学院名称', trigger: 'blur' }
        ],
        // adminPhone: [
        //   {
        //     required: true,
        //     trigger: 'blur',
        //     validator: (rules, value, callback) => {
        //       if (!phoneReg.test(value) && value) {
        //         callback(new Error('请输入正确格式的手机号码'))
        //       }
        //       if (!value) {
        //         callback(new Error('请输入手机号码'))
        //       }
        //       callback()
        //     }
        //   }
        // ],
        // adminEmail: [
        //   {
        //     trigger: 'blur',
        //     validator: (rules, value, callback) => {
        //       if (!emailReg.test(value) && value) {
        //         console.log(111)
        //         callback(new Error('请输入正确格式的邮箱'))
        //       }
        //       callback()
        //     }
        //   }
        // ]
      },
      //所需数据选项
      groups: [],
      groupsProps: {
        value: "id",
        emitPath: false,
        checkStrictly: true
      }
    }
  },
  mounted() {

  },
  methods: {
    //显示
    open(mode = 'add') {
      this.mode = mode;
      this.visible = true;
      return this
    },
    //表单提交方法
    async submit() {
      const operate = this.mode === 'edit' ? 'update' : 'add'
      try {
        await this.$refs.dialogForm.validate()
        await this.$API.department.department[operate].post(this.form)
        this.$message({
          type: 'success',
          message: `${this.titleMap[this.mode]}成功`
        })
        this.visible = false
        this.$emit('success')
      } catch (err) {
        /* empty */
      }
    },
    //表单注入数据
    setData({ departmentId }) {
      this.$API.department.department.detail.get({ departmentId }).then(({data}) => {
        this.form = data
      }).catch(() => {
      })
    }
  }
}
</script>

<style>
</style>
