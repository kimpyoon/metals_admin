<template>
  <div>
    <div class="searchBox">
      <div class="searchItem">
        <label class="el-form-item__label">商家名</label>
        <div class="el-form-item__content"><el-input v-model="masterInput" placeholder="请输入"></el-input ></div>
      </div>
      <div class="searchItem">
        <label class="el-form-item__label">店铺名</label>
        <div class="el-form-item__content"><el-input v-model="storeInput" placeholder="请输入"></el-input></div>
      </div>
      <div class="searchItem">
        <label class="el-form-item__label">状态</label>
        <el-select class="el-form-item__content" v-model="statusInput" placeholder="请选择">
          <el-option label="刚提交" :value="1"></el-option>
          <el-option label="已开始" :value="2"></el-option>
          <el-option label="未开始" :value="3"></el-option>
          <el-option label="不通过" :value="4"></el-option>
          <el-option label="已结束" :value="5"></el-option>
          <el-option label="已取消" :value="6"></el-option>
        </el-select>
      </div>
    </div>
    <div class="searchBox">
      <div class="searchItem">
        <label class="el-form-item__label">商品标题</label>
        <div class="el-form-item__content"><el-input v-model="titleInput" placeholder="请输入"></el-input></div>
      </div>
      <div class="searchItem">
        <label class="el-form-item__label">申请人姓名</label>
        <div class="el-form-item__content"><el-input v-model="nameInput" placeholder="请输入"></el-input></div>
      </div>
      <div class="handleBox">
        <div class="handleItem">
          <el-button class="default" size="normal" @click="reset">重置</el-button>
        </div>
        <div class="handleItem">
          <el-button class="primary" size="normal" @click="getData({ type: 'search', name: nameInput, masterName: masterInput, storeName: storeInput, status: statusInput, page: 0 })">搜索</el-button>
        </div>
      </div>
    </div>
    <template>
      <el-table
        :data="tableData.data"
        :row-class-name="tableRowClassName"
        :header-cell-style="{background:'#FAFAFA'}"
        v-loading="loading"
        :highlight-current-row="false"
        style="width: 100%">
        <el-table-column
          prop="storeName"
          :show-overflow-tooltip="true"
          label="店铺名">
        </el-table-column>
        <el-table-column
          prop="masterName"
          :show-overflow-tooltip="true"
          label="商家名">
        </el-table-column>
        <el-table-column
          prop="region"
          :show-overflow-tooltip="true"
          label="地区"
          align="center">
        </el-table-column>
        <el-table-column
          prop="startTime"
          label="开始时间"
          width="140"
          align="center">
          <template slot-scope="scope">
            {{formateDate(scope.row.startTime)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="birth"
          label="结束时间"
          width="140"
          align="center">
          <template slot-scope="scope">
            {{formateDate(scope.row.endTime)}}
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          width="100"
          prop="status"
          align="center">
          <template slot-scope="scope">
            {{scope.row.status | formatStatus}}
          </template>
        </el-table-column>
        <el-table-column
          label="上架/下架"
          width="100"
          align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.toggle"
              @change="toggle(scope.row)"
              active-color="#409eff"
              inactive-color="#dcdfe6">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="250"
          fixed="right"
          align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="showGoods(scope.row)">商品</el-button>
            <el-button type="text" @click="showStore(scope.row)">商家</el-button>
            <el-button v-if="scope.row.status === 1" type="text" @click="toggleSuccess(scope.row.id)">成功</el-button>
            <el-button v-if="scope.row.status === 1" type="text" @click="toggleFail(scope.row.id)">失败</el-button>
            <el-button type="text" @click="update(scope.row)">更新</el-button>
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
    <goods-dialog @hideDialog="showGoodsDialog = false" v-if="showGoodsDialog" :goodsData="goodsData"></goods-dialog>
    <store-dialog @hideDialog="showStoreDialog = false" v-if="showStoreDialog" :storeData="storeData"></store-dialog>
    <Dialog @hideDialog="showDialog = false" @refresh="getData(searchParams)" :apiType="'goods'" v-if="showDialog" :currentData="currentData"></Dialog>
  </div>
</template>

<script>
import { formatDate } from '@/utils/formatDate.js'
import { formatDateTime } from '@/utils/formatDateTime.js'
import { getToken } from '@/utils/auth'
import GoodsDialog from './goodsDialog.vue'
import StoreDialog from './storeDialog.vue'
import Dialog from './dialog.vue'
export default {
  data () {
    return {
      masterInput: '',
      nameInput: '',
      storeInput: '',
      statusInput: '',
      titleInput: '',
      tableData: {
        data: [],
        size: 20,
        total: 0
      },
      loading: true,
      currentPage: 1,
      searchParams: {
        masterName: '',
        name: '',
        storeName: '',
        status: '',
        title: '',
        page: 0
      },
      goodsData: {},
      showGoodsDialog: false,
      storeData: {},
      showStoreDialog: false,
      currentData: {},
      showDialog: false
    }
  },
  filters: {
    formatStatus (val) {
      if (val === 1) {
        return '刚提交'
      } else if (val === 2) {
        return '已开始'
      } else if (val === 3) {
        return '未开始'
      } else if (val === 4) {
        return '不通过'
      } else if (val === 5) {
        return '已结束'
      } else if (val === 6) {
        return '已取消'
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
    update (row) {
      this.currentData = row
      this.showDialog = true
    },
    toggle (row) {
      row.toggle = !row.toggle
      let text = row.toggle ? '下架' : '上架'
      this.$confirm(`是否确认${text}？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '执行中...'
            const url = `/api/admin/advert/goods/handle/${row.id}/toggle`
            this.$axios.put(url).then(res => {
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
    showGoods (row) {
      this.goodsData = row
      this.showGoodsDialog = true
    },
    showStore (row) {
      this.storeData = row
      this.showStoreDialog = true
    },
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
    toggleSuccess (id) {
      this.$confirm('是否继续设为成功?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const url = `/api/admin/advert/goods/handle/${id}/success`
        this.$axios.get(url).then(res => {
          this.getData(this.searchParams)
          this.$message.success('已处理')
        }).catch(() => {
          this.$message.error('系统错误')
        })
      }).catch(() => {})
    },
    toggleFail (id) {
      this.$confirm('是否继续设为失败?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const url = `/api/admin/advert/goods/handle/${id}/fail`
        this.$axios.get(url).then(res => {
          this.getData(this.searchParams)
          this.$message.success('已处理')
        }).catch(() => {
          this.$message.error('系统错误')
        })
      }).catch(() => {})
    },
    getData (params) {
      this.loading = true
      if (params.type === 'search') {
        this.searchParams = {
          masterName: params.masterName,
          name: params.name,
          storeName: params.storeName,
          status: params.status,
          title: params.title,
          page: params.page
        }
      }
      let url = `/api/admin/advert/goods/list?pagesize=20&pn=${params.page}`
      if (params.masterName && params.masterName.replace(/\s+/g, '')) { url += `&masterName=${params.masterName.trim()}` }
      if (params.title && params.title.replace(/\s+/g, '')) { url += `&title=${params.title.trim()}` }
      if (params.name && params.name.replace(/\s+/g, '')) { url += `&name=${params.name.trim()}` }
      if (params.storeName && params.storeName.replace(/\s+/g, '')) { url += `&storeName=${params.storeName.trim()}` }
      if (params.status) { url += `&status=${params.status}` }
      this.$axios.get(url).then(res => {
        this.loading = false
        Object.assign(this.tableData, res)
      }).catch(() => { this.loading = false })
    },
    reset () {
      this.masterInput = ''
      this.nameInput = ''
      this.storeInput = ''
      this.statusInput = ''
      this.titleInput = ''
    }
  },
  components: {
    GoodsDialog,
    StoreDialog,
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
  justify-content space-between
  flex-wrap wrap
  .searchItem
    // margin-right 20px
    height 40px
    width 230px
    line-height 40px
    overflow hidden
    .el-form-item__label
      width 5em
      color #1D3861
      text-align justify
      text-justify inter-ideograph
      text-align-last justify
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
      width 160px
    &:last-child
      margin-right 0
  .handleBox
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
  &:first-child
    margin-bottom 0
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
>>>.el-table--mini
>>>.el-table--small
>>>.el-table__expand-icon
    font-size 13px
>>>.single-row
  background #F4F8FB
>>>.el-button--text
  color #0170D2
</style>
