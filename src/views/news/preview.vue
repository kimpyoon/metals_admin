<template>
  <div class="modal">
    <div class="dialog animateSlideInDown">
      <div class="content">
        <div class="phone">
          <div class="wrap">
            <div class="news">
              <h3 class="title">{{previewData.title}}</h3>
              <div class="creator">作者：{{previewData.creator}}</div>
              <div class="editContent ql-editor" v-html="previewData.content">{{previewData.content}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="footer">
        <el-button class="default" @click="hideDialog">关闭</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    previewData: {
      type: Object
    }
  },
  data () {
    return {

    }
  },
  mounted () {
    console.log(this.previewData)
  },
  methods: {
    hideDialog () {
      this.$emit('hideDialog')
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
  z-index 1100
  .dialog
    position absolute
    top 48%
    left 50%
    transform translate(-50%, -50%)
    background #FFFFFF
    border-radius 2px
    .content
      overflow-x hidden
      overflow-y auto
      .phone
        padding 60px 0
        width 400px
        height 418px
        background-image url('../../static/img/phone.jpg')
        background-size cover
        background-repeat no-repeat
        background-position center
        overflow hidden
        .wrap
          padding 10px 0
          margin 0 auto
          width 240px
          height calc(100% - 20px)
          overflow-x hidden
          overflow-y auto
          background #ffffff
          .news
            white-space pre-wrap
            .title
              padding 0 12px
            .creator
              padding 0 12px
              margin-top 4px
              line-height 2
              color #979797
              font-size 14px
              border-bottom 1px dashed #979797
            .editContent
              >>>blockquote
                border-left 4px solid #ccc
                margin-bottom 5px
                margin-top 5px
                padding-left 16px
              >>>img
                width 100%
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
