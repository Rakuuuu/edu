<template>
  <el-dialog v-loading="isLoading" :title="titleMap[mode]" v-model="visible" :width="800" destroy-on-close @closed="$emit('closed')">
    <div v-loading="isLoading">
      <div class="comment-box">
        <div class="parent-comment" v-if="comment.parentComment?.commentId">
          <div class="parent-send-info">
            <div class="send-user">回复：<b>{{ comment.parentComment.edu_student?.studentName || `${comment.parentComment?.edu_teacher?.teacherName}（教师）` || ''}}</b></div>
            <div class="send-time">{{ comment.parentComment.createdAt }}</div>
          </div>
          <div class="parent-comment-content" v-html="comment.parentComment?.commentContent"></div>
        </div>
        <div class="comment-content" v-html="comment.commentContent"></div>
        <div class="comment-send-info">
          <div>发布人：<b>{{ comment.edu_student?.studentName || `${comment.edu_teacher?.teacherName}（教师）` || '' }}</b></div>
          <div>发布时间：{{ comment.createdAt }}</div>
        </div>
      </div>
      <div class="post-box">
        <div class="post-label"> 帖子主题 </div>
        <div class="post-title"> 标题：<b>{{ comment.edu_post.postTitle }}</b></div>
        <div class="post-content" v-html="comment.edu_post.postContent"></div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
// import {emailReg, phoneReg} from "@/utils/regs";


export default {
  emits: ['success', 'closed'],
  data() {
    return {
      mode: "add",
      titleMap: {
        add: '新增',
        edit: '编辑',
        show: '查看评论内容'
      },
      commentContent: "",
      visible: false,
      isSaveing: false,
      isLoading: false,
      // 对应的评论对象
      comment: {
        edu_post: {},
        parentComment: {},
        edu_student: {},
        edu_teacher: {}
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
      return this
    },
    //表单提交方法
    async submit() {
      const operate = this.mode === 'edit' ? 'update' : 'add'
      try {
        await this.$refs.dialogForm.validate()
        await this.$API.department.department[operate].post(this.form)
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
    setData({ commentId }) {
      this.isLoading = true
      this.$API.post.comment.detail.get({ commentId }).then(({ data }) => {
        this.comment = data
        this.isLoading = false
      }).catch(() => {
        this.isLoading = false
      })
    }
  }
}
</script>

<style lang="scss">
.comment-box {
  .parent-comment {
    margin-bottom: 30px;
    padding: 8px;
    border-radius: 4px;
    background: #f5f5f5;
    .parent-send-info{
      display: flex;
      flex-wrap: wrap;
      .send-user {
        margin-right: 8px;
      }
    }
    .parent-comment-content {
      font-size: 16px;
      margin: 16px 0;
      padding: 0 8px;
    }
  }
  .comment-content {
    padding: 0 8px;
    width: 100%;
    overflow: auto;
    font-size: 16px;
    margin-bottom: 30px;
    color: #333;
  }
  .comment-send-info {
    padding: 0 8px;
  }
}
.post-box {
  margin-top: 30px;
  border-top: 1px solid #d7d7d7;
  padding: 16px 0;
  .post-label {
    margin-bottom: 16px;
    font-size: 17px;
    color: #303133;
    font-weight: bold;
  }
  .post-title {
    padding: 0 8px;
    font-size: 16px;
    margin-bottom: 16px;
    b {
      font-size: 24px !important;
    }
  }
  .post-content {
    padding: 0 8px;
  }
}
</style>
