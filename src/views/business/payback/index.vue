<template>
  <div>
    <div class="searchBox">
      <div class="searchItem">
        <label class="el-form-item__label">开始日期</label>
        <div class="el-form-item__content">
          <el-date-picker
            v-model="startStr"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </div>
      </div>
      <div class="searchItem">
        <label class="el-form-item__label">截止日期</label>
        <div class="el-form-item__content">
          <el-date-picker
            v-model="endStr"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </div>
      </div>
      <div class="searchItem">
        <label class="el-form-item__label">状态</label>
        <el-select class="el-form-item__content" v-model="statusInput" placeholder="请选择">
          <el-option label="刚提交" :value="1"></el-option>
          <el-option label="操作成功" :value="2"></el-option>
          <el-option label="操作失败" :value="3"></el-option>
          <el-option label="进行中" :value="4"></el-option>
        </el-select>
      </div>
      <div class="handleBox">
        <div class="handleItem">
          <el-button class="default" size="normal" @click="reset">重置</el-button>
        </div>
        <div class="handleItem">
          <el-button class="primary" size="normal" @click="getData({ type: 'search', startStr: startStr, endStr: endStr, status: statusInput, page: 0 })">搜索</el-button>
        </div>
      </div>
    </div>
    <el-tag type="danger" style="width: 100%; border-radius: 0;" size="normal">提现申请会审核店铺当前账户余额，如果当前账户余额与申请时账户余额不一致，该扣款将无法成功</el-tag>
    <template>
      <el-table
        :data="tableData.data"
        :header-cell-style="{background:'#FAFAFA'}"
        v-loading="loading"
        :highlight-current-row="false"
        style="width: 100%">
        <el-table-column
          :show-overflow-tooltip="true"
          align="center"
          label="店铺名">
          <template slot-scope="scope">
            {{scope.row.store.name}}
          </template>
        </el-table-column>
        <el-table-column
          label="姓名"
          align="center">
          <template slot-scope="scope">
            {{scope.row.store.storekeeper.realName}}
          </template>
        </el-table-column>
        <el-table-column
          label="手机号"
          align="center">
          <template slot-scope="scope">
            {{scope.row.store.storekeeper.username}}
          </template>
        </el-table-column>
        <el-table-column
          prop="amount"
          label="账户余额"
          align="center">
          <template slot-scope="scope">
            {{scope.row.beforeAmount | formatMoney}}
          </template>
        </el-table-column>
        <el-table-column
          prop="amount"
          label="提现金额"
          align="center">
          <template slot-scope="scope">
            {{scope.row.amount | formatMoney}}
          </template>
        </el-table-column>
        <el-table-column
          prop="created"
          label="申请时间"
          align="center">
          <template slot-scope="scope">
            {{formateDate(scope.row.created)}}
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          prop="status"
          align="center">
          <template slot-scope="scope">
            {{scope.row.status | formatStatus}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status === 1" type="text" @click="toggleHandle(scope.row, 'success', '成功')">成功</el-button>
            <el-button v-if="scope.row.status === 1" type="text" @click="toggleHandle(scope.row, 'fail', '失败')">失败</el-button>
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
  </div>
</template>

<script>
import { formatDate } from '@/utils/formatDate.js'
import { formatDateTime } from '@/utils/formatDateTime.js'
export default {
  data () {
    return {
      startStr: '',
      endStr: '',
      statusInput: '',
      tableData: {
        data: [],
        size: 20,
        total: 0
      },
      loading: true,
      currentPage: 1,
      searchParams: {
        startStr: '',
        endStr: '',
        status: '',
        page: 0
      },
      currentData: {},
      showDialog: false
    }
  },
  filters: {
    formatStatus (val) {
      if (val === 1) {
        return '刚申请'
      } else if (val === 2) {
        return '操作成功'
      } else if (val === 3) {
        return '操作失败'
      } else if (val === 4) {
        return '进行中'
      } else {
        return val
      }
    },
    formatMoney (value) {
      if (value) {
        return (value / 100).toFixed(2)
      }
      return '0.00'
    }
  },
  mounted () {
    this.getData(this.searchParams)
  },
  methods: {
    formateDate (t) {
      const date = new Date(t)
      return formatDate(date)
    },
    formateDateTime (t) {
      const date = new Date(t)
      return formatDateTime(date)
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.searchParams.page = val - 1
      this.getData(this.searchParams)
    },
    toDetail (row) {
      this.currentData = row
      this.showDialog = true
    },
    toggleHandle (row, type, text) {
      this.$confirm(`是否执行${text}操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '执行中...'
            const url = `/api/metals/store/account/handle/${row.id}/${type}`
            this.$axios.post(url).then(res => {
              done()
              instance.confirmButtonLoading = false
              instance.confirmButtonText = '确定'
              this.getData(this.searchParams)
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
    getData (params) {
      this.loading = true
      if (params.type === 'search') {
        this.searchParams = {
          startStr: params.startStr,
          endStr: params.endStr,
          status: params.status,
          page: params.page
        }
      }
      let url = `/api/metals/store/account/page?pagesize=20&pn=${params.page}`
      if (params.startStr) { url += `&startStr=${params.startStr}` }
      if (params.endStr) { url += `&endStr=${params.endStr}` }
      if (params.status) { url += `&status=${params.status}` }
      this.$axios.get(url).then(res => {
        this.loading = false
        Object.assign(this.tableData, res)
      }).catch(() => { this.loading = false })
    },
    reset () {
      this.startStr = ''
      this.endStr = ''
      this.statusInput = ''
    }
  },
  components: {

  }
}
</script>
<style scoped lang="stylus" src="@/static/css/pagination.styl"></style>
<style scoped lang="stylus">
.avatar
  width 50px
  height 50px
.searchBox
  margin-bottom 27px
  display flex
  align-items center
  flex-wrap wrap
  .searchItem
    margin-right 20px
    height 40px
    overflow hidden
    .el-form-item__label
      // width 5em
      color #1D3861
      text-align justify
      &:after
        display inline-block
        content ''
        width 100%
    >>>.el-form-item__content
      display inline-block
    >>>.el-date-editor
      .el-input__inner
        padding-left 30px
        padding-right 10px
        width 100%
    >>>.el-input__inner
      padding-left 20px
      height 30px
      border-radius 0
      width 128px
    &:last-child
      margin-right 0
  .handleBox
    flex 1
    display flex
    align-items center
    justify-content flex-end
    .handleItem
      margin-right 20px
      width 105px
      height 30px
      >>>.el-button
        padding 7px 15px
        border-radius 1px
        font-size 14px
      &:last-child
        margin-right 0
.default
  width 100%
  color #1D3861
.primary
  background #FF9800
  color #ffffff
  width 100%
>>>.el-table
  th
    padding 10px 0
    font-size 14px
  th.is-leaf
    border-bottom none
  td
    padding 5px 0
    .el-button--mini
    .el-button--small
      font-size 13px
    .el-button
      &+.el-button
        margin-left 22px
    .cell
      .coverImage
        display flex
        align-items center
        justify-content center
        width 50px
        height 50px
      .business
        display flex
        align-items center
        justify-content center
        .coverImage
          width 36px
          height 36px
          border-radius 50%
          overflow hidden
>>>.el-table--mini
>>>.el-table--small
>>>.el-table__expand-icon
    font-size 13px
>>>.single-row
  background #F4F8FB
>>>.el-button--text
  color #0170D2
</style>
