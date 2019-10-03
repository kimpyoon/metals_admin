<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <div class="logo">
<!--       <div class="collapse-btn" @click="collapseChage">
        <i class="el-icon-menu"></i>
      </div> -->
    建材平台系统管理</div>
    <div class="header-right">
      <div class="header-user-con">
        <!-- 用户头像 -->
        <div class="user-avator"><img :src="icon.avatar"></div>
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-name" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            {{userInfo.username}} <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="loginout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script>
import bus from './bus'
import { getToken } from '@/utils/auth'
import AVATAR from '@/static/img/img.jpg'
export default {
  data () {
    return {
      collapse: false,
      userInfo: {
        username: '管理员'
      },
      icon: {
        avatar: AVATAR
      }
    }
  },
  methods: {
    getToken: getToken,
    // 用户名下拉菜单选择事件
    handleCommand (command) {
      if (command === 'loginout') {
        this.logout()
      }
    },
    // 侧边栏折叠
    collapseChage () {
      this.collapse = !this.collapse
      bus.$emit('collapse', this.collapse)
    },
    logout () {
      const url = '/api/metals/other/logout'
      this.$axios.post(url).then(res => {
        if (res.answer) {
          this.$message.success('已退出登录')
          localStorage.removeItem('metals_admin_info')
          this.$router.push('/login')
        }
      }).catch(err => {
        localStorage.removeItem('metals_admin_info')
        this.$router.push('/login')
        this.$message.error(`退出失败: ${err.errmsg}`)
      })
    }
  },
  mounted () {
    let userInfo = localStorage.getItem('metals_admin_info')
    if (userInfo) {
      userInfo = JSON.parse(userInfo)
      this.$set(this.userInfo, 'username', userInfo.username)
    }
    // if (document.body.clientWidth < 1500) {
    //   this.collapseChage()
    // }
  }
}
</script>
<style scoped lang="stylus">
.header
  position relative
  box-sizing border-box
  width 100%
  height 48px
  font-size 22px
  color #fff
  box-shadow 0 1px 5px -5px #000
  z-index 1
.collapse-btn
  position absolute
  left 0
  top 50%
  transform translate(0, -50%)
  cursor pointer
.header .logo
  // padding-left 22px
  float left
  // width 154px
  width 176px
  line-height 48px
  font-size 18px
  text-align center
  background-color #1f1f21
  color #FF9800
  font-weight bold
  position relative
.header-right
  float right
  padding-right 50px
.header-user-con
  display flex
  height 48px
  align-items center
.btn-bell-badge
  position absolute
  right 0
  top -2px
  width 8px
  height 8px
  border-radius 4px
  background #f56c6c
  color #bdbfcb
.btn-bell .el-icon-bell
  color #bdbfcb
.user-name
  padding-left 16px
  margin-left 16px
  border-left 1px solid #D8D8D8
.user-avator
  margin-left 20px
.user-avator img
  display block
  width 24px
  height 24px
  border-radius 50%
.el-dropdown-link
  color #1D3861
  cursor pointer
  >>>.el-icon-caret-bottom
    color #D8D8D8
.el-dropdown-menu__item
  text-align center
</style>
