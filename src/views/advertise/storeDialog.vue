<template>
  <div class="modal">
    <div class="dialog animateSlideInDown">
      <div class="content">
        <div class="card">
          <div class="storeName"><i class="el-icon-s-shop"></i>店铺：<span>{{storeData.storeName}}</span></div>
          <div class="name"><i class="el-icon-s-custom"></i>商家：{{storeData.name}}</div>
          <div class="phone"><i class="el-icon-phone"></i>电话：{{storeData.phone}}</div>
          <div class="masterName"><i class="el-icon-user-solid"></i>申请人：{{storeData.masterName}}</div>
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
    storeData: {
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
      max-height 444px
      overflow-y auto
      overflow-x hidden
      .card
        max-width 400px
        .storeName
        .name
        .phone
          margin-bottom 10px
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
