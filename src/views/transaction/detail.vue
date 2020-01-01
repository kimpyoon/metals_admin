<template>
  <div class="container el-card" v-if="showDetail">
    <div class="box">
      <div class="status">
        <i class="el-icon-info color-primary" style="marginLeft: 20px;"></i><span style="marginLeft: 5px;" class="color-primary">当前订单状态：{{formatStatus(orderDetail.status)}}</span>
        <i class="el-icon-circle-close color-primary" @click="back"></i>
      </div>
      <div class="cell">
        <i class="el-icon-collection-tag"></i><span class="label">基本信息</span>
      </div>
      <template>
        <div class="row">
          <div class="column">
            <div class="column-head">订单编号</div>
            <div class="column-content">{{orderNo}}</div>
          </div>
          <div class="column">
            <div class="column-head">用户账号</div>
            <div class="column-content">{{userInfo.username}}</div>
          </div>
          <div class="column">
            <div class="column-head">支付金额</div>
            <div class="column-content">{{formatPrice(orderDetail.amount)}}</div>
          </div>
        </div>
        <div class="row">
          <div class="column border-bottom">
            <div class="column-head">配送方式</div>
            <div class="column-content">{{formatMethod(orderDetail.logisticsType)}}</div>
          </div>
          <div class="column border-bottom">
            <div class="column-head">物流单号</div>
            <div class="column-content">{{orderDetail.expressNo || '-'}}</div>
          </div>
          <div class="column border-bottom">
            <div class="column-head">支付方式</div>
            <div class="column-content">微信</div>
          </div>
        </div>
      </template>
      <div class="cell">
        <i class="el-icon-collection-tag"></i><span class="label">收货信息</span>
      </div>
      <template>
        <div class="row">
          <div class="column border-bottom">
            <div class="column-head">收货人</div>
            <div class="column-content">{{addressInfo.name}}</div>
          </div>
          <div class="column border-bottom">
            <div class="column-head">手机号码</div>
            <div class="column-content">{{addressInfo.phone}}</div>
          </div>
          <div class="column border-bottom">
            <div class="column-head">收货地址</div>
            <div class="column-content">{{addressInfo.address}}</div>
          </div>
        </div>
      </template>
      <div class="cell">
        <i class="el-icon-collection-tag"></i><span class="label">商品信息</span>
      </div>
      <template>
        <el-table
          class="goodsList"
          :data="goodsList"
          border
          show-summary
          :summary-method="getSummaries"
          style="width: 96%">
          <el-table-column
            prop="images"
            label="商品图片"
            align="center"
            width="180">
            <template slot-scope="scope">
              <img :src="scope.row.images" alt="" style="object-fit: contain; width: 80%;">
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            align="center"
            width="300px"
            label="商品名称">
          </el-table-column>
          <el-table-column
            prop="price"
            sortable
            align="center"
            label="价格">
            <template slot-scope="scope">
              ￥{{formatPrice(scope.row.price)}}
            </template>
          </el-table-column>
          <el-table-column
            prop="num"
            sortable
            align="center"
            label="数量">
          </el-table-column>
          <el-table-column
            prop="sum"
            align="center"
            sortable
            label="小计">
            <template slot-scope="scope">
              ￥{{formatPrice(scope.row.sum)}}
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      orderNo: '',
      orderDetail: {},
      showDetail: false,
      goodsList: [],
      userInfo: {},
      addressInfo: {}
    }
  },
  mounted () {
    this.orderNo = this.$route.params.orderNo
    if (this.orderNo) {
      let orderDetail = localStorage.getItem('metals_admin_order')
      if (orderDetail) {
        this.orderDetail = JSON.parse(orderDetail)
        this.showDetail = this.orderDetail.orderNo === this.orderNo
        if (!this.showDetail) {
          this.$message.error('查询订单错误')
        } else {
          if (this.orderDetail.user) {
            this.userInfo = this.orderDetail.user
          }
          this.addressInfo = JSON.parse(this.orderDetail.addressJson)
          this.orderDetail.goodsList.forEach(n => {
            let goodsJson = JSON.parse(n.goodsJson)
            const obj = {
              images: goodsJson.images.split(',')[0],
              name: goodsJson.title,
              num: n.num,
              price: n.price,
              sum: n.price * n.num
            }
            this.goodsList.push(obj)
          })
        }
      }
    }
  },
  methods: {
    formatPrice (val) {
      if (val) {
        return (val / 100).toFixed(2)
      }
      return '0.00'
    },
    formatMethod (val) {
      if (val === 1) {
        return '店铺配送'
      } else if (val === 2) {
        return '物流配送'
      } else if (val === 3) {
        return '自提货物'
      } else {
        return val
      }
    },
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
    back () {
      this.$router.back()
    },
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 3) {
          sums[index] = '总价'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (index === 4) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          let price = this.formatPrice(sums[index])
          sums[index] = `￥${price}`
        }
      })
      return sums
    }
  }
}
</script>
<style scoped lang="stylus">
.el-card
  border 1px solid #ebeef5
  background-color #fff
  color #303133
.container
  margin 0 auto 20px
  width 90%
  .box
    padding 0 0 20px 0
    border 1px solid #ebeef5
    background-color #fff
    color #303133
    .status
      position relative
      background #f2f6fc
      height 60px
      line-height 60px
      .el-icon-circle-close
        position absolute
        right 20px
        top 50%
        transform translateY(-50%)
        font-size 25px
        cursor pointer
    .cell
      margin 15px 20px
      .label
        font-size 14px
        color #606266
    .row
      padding 0 20px
      display flex
      align-items center
      justify-content center
      .column
        flex 1
        border-top 1px solid #ebeef5
        border-right 1px solid #ebeef5
        border-bottom none
        border-left none
        text-align center
        &:first-child
          border-left 1px solid #ebeef5
        .column-head
          padding 5px
          border-bottom 1px solid #ebeef5
          background #f2f6fc
          color #303133
          font-size 14px
        .column-content
          padding 5px 5px
          display flex
          align-items center
          justify-content center
          color #606266
          min-height 42px
          font-size 14px
.goodsList
  margin 0 auto
.border-bottom
  border-bottom 1px solid #ebeef5 !important
.color-primary
  color #409EFF
.default
  width 100%
  color #1D3861
.primary
  background #FF9800
  color #ffffff
  width 100%
.el-table--small
  font-size 14px
</style>
