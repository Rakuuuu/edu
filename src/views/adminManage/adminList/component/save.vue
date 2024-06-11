<template>
  <el-dialog :title="titleMap[mode]" v-model="visible" :width="500" destroy-on-close @closed="$emit('closed')">
    <el-form :model="form" :rules="rules" :disabled="mode=='show'" ref="dialogForm" label-width="100px">
      <el-form-item label="姓名" prop="adminName">
        <el-input v-model="form.adminName" placeholder="请输入姓名" clearable></el-input>
      </el-form-item>
      <!--      <el-form-item label="性别" prop="sex">-->
      <!--        <el-radio-group v-model="form.sex">-->
      <!--          <el-radio label="男">男</el-radio>-->
      <!--          <el-radio label="女">女</el-radio>-->
      <!--        </el-radio-group>-->
      <!--      </el-form-item>-->
      <el-form-item label="手机号" prop="adminPhone">
        <el-input v-model="form.adminPhone" placeholder="请输入手机号" clearable></el-input>
      </el-form-item>

      <el-form-item label="所属学院" prop="departmentId">
        <el-select
          v-model="form.departmentId"
          placeholder="请选择"
          :disabled="mode!=='add'"
        >
          <el-option
            v-for="department in specialityOptions"
            :value="department.departmentId"
            :label="department.departmentName"
            :key="department"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible=false">取 消</el-button>
      <el-button v-if="mode!='show'" type="primary" :loading="isSaveing" @click="submit()">保 存</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { phoneReg} from "@/utils/regs";

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
        adminName: "",
        // adminSex: "男",
        adminPhone: ""
      },
      specialityOptions: [],
      //验证规则
      rules: {
        adminName: [
          {required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        adminPhone: [
          {
            required: true,
            trigger: 'blur',
            validator: (rules, value, callback) => {
              if (!phoneReg.test(value) && value) {
                callback(new Error('请输入正确格式的手机号码'))
              }
              if (!value) {
                callback(new Error('请输入手机号码'))
              }
              callback()
            }
          }
        ]
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
      this.$API.department.speciality.all.get().then(({ data }) => {
        this.specialityOptions = data
      }).catch(() => {
      })
      return this
    },
    //表单提交方法
    async submit() {
      const operate = this.mode === 'edit' ? 'update' : 'add'
      try {
        await this.$refs.dialogForm.validate()
        await this.$API.user.admin[operate].post(this.form)
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
    setData({ adminId }) {
      this.$API.user.admin.detail.get({ adminId }).then(({data}) => {
        this.form = data
      }).catch(() => {
      })
    }
  }
}
</script>

<style>
</style>
