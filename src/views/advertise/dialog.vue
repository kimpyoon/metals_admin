<template>
  <div class="modal">
    <div class="dialog animateSlideInDown">
      <div class="content">
        <el-form :status-icon="false" label-position="right" label-width="5em" :model="ruleForm" :rules="rules" :hide-required-asterisk="true" ref="ruleForm">
          <el-form-item label="广告时间" prop="dateTime">
            <el-date-picker
              v-model="ruleForm.dateTime"
              type="datetimerange"
              value-format="yyyy-MM-dd hh:mm"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <div class="avatar-uploader-box" v-if="currentData.type === 2">
          <div class="el-form-item__label">图片</div>
          <el-upload
            class="avatar-uploader"
            :action="uploadApi"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :on-error="avatarError"
            :on-progress="avatarProgress"
            :before-upload="beforeUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <i v-if="imgLoading" class="el-icon-loading loading-icon"></i>
          </el-upload>
        </div>
      </div>
      <div class="footer">
        <el-button class="default" @click="hideDialog">取消</el-button>
        <el-button class="primary" @click="submit" :loading="loading">{{saveText}}</el-button>
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
    },
    apiType: {
      type: String
    }
  },
  data () {
    return {
      saveText: '保存',
      imageUrl: '',
      loading: false,
      imgLoading: false,
      uploadApi: '',
      isUploadSuccess: false,
      ruleForm: {
        dateTime: []
      },
      rules: {
        dateTime: { required: true, message: '请选择广告时间', trigger: [ 'blur', 'change' ] }
      }
    }
  },
  mounted () {
    if (process.env.NODE_ENV === 'development') {
      this.uploadApi = `/api/api/metals/common/upload?type=store-banner`
    } else {
      this.uploadApi = '/api/metals/common/upload?type=store-banner'
    }

    this.ruleForm.dateTime = [this.formateDate(this.currentData.startTime), this.formateDate(this.currentData.endTime)]
    if (this.currentData.type === 2) {
      this.imageUrl = this.currentData.image
    }
  },
  methods: {
    hideDialog () {
      this.$emit('hideDialog')
    },
    formateDate (t) {
      const date = new Date(t)
      return formatDate(date)
    },
    submit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let params = {
            id: this.currentData.id,
            startStr: this.ruleForm.dateTime[0],
            endStr: this.ruleForm.dateTime[1]
          }
          if (this.currentData.type === 2) {
            if (this.isUploadSuccess && this.imageUrl) {
              params.image = this.imageUrl
              this.submitAction(params)
            } else {
              this.$message.error(`请先上传图片`)
            }
          } else {
            this.submitAction(params)
          }
        }
      })
    },
    submitAction (params) {
      this.loading = true
      this.saveText = '保存中'
      this.$axios.post(`/api/admin/advert/${this.apiType}/handle/updateTime`, params).then(res => {
        if (res.answer) {
          this.hideDialog()
          this.$emit('refresh')
          this.$message.success('保存成功')
        }
        this.loading = false
        this.saveText = '保存'
      }).catch(() => {
        this.loading = false
        this.saveText = '保存'
      })
    },
    handleAvatarSuccess (res, file) {
      this.imgLoading = false
      this.isUploadSuccess = true
      this.imageUrl = res.path
    },
    avatarProgress (event, file) {
      this.progress = event.percent
      this.imgLoading = true
    },
    avatarError () {
      this.isUploadSuccess = false
      this.imgLoading = false
      this.$message.error('上传失败')
    },
    beforeUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isJPG && !isPNG) {
        this.$message.error('上传图片只能是 JPG 或者 PNG 格式!')
      }
      if (!isLt10M) {
        this.$message.error('上传图片大小不能超过 10MB!')
      }
      return (isJPG || isPNG) && isLt10M
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
      .avatar-uploader-box
        .el-form-item__label
          width 5em
          line-height 62px
        .avatar-uploader
          >>>.el-upload
            border 1px dashed #d9d9d9
            border-radius 6px
            cursor pointer
            position relative
            overflow hidden
        .avatar-uploader
          >>>.el-upload
            &:hover
              border-color #409EFF
        .avatar-uploader-icon
          font-size 28px
          color #8c939d
          width 398px
          height 200px
          line-height 200px
          text-align center
        .loading-icon
          display inline-block
          position absolute
          top 0
          left 0
        .avatar
          object-fit contain
          min-width 60px
          min-height 60px
          max-width 180px
          max-height 180px
          display block
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
