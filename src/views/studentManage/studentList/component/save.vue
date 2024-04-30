<template>
  <el-dialog :title="titleMap[mode]" v-model="visible" :width="500" destroy-on-close @closed="$emit('closed')">
    <el-form :model="form" :rules="rules" :disabled="mode=='show'" ref="dialogForm" label-width="100px">
      <el-form-item label="姓名" prop="studentName">
        <el-input v-model="form.studentName" placeholder="请输入姓名" clearable></el-input>
      </el-form-item>
      <!--      <el-form-item label="性别" prop="sex">-->
      <!--        <el-radio-group v-model="form.sex">-->
      <!--          <el-radio label="男">男</el-radio>-->
      <!--          <el-radio label="女">女</el-radio>-->
      <!--        </el-radio-group>-->
      <!--      </el-form-item>-->
      <el-form-item label="手机号" prop="studentPhone">
        <el-input v-model="form.studentPhone" placeholder="请输入手机号" clearable></el-input>
      </el-form-item>
      <el-form-item label="学号" prop="studentNo">
        <el-input type="number" v-model="form.studentNo" placeholder="请输入学号" clearable></el-input>
      </el-form-item>
      <el-form-item label="年龄" prop="studentAge">
        <el-input-number :max="100" :min="0" :precision="0" :step="1" v-model="form.studentAge" placeholder="年龄" clearable></el-input-number>
      </el-form-item>
      <el-form-item label="邮箱" prop="studentEmail">
        <el-input v-model="form.studentEmail" placeholder="请输入邮箱" clearable></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="studentSex">
        <el-select v-model="form.studentSex" placeholder="请选择性别">
          <el-option value="" label="未知"></el-option>
          <el-option value="1" label="男"></el-option>
          <el-option value="2" label="女"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属专业" prop="specialityId">
        <el-select
          v-model="form.specialityId"
          placeholder="请选择"
          :disabled="mode!=='add'"
        >
          <el-option-group
            v-for="group in specialityOptions"
            :key="group.departmentName"
            :label="group.departmentName"
          >
            <el-option
              v-for="item in group.edu_specialities"
              :key="item.specialityName"
              :label="item.specialityName"
              :value="item.specialityId"
            />
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item prop="studentIntroduction" label="个人简介">
        <el-input type="textarea" placeholder="输入简介" v-model="form.studentIntroduction"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible=false">取 消</el-button>
      <el-button v-if="mode!='show'" type="primary" :loading="isSaveing" @click="submit()">保 存</el-button>
    </template>
  </el-dialog>
</template>

<script>
import {emailReg, phoneReg} from "@/utils/regs";

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
      specialityOptions: [],
      visible: false,
      isSaveing: false,
      //表单数据
      form: {
        studentName: "",
        studentSex: "男",
        studentPhone: "",
        studentEmail: "",
        studentAge: "",
        specialityId: "",
        studentNo: "",
        studentIntroduction: ""
      },
      //验证规则
      rules: {
        studentName: [
          {required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        specialityId: [
          {required: true, message: '请选择专业', trigger: 'change' }
        ],
        studentNo: [
          { required: true, message: '请输入学号', trigger: 'blur' }
        ],
        studentPhone: [
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
        ],
        studentEmail: [
          {
            trigger: 'blur',
            validator: (rules, value, callback) => {
              if (!emailReg.test(value) && value) {
                console.log(111)
                callback(new Error('请输入正确格式的邮箱'))
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
        await this.$API.user.student[operate].post(this.form)
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
    setData({ studentId }) {
      this.$API.user.student.detail.get({ studentId }).then(({data}) => {
        this.form = data
      }).catch(() => {
      })
    }
  }
}
</script>

<style>
</style>
