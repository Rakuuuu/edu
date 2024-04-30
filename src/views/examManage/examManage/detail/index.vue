<template>
  <el-container v-loading="isLoading">
    <el-header class="header">
      <div class="header-content">
        <el-button
          @click="$router.back()"
          class="header-left"
          type="text"
        ><el-icon><ArrowLeft /></el-icon><span>返回</span></el-button>
        <div class="header-middle">{{ editText }}任务</div>
      </div>
    </el-header>
    <el-main class="main">
      <el-form
        class="form"
        :model="form"
        ref="form"
        :rules="formRules"
        label-position="top"
        size="large"
        :disabled="editType==='preview'"
      >
        <el-form-item label="任务名称" prop="examName">
          <el-input v-model="form.examName"/>
        </el-form-item>
        <el-form-item label="所属课程" prop="courseId">
          <el-input
            :disabled="editType === 'preview'"
            v-model="form.courseName"
          />
        </el-form-item>
        <el-form-item label="开始时间" prop="examStartTime">
          <el-date-picker
            v-model="form.examStartTime"
            type="datetime"
            placeholder="开始时间"
            format="YYYY-MM-DD HH:mm:ss"
            :disabled="editType==='edit'"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="examEndTime">
          <el-date-picker
            v-model="form.examEndTime"
            type="datetime"
            placeholder="结束时间"
            format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="任务类型" prop="examType">
          <el-select
            v-model="form.examType"
            placeholder="请选择任务类型"
            :disabled="editType==='edit'"
          >
            <el-option
              v-for="item in examType"
              :key="item.label"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="考试限定答题时长" prop="examLimitTime" v-if="form.examType==='2'">
          <el-input :maxlength="3" type="number" v-model.number="form.examLimitTime">
            <template #append>分钟</template>
          </el-input>
        </el-form-item>
        <el-form-item label="限定答题次数" prop="maxFrequency">
          <el-input
            type="number"
            v-model.number="form.maxFrequency"
            :disabled="editType==='edit'"
          >
            <template #append>次</template>
          </el-input>
        </el-form-item>
        <el-form-item label="是否必须完成" prop="isRequired">
          <el-radio-group
            v-model="form.isRequired"
            :disabled="editType==='edit'"
          >
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="完成后显示答案解析" prop="showAnswer">
          <el-radio-group v-model="form.showAnswer">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="题目配置" class="is-required">
          <el-form>
            <exam-question-list
              ref="examQuestionList"
              :courseId="form.courseId"
              :edit-type="editType"
            />
          </el-form>
        </el-form-item>
      </el-form>
    </el-main>
    <el-footer class="footer">
      <el-button @click="$router.back()">取消</el-button>
    </el-footer>
  </el-container>
</template>

<script>
import {ArrowLeft, MoreFilled, Connection, Remove, Plus} from '@element-plus/icons-vue'
import ScEditor from '@/components/scEditor/index.vue'
import { examType } from '@/utils/enum'
import ExamQuestionList from './components/examQuestionList.vue'
export default {
  name: "examDetail",
  data () {
    return {
      isLoading: false,
      examId: '',
      editType: '',
      form: {
        examName: '',
        examType: '',
        isRequired: '',
        examStartTime: '',
        examEndTime: '',
        examLimitTime: '',
        showAnswer: '',
        maxFrequency: '',
        courseId: '',
      },
      courseOptions: [],
      formRules: {
        examName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ],
        examType: [
          { required: true, message: '请选择考试类型', trigger: 'change' }
        ],
        isRequired: [
          { required: true, message: '请选择是否必须完成', trigger: 'change' }
        ],
        examStartTime: [
          { required: true, message: '请选择开始时间', trigger: 'change' }
        ],
        examEndTime: [
          { required: true, message: '请选择结束时间', trigger: 'change' },
          {
            validator: (rules, value, callback) => {
              if (new Date(value).getTime() <= new Date(this.form.examStartTime).getTime()) {
                callback(new Error('考试结束时间不合法'))
              } else {
                callback()
              }
            }
          }
        ],
        showAnswer: [
          { required: true, message: '请选择是否展示答案解析', trigger: 'change' }
        ],
        courseId: [
          { required: true, message: '请选择任务所属课程', trigger: 'change' }
        ],
        examLimitTime: [
          { required: true, message: '请输入考试限定时长', trigger: 'blur' },
          {
            validator: (rules, value, callback) => {
              if (new Date(this.form.examEndTime).getTime() - new Date(this.form.examStartTime).getTime() <= value * 6e4) {
                callback(new Error('考试时长不合法'))
              } else {
                callback()
              }
            }
          }
        ],
      },
      examType
    }
  },
  components: {
    ExamQuestionList,
    Plus,
    ArrowLeft,
    MoreFilled,
    Connection,
    Remove,
    ScEditor
  },
  created() {
    this.examId = this.$route.query.examId || ''
    this.editType = this.$route.query.editType || 'add'
    this.form.courseId = this.$route.query.courseId || ''
    console.log(typeof this.form.courseId)
    if (['edit', 'preview'].includes(this.editType)) {
      this.queryExamDetail()
    }
  },
  computed: {
    editText () {
      if (this.editType === 'edit') return '编辑'
      else if (this.editType === 'preview') return '预览'
      else return '创建'
    },
  },
  methods: {
    // 获取试题详情
    queryExamDetail () {
      this.isLoading = true
      this.$API.exam.exam.detail.get({
        examId: this.examId
      }).then(({ data }) => {
        console.log(data)
        Object.keys(this.form).forEach(key => {
          this.form[key] = data[key]
        })
        this.form.courseName = data.edu_course.courseName
        this.$nextTick(() => {
          this.$refs.examQuestionList.setQuestion(data.edu_questions)
        })
      }).catch(() => {}).finally(() => {
        this.isLoading = false
      })
    },
  }
}
</script>


<style scoped lang="scss">
.header {
  width: 100%;
  .header-content {
    width: 100%;
    max-width: 1280px !important;
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
    position: relative;
    .header-left {
      span {
        margin-left: 4px;
        margin-top: 2px;
      }
    }
    .header-middle {
      font-size: 16px;
      font-weight: bold;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}

.main {
  max-width: 1280px !important;
  width: 100%;
  margin: 0 auto;
  background: var(--el-bg-color);
  padding: 16px;
  .form {
    flex-grow: 1;
    width: 100% !important;
    overflow: hidden;
    :deep(.el-form-item) {
      max-width: 750px;
      width: 100%;
      margin: 0 auto 22px auto;
    }
    :deep(.el-form-item__content > *) {
      width: 100% !important;
      margin: 0 auto;
    }
  }
}
:deep(.sceditor) {
  width: 100% !important;
}

:deep(.tox-tinymce) {
  height: 300px !important;
}

.submit-btn {
  margin-top: 22px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer {
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>
