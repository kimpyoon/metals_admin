<template>
  <div class="modal">
    <div class="dialog animateSlideInDown">
      <div class="content">
        <div class="card">
          <el-image :src="currentData.avatarUrl">
            <div slot="placeholder" class="image-slot">
              加载中<span class="dot">...</span>
            </div>
            <div slot="error" style="font-size: 30px;">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
          <div class="store">
            <div class="name">{{currentData.storeName}}</div>
            <div class="address">地区：{{currentData.region}}</div>
            <div class="address">手机：{{currentData.phone}}</div>
          </div>
        </div>
        <div class="other">
          <div class="business">
            <div class="label">banner</div>
          </div>
          <div class="imagesDesc">
            <el-image :src="item" v-for="(item, index) in imagesDesc" :key="index">
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
              <div slot="error" style="font-size: 30px;">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </div>
        </div>
      </div>
      <div class="footer">
        <el-button class="primary" @click="hideDialog">关闭</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate } from '@/utils/formatDate.js'
export default {
  props: {
    currentData: {
      type: Object
    }
  },
  data () {
    return {

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
  computed: {
    imagesDesc () {
      if (this.currentData.image) {
        return this.currentData.image.split(',')
      } else {
        return []
      }
    }
  },
  mounted () {

  },
  methods: {
    hideDialog () {
      this.$emit('hideDialog')
    },
    formateDate (t) {
      const date = new Date(t)
      return formatDate(date)
    }
  }
}
</script>
<style scoped lang="stylus" src="@/static/css/slideInDown.styl"></style>
<style scoped lang="stylus">
.modal
  position fixed
  top 0
  bottom 0
  left 0
  right 0
  width 100vw
  height 100vh
  background rgba(0, 0, 0, .55)
  z-index 1000
  .dialog
    position absolute
    top 50%
    left 50%
    transform translate(-50%, -50%)
    background #FFFFFF
    border-radius 2px
    .content
      padding 40px 46px 22px 46px
      min-width 400px
      max-height 500px
      overflow-y auto
      overflow-x hidden
      .card
        max-width 400px
        display flex
        align-items center
        .el-image
          margin-right 15px
          display flex
          align-items center
          justify-content center
          background-color #f5f7fa
          color #909399
          width 60px
          height 60px
          border 1px solid #f2f2f2
          flex 0 0 auto
        .store
          display flex
          height 60px
          justify-content space-between
          flex-direction column
          .name
            font-size 16px
            line-height 1
          .address
            font-size 14px
            color #969696
      .other
        margin-top 15px
        .desc
          margin-bottom 15px
          font-size 14px
        .imagesDesc
          display flex
          flex-direction column
        .item
          margin-bottom 5px
          display flex
          align-items center
          justify-content space-between
          .text
            font-size 14px
          .el-tag
            font-size 14px
        .business
          margin-top 10px
          padding 10px 0
          border-top 1px solid #f2f2f2
          .label
            padding-left 8px
            font-size 16px
            position relative
            &::before
              content ''
              position absolute
              left 0
              top 0
              width 4px
              height 21px
              border-radius 2px
              background-color #ff9800
          .business-item
            margin-top 10px
            display flex
            align-items center
            font-size 0
            .el-image
              margin-right 15px
              display flex
              align-items center
              justify-content center
              background-color #f5f7fa
              color #909399
              width 36px
              height 36px
              border 1px solid #f2f2f2
              border-radius 50%
              overflow hidden
              flex 0 0 auto
            .business-item__info
              font-size 14px
    .footer
      padding 0 46px
      height 59px
      display flex
      justify-content center
      align-items center
      border-top 1px solid #ECECEC
      >>>.el-button
        width 105px
        font-size 14px
        border-radius 1px
        &+.el-button
          margin-left 20px
      .default
        color #1D3861
        border 1px solid #d8d8d8
      .primary
        background #FF9800
        color #ffffff
        border 1px solid #FF9800
</style>
