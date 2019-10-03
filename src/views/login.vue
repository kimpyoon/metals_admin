<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">
        <div class="title">建材平台系统管理后台</div>
      </div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
        <el-form-item prop="username">
          <div class="icon">
            <div class="user-icon"></div>
          </div>
          <el-input size="normal" v-model="ruleForm.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <div class="icon">
            <div class="password-icon"></div>
          </div>
          <el-input size="normal" type="password" placeholder="密码" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <div class="icon">
            <div class="password-icon"></div>
          </div>
          <el-input size="normal" class="identifyingCode" placeholder="验证码" v-model="ruleForm.code" @keyup.enter.native="submitForm('ruleForm')" maxlength="4"></el-input>
          <div class="verifyCode" @click="getIdentifyingCode">
            <i v-show="isLoading" class="loading el-icon-loading"></i>
            <img :src="verifyCode" alt="点击刷新">
          </div>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { calcuMd5 } from '@/utils/auth.js'
export default {
  data () {
    return {
      ruleForm: {
        username: '',
        password: '',
        code: '',
        flag: ''
      },
      isLock: false,
      rules: {
        username: { required: true, message: '请输入用户名', trigger: ['blur', 'change'] },
        password: { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
        code: { required: true, message: '请输入验证码', trigger: ['blur', 'change'] }
      },
      verifyCode: '',
      isLoading: true
    }
  },
  mounted () {
    this.getIdentifyingCode()
  },
  methods: {
    getIdentifyingCode () {
      this.isLoading = true
      const url = '/api/metals/other/captcha'
      this.$axios.post(url).then(res => {
        this.verifyCode = res.base64
        this.$set(this.ruleForm, 'flag', res.flag)
        this.isLoading = false
      }).catch(() => {
        this.isLoading = false
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.isLock) {
            this.isLock = true
            const loading = this.$loading({
              lock: true,
              text: '登录中',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            })
            let password = (calcuMd5(this.ruleForm.password)).toUpperCase()
            const url = `/api/metals/other/login?password=${password}&username=${this.ruleForm.username}&code=${this.ruleForm.code}&flag=${this.ruleForm.flag}`
            this.$axios.post(url).then(res => {
              this.isLock = false
              localStorage.setItem('metals_admin_info', JSON.stringify(res))
              loading.close()
              this.$router.push('/')
            }).catch(err => {
              loading.close()
              this.isLock = false
              this.getIdentifyingCode()
              this.$message.error(err.errmsg)
            })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped lang="stylus">
.login-wrap
  position relative
  height 100vh
  background-image url('../static/img/pic_bg.jpg')
  background-size cover
  background-repeat no-repeat
  background-position center
.ms-title
  width 100%
  display flex
  align-items center
  justify-content center
  padding-top 30px
  color #373737
  .title
    flex 0 0 auto
    transform translateY(-1px)
    width 10em
    font-weight bold
    line-height 25px
    text-align center
    font-size 18px
.ms-login
  position absolute
  left 50%
  top 50%
  width 330px
  transform translate(-50%,-50%)
  border-radius 2px
  background #ffffff
  overflow hidden
.ms-content
  padding 40px 40px
  >>>.el-form-item
    margin-bottom 30px
.ms-content
  .icon
    position absolute
    top 0
    left 0
    width 40px
    height 40px
    display flex
    justify-content center
    align-items center
    z-index 2
    &::after
      position absolute
      top 50%
      transform translateY(-50%)
      right 0
      content ''
      width 0px
      height 14px
      border-right 1px solid #D8D8D8
    .user-icon
      flex 0 0 auto
      width 14px
      height 14px
      background-image url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAAXNSR0IArs4c6QAAAR9JREFUKBVjZEAD////Z7SwsLAGCusxMjL+Y2Jiunjs2LHjaMoYGNEFLC0tk//9+2eOJn7o5MmTS5DFmJA55ubmqlg0gZTYWVlZySOrRdEIlFBElkRmAw1EkUPRCPTPB2TFyGx0ORSNv379ugJUjKEZGEiv+fn5ryMbxIzMef78+W8ZGRmQAmUg5gPJATU9YGVlnbV3714MA0HyGMDGxkbQxcWFH0MCKoDiVGRF379//wLU/BlZDJkNjkdPT0/2Dx8+GAMjXxsoqQCkQTaxQRV+Bzr3JRDfB4pfOH78+A0g+z+jmZmZCZARA1TEBVWIlwKqfcbCwjKPBchIBKpkxasaSRJoq9Tv379zQH4kWhNMP9AyXhYg5zlMgFgaaOtfAHNcVnJCDG7dAAAAAElFTkSuQmCC')
      background-size cover
      background-repeat no-repeat
      background-position center
    .password-icon
      flex 0 0 auto
      width 12px
      height 16px
      background-image url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAQCAYAAAAiYZ4HAAAAAXNSR0IArs4c6QAAAVxJREFUKBWFUrFKxEAUvI0x6BEbO1EiWAgiYhswwv2D5A/0M7S3EezttMtnaEhS2giCB0YCpwcWohijJHFm3Q3JpfDBsvPmzeS93awYzITruluGYWyUZVmbpjkOw/C+LRE6GY1GC0VRHFZVtaM5td86jnMRBME3c0MX8zz3KRZCFOCusW6AKdrNsuxA66TB930LxJ4iz5IkucK6hOGcXF3X+5jAJJaGNE1XgTneaxzHj9hlRFH0APAGwxy6r5CUBsuy5pmoEQib0BwMUtOcoVH8AwSu8Qgtt6FbxKrxxY+2BzUbOcf9RO2OB6GQiyEgWPqDg5q5wtyGqA17I6mZT3CuY+CvlkFCeVVtEl+Z4kpfyGFc7uvtes+A4prneZu4FbyOsiOmsTcSSXSZ2Lb9TDwbvQ6Ye4oH904hRprALH+YNvYMKCxDeEoBxLzSTph4ymPM+9NhVYJuHRrap19bpYKw0Zp3RQAAAABJRU5ErkJggg==')
      background-size cover
      background-repeat no-repeat
      background-position center
  >>>.el-form-item__content
    position relative
  >>>.el-input__inner
    padding-left 55px
    border-radius 2px
    border none
    background #F6F6F6
  >>>.el-input__inner
    &:hover
      border-color transparent
  .identifyingCode
    >>>.el-input__inner
      padding-right 105px
  .verifyCode
    position absolute
    top 5%
    right 2px
    display inline-block
    width 42%
    height 90%
    background #fff
    z-index 2
    border-top-right-radius 4px
    border-bottom-right-radius 4px
  .verifyCode
    img
      display inline-block
      width 100%
      height 100%
      text-align center
      color #cccccc
      border-top-right-radius 4px
      border-bottom-right-radius 4px
.login-btn
  margin-top 63px
  text-align center
  button
    margin-bottom 10px
    border none
    border-radius 2px
    width 100%
    height 44px
    font-size 16px
    background-image linear-gradient(90deg, #FF9800 0%, #FBC02D 100%)
    border-radius 2px
.login-tips
  font-size 14px
  color #fff
.loading
  position absolute
</style>
