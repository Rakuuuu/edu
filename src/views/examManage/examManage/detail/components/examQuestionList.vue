<template>
  <div class="container">
    <div v-if="courseId">
      <div
        v-for="(item, index) in partList"
        :key="item.partId"
      >
        <div class="part-info">
          <el-input
            :disabled="editType === 'preview'"
            class="part-name"
            v-model="partList[index].partName"
            placeholder="请输入当前部分名称"
          />

          <el-button
            :disabled="editType !== 'add'"
            @click="openDialog(item.partId)"
            class="part-add-question"
          >
            <el-icon><Plus/></el-icon>添加题目
          </el-button>
          <el-button
            :disabled="editType !== 'add'"
            class="part-delete"
            @click="deletePart(index)"
            type="danger"
          >
            <el-icon><Delete/></el-icon>删除
          </el-button>
        </div>
        <div
          v-for="(question, /* questionIndex */) in item.questionList"
          :key="question.questionId"
          class="question-item"
        >
          <div class="question-content">
            <el-tag>{{ getQuestionTypeName(question) }}</el-tag>
            <span class="content-text">{{ question.questionContent.replace(/<[^>]*>?/gm, '') }}</span>
          </div>
          <div class="question-right">
            <div class="question-score">
              <el-input
                v-model="question.questionScore"
                placeholder="请输入分数"
                :disabled="editType === 'preview'"
              />
            </div>
            <div class="question-operate">
              <el-button
                @click="openQuestionDetail(question)"
              >
                <el-icon><More/></el-icon>
              </el-button>
<!--              <el-button-->
<!--                @click="deleteQuestion(index, questionIndex)"-->
<!--                :disabled="editType !== 'add'"-->
<!--                type="danger"-->
<!--                plain-->
<!--              >-->
<!--                <el-icon><Delete/></el-icon>-->
<!--              </el-button>-->
            </div>
          </div>
        </div>
        <div>
        </div>
      </div>
      <div>
        <el-button
          @click="addPart"
          class="add-part-btn"
          :disabled="editType !== 'add'"
        >
          <el-icon><Plus/></el-icon>创建部分
        </el-button>
      </div>
    </div>
    <div v-else>
      <el-empty description="暂未选择所属课程"/>
    </div>
    <el-dialog
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      v-model="dialogVisible"
      width="60%"
      title="添加题目"
      :fullscreen="ismobile"
      :before-close="() => { dialogVisible = false }"
    >
      <select-question
        :course-id="courseId"
        ref="selectQuestion"
        @onClose="dialogVisible=false"
        @onConfirm="onSelectQuestion"
      />
    </el-dialog>
    <el-dialog
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      v-model="detailVisible"
      width="60%"
      title="题目详情"
      :fullscreen="ismobile"
      :before-close="() => { detailVisible = false }"
    >
      <div v-loading="detailLoading">
        <question-detail
          edit-type="preview"
          ref="questionDetail"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import SelectQuestion from './selectQuestion.vue'
import { Plus, Delete, More } from '@element-plus/icons-vue'
import QuestionDetail from '@/views/examManage/questionManage/detail/components/questionDetail.vue'
import {questionType} from '@/utils/enum'

