<template>
  <el-container v-loading="isLoadingQuestion">
    <el-header>
      <div class="main-header title">
        <div class="title-text">习题列表</div>
        <div class="title-btn">
          <el-checkbox
            class="select-all"
            @change="selectAll"
            :model-value="selectedId.length === questionList.filter(v => v.isUsed===0).length && selectedId.length"
            :disabled="!questionList.filter(v => v.isUsed===0).length"
          >
            全选
          </el-checkbox>
          <el-button-group>
            <el-button
              type="primary"
              @click="$router.push({ name: 'addQuestion' })"
            >
              <el-icon><Plus/></el-icon>创建
            </el-button>
            <el-button
              type="danger"
              plain
              :disabled="!selectedId.length"
              @click="deleteQuestion"
            >
              <el-icon><Delete/></el-icon>删除（{{selectedId.length}}）
            </el-button>
          </el-button-group>
        </div>
      </div>
    </el-header>
    <el-main class="nopadding">
      <el-scrollbar>
        <div v-if="questionList.length" class="container">
          <div
            v-for="item in questionList"
            :key="item.questionContent"
            class="question-main el-button"
            :class="ismobile ? 'mobile' : ''"
          >
            <div class="left">
              <div class="check-box">
                <el-checkbox
                  @change="item.isUsed===0 && handleCheckbox($event, item)"
                  :model-value="item.isUsed===0 && isChecked(item)"
                  :disabled="item.isUsed!==0"
                ></el-checkbox>
              </div>
              <div class="question-type">
                <el-tag>{{ getQuestionTypeName(item) }}</el-tag>
              </div>
              <div class="exam-info">
                <div class="question-content">
                  {{ item.questionContent.replace(/<[^>]*>?/gm, '') }}
                </div>
                <div class="question-course">
                  {{ item.edu_course?.courseName }}
                </div>
              </div>
            </div>
            <div class="right">
              <el-button-group>
                <el-button @click="toDetail(item, 'preview')"><el-icon><More/></el-icon><span>详情</span></el-button>
                <el-button @click="toDetail(item, 'edit')"><el-icon><Edit/></el-icon><span>编辑</span></el-button>
                <el-button :disabled="item.isUsed !== 0" @click="deleteItem(item)"><el-icon><Delete/></el-icon><span>删除</span></el-button>
              </el-button-group>
            </div>
          </div>
        </div>
        <el-empty v-else class="empty"/>
      </el-scrollbar>
    </el-main>
    <el-footer>
      <el-pagination
        v-model:current-page="pageParam.currentPage"
        v-model:page-size="pageParam.pageSize"
        v-model:total="pageParam.total"
      />
    </el-footer>
  </el-container>
</template>

<script>
import { questionType } from '@/utils/enum'
import { More, Edit, Delete, Plus } from '@element-plus/icons-vue'

export default {
  name: "questionList",
  components: {Plus,  Edit, Delete, More },
  props: {
    currentCourse: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      questionType,
      questionList: [],
      selectedId: [],
      isLoadingQuestion: false,
      pageParam: {
        currentPage: 1,
        pageSize: 15,
        total: 0
      }
    }
  },
  watch: {
    'currentCourse.courseId'() {
      this.queryQuestion()
    }
  },
  computed: {
    // 计算是否是移动设备
    ismobile () {
      return this.$store.state.global.ismobile
    }
  },
  mounted() {
    this.queryQuestion()
  },
  methods: {
    // 跳转详情页
    toDetail (item, editType) {
      this.$router.push({
        name: 'questionDetail',
        query: {
          questionId: item.questionId,
          editType
        }
      })
    },
    // 是否选中
    isChecked (item) {
      return this.selectedId.includes(item.questionId)
    },
    // 全选/全不选
    selectAll (val) {
      if (val) {
        this.selectedId = this.questionList.filter(v => v.isUsed === 0).map(({ questionId }) => questionId)
      } else {
        this.selectedId = []
      }
      console.log(this.selectedId)
    },
    // 单选变化
    handleCheckbox (val, item) {
      const matchIdIndex = this.selectedId.findIndex(v => v === item.questionId)
      if (val && matchIdIndex === -1) {
        this.selectedId.push(item.questionId)
      } else if (!val && matchIdIndex !== -1) {
        this.selectedId.splice(matchIdIndex, 1)
      }
      console.log(this.selectedId)
    },
    // 获取题目类型名称
    getQuestionTypeName (item) {
      const matchRecord = this.questionType.find(v => v.value === item.questionType)
      return matchRecord.label
    },
    // 查询题目
    queryQuestion () {
      this.isLoadingQuestion = true
      this.$API.exam.question.list.get({
        currentPage: this.pageParam.currentPage,
        pageSize: this.pageParam.pageSize,
        courseId: this.currentCourse?.courseId
      }).then(({ data: { list, total }}) => {
        this.selectedId = []
        this.questionList = list
        this.pageParam.total = total
      }).catch(() => {}).finally(() => {
        this.isLoadingQuestion = false
      })
    },
    // 批量删除题目
    async deleteQuestion () {
      try {
        await this.$confirm('确定要删除选中题目吗？', '提示', { type: 'warning' })
        this.isLoadingQuestion = true
        await this.$API.exam.question.delete.post({
          questionIdList: this.selectedId
        })
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.queryQuestion()
      } catch (err) {
        this.isLoadingQuestion = false
      }
    },
    // 删除单个题目
    async deleteItem (item) {
      try {
        await this.$confirm('确定要删除该题目吗？', '提示', { type: 'warning' })
        this.isLoadingQuestion = true
        await this.$API.exam.question.delete.post({
          questionIdList: [ item.questionId ]
        })
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.queryQuestion()
      } catch (err) {
        //
      }
    }
  }
}
</script>

<style scoped lang="scss">
// 习题列表容器
.main-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  .question-title {
    font-weight: bold;
    font-size: 20px;
  }
  .title-btn {
    display: flex;
    align-items: center;
    .select-all {
      margin-right: 16px;
    }
  }
}

.empty {
  height: 100%;
}
.container {
  display: flex;
  flex-direction: column;
}

:deep(.el-tag) {
  margin: 0 12px;
}
.mobile {
  flex-direction: column;
  align-items: start !important;
  .left{
    width: 100%;
    .check-box {
    }
    .question-type {
    }
    .exam-info {
      .question-content {
      }
      .question-course {
      }
    }
  }
  .right {
    align-self: center;
    margin: 32px 0 8px 0;
  }
}
.question-main {
  width: 100%;
  display: flex;
  cursor: initial;
  align-items: center;
  padding: 24px 16px;
  height: fit-content !important;
  justify-content: space-between;
  margin: 0;
  border-radius: 0 !important;
  border: 0;
  .left{
    display: flex;
    overflow: hidden;
    align-items: center;
    margin-right: 24px;
    .check-box {

    }
    .exam-type {
      margin: 0 16px;
    }
    .exam-info {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      align-items: start;
      .question-content {
        text-align: start;
        width: 100%;
        font-weight: bold;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        font-size: 14px;
      }
      .question-course {
        text-align: start;
        width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        color: var(--el-text-color-secondary);
        margin-top: 8px;
      }
    }
  }
  .right {
    flex-shrink: 0;
  }
}
</style>
