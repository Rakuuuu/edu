<template>
  <el-container v-loading="isLoading">
    <el-header class="header">
      <div class="header-content">
        <el-button
          @click="$router.back()"
          class="header-left"
          type="text"
        ><el-icon><ArrowLeft /></el-icon><span>返回</span></el-button>
        <div class="header-middle">{{ editText }}题目</div>
      </div>
    </el-header>
    <el-main class="main">
      <question-detail
        ref="questionDetail"
        :editType="editType"
      />
    </el-main>
    <el-footer class="footer" v-if="isEdit">
      <el-button
        type="primary"
        @click="saveQuestion"
      >
        保存
      </el-button>
    </el-footer>
  </el-container>
</template>

<script>
import {ArrowLeft, Refresh} from '@element-plus/icons-vue'
import QuestionDetail from '@/views/examManage/questionManage/detail/components/questionDetail.vue'

export default {
  name: "questionEdit",
components: { ArrowLeft, Refresh, QuestionDetail },
  data () {
    return {
      isLoading: false,
      questionId: '',
      // preview || edit
      editType: 'edit',
    }
  },
  computed: {
    isEdit () {
      return this.editType === 'edit'
    },
    editText () {
      return this.editType === 'edit' ? '编辑' : '查看'
    }
  },
  methods: {
    async saveQuestion () {
      this.isLoading = true
      try {
        await this.$refs.questionDetail.saveQuestion()
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.$router.back()
      } catch (e) {
        //
      } finally {
        this.isLoading = false
      }
    }
  },
  async mounted() {
    const { questionId, editType } = this.$route.query
    this.questionId = questionId
    this.editType = editType
    this.isLoading = true
    try {
      await this.$refs.questionDetail.getQuestionDetail(this.questionId)
    } catch (e) {
      //
    } finally {
      this.isLoading = false
    }
  },
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
      max-width: 1000px;
      width: 100%;
      margin: 0 auto 22px auto;
    }
  }
}


.editor {
  width: 100% !important;
}

.footer {
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>
