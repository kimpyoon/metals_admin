<template>
  <div style="margin-top: -12px;">
    <div class="addBox">
      <label class="title">新闻列表</label>
      <div class="addHandle">
        <el-button size="normal" class="primary" icon="el-icon-plus" @click="editNews('add', {})">新建</el-button>
      </div>
    </div>
    <template>
      <el-table
        :data="tableData.data"
        :header-row-class-name="tableHeaderRowClassName"
        :cell-class-name="tableCellClassName"
        :row-class-name="tableRowClassName"
        :header-cell-style="{background:'#FAFAFA'}"
        v-loading="loading"
        :highlight-current-row="false"
        style="width: 100%">
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          prop="title"
          width="300"
          show-overflow-tooltip
          label="新闻标题">
        </el-table-column>
        <el-table-column
          prop="image"
          label="新闻封面">
          <template slot-scope="scope">
            <el-image
              v-for="(item, index) in scope.row.image.split(',')"
              class="coverImage"
              fit="contain"
              :src="item"
              :key="index"
              :preview-src-list="scope.row.image.split(',')">
              <div slot="error" style="font-size: 30px;">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="created"
          label="创建时间"
          :formatter="formatDateTime"
          align="center">
        </el-table-column>
        <el-table-column
          label="下架/上架"
          width="100"
          align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              @change="toggle(scope.row)"
              active-color="#409eff"
              inactive-color="#dcdfe6">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="160"
          align="center">
          <template slot-scope="scope">
            <el-button size="normal" type="text" @click="editNews('edit', scope.row)">编辑</el-button>
            <el-button size="normal" type="text" @click="deleteHandle(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <span class="slotText">共 <span class="current">{{tableData.total}}</span> 条记录，第 <span class="current">{{currentPage}}</span>/{{Math.ceil(tableData.total / tableData.size)}}页</span>
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          background
          :page-size="tableData.size"
          layout="slot, prev, pager, next, jumper"
          :total="tableData.total">
        </el-pagination>
      </div>
    </template>
    <Edit v-if="showEdit" @refreshTable="getNews" :editType="editType" :editForm="editForm" @hideDialog="showEdit = false" @preview="preview"></Edit>
    <Delete v-if="showDelete" @refreshTable="getNews" :text="'你将删除该新闻'" :url="deleteUri" @hideDialog="showDelete = false"></Delete>
    <Preview v-if="showPreview" :previewData="previewData" @hideDialog="showPreview = false"></Preview>
  </div>
</template>

<script>
import Edit from './edit.vue'
import Delete from '@/components/common/delete.vue'
import Preview from './preview.vue'
import { formatDateTime } from '@/utils/formatDateTime.js'
export default {
  name: 'group',
  data () {
    return {
      deleteUri: '',
      tableData: {
        data: [],
        size: 20,
        total: 0
      },
      loading: true,
      currentPage: 1,
      showEdit: false,
      editType: 'add',
      editForm: {},
      showDelete: false,
      deleteForm: {},
      showPreview: false,
      previewData: {}
    }
  },
  mounted () {
    this.loading = false
    this.getNews()
  },
  methods: {
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex % 2 !== 0) {
        return 'single-row'
      } else {
        return ''
      }
    },
    tableCellClassName ({ column, columnIndex }) {
      if (columnIndex === 0) {
        return 'firstCell'
      }
    },
    tableHeaderRowClassName ({ row, rowIndex }) {
      if (rowIndex === 0) {
        return 'firstRow'
      }
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getNews()
    },
    editNews (type, row) {
      this.showEdit = true
      this.editType = type
      this.editForm = row
    },
    toggle (row) {
      row.status = !row.status
      let text = row.status ? '下架' : '上架'
      this.$confirm(`是否确认${text}？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '执行中...'
            const url = `/api/metals/news/toggle/${row.id}`
            this.$axios.put(url).then(res => {
              done()
              instance.confirmButtonLoading = false
              instance.confirmButtonText = '确定'
              this.getNews()
              this.$message.success('已处理')
            }).catch(() => {
              instance.confirmButtonLoading = false
              instance.confirmButtonText = '确定'
              this.$message.error('系统错误')
            })
          } else {
            done()
          }
        }
      }).catch(() => {})
    },
    deleteHandle (row) {
      this.showDelete = true
      this.deleteUri = `/api/metals/news/delete/${row.id}`
    },
    getNews () {
      this.loading = true
      const url = `/api/metals/news/page?pn=${this.currentPage - 1}&pagesize=20`
      this.$axios.get(url).then(res => {
        this.loading = false
        if (res.data.length > 0) {
          res.data.forEach(item => {
            item.status = item.status === 0
          })
        }
        this.tableData = res
      }).catch(() => {
        this.loading = false
      })
    },
    preview (data) {
      this.previewData = data
      this.showPreview = true
    },
    formatDateTime (row, column) {
      const date = new Date(row.created)
      return formatDateTime(date)
    }
  },
  components: {
    Edit,
    Delete,
    Preview
  }
}
</script>
<style scoped lang="stylus" src="@/static/css/pagination.styl"></style>
<style scoped lang="stylus">
.addBox
  margin-bottom 20px
  display flex
  justify-content space-between
  align-items center
  height 30px
  .title
    font-size 16px
    color #1D3861
    line-height 22px
  .addHandle
    width 92px
    font-size 14px
    >>>.el-button
      border-radius 1px
      padding 8px 15px
.default
  width 100%
  color #1D3861
.primary
  background #FF9800
  color #ffffff
  width 100%
>>>.el-table
  .cell
    display flex
    align-items center
    .coverImage
      display flex
      justify-content center
      align-items center
      width 60px
      height 60px
  .firstCell
    .cell
      padding-left 20px
  .firstRow
    th
      &:first-child
        .cell
          padding-left 20px
  th
    padding 10px 0
    font-size 14px
  th.is-leaf
    border-bottom none
  td
    padding 5px 0
    .el-button
      &+.el-button
        margin-left 22px
>>>.el-table--mini
>>>.el-table--small
>>>.el-table__expand-icon
    font-size 14px
>>>.single-row
  background #F4F8FB
>>>.el-button--text
  color #0170D2
</style>
