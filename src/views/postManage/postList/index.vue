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
        <el-table-column label="帖子名称" prop="postTitle" width="180"></el-table-column>
        <el-table-column label="发布人" width="180">
          <template #default="{ row: { studentName, teacherName } }">
            {{ studentName || `${teacherName}（教师）` }}
          </template>
        </el-table-column>
        <el-table-column label="所属课程" prop="courseName" width="180"></el-table-column>
        <el-table-column label="创建时间" prop="createdAt" width="150">
          <template v-slot="{ row }">
            {{ $TOOL.dateFormat(row.createdAt)}}
          </template>
        </el-table-column>
        <!--        <el-table-column label="状态" prop="boolean" width="60">-->
        <!--          <template #default="scope">-->
        <!--            <sc-status-indicator v-if="scope.row.boolean" type="success"></sc-status-indicator>-->
        <!--            <sc-status-indicator v-if="!scope.row.boolean" pulse type="danger"></sc-status-indicator>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <el-table-column label="操作" fixed="right" align="right" width="200">
          <template #default="scope">
            <el-button plain size="small" @click="table_show(scope.row)">查看</el-button>
            <el-button type="primary" plain size="small" @click="table_edit_page(scope.row)">编辑</el-button>
            <!--            <el-button type="primary" plain size="small" @click="table_edit_page(scope.row)">页面编辑-->
            <!--            </el-button>-->
<!--            <el-popconfirm title="确定删除吗？" @confirm="table_del(scope.row, scope.$index)">-->
<!--              <template #reference>-->
<!--                <el-button plain type="danger" size="small">删除</el-button>-->
<!--              </template>-->
<!--            </el-popconfirm>-->
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
  name: 'postList',
  components: {
    saveDialog
  },
  data() {
    return {
      dialog: {
        save: false
      },
      list: {
        apiObj: this.$API.post.post.list
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
          postId: row.postId
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
      const postIdList = [row.postId]
      this.$API.post.post.delete.post({ postIdList }).then(() => {
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
        await this.$API.post.post.delete.post({
          postIdList: this.selection.map(({ postId }) => postId)
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