export default {
  name: "examQuestionList",
  components: {QuestionDetail, SelectQuestion, Delete, More, Plus },
  props: {
    courseId: String,
    editType: String,
  },
  watch: {
    'courseId' () {
      this.partList = []
    }
  },
  computed: {
    ismobile() {
      return this.$store.state.global.ismobile
    },
    // 计算所有part已选择的题目（防止不同part中出现相同的题目）
    allSelectedQuestion () {
      const list = []
      this.partList.forEach(v => {
        if (v.questionList.length) {
          list.push(...v.questionList)
        }
      })
      return list
    }
  },
  data () {
    return {
      questionType,
      dialogVisible: false,
      detailVisible: false,
      detailLoading: false,
      /**
       * 题目所属部分划分，传入Object
       * @example { partId: xxx, partName: xxx, questionList: [] }
       */
      partList: []
    }
  },
  methods: {
    // 打开选择题目的弹窗
    openDialog (partId) {
      this.dialogVisible = true
      this.$nextTick(() => {
        console.log(this.allSelectedQuestion)
        this.$refs.selectQuestion.init(partId, this.allSelectedQuestion)
      })
    },
    // 打开题目详情弹窗
    openQuestionDetail (questionItem) {
      this.detailVisible = true
      this.$nextTick(async () => {
        try {
          this.detailLoading = true
          await this.$refs.questionDetail.getQuestionDetail(questionItem.questionId)
        } catch (e) {
          //
        } finally {
          this.detailLoading = false
        }
      })
    },
    // 添加部分
    addPart () {
      this.partList.push({
        partId: `part${Date.now()}`,
        partName: '',
        questionList: []
      })
    },
    // 删除部分
    deletePart (index) {
      this.partList.splice(index, 1)
    },
    // 获取题目类型名称
    getQuestionTypeName (item) {
      const matchRecord = this.questionType.find(v => v.value === item.questionType)
      return matchRecord.label
    },
    // 删除题目
    // deleteQuestion (partIndex, questionIndex) {
    //   this.partList[partIndex].questionList.splice(questionIndex, 1)
    // },
    // 选择题目
    onSelectQuestion (partId, questionList) {
      this.partList.forEach(part => {
        if (part.partId === partId) {
          part.questionList = [...part.questionList, ...questionList]
        }
      })
      this.dialogVisible = false
    },
    // 获取已选择的题目
    async getQuestion () {
      if (!this.partList.length) {
        this.$message({
          type: 'warning',
          message: `题目配置不得为空`
        })
        throw new Error('part配置错误')
      }
      for (const partIndex in this.partList) {
        if (!this.partList[partIndex].partName) {
          this.$message({
            type: 'warning',
            message: `第${Number(partIndex) + 1}部分的名称不得为空`
          })
          throw new  Error('part配置错误')
        } else if (!this.partList[partIndex].questionList.length) {
          this.$message({
            type: 'warning',
            message: `“${this.partList[partIndex].partName}”部分的题目不得为空`
          })
          throw new  Error('题目配置错误')
        } else if (!this.partList[partIndex].questionList.every(q => !!q.questionScore)) {
          this.$message({
            type: 'warning',
            message: `“${this.partList[partIndex].partName}”的题目分数配置不得为空`
          })
          throw new  Error('题目配置错误')
        }
      }
      // 校验通过后
      const questionArr = []
      this.partList.forEach(part => {
        questionArr.push(
          ...part.questionList.map(question => {
            return {
              ...question,
              partId: part.partId,
              partName: part.partName
            }
          })
        )
      })
      console.log(questionArr)
      return questionArr
    },
    // 设置题目反显（包含examQuestionRef中的part信息）
    setQuestion (questions) {
      const partList = []
      questions.forEach(v => {
        // 判断该part是否已经建立
        const matchPartIndex = partList.findIndex(part => part.partId === v.edu_exam_question_ref.partId)
        console.log(matchPartIndex)
        if (matchPartIndex === -1) {
          partList.push({
            partId: v.edu_exam_question_ref.partId,
            partName: v.edu_exam_question_ref.partName,
            questionList: [{
              questionId: v.questionId,
              questionContent: v.questionContent,
              questionType: v.questionType,
              questionOption: v.questionOption,
              questionScore: v.edu_exam_question_ref.questionScore,
              teacherId: v.teacherId,
              courseId: v.courseId
            }]
          })
        } else {
          partList[matchPartIndex].questionList.push({
            questionId: v.questionId,
            questionContent: v.questionContent,
            questionType: v.questionType,
            questionOption: v.questionOption,
            questionScore: v.edu_exam_question_ref.questionScore,
            teacherId: v.teacherId,
            courseId: v.courseId
          })
        }
        console.log(partList)
      })
      this.partList = partList
    }
  }
}
</script>


<style scoped lang="scss">
  .container {
  }
  :deep(.el-dialog__body) {
    padding: 0 16px 16px !important;
    overflow: auto;
  }
  :deep(.el-dialog) {
    margin: 0 auto;
    height: 100%;
  }
  :deep(.el-dialog__body) {
    height: calc(100% - 70px);
  }
  .part-info {
    display: flex;
    align-items: center;
    margin: 0 0 16px;
    padding-left: 32px;
    position: relative;
    &::before {
    position: absolute;
    height: 60%;
    width: 16px;
    top: 50%;
    left: 0;
    content: '';
    border-radius: 4px;
    background: var(--el-color-primary);
    transform: translate(0, -50%);
  }
    .part-name {

    }
    .part-add-question {
      margin-left: 12px;
    }
    .part-delete {
      margin-left: 12px;
    }
  }
  .question-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    padding: 8px 0;
    margin-bottom: 16px;
    .question-content {
      display: flex;
      align-items: center;
      flex-grow: 1;
      overflow: hidden;
      padding: 4px 0;
      .content-text {
        flex-grow: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      :deep(.el-tag) {
        margin-right: 12px;
      }
    }
    .question-right {
      display: flex;
      align-items: center;
      padding: 4px 0;
      .question-score {
        margin-right: 12px;
      }
    }
  }
  .add-part-btn {
    width: 100%;
    padding: 72px;
    border: dashed 1px;
  }
</style>
