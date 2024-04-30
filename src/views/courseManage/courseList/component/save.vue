<template>
  <el-dialog :title="titleMap[mode]" v-model="visible" :width="650" destroy-on-close @closed="$emit('closed')">
    <el-form :model="form" :rules="rules" :disabled="mode=='show'" ref="dialogForm" label-width="120px">
      <el-form-item label="课程名称" prop="courseName">
        <el-input v-model="form.courseName" placeholder="请输入课程名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="课程描述" prop="courseDescription">
        <el-input type="textarea" v-model="form.courseDescription" resize="none"/>
      </el-form-item>
      <el-form-item label="课程类型" prop="courseType">
        <el-select
          v-model="form.courseType"
          :disabled="mode!=='add'"
        >
          <el-option
            v-for="item in courseTypes"
            :value="item.value"
            :key="item.label"
            :label="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="课程教师" prop="courseType">
        <el-select
          v-model="form.teacherId"
          :disabled="mode!=='add'"
        >
          <el-option
            v-for="item in teacherList"
            :value="item.value"
            :key="`teacher${item.teacherId}`"
            :label="item.label"
          >
            <div>
              <span style="float: left">{{ item.label }}</span>
              <span style="float: right; color: #999; font-size: 13px">{{ item.teacherNo }}</span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="课程所属专业" prop="specialityId">
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
      <el-form-item label="加课码" prop="adminEmail">
        <el-input v-model="form.courseCode" placeholder="请输入加课码" clearable></el-input>
      </el-form-item>
      <el-form-item label="是否公开" prop="isPublish" >
        <el-select v-model="form.isPublish"
                   :disabled="mode!=='add'">
          <el-option value="0" label="否"/>
          <el-option value="1" label="是"/>
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
// import {emailReg, phoneReg} from "@/utils/regs";
import { courseType } from '@/utils/enum'
export default {
  emits: ['success', 'closed'],
  data() {
    return {
      mode: "add",
      titleMap: {
        add: '新增课程',
        edit: '编辑课程',
        show: '查看课程'
      },
      visible: false,
      isSaveing: false,
      //表单数据
      form: {
        courseName: '',
        courseDescription: '',
        courseType: '',
        courseCode: '',
        teacherId: '',
        specialityId: '',
        isPublish: ''
      },
      courseTypes: courseType,
      teacherList: [],
      specialityOptions: [],
      //验证规则
      rules: {
        courseName: [
          { required: true, message: '请输入课程名称', trigger: 'blur' }
        ],
        specialityId: [
          { required: true, message: '请选择课程所属专业', trigger: 'change' }
        ],
        isPublish: [
          { required: true, message: '请选择课程是否公开', trigger: 'change' }
        ]
      },
    }
  },
  mounted() {
  },
  methods: {
    //显示
    open(mode = 'add') {
      this.$API.user.teacher.getTeacherByNameOrNo.get().then(({ data }) => {
        this.teacherList = data
      }).catch(() => {
      })
      this.$API.department.speciality.all.get().then(({ data }) => {
        this.specialityOptions = data
      }).catch(() => {
      })
      this.mode = mode;
      this.visible = true;
      return this
    },
    //表单提交方法
    async submit() {
      const operate = this.mode === 'edit' ? 'update' : 'add'
      try {
        await this.$refs.dialogForm.validate()
        await this.$API.course.course[operate].post(this.form)
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
    setData({ courseId }) {
      this.$API.course.course.detail.get({ courseId }).then(({data}) => {
        this.form = data
      }).catch(() => {
      })
    }
  }
}
</script>

<style>
</style>
