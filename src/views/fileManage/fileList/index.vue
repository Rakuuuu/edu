<template>
  <el-container>
<!--    <el-header>-->
<!--      <div class="left-panel">-->
<!--        <el-button type="primary" icon="el-icon-plus" @click="add"></el-button>-->
<!--        <el-button type="danger" plain icon="el-icon-delete" :disabled="selection.length==0"-->
<!--                   @click="batch_del"></el-button>-->
<!--      </div>-->
<!--    </el-header>-->
    <el-main class="nopadding">
      <scTable
        ref="table"
        :apiObj="list.apiObj"
        row-key="id"
        @selection-change="selectionChange"
        stripe
      >
<!--        <el-table-column type="selection" width="50"></el-table-column>-->
        <el-table-column label="文件名" width="300">
          <template #default="{ row }">
            <div class="file-name-custom">
              <img :src="`/img/file_types/${getFileTypeFromMIME(row.fileType)}`"/>
              <div class="file-name">
                {{ row.fileName }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="文件大小" prop="fileSize" width="150">
          <template #default="{ row }">
            {{ formatBytes(row.fileSize) }}
          </template>
        </el-table-column>
        <el-table-column label="上传人" prop="fileSize" width="150">
          <template #default="{ row }">
            {{ row.edu_student?.studentName || `${row.edu_teacher?.teacherName}（教师）` || '' }}
          </template>
        </el-table-column>
        <el-table-column label="上传时间" prop="createdAt" width="150"></el-table-column>
<!--        <el-table-column label="修改时间" prop="updatedAt" width="150"></el-table-column>-->
        <!--        <el-table-column label="状态" prop="boolean" width="60">-->
        <!--          <template #default="scope">-->
        <!--            <sc-status-indicator v-if="scope.row.boolean" type="success"></sc-status-indicator>-->
        <!--            <sc-status-indicator v-if="!scope.row.boolean" pulse type="danger"></sc-status-indicator>-->
        <!--          </template>-->
        <!--        </el-table-column>-->

        <el-table-column label="操作" fixed="right" align="right" width="300">
          <template #default="scope">
<!--            <el-button plain size="small" @click="table_show(scope.row)">查看</el-button>-->
<!--            <el-button type="primary" plain size="small" @click="table_edit(scope.row)">编辑</el-button>-->
            <!--            <el-button type="primary" plain size="small" @click="table_edit_page(scope.row)">页面编辑-->
            <!--            </el-button>-->
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
import {formatBytes, getFileTypeFromMIME} from '../../../utils/enum'

export default {
  name: 'teacherList',
  components: {
    saveDialog
  },
  data() {
    return {
      dialog: {
        save: false
      },
      list: {
        apiObj: this.$API.file.file.list
      },
      selection: []
    }
  },
  mounted() {
  },
  methods: {
    getFileTypeFromMIME,
    formatBytes,
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
        path: '/template/list/crud/detail',
        query: {
          id: row.id
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
    table_del({ fileId }) {
      this.$API.file.file.delete.post({ fileId }).then(() => {
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
        await this.$API.user.teacher.delete.post({
          teacherIdList: this.selection.map(({ teacherId }) => teacherId)
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
    },
  }
}
</script>

<style scoped lang="scss">
.file-name-custom {
  display: flex;
  align-items: center;
  img {
    width: 32px;
    height: 32px;
  }
  .file-name {
    margin-left: 12px;
  }
}
</style>
