<template>
  <div class="modal">
    <div class="dialog animateSlideInDown">
      <div class="content">
        <el-date-picker
          v-model="date"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <div class="footer">
        <el-button class="default" @click="hideDialog">取消</el-button>
        <el-button class="primary" @click="submit" :loading="loading">{{saveText}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDateTime } from '@/utils/formatDateTime.js'
export default {
  data () {
    return {
      saveText: '导出',
      date: [],
      loading: false
    }
  },
  mounted () {
    let date = formatDateTime(new Date()).split(' ')[0]
    this.date = [date, date]
  },
  methods: {
    hideDialog () {
      this.$emit('hideDialog')
    },
    submit () {
      const url = `/api/fczf/case/export?startTime=${this.date[0]}&endTime=${this.date[1]}`
      this.loading = true
      this.saveText = '导出中'
      this.$axios({
        method: 'get',
        header: { 'Content-Type': 'application/xls' },
        responseType: 'blob',
        url: url
      }).then(res => {
        let fileName = ''
        const disposition = res.headers['content-disposition']
        let disArr = disposition.split(';')
        for (let i = 0, len = disArr.length; i < len; i++) {
          if (disArr[i].indexOf('filename=') > -1) {
            fileName = decodeURIComponent(disArr[i].split('=')[1])
          }
        }
        let blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
        let link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        this.loading = false
        this.saveText = '导出'
      }).catch(err => {
        this.loading = false
        this.saveText = '导出'
        this.$message.error('案件个数为零')
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
  z-index 1000
  .dialog
    position absolute
    width 400px
    top 48%
    left 50%
    transform translate(-50%, -50%)
    background #FFFFFF
    border-radius 2px
    .content
      padding 40px 46px 22px 46px
      height 100px
      >>>.el-input__inner
        line-height 30px
      >>>.el-range-editor
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
        background #0170D2
        color #ffffff
        border 1px solid #0170D2
</style>
