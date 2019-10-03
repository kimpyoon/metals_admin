<template>
  <div class="modal">
    <div class="dialog animateSlideInDown">
      <div class="content">
        <div class="card">
          <el-image :src="goodsData.image">
            <div slot="placeholder" class="image-slot">
              加载中<span class="dot">...</span>
            </div>
            <div slot="error" style="font-size: 30px;">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
          <div class="desc">
            <div class="title">{{goodsData.title}}</div>
            <div class="price">￥{{formatPrice(goodsData.price)}}</div>
          </div>
        </div>
        <div class="link"><span class="label">链接查看：</span><a :href="goodsData.url" target="_blank">{{goodsData.url}}</a></div>
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
    goodsData: {
      type: Object
    }
  },
  data () {
    return {

    }
  },
  mounted () {

  },
  methods: {
    hideDialog () {
      this.$emit('hideDialog')
    },
    formatPrice (value) {
      return Number(value / 100).toFixed(2)
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
    top 48%
    left 50%
    transform translate(-50%, -50%)
    background #FFFFFF
    border-radius 2px
    .content
      padding 40px 46px 22px 46px
      min-width 400px
      max-width 500px
      max-height 444px
      overflow-y auto
      overflow-x hidden
      .card
        max-width 400px
        display flex
        align-items center
        justify-content space-between
        .el-image
          margin-right 15px
          display flex
          align-items center
          justify-content center
          background-color #f5f7fa
          color #909399
          width 100px
          height 100px
          flex 0 0 auto
        .desc
          flex 1
          display flex
          justify-content space-between
          flex-direction column
          font-size 0
          height 100px
          color #303030
          .title
            display -webkit-box
            -webkit-box-orient vertical
            -webkit-line-clamp 3
            overflow hidden
            font-size 16px
          .price
            font-size 25px
            color #FF9800
            white-space pre-wrap
            word-break break-word
      .link
        display flex
        margin-top 20px
        line-height 30px
        .label
          flex 0 0 auto
          width 5em
        a
          white-spacing pre-wrap
          word-break break-word
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
