<template>
  <div v-loading="isLoading" class="container">
    <div class="top">
      <div class="search-bar">
        <el-input
          placeholder="题目名称"
          class="input"
          v-model="searchParams.questionContent"
        />
        <el-select
          placeholder="题目类型"
          class="select"
          v-model="searchParams.questionType"
        >
          <el-option
            v-for="item in questionType"
            :key="item.label"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
        <div class="search-btns">
          <el-button type="primary" @click="queryQuestion">查询</el-button>
          <el-button @click="resetSearchParam">重置</el-button>
        </div>
      </div>
    </div>
    <div class="content">
      <el-checkbox-group
        v-model="selectedQuestionList"
        v-if="questionList.length"
      >
        <el-checkbox
          v-for="item in questionList"
          :key="item.questionId"
          :label="item"
          :disabled="originSelectedQuestionList.findIndex(({ questionId }) => item.questionId === questionId) !== -1"
        >
          <div class="question-info">
            <div class="question-title">
              {{ item.questionContent.replace(/<[^>]*>?/gm, '') }}
            </div>
            <div class="question-type">
              <el-tag>{{ getQuestionTypeName(item) }}</el-tag>
            </div>
          </div>
        </el-checkbox>
      </el-checkbox-group>
      <div v-else>
        <el-empty/>
      </div>
    </div>
    <div class="bottom">
      <el-pagination
        v-model:current-page="pageParams.currentPage"
        v-model:page-size="pageParams.pageSize"
        v-model:total="pageParams.total"
        @current-change="pageChange"
      />
      <div class="operate-btn">
        <el-button
          :disabled="!selectedQuestionList.length"
          type="primary"
          @click="onConfirm"
        >确定
        </el-button>
        <el-button @click="$emit('onClose')">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { questionType } from '@/utils/enum'
import QuestionList from '@/views/examManage/questionManage/component/questionList.vue'

export default {
  name: "selectQuestion",
  components: { QuestionList },
  emits: ['onClose', 'onConfirm'],
  props: {
    courseId: String
  },
  data () {
    return {
      // 分页参数
      pageParams: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      // 搜索参数
      searchParams: {
        questionType: '',
        questionContent: ''
      },
      // 题目列表
      questionList: [],
      // 目前已选的题目列表
      selectedQuestionList: [],
      // 之前已配置选择的题目
      originSelectedQuestionList: [],
      // 题目所属部分的ID
      partId: '',
      isLoading: false,
      questionType
    }
  },
  methods: {
    pageChange (page) {
      this.pageParams.currentPage = page
      this.queryQuestion()
    },
    resetSearchParam () {
      this.searchParams = {
        questionType: '',
        questionContent: ''
      }
    },
    // 查询题目
    queryQuestion () {
      const params = {
        currentPage: this.pageParams.currentPage,
        pageSize: this.pageParams.pageSize,
        courseId: this.courseId
      }
      Object.keys(this.searchParams).forEach(key => {
        if (this.searchParams[key]) {
          params[key] = this.searchParams[key]
        }
      })
      this.isLoading = true
      this.$API.exam.question.list.get(params).then(({ data: { list, total }}) => {
        this.pageParams.total = total
        this.questionList = list
      }).catch(() => {}).finally(() => {
        this.isLoading = false
      })
    },
    // 获取题目类型名称
    getQuestionTypeName (item) {
      const matchRecord = this.questionType.find(v => v.value === item.questionType)
      return matchRecord.label
    },
    // 点击“确定”，返回已选择的partId和题目信息
    onConfirm () {
      // 过滤掉之前已经选择的题目
      const confirmList = []
      this.selectedQuestionList.forEach(i => {
        if (this.originSelectedQuestionList.findIndex(j => {
          return j.questionId === i.questionId
        }) === -1) {
          confirmList.push(i)
        }
      })
      this.$emit('onConfirm', this.partId, confirmList)
    },
    // 初始化
    init (partId, questionList) {
      this.partId = partId
      this.originSelectedQuestionList = questionList
      this.questionList = []
      this.selectedQuestionList = this.originSelectedQuestionList
      this.pageParams = {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
      this.resetSearchParam()
      this.queryQuestion()
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.top {
  .search-bar {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .input {
      width: 200px !important;
      margin-right: 12px;
      margin-bottom: 12px;
      :deep(.el-input__wrapper),
      :deep(.el-input__inner) {
        width: 200px !important;
      }
    }
    .select {
      width: 200px !important;
      margin-right: 12px;
      margin-bottom: 12px;
      :deep(.el-input__wrapper) {
        width: 200px !important;
      }
    }
    .search-btns {
      margin-bottom: 12px;
    }
  }
}
.bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  :deep(.el-pagination) {
    width: 100%;
  }
  .operate-btn {
    margin-top: 12px;
  }
}
.content {
  flex-grow: 1;
  overflow-y: auto;
  margin: 16px 0;
  height: 100%;
  :deep(.el-checkbox) {
    width: 100%;
    margin: 0;
    height: fit-content;
  }
  .question-info {
    padding: 8px;
    box-sizing: border-box;
    .question-title {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .question-type {
      margin-top: 8px;
    }
  }
}
</style>
