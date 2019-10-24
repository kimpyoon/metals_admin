<template>
  <div>
    <div class="searchBox">
      <div class="searchItem">
        <label class="el-form-item__label">用户名</label>
        <div class="el-form-item__content"><el-input v-model="userInput" placeholder="请输入"></el-input ></div>
      </div>
      <div class="searchItem">
        <label class="el-form-item__label">昵称</label>
        <div class="el-form-item__content"><el-input v-model="nameInput" placeholder="请输入"></el-input></div>
      </div>
      <div class="handleBox">
        <div class="handleItem">
          <el-button class="default" size="normal" @click="reset">重置</el-button>
        </div>
        <div class="handleItem">
          <el-button class="primary" size="normal" @click="getData({ type: 'search', nickname: nameInput, username: userInput, page: 0 })">搜索</el-button>
        </div>
      </div>
    </div>
<!--     <div class="addBox">
      <label class="title">用户管理</label>
      <div class="addHandle">
        <el-button class="primary" size="normal" icon="el-icon-plus" @click="editUser('add', {})">新建</el-button>
      </div>
    </div> -->
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
          prop="username"
          label="用户名">
        </el-table-column>
        <el-table-column
          prop="nickName"
          label="昵称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="avatarUrl"
          label="头像"
          align="center">
          <template slot-scope="scope">
            <img style="object-fit: contain;" class="avatar" :src="scope.row.avatarUrl">
          </template>
        </el-table-column>
        <el-table-column
          prop="gender"
          label="性别"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.gender | farmatGender}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="age"
          label="年龄"
          align="center">
        </el-table-column>
        <el-table-column
          prop="birth"
          label="出生日期"
          width="140"
          :formatter="formateDate"
          align="center">
        </el-table-column>
        <el-table-column
          prop="created"
          label="创建时间"
          width="180"
          :formatter="formateDateTime"
          align="center">
        </el-table-column>
        <el-table-column
          label="状态"
          prop="status"
          align="center">
          <template slot-scope="scope">
            {{scope.row.status === 0 ? '正常' : '封号'}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="toggleLock(scope.row.id)">{{scope.row.status === 0 ? '封号' : '解封'}}</el-button>
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
import { getToken } from '@/utils/auth'
export default {
  name: 'user',
  data () {
    return {
      userInput: '',
      nameInput: '',
      tableData: {
        data: [],
        size: 20,
        total: 0
      },
      loading: true,
      currentPage: 1,
      searchParams: {
        username: '',
        nickname: '',
        page: 0
      }
    }
  },
  filters: {
    farmatGender (val) {
      if (val === 0) {
        return '未知'
      } else if (val === 1) {
        return '男'
      } else if (val === 2) {
        return '女'
      } else {
        return val
      }
    }
  },
  mounted () {
    this.getData(this.searchParams)
  },
  methods: {
    getToken: getToken,
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
    formateDate (row, column) {
      const date = new Date(row.birth)
      return formatDate(date)
    },
    formateDateTime (row, column) {
      const date = new Date(row.created)
      return formatDateTime(date)
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.searchParams.page = val - 1
      this.getData(this.searchParams)
    },
    toggleLock (id) {
      this.$confirm('是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const url = `/api/metals/user/lock/${id}`
        this.$axios.get(url).then(res => {
          this.getData(this.searchParams)
          this.$message.success('修改成功')
        }).catch(() => {
          this.$message.error('修改失败')
        })
      }).catch(() => {})
    },
    getData (params) {
      this.loading = true
      if (params.type === 'search') {
        this.searchParams = {
          username: params.username,
          nickname: params.nickname,
          page: params.page
        }
      }
      let url = `/api/metals/user/page?pagesize=20&pn=${params.page}`
      if (params.username && params.username.replace(/\s+/g, '')) { url += `&username=${params.username.trim()}` }
      if (params.nickname && params.nickname.replace(/\s+/g, '')) { url += `&nickname=${params.nickname.trim()}` }
      this.$axios.get(url).then(res => {
        this.loading = false
        Object.assign(this.tableData, res)
      }).catch(() => { this.loading = false })
    },
    reset () {
      this.userInput = ''
      this.nameInput = ''
    }
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
      width 4em
      color #1D3861
      text-align justify
      &:after
        display inline-block
        content ''
        width 100%
    >>>.el-form-item__content
      display inline-block
    >>>.el-input__inner
      padding-left 20px
      height 30px
      border-radius 0
      width 128px
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
    .el-button--mini
    .el-button--small
      font-size 13px
    .el-button
      &+.el-button
        margin-left 22px
>>>.el-table--mini
>>>.el-table--small
>>>.el-table__expand-icon
    font-size 13px
>>>.single-row
  background #F4F8FB
>>>.el-button--text
  color #0170D2
</style>
