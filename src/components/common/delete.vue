<template>
  <div class="modal">
    <div class="dialog animateSlideInDown">
      <div class="content">
        <div class="title">删除提醒</div>
        <div class="tip">{{text}}</div>
      </div>
      <div class="footer">
        <el-button class="default" @click="hideDialog">取消</el-button>
        <el-button class="primary" @click="submit" :loading="loaing">{{saveText}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'delete',
  props: ['text', 'url'],
  data () {
    return {
      loaing: false,
      saveText: '确认'
    }
  },
  mounted () {

  },
  methods: {
    hideDialog () {
      this.$emit('hideDialog')
    },
    submit () {
      this.loaing = true
      this.saveText = '删除中'
      this.$axios.delete(this.url).then(() => {
        this.hideDialog()
        this.$emit('refreshTable')
        this.$message.success('已删除该记录')
      }).catch(() => {
        this.loaing = false
        this.saveText = '删除'
        this.$message.error('服务器错误，删除失败')
      })
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
  z-index 3100
  .dialog
    position absolute
    width 322px
    top 48%
    left 50%
    transform translate(-50%, -50%)
    background #FFFFFF
    border-radius 2px
    .content
      padding 40px 46px
      color #1D3861
      text-align center
      .title
        font-size 20px
        line-height 28px
      .tip
        margin-top 20px
        font-size 14px
        line-height 20px
    .footer
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
