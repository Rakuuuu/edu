<template>
  <el-container>
    <el-header>
      <div class="left-panel">
        <el-button type="primary" icon="el-icon-plus" @click="add"></el-button>
        <el-button type="danger" plain icon="el-icon-delete" :disabled="selection.length==0"
                   @click="batch_del"></el-button>
      </div>
      <div>
        <sc-search-form
          :listForm="searchForm"
          @searchHandler="searchHandler"
        />
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
        <el-table-column label="课程名称" prop="courseName" width="180"></el-table-column>
        <el-table-column label="选课人数" prop="studentCount" width="180"></el-table-column>
        <el-table-column label="课程教师" prop="studentCount" width="180">
          <template v-slot="{ row }">
            <div>{{ row.teacherName }}</div>
            <div>{{ row.teacherNo }}</div>
          </template>
        </el-table-column>
        <el-table-column label="课程类型" prop="studentCount" width="180">
          <template v-slot="{ row }">
            <div>{{ courseType?.find(v => v.value === row.courseType)?.label }}</div>
          </template>
        </el-table-column>
        <el-table-column label="课程所属专业" prop="specialityName" width="180">
          <template v-slot="{ row }">
            <div>{{ row.specialityName }}</div>
            <div>{{ row.departmentName }}</div>
          </template>
        </el-table-column>
        <!--        <el-table-column label="状态" prop="boolean" width="60">-->
        <!--          <template #default="scope">-->
        <!--            <sc-status-indicator v-if="scope.row.boolean" type="success"></sc-status-indicator>-->
        <!--            <sc-status-indicator v-if="!scope.row.boolean" pulse type="danger"></sc-status-indicator>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <el-table-column label="操作" fixed="right" align="right" width="350">
          <template #default="scope">
            <el-button plain size="small" @click="table_show(scope.row)">查看</el-button>
            <el-button plain size="small" @click="table_choose_course(scope.row)">学生</el-button>
            <el-button plain size="small" @click="table_course_file(scope.row)">文件</el-button>
            <el-button type="primary" plain size="small" @click="table_edit(scope.row)">编辑</el-button>
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
import ScSearchForm from '@/components/scSearchForm/index.vue'
import {courseType} from '@/utils/enum'
export default {
  name: 'courseList',
  components: {
    ScSearchForm,
    saveDialog
  },
  data() {
    return {
      courseType,
      dialog: {
        save: false
      },
      list: {
        apiObj: this.$API.course.course.list
      },
      selection: [],
      searchForm: [
        {
          type: 'input',
          keyName: 'courseName',
          placeholder: '课程名称',
        },
        {
          type: 'select',
          keyName: 'courseType',
          placeholder: '课程类型',
          options: courseType
        }
      ]
    }
  },
  mounted() {
  },
  methods: {
    searchHandler (val) {
      this.$refs.table.reload(val)
    },
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
    //查看
    table_show(row) {
      this.dialog.save = true
      this.$nextTick(() => {
        this.$refs.saveDialog.open('show').setData(row)
      })
    },
    //窗口查看选课学生列表
    table_choose_course({ courseId }) {
      this.$router.push({
        path: '/courseManage/chooseCourseDetail',
        query: {
          courseId
        }
      })
    },
    //窗口查看课程文件列表
    table_course_file({ courseId }) {
      this.$router.push({
        path: '/courseManage/courseFileDetail',
        query: {
          courseId
        }
      })
    },
    //删除明细
    table_del(row) {
      const courseIdList = [ row.courseId ]
      this.$API.course.course.delete.post({ courseIdList }).then(() => {
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
        await this.$confirm(`确定删除选中课程吗？删除后课程资源将被一并清空。`, '提示', { type: 'warning' })
        await this.$API.course.course.delete.post({
          courseIdList: this.selection.map(({ courseId }) => courseId)
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
