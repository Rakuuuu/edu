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
        <el-table-column label="姓名" prop="adminName" width="180"></el-table-column>
        <el-table-column label="手机号" prop="adminPhone" width="150"></el-table-column>
        <el-table-column label="所属学院" prop="departmentName" width="180"></el-table-column>
        <el-table-column label="创建时间" prop="createdAt" width="150">
          <template v-slot="{ row }">
            {{ $TOOL.dateFormat(row.createdAt)}}
          </template>
        </el-table-column>
        <el-table-column label="修改时间" prop="updatedAt" width="150">
          <template v-slot="{ row }">
            {{ $TOOL.dateFormat(row.updatedAt)}}
          </template>
        </el-table-column>
        <!--        <el-table-column label="状态" prop="boolean" width="60">-->
        <!--          <template #default="scope">-->
        <!--            <sc-status-indicator v-if="scope.row.boolean" type="success"></sc-status-indicator>-->
        <!--            <sc-status-indicator v-if="!scope.row.boolean" pulse type="danger"></sc-status-indicator>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <el-table-column label="操作" fixed="right" align="right" width="300">
          <template #default="scope">
            <el-button plain size="small" @click="table_show(scope.row)">查看</el-button>
            <el-button type="primary" plain size="small" @click="table_edit(scope.row)">编辑</el-button>
            <!--            <el-button type="primary" plain size="small" @click="table_edit_page(scope.row)">页面编辑-->
            <!--            </el-button>-->
            <el-popconfirm title="确定要重置密码吗？" @confirm="reset_password(scope.row)">
              <template #reference>
                <el-button plain type="warning" size="small">重置密码</el-button>
              </template>
            </el-popconfirm>
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

export default {
  name: 'adminList',
  components: {
    ScSearchForm,
    saveDialog
  },
  data() {
    return {
      dialog: {
        save: false
      },
      list: {
        apiObj: this.$API.user.admin.list
      },
      selection: [],
      searchForm: [
        {
          type: 'input',
          keyName: 'adminName',
          placeholder: '管理员姓名',
        },
        {
          type: 'input',
          keyName: 'adminPhone',
          placeholder: '手机号',
        },
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
    // 重置密码
    async reset_password (row) {
      try {
        await this.$API.user.common.resetUserPassword.post({
          adminId: row.adminId
        })
        this.$message({
          type: 'success',
          message: '密码重置成功'
        })
      } catch (err) {
        //
      }
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
    table_del(row) {
      const adminIdList = [row.adminId]
      this.$API.user.admin.delete.post({ adminIdList }).then(() => {
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
        await this.$API.user.admin.delete.post({
          adminIdList: this.selection.map(({ adminId }) => adminId)
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
