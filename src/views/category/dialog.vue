<template>
  <div class="modal">
    <div class="dialog animateSlideInDown">
      <div class="content">
        <el-form :status-icon="false" label-position="right" label-width="3em" :model="ruleForm" :rules="rules" :hide-required-asterisk="true" ref="ruleForm">
          <el-form-item label="名称" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入菜单名称"></el-input>
          </el-form-item>
        </el-form>
        <div class="avatar-uploader-box">
          <div class="el-form-item__label">图标</div>
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
<!--         <el-upload
          :action="uploadApi"
          list-type="picture-card"
          :limit="1"
          :file-list="fileList"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :on-error="avatarError"
          :before-upload="beforeUpload">
          <i class="el-icon-plus"></i>
        </el-upload> -->
      </div>
      <div class="footer">
        <el-button class="default" @click="hideDialog">取消</el-button>
        <el-button class="primary" @click="submit" :loading="loading">{{saveText}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isAdd: {
      type: Boolean
    },
    thridItemData: {
      type: Object
    }
  },
  data () {
    return {
      saveText: '保存',
      imageUrl: '',
      loading: false,
      imgLoading: false,
      uploadApi: '',
      imagesList: [],
      fileList: [],
      isUploadSuccess: false,
      ruleForm: {
        name: '',
        icon: ''
      },
      rules: {
        name: { required: true, message: '请输入菜单名称', trigger: [ 'blur', 'change' ] }
      }
    }
  },
  mounted () {
    if (!this.isAdd) {
      this.ruleForm.icon = this.thridItemData.image
      this.ruleForm.name = this.thridItemData.name
      this.imageUrl = this.thridItemData.image
      this.isUploadSuccess = true
    }
    if (process.env.NODE_ENV === 'development') {
      this.uploadApi = `/api/api/metals/common/upload?type=icon`
    } else {
      this.uploadApi = '/api/metals/common/upload?type=icon'
    }
  },
  methods: {
    hideDialog () {
      this.$emit('hideDialog')
    },
    submit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.isUploadSuccess) {
            let params = {
              level: 3,
              previousId: this.thridItemData.id,
              name: this.ruleForm.name,
              image: this.ruleForm.icon
            }
            if (!this.isAdd) {
              params.id = this.thridItemData.id
            }
            this.loading = true
            this.saveText = '保存中'
            this.$axios.post(this.isAdd ? '/api/metals/catalog/add' : '/api/metals/catalog/edit', params).then(res => {
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
          } else {
            this.$message.error(`请先上传图片`)
          }
        }
      })
    },
    handleAvatarSuccess (res, file) {
      this.imgLoading = false
      this.isUploadSuccess = true
      this.$set(this.ruleForm, 'icon', res.path)
      this.imageUrl = URL.createObjectURL(file.raw)
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
    // handleRemove (file, fileList) {
    //   this.fileList = fileList
    //   this.imagesList = this.imagesList.filter(n => n.name !== file.name)
    // },
    // handleSuccess (res, file) {
    //   const obj = {
    //     name: file.name,
    //     url: res.path
    //   }
    //   this.imagesList.push(obj)
    // },
    // avatarError () {
    //   this.$message.error('上传失败')
    // },
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
    width 330px
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
          width 3em
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
          width 61px
          height 61px
          line-height 61px
          text-align center
        .loading-icon
          display inline-block
          position absolute
          top 0
          left 0
        .avatar
          width 60px
          height 60px
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
