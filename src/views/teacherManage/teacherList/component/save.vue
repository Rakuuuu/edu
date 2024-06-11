<template>
  <el-dialog :title="titleMap[mode]" v-model="visible" :width="500" destroy-on-close @closed="$emit('closed')">
    <el-form :model="form" :rules="rules" :disabled="mode=='show'" ref="dialogForm" label-width="100px">
      <el-form-item label="头像" prop="teacherAvatar">
        <sc-upload
          v-model="form.teacherAvatar"
          title="上传头像"
          :cropper="true"
          :compress="1"
          :disabled="mode=='show'"
          :maxSize="5 * 1024 * 1024"
          :apiObj="$API.file.file.uploadStatic"
          :aspectRatio="1/1"
        ></sc-upload>
      </el-form-item>
      <el-form-item label="姓名" prop="teacherName">
        <el-input v-model="form.teacherName" placeholder="请输入姓名" clearable></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="teacherPhone">
        <el-input v-model="form.teacherPhone" placeholder="请输入手机号" clearable></el-input>
      </el-form-item>
      <el-form-item label="教师号" prop="teacherNo">
        <el-input type="number" v-model="form.teacherNo" placeholder="请输入教师号" clearable></el-input>
      </el-form-item>
      <el-form-item label="年龄" prop="teacherAge">
        <el-input-number :max="100" :min="0" :precision="0" :step="1" v-model="form.teacherAge" placeholder="年龄" clearable></el-input-number>
      </el-form-item>
      <el-form-item label="邮箱" prop="teacherEmail">
        <el-input v-model="form.teacherEmail" placeholder="请输入邮箱" clearable></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="teacherSex">
        <el-select v-model="form.teacherSex" placeholder="请选择性别">
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
      <el-form-item prop="teacherIntroduction" label="个人简介">
        <el-input type="textarea" placeholder="输入简介" v-model="form.teacherIntroduction"></el-input>
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
      visible: false,
      isSaveing: false,
      specialityOptions: [],
      //表单数据
      form: {
        teacherAvatar: "",
        teacherName: "",
        teacherSex: "",
        specialityId: "",
        teacherIntroduction: "",
        teacherPhone: "",
        teacherEmail: "",
        teacherAge: ""
      },
      //验证规则
      rules: {
        teacherName: [
          {required: true, message: '请输入姓名', trigger: 'blur' },
        ],
        teacherNo: [
          {required: true, message: '请输入教师号', trigger: 'blur' },
        ],
        specialityId: [
          {required: true, message: '请选择所属专业', trigger: 'blur' },
        ],
        teacherPhone: [
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
        teacherEmail: [
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
        await this.$API.user.teacher[operate].post(this.form)
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
    setData({teacherId}) {
      this.$API.user.teacher.detail.get({teacherId}).then(({data}) => {
        this.form = data
      }).catch(() => {
      })
    }
  }
}
</script>

<style>
</style>
