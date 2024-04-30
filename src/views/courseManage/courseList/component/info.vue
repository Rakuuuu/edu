<template>
  <el-container>
    <el-header>
      <div class="title"> 选课详情 </div>
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
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column label="学生姓名" prop="studentName" width="180"></el-table-column>
        <el-table-column label="学号" prop="studentNo" width="150"></el-table-column>
        <el-table-column label="选课时间" prop="createdAt" width="150">
          <template v-slot="{ row }">
            {{ $TOOL.dateFormat(row.createdAt)}}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="right" width="300">
          <template #default="scope">
            <el-popconfirm title="确定删除吗？" @confirm="table_del(scope.row, scope.$index)">
              <template #reference>
                <el-button plain type="danger" size="small">删除</el-button>
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

export default {
  components: { ScTable, Close },
  name: 'chooseCourseDetail',
  data() {
    return {
      courseId: "",
      list: {
        apiObj: this.$API.course.course.chooseCourseList
      },
      // 多选的表格数据
      selection: []
    }
  },
  methods: {
    //表格选择后回调事件
    selectionChange(selection) {
      this.selection = selection
    },
    // 删除单个选课信息
    table_del (row, /* index */) {
      this.$API.course.course.deleteChooseInfo.post({
        studentIdList: [row.studentId],
        courseId: this.courseId
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功'
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

<style lang="scss">
  .title {
    font-size: 16px;
  }
</style>
