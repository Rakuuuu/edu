<template>
  <el-container>
    <el-header>
      <div class="title"> 任务记录详情 </div>
      <div>
        <el-button type="primary" @click="exportReport">导出报表</el-button>
        <el-button icon="el-icon-close" @click="$router.go(-1)">关闭</el-button>
      </div>
    </el-header>
    <el-main class="nopadding">
      <sc-table
        ref="chooseCourseTable"
        :apiObj="list.apiObj"
        row-key="studentId"
        :params="{ examId }"
        @selection-change="selectionChange"
        stripe
      >
        <el-table-column label="学生" width="180">
          <template v-slot="{row}">
            <div>{{ row.edu_student?.studentName }}</div>
            <div>{{ row.edu_student?.studentNo }}</div>
          </template>
        </el-table-column>
        <el-table-column label="开始时间" prop="" width="150">
          <template v-slot="{ row }">
            {{ dateFormat(row.startTime) }}
          </template>
        </el-table-column>
        <el-table-column label="是否提交" width="100">
          <template v-slot="{ row }">
            {{ row.isSubmit === '1' ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column label="提交时间" prop="" width="150">
          <template v-slot="{ row }">
            {{ dateFormat(row.submitTime) }}
          </template>
        </el-table-column>
        <el-table-column label="提交次数" prop="frequency">
        </el-table-column>
        <el-table-column label="得分" prop="examScore">
        </el-table-column>
      </sc-table>
    </el-main>
  </el-container>
</template>

<script>
import ScTable from '@/components/scTable/index.vue'
import { Close } from '@element-plus/icons-vue'
import tool from '@/utils/tool'

export default {
  components: { ScTable, Close },
  name: 'examRecord',
  data() {
    return {
      examId: "",
      list: {
        apiObj: this.$API.exam.exam.record
      },
      // 多选的表格数据
      selection: []
    }
  },
  methods: {
    dateFormat: tool.dateFormat,
    //表格选择后回调事件
    selectionChange(selection) {
      this.selection = selection
    },
    // 导出报表
    async exportReport () {
      try {
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href =`${this.$API.exam.exam.condition.url}?examId=${this.examId}`
        link.setAttribute(
          'download',
          '任务情况统计报表.xlsx'
        )
        document.body.appendChild(link)
        link.click()
      } catch (err) {
        //
      }
    },
    // 删除单个选课信息
  //   table_del (row, /* index */) {
  //     this.$API.course.course.deleteChooseInfo.post({ studentIdList: [row.studentId] }).then(() => {
  //       this.$message({
  //         type: 'success',
  //         message: '删除成功'
  //       })
  //       this.$refs.chooseCourseTable.refresh()
  //     }).catch(() => {})
  //   }
  },
  created() {
    this.examId = this.$route.query.examId
  }
}
</script>

<style lang="scss">
.title {
  font-size: 16px;
}
</style>
