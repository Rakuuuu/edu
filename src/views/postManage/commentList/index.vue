<template>
  <el-container>
    <el-header>
      <div class="left-panel">
<!--        <el-button type="primary" icon="el-icon-plus" @click="add"></el-button>-->
        <el-button type="danger" plain icon="el-icon-delete" :disabled="selection.length==0"
                   @click="batch_del"></el-button>
      </div>
    </el-header>
    <el-main class="nopadding">
      <scTable
        ref="table"
        :apiObj="list.apiObj"
        row-key="id"
        @selection-change="selectionChange"
        stripe
      >
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column label="评论内容" prop="commentContent" width="180">
          <template v-slot="{ row }">
            {{ row.commentContent?.replace(/<[^>]*>/g, '') }}
          </template>
        </el-table-column>
        <el-table-column label="所属帖子名称" prop="postTitle" width="180"></el-table-column>
        <el-table-column label="发布人" width="180">
          <template #default="{ row: { studentName, teacherName } }">
            {{ studentName || `${teacherName}（教师）` }}
          </template>
        </el-table-column>
        <el-table-column label="所属课程" prop="courseName" width="180"></el-table-column>
        <el-table-column label="评论时间" prop="createdAt" width="150">
          <template v-slot="{ row }">
            {{ $TOOL.dateFormat(row.createdAt)}}
          </template>
        </el-table-column>

        <el-table-column label="操作" fixed="right" align="right" width="200">
          <template #default="scope">
            <el-button plain size="small" @click="table_show(scope.row)">查看</el-button>
            <el-popconfirm title="确定删除吗？" @confirm="table_del(scope.row, scope.$index)">
              <template #reference>
                <el-button plain type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </scTable>
    </el-main>
  </el-container>

  <save-dialog v-if="dialog.save" ref="saveDialog" @success="handleSaveSuccess"
               @closed="dialog.save=false">

  </save-dialog>
</template>

<script>
import saveDialog from './component/save.vue'

export default {
  name: 'commentList',
  components: {
    saveDialog
  },
  data() {
    return {
      dialog: {
        save: false
      },
      list: {
        apiObj: this.$API.post.comment.list
      },
      selection: []
    }
  },
  mounted() {
  },
  methods: {
    //窗口新增
    add() {
      this.dialog.save = true
      this.$nextTick(() => {
        this.$refs.saveDialog.open()
      })
    },
    //窗口编辑
    table_edit(row) {
      this.dialog.save = true
      this.$nextTick(() => {
        this.$refs.saveDialog.open('edit').setData(row)
      })
    },
    //页面新增
    addPage() {
      this.$router.push({
        path: '/template/list/crud/detail',
      })
    },
    //页面编辑
    table_edit_page(row) {
      this.$router.push({
        path: '/postManage/postDetail',
        query: {
          commentId: row.commentId
        }
      })
    },
    //查看
    table_show(row) {
      this.dialog.save = true
      this.$nextTick(() => {
        this.$refs.saveDialog.open('show').setData(row)
      })
    },
    //删除明细
    table_del(row) {
      const commentIdList = [row.commentId]
      this.$API.post.comment.delete.post({ commentIdList }).then(() => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        // 刷新表格
        this.$refs.table.refresh()
      }).catch(() => {})
    },
    //批量删除
    async batch_del() {
      try {
        await this.$confirm(`确定删除选中数据吗？`, '提示', { type: 'warning' })
        await this.$API.post.comment.delete.post({
          commentIdList: this.selection.map(({ commentId }) => commentId)
        })
        this.$message.success("操作成功")
        this.$refs.table.refresh()
      } catch (err) {
        /* empty */
      }
    },
    //表格选择后回调事件
    selectionChange(selection) {
      this.selection = selection
    },
    //本地更新数据
    handleSaveSuccess() {
      // 刷新表格
      this.$refs.table.refresh()
    }
  }
}
</script>

<style>
</style>
