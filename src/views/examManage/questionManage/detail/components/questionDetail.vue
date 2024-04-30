<template>
  <el-form
    ref="form"
    :model="form"
    label-position="top"
    class="form"
    :rules="formRules"
    :disabled="!isEdit"
  >
    <el-form-item label="题目内容" prop="questionContent">
      <sc-editor
        :options="{ statusbar: false }"
        id="comment-editor"
        class="editor"
        :disabled="!isEdit"
        v-model="form.questionContent"
      ></sc-editor>
    </el-form-item>
    <el-form-item label="题目类型" prop="questionType">
      <el-select
        v-model="form.questionType"
        size="large"
        :disabled="isEdit"
        @change="clearAnswer"
      >
        <el-option
          v-for="item in questionType"
          :key="item"
          :value="item.value"
          :label="item.label"
        />
      </el-select>
    </el-form-item>
    <el-form-item class="is-required" label="单选题配置" v-if="form.questionType === '1'">
      <select-question ref="singleSelect" :disabled="!isEdit" :question-type="form.questionType"/>
    </el-form-item>
    <el-form-item class="is-required" label="多选题配置" v-if="form.questionType === '6'">
      <select-question ref="multiSelect" :disabled="!isEdit" :question-type="form.questionType"/>
    </el-form-item>
    <el-form-item label="判断题配置" v-if="form.questionType === '3'" prop="questionAnswer">
      <el-radio-group v-model="form.questionAnswer">
        <el-radio label="1" size="large">正确</el-radio>
        <el-radio label="0" size="large">错误</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item
      class="is-required"
      label="填空题配置（多答案请用英文逗号隔开）"
      v-if="form.questionType === '2'"
    >
      <fill-space-question ref="fillSpace" :disabled="!isEdit"/>
    </el-form-item>
    <el-form-item label="简答题配置"  v-if="form.questionType === '4'" prop="questionAnswer">
      <el-input v-model="form.questionAnswer" type="textarea"/>
    </el-form-item>
    <el-form-item label="主观题配置" v-if="form.questionType === '5'" prop="questionAnswer">
      <sc-editor
        :options="{ statusbar: false }"
        id="comment-editor"
        class="editor"
        :disabled="!isEdit"
        v-model="form.questionAnswer"
      ></sc-editor>
    </el-form-item>
    <el-form-item label="题目解析" prop="questionAnalytic">
      <sc-editor
        :options="{ statusbar: false }"
        id="comment-editor"
        class="editor"
        :disabled="!isEdit"
        v-model="form.questionAnalytic"
      ></sc-editor>
    </el-form-item>
  </el-form>
</template>

<script>
import SelectQuestion from '@/views/examManage/component/selectQuestion.vue'
import FillSpaceQuestion from '@/views/examManage/component/fillSpaceQuestion.vue'
import ScEditor from '@/components/scEditor/index.vue'
import { questionType } from '@/utils/enum'
import About from '@/views/home/widgets/components/about.vue'

export default {
  name: "questionDetail",
  components: {About, ScEditor, FillSpaceQuestion, SelectQuestion},
  props: {
    editType: String
  },
  computed: {
    isEdit () {
      return this.editType === 'edit'
    },
  },
  data () {
    return {
      questionType,
      questionId: '',
      form: {
        questionContent: '',
        questionType: '1',
        questionAnswer: '',
        questionAnalytic: ''
      },
      formRules: {
        questionContent: [
          { required: true, message: '请输入题目内容', trigger: 'blur' }
        ],
        questionType: [
          { required: true, message: '请选择题目类型', trigger: 'change' }
        ],
        questionAnswer: [
          { required: true, message: '请输入题目答案', trigger: 'change' }
        ],
        // questionAnalytic: [
        //   { required: true, message: '请输入题目解析', trigger: 'blur' }
        // ]
      },
    }
  },
  methods: {
    // 保存题目
    async saveQuestion () {
      try {
        await this.$refs.form.validate()
        let params = this.form
        if (this.form.questionType === '1') { // 单选题
          const { optionStr, answerStr } = this.$refs.singleSelect.getData()
          if (!optionStr || !answerStr) return
          params = {
            ...this.form,
            questionOption: optionStr,
            questionAnswer: answerStr
          }
        } else if (this.form.questionType === '6') { // 多选题
          const { optionStr, answerStr } = this.$refs.multiSelect.getData()
          if (!optionStr || !answerStr) return
          params = {
            ...this.form,
            questionOption: optionStr,
            questionAnswer: answerStr
          }
        } else if (this.form.questionType === '2') { // 填空题
          const { optionStr, answerStr } = this.$refs.fillSpace.getData()
          if (!optionStr || !answerStr) return
          params = {
            ...this.form,
            questionOption: optionStr,
            questionAnswer: answerStr
          }
        }
        await this.$API.exam.question.save.post({
          ...params,
          questionId: this.questionId
        })
        return true
      } catch (err) {
        return false
      }
    },
    // 获取题目详情
    async getQuestionDetail (questionId) {
      this.questionId = questionId
      this.form = {}
      await this.$API.exam.question.detail.get({
        questionId
      }).then(({ data }) => {
        this.form = { ...data }
        this.$nextTick(() => {
          if (data.questionType === '1') {
            // 反显单选题
            this.$refs.singleSelect.setData(data)
          } else if (data.questionType === '6') {
            // 反显多选题
            this.$refs.multiSelect.setData(data)
          } else if (data.questionType === '2') {
            // 反显填空题
            this.$refs.fillSpace.setData(data)
          }
        })
      }).catch(() => {})
    },
    // 手动切换题目类型时清楚答案
    clearAnswer () {
      this.form.questionAnswer = ''
    }
  },
}
</script>

<style scoped lang="scss">

.form {
  flex-grow: 1;
  width: 100% !important;
  overflow: hidden;
  :deep(.el-form-item) {
    max-width: 1000px;
    width: 100%;
    margin: 0 auto 22px auto;
  }
}

:deep(.tox-tinymce) {
  //margin-top: 0 !important;
  height: 300px !important;
  //box-shadow: 0px 6px 24px 4px rgba(0, 0, 0, 0.04);
  border-radius: 4px !important;
  overflow: hidden;
}

:deep(.el-textarea__inner) {
  height: 200px !important;
  resize: none !important;
}
</style>
