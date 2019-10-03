<template>
  <div class="modal">
    <div class="dialog animateSlideInDown">
      <div class="content">
        <el-form :status-icon="false" label-position="right" label-width="4em" :model="ruleForm" :rules="rules" :hide-required-asterisk="true" ref="ruleForm">
          <template v-if="isAdd">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="ruleForm.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
          </template>
          <template v-if="!isAdd">
            <el-form-item label="用户名">
              <el-input v-model="ruleForm.username" placeholder="请输入用户名" :readonly="!isAdd"></el-input>
            </el-form-item>
          </template>
          <el-form-item label="姓名" prop="realname">
            <el-input v-model="ruleForm.realname" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <template v-if="isAdd">
            <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="ruleForm.password" :minlength="6" placeholder="不少于6位"></el-input>
            </el-form-item>
          </template>
          <template v-if="!isAdd">
            <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="ruleForm.password" :minlength="6" placeholder="不少于6位"></el-input>
            </el-form-item>
          </template>
          <el-form-item label="角色" prop="roleType">
            <el-select v-model="ruleForm.roleType" clearable filterable placeholder="请选择">
              <el-option
                v-for="item in roleSelectOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="组别" prop="groupId">
            <el-select v-model="ruleForm.groupId" clearable filterable placeholder="请选择">
              <el-option
                v-for="item in groupSelectOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-checkbox class="leader" v-model="isLeader">组长</el-checkbox>
          </el-form-item>
        </el-form>
        <div class="avatar-uploader-box">
          <div class="label">头像</div>
          <el-upload
            class="avatar-uploader"
            :action="uploadApi"
            :show-file-list="false"
            :headers="{Authorization: `Bearer ${getToken()}`}"
            :on-success="handleAvatarSuccess"
            :on-error="avatarError"
            :on-progress="avatarProgress"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <i v-if="loading" class="el-icon-loading loading-icon"></i>
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
import { calcuMd5, getToken } from '@/utils/auth.js'
import bus from '@/components/common/bus'
let timer
export default {
  name: 'edit',
  props: ['editType', 'editForm', 'roleSelectOptions', 'groupSelectOptions'],
  data () {
    const checkUser = this.checkUser
    const validatePassword = this.validatePassword
    return {
      imageUrl: '',
      uploadApi: '',
      loading: false,
      ruleForm: {
        username: '',
        realname: '',
        password: '',
        roleType: '',
        groupId: '',
        headImg: ''
      },
      isLeader: false,
      progress: 0,
      checkList: [],
      isAdd: true,
      saveText: '保存',
      isUploadSuccess: true,
      rules: {
        username: { required: true, validator: checkUser, trigger: [ 'blur', 'change' ] },
        realname: [
          { required: true, message: '请输入姓名', trigger: [ 'blur', 'change' ] }
        ],
        password: { required: true, validator: validatePassword, trigger: [ 'blur', 'change' ] },
        roleType: { required: true, message: '请选择角色', trigger: 'blur' },
        groupId: { required: true, message: '请选择组别', trigger: 'blur' }
      }
    }
  },
  mounted () {
    if (process.env.NODE_ENV === 'development') {
      this.uploadApi = '/api/api/fczf/case/upload'
    } else {
      this.uploadApi = '/fczf-gateway/api/fczf/case/upload'
    }
    if (this.editType === 'edit') {
      this.isAdd = false
      this.isLeader = this.editForm.isLeader !== 2
      this.ruleForm = {
        username: this.editForm.username,
        realname: this.editForm.realname,
        password: '',
        isLeader: this.editForm.isLeader,
        roleType: this.editForm.roleType,
        groupId: this.editForm.groupId,
        headImg: this.editForm.headImg
      }
      this.imageUrl = `/fczf-gateway/api/fczf/case/download?url=${this.editForm.headImg}.thumb.jpg&authorization=${getToken()}`
      this.$nextTick(() => {
        this.rules.password.validator = this.validatePasswordEdit
        this.rules.password.required = false
      })
      console.log(this.rules.password)
    } else {
      this.imageUrl = `/fczf-gateway/api/fczf/case/download?url=avatar.png&authorization=${getToken()}`
      this.$set(this.ruleForm, 'headImg', 'avatar.png')
    }
  },
  methods: {
    getToken: getToken,
    hideDialog () {
      this.$emit('hideDialog')
    },
    handleAvatarSuccess (res, file) {
      this.loading = false
      this.isUploadSuccess = true
      this.$set(this.ruleForm, 'headImg', res.data)
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    avatarProgress (event, file) {
      this.progress = event.percent
      this.loading = true
    },
    avatarError () {
      this.isUploadSuccess = false
      this.loading = false
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt4M = file.size / 1024 / 1024 < 4
      if (!isJPG && !isPNG) {
        this.$message.error('上传图片只能是 JPG 或者 PNG 格式!')
      }
      if (!isLt4M) {
        this.$message.error('上传图片大小不能超过 4MB!')
      }
      return (isJPG || isPNG) && isLt4M
    },
    validatePassword (rule, value, callback) {
      if (value) {
        if ((/\s+/g).test(value)) {
          callback(new Error('不能有空格'))
        } else {
          if (value.length > 5) {
            callback()
          } else {
            callback(new Error('不少于6位密码'))
          }
        }
      } else {
        callback(new Error('请输入密码'))
      }
    },
    validatePasswordEdit (rule, value, callback) {
      if (value) {
        if ((/\s+/g).test(value)) {
          callback(new Error('不能有空格'))
        } else {
          if (value.length > 5) {
            callback()
          } else {
            callback(new Error('不少于6位密码'))
          }
        }
      } else {
        callback()
      }
    },
    checkUser (rule, value, callback) {
      if (timer) {
        clearTimeout(timer)
      }
      if (value) {
        const reg = /^[a-zA-Z0-9]+$/
        if (reg.test(value)) {
          let that = this
          timer = setTimeout(function () {
            timer = undefined
            const url = `/api/fczf/admin/name?username=${that.ruleForm.username}`
            that.$axios.get(url).then(res => {
              if (res.answer) {
                callback()
              } else {
                callback(new Error('此用户已存在'))
              }
            }).catch(() => {
              callback(new Error('此用户已存在'))
            })
          }, 1000)
        } else {
          callback(new Error('请输入英文或者数字'))
        }
      } else {
        callback(new Error('请输入用户名'))
      }
    },
    submit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.isUploadSuccess) {
            this.loading = true
            this.saveText = '保存中'
            const url = {
              post: '/api/fczf/admin/add',
              put: '/api/fczf/admin/update'
            }
            const type = this.isAdd ? 'post' : 'put'
            const params = {
              username: this.ruleForm.username,
              realname: this.ruleForm.realname,
              password: this.ruleForm.password ? calcuMd5(this.ruleForm.password) : '',
              roleType: this.ruleForm.roleType,
              groupId: this.ruleForm.groupId,
              headImg: this.ruleForm.headImg,
              isLeader: this.isLeader ? 1 : 2
            }
            if (!this.isAdd) {
              Object.assign(params, { id: this.editForm.id })
            }
            this.$axios[type](url[type], params).then(() => {
              this.hideDialog()
              this.$emit('refreshTable')
              bus.$emit('getUser')
              this.$message.success('保存成功')
            }).catch(err => {
              this.loading = false
              this.saveText = '保存'
              this.$message.error(`保存失败:${err.errmsg}`)
            })
          } else {
            this.$message.error(`请先上传图片`)
          }
        }
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
  z-index 2000
  .dialog
    position absolute
    width 322px
    top 48%
    left 50%
    transform translate(-50%, -50%)
    background #FFFFFF
    border-radius 2px
    .content
      padding 40px 77px 22px 46px
      >>>.el-form-item
        .el-input__inner
        .el-form-item__content
          line-height 30px
          .el-input__inner
            padding 0 23px 0 15px
            border-radius 1px
            color #1D3861
            font-size 14px
        .el-form-item__label
          height 30px
          overflow hidden
          color #1D3861
          text-align justify
          &:after
            display inline-block
            content ''
            width 100%
      .leader
        position absolute
        margin-right 0
        right -6px
        transform translateX(100%)
      .avatar-uploader-box
        .label
          width 3em
          height 30px
          overflow hidden
          color #1D3861
          text-align justify
          &:after
            display inline-block
            content ''
            width 100%
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
          width 60px
          height 60px
          line-height 60px
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
