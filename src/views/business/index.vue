<template>
  <div>
    <div class="searchBox">
      <div class="searchItem">
        <label class="el-form-item__label">店铺名</label>
        <div class="el-form-item__content"><el-input v-model="nameInput" placeholder="请输入"></el-input></div>
      </div>
      <div class="searchItem">
        <label class="el-form-item__label">商家名</label>
        <div class="el-form-item__content"><el-input v-model="realNameInput" placeholder="请输入"></el-input ></div>
      </div>
      <div class="searchItem">
        <label class="el-form-item__label">用户名</label>
        <div class="el-form-item__content"><el-input v-model="userNameInput" placeholder="请输入"></el-input></div>
      </div>
      <div class="searchItem">
        <label class="el-form-item__label">状态</label>
        <el-select class="el-form-item__content" v-model="statusInput" placeholder="请选择">
          <el-option label="刚提交" :value="1"></el-option>
          <el-option label="审批失败" :value="2"></el-option>
          <el-option label="下线" :value="3"></el-option>
          <el-option label="上线" :value="4"></el-option>
          <el-option label="封停" :value="5"></el-option>
        </el-select>
      </div>
      <div class="handleBox">
        <div class="handleItem">
          <el-button class="default" size="normal" @click="reset">重置</el-button>
        </div>
        <div class="handleItem">
          <el-button class="primary" size="normal" @click="getData({ type: 'search', name: nameInput, userName: userNameInput, realName: realNameInput, status: statusInput, page: 0 })">搜索</el-button>
        </div>
      </div>
    </div>
    <template>
      <el-table
        :data="tableData.data"
        :header-cell-style="{background:'#FAFAFA'}"
        v-loading="loading"
        :highlight-current-row="false"
        style="width: 100%">
        <el-table-column
          width="80"
          label="logo">
          <template slot-scope="scope">
            <el-image
              class="coverImage"
              :src="scope.row.avatarUrl"
              :preview-src-list="[scope.row.avatarUrl]">
              <div slot="error" style="font-size: 30px;">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          :show-overflow-tooltip="true"
          align="center"
          label="店铺">
        </el-table-column>
        <el-table-column
          label="商家"
          align="center">
          <template slot-scope="scope">
            <div class="business">
              <el-image
                class="coverImage"
                :src="scope.row.storekeeper.avatarUrl"
                :preview-src-list="[scope.row.storekeeper.avatarUrl]">
                <div slot="error" style="font-size: 30px;">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
              <div>{{scope.row.storekeeper.realName}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          label="省市"
          align="center">
          <template slot-scope="scope">
            {{scope.row.provinceId}} {{scope.row.cityId}}
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
            <el-button type="text" @click="toDetail(scope.row)">查看</el-button>
            <el-button v-if="scope.row.status === 1" type="text" @click="toggleSuccess(scope.row.id)">通过</el-button>
            <el-button v-if="scope.row.status === 1" type="text" @click="toggleFail(scope.row.id)">不通过</el-button>
            <el-button v-if="scope.row.status > 2" type="text" @click="lock(scope.row)">{{scope.row.status === 5 ? '解封' : '封停'}}</el-button>
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
    <Dialog @hideDialog="showDialog = false" @refresh="getData(searchParams)" v-if="showDialog" :currentData="currentData"></Dialog>
  </div>
</template>

<script>
import { formatDate } from '@/utils/formatDate.js'
import { formatDateTime } from '@/utils/formatDateTime.js'
import Dialog from './dialog.vue'
export default {
  data () {
    return {
      userNameInput: '',
      nameInput: '',
      realNameInput: '',
      statusInput: '',
      tableData: {
        data: [],
        size: 20,
        total: 0
      },
      loading: true,
      currentPage: 1,
      searchParams: {
        userName: '',
        name: '',
        realName: '',
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
        return '审批失败'
      } else if (val === 3) {
        return '下线'
      } else if (val === 4) {
        return '上线'
      } else if (val === 5) {
        return '封停'
      } else {
        return val
      }
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
    formateDateTime (row, column) {
      const date = new Date(row.created)
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
    lock (row) {
      let text = row.status === 5 ? '解封' : '封停'
      this.$confirm(`是否${text}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '执行中...'
            const url = `/api/metals/store/lock/${row.id}`
            this.$axios.get(url).then(res => {
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
    toggleSuccess (id) {
      this.$confirm('是否设为成功?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '执行中...'
            const url = `/api/metals/store/success/${id}`
            this.$axios.get(url).then(res => {
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
    toggleFail (id) {
      this.$confirm('是否设为不通过?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '执行中...'
            const url = `/api/metals/store/fail/${id}`
            this.$axios.get(url).then(res => {
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
          userName: params.userName,
          name: params.name,
          realName: params.realName,
          status: params.status,
          page: params.page
        }
      }
      let url = `/api/metals/store/page?pagesize=20&pn=${params.page}`
      if (params.userName && params.userName.replace(/\s+/g, '')) { url += `&userName=${params.userName.trim()}` }
      if (params.name && params.name.replace(/\s+/g, '')) { url += `&name=${params.name.trim()}` }
      if (params.realName && params.realName.replace(/\s+/g, '')) { url += `&realName=${params.realName.trim()}` }
      if (params.status) { url += `&status=${params.status}` }
      this.$axios.get(url).then(res => {
        this.loading = false
        Object.assign(this.tableData, res)
      }).catch(() => { this.loading = false })
    },
    reset () {
      this.userNameInput = ''
      this.nameInput = ''
      this.realNameInput = ''
      this.statusInput = ''
    }
  },
  components: {
    Dialog
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
