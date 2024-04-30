<template>
  <el-container>
    <el-header>
      <div class="left-panel">
<!--        <el-button type="primary" icon="el-icon-plus" @click="add"></el-button>-->
        <el-button type="danger" plain icon="el-icon-delete" :disabled="selection.length===0"
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
        <el-table-column type="selection" width="50" :selectable="(row) => row.isUsed===0"></el-table-column>
        <el-table-column label="题目内容" prop="questionContent" width="300">
          <template v-slot="{ row }">
            {{ row.questionContent.replace(/<[^>]*>/g, '') }}
          </template>
        </el-table-column>
        <el-table-column label="题目类型" width="150">
          <template v-slot="{ row }">
            {{ getQuestionTypeName(row) }}
          </template>
        </el-table-column>
        <el-table-column label="使用数" prop="isUsed">
        </el-table-column>
        <el-table-column label="所属课程" width="150">
          <template v-slot="{ row }">
            <div>{{ row.edu_course.courseName }}</div>
            <div>（{{ row.edu_course?.edu_speciality?.specialityName }}）</div>
          </template>
        </el-table-column>
          <el-table-column label="创建人" width="150">
            <template v-slot="{ row }">
              {{ row.edu_course.edu_teacher.teacherName }}
            </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createdAt" width="150">
          <template v-slot="{ row }">
            {{ dateFormat(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="修改时间" prop="updatedAt" width="150">
          <template v-slot="{ row }">
            {{ dateFormat(row.updatedAt) }}
          </template></el-table-column>
        <el-table-column label="操作" fixed="right" align="right" width="300">
          <template #default="scope">
            <el-button plain size="small" @click="table_show(scope.row)">查看</el-button>
<!--            <el-button type="primary" plain size="small" @click="table_edit(scope.row)">编辑</el-button>-->
            <!--            <el-button type="primary" plain size="small" @click="table_edit_page(scope.row)">页面编辑-->
            <!--            </el-button>-->
            <el-popconfirm
              title="确定删除吗？" @confirm="table_del(scope.row, scope.$index)">
              <template #reference>
                <el-button :disabled="scope.row.isUsed!==0" plain type="danger" size="small">删除</el-button>
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
import tool from '@/utils/tool'
import saveDialog from './component/save.vue'
import {questionType} from '@/utils/enum'

export default {
  name: 'questionList',
  components: {
    saveDialog
  },
  data() {
    return {
      dialog: {
        save: false
      },
      list: {
        apiObj: this.$API.exam.question.list
      },
      selection: [],
      questionType
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
    dateFormat: tool.dateFormat,
    // 获取题目类型名称
    getQuestionTypeName (item) {
      const matchRecord = this.questionType.find(v => v.value === item.questionType)
      return matchRecord.label
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
      // this.dialog.save = true
      // this.$nextTick(() => {
      //   this.$refs.saveDialog.open('show').setData(row)
      // })
      this.$router.push({
        name: 'questionDetail',
        query: {
          questionId: row.questionId
        }
      })
    },
    //删除明细
    table_del(row) {
      const questionIdList = [row.questionId]
      this.$API.exam.question.delete.post({ questionIdList }).then(() => {
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
        await this.$API.exam.question.delete.post({
          questionIdList: this.selection.map(({ questionId }) => questionId)
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
