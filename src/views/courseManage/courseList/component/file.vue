<template>
  <el-container>
    <el-header>
      <div class="title"> 课程文件详情 </div>
      <div><el-button icon="el-icon-close" @click="$router.go(-1)">关闭</el-button></div>
    </el-header>
    <el-main class="nopadding">
      <sc-table
        ref="chooseCourseTable"
        :apiObj="list.apiObj"
        row-key="studentId"
        :params="{ courseId }"
        @selection-change="selectionChange"
        stripe
      >
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
        <el-table-column label="上传时间" prop="createdAt" width="150">
          <template v-slot="{ row }">
            {{ $TOOL.dateFormat(row.createdAt)}}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="right" width="100">
          <template #default="scope">
            <el-popconfirm title="确定移除吗？" @confirm="table_del(scope.row)">
              <template #reference>
                <el-button plain type="danger" size="small">移除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </sc-table>
    </el-main>
  </el-container>
</template>

<script>
import ScTable from '@/components/scTable/index.vue'
import Close from '@element-plus/icons-vue'
import {formatBytes, getFileTypeFromMIME} from '@/utils/enum'

export default {
  components: { ScTable, Close },
  name: 'courseFileDetail',
  data() {
    return {
      courseId: "",
      list: {
        apiObj: this.$API.file.file.courseFileList
      },
      // 多选的表格数据
      selection: []
    }
  },
  methods: {
    formatBytes,
    getFileTypeFromMIME,
    //表格选择后回调事件
    selectionChange(selection) {
      this.selection = selection
    },
    // 移除单个文件信息
    table_del ({ fileId }) {
      this.$API.file.file.deleteCourseFile.post({
        courseId: this.courseId,
        fileId
      }).then(() => {
        this.$message({
          type: 'success',
          message: '移除成功'
        })
        this.$refs.chooseCourseTable.refresh()
      }).catch(() => {})
    }
  },
  created() {
    this.courseId = this.$route.query.courseId
  }
}
</script>


<style scoped lang="scss">
.title {
  font-size: 16px;
}
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
