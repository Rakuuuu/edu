<template>
  <el-container>
    <el-header>
      <div class="title"> 帖子内容编辑 </div>
      <div><el-button icon="el-icon-close" @click="$router.go(-1)">关闭</el-button></div>
    </el-header>
    <el-main class="nopadding">
      <sc-editor
        v-model="postContent"
        class="editor"
        resize="none"
        :options="{ statusbar: false }"
      ></sc-editor>
    </el-main>
    <el-footer class="footer">
      <el-button
        class="save-btn"
        icon="el-icon-check"
        type="primary"
        :disabled="!postContent"
        @click="savePostDetail"
      >保存</el-button>
    </el-footer>
  </el-container>
</template>

<script>
import Close from '@element-plus/icons-vue'
import ScEditor from '@/components/scEditor/index.vue'
export default {
  components: { Close, ScEditor },
  name: 'chooseCourseDetail',
  data() {
    return {
      postId: "",
      postContent: ""
    }
  },
  methods: {
    async savePostDetail () {
      try {
        await this.$API.post.post.save.post({
          postId: this.postId,
          postContent: this.postContent
        })
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.$router.back()
      } catch (e) {
        /* empty */
      }
    }
  },
  async created() {
    this.postId = this.$route.query.postId
    try {
      const { data: { postContent } } = await this.$API.post.post.detail.get({
        postId: this.postId
      })
      this.postContent = postContent
    } catch (e) {
      /* empty */
    }
  }
}
</script>

<style lang="scss">
  .title {
    font-size: 16px;
  }
  .editor {
    height: 100% !important;
    .tox-tinymce {
      height: 100% !important;
      border-top: 0 !important;
      border-bottom: 0 !important;
    }
  }
  .footer {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
