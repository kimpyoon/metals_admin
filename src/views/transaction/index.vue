<template>
  <div>
    <div class="searchBox">
      <div class="searchItem">
        <label class="el-form-item__label">订单号</label>
        <div class="el-form-item__content"><el-input v-model="orderNoInput" placeholder="请输入"></el-input ></div>
      </div>
      <div class="searchItem">
        <label class="el-form-item__label">状态</label>
        <el-select class="el-form-item__content" v-model="statusInput" placeholder="请选择">
          <el-option label="所有订单" :value="0"></el-option>
          <el-option label="待支付" :value="1"></el-option>
          <el-option label="已付款" :value="2"></el-option>
          <el-option label="已发货" :value="3"></el-option>
          <el-option label="已成功" :value="5"></el-option>
          <el-option label="已取消" :value="6"></el-option>
          <el-option label="已参与" :value="7"></el-option>
        </el-select>
      </div>
      <div class="searchItem">
        <label class="el-form-item__label">店铺</label>
        <el-select
          class="el-form-item__content"
          v-model="storeId"
          filterable
          remote
          reserve-keyword
          placeholder="请输入店铺"
          :remote-method="remoteMethod"
          :loading="optionsLoading">
          <el-option
            v-for="item in storeOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="handleBox">
        <div class="handleItem">
          <el-button class="default" size="normal" @click="reset">重置</el-button>
        </div>
        <div class="handleItem">
          <el-button class="primary" size="normal" @click="getData({ type: 'search', orderNo: orderNoInput, status: statusInput, storeId: storeId, page: 0 })">搜索</el-button>
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
          prop="orderNo"
          :show-overflow-tooltip="true"
          fixed
          width="200"
          label="订单号">
        </el-table-column>
        <el-table-column
          prop="total"
          :show-overflow-tooltip="true"
          align="center"
          label="订单金额">
          <template slot-scope="scope">
            {{scope.row.total | formatPrice}}
          </template>
        </el-table-column>
        <el-table-column
          label="订单状态"
          prop="status"
          align="center">
          <template slot-scope="scope">
            {{scope.row.status | formatStatus}}
          </template>
        </el-table-column>
        <el-table-column
          prop="created"
          label="提交时间"
          align="center">
          <template slot-scope="scope">
            {{formateDateTime(scope.row.created)}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="200"
          fixed="right"
          align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="toDetail(scope.row)">查看</el-button>
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
import { formatDateTime } from '@/utils/formatDateTime.js'
export default {
  data () {
    return {
      orderNoInput: '',
      statusInput: '',
      storeId: '',
      tableData: {
        data: [],
        size: 20,
        total: 0
      },
      loading: true,
      currentPage: 1,
      searchParams: {
        orderNo: '',
        status: '',
        storeId: '',
        page: 0
      },
      storeOptions: [],
      optionsLoading: false
    }
  },
  filters: {
    formatStatus (val) {
      if (val === 1) {
        return '待支付'
      } else if (val === 2) {
        return '已付款'
      } else if (val === 3) {
        return '已发货'
      } else if (val === 5) {
        return '已成功'
      } else if (val === 6) {
        return '已取消'
      } else if (val === 7) {
        return '已参与'
      } else {
        return val
      }
    },
    formatPrice (val) {
      if (val) {
        return (val / 100).toFixed(2)
      }
      return '0.00'
    }
  },
  mounted () {
    this.initStore()
    this.getData(this.searchParams)
  },
  methods: {
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex % 2 !== 0) {
        return 'single-row'
      } else {
        return ''
      }
    },
    formateDateTime (val) {
      const date = new Date(val)
      return formatDateTime(date)
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.searchParams.page = val - 1
      this.getData(this.searchParams)
    },
    remoteMethod (query) {
      if (query !== '') {
        this.optionsLoading = true
        this.getStore(query).then(res => {
          this.optionsLoading = false
          if (res.data.length > 0) {
            let arr = []
            res.data.forEach(item => {
              const obj = {
                id: item.id,
                name: item.name
              }
              arr.push(obj)
            })
            this.storeOptions = [...arr]
          } else {
            this.storeOptions = []
          }
        })
      } else {
        this.initStore()
      }
    },
    toDetail (row) {
      localStorage.setItem('metals_admin_order', JSON.stringify(row))
      this.$router.push(`/transaction/detail/${row.orderNo}`)
    },
    getData (params) {
      this.loading = true
      if (params.type === 'search') {
        this.searchParams = {
          orderNo: params.orderNo,
          status: params.status,
          storeId: params.storeId,
          page: params.page
        }
      }
      let url = `/api/manager/order/${params.status === '' ? 0 : params.status}/master/list?pagesize=20&pn=${params.page}`
      if (params.orderNo && params.orderNo.replace(/\s+/g, '')) { url += `&orderNo=${params.orderNo.trim()}` }
      if (params.storeId) { url += `&storeId=${params.storeId}` }
      this.$axios.post(url).then(res => {
        this.loading = false
        Object.assign(this.tableData, res)
      }).catch(() => { this.loading = false })
    },
    reset () {
      this.orderNoInput = ''
      this.statusInput = ''
      this.storeId = ''
    },
    initStore () {
      this.getStore().then(res => {
        if (res.data.length > 0) {
          let arr = []
          res.data.forEach(item => {
            const obj = {
              id: item.id,
              name: item.name
            }
            arr.push(obj)
          })
          this.storeOptions = [...arr]
        } else {
          this.storeOptions = []
        }
      })
    },
    getStore (name) {
      return new Promise((resolve, reject) => {
        let url = `/api/metals/store/page?pagesize=20&pn=0`
        if (name && name.replace(/\s+/g, '')) { url += `&name=${name.trim()}` }
        this.$axios.get(url).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
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
      // width 7em
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
    &:nth-child(3)
      margin-right 0
      >>>.el-input__inner
        padding 0 15px
        width auto
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
  &:first-child
    margin-bottom 10px
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
