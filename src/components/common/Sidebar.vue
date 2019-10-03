<template>
  <div class="sidebarBox">
    <div class="sidebar">
      <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#1f1f21"
        text-color="#818398" active-text-color="#ffffff" unique-opened router>
        <template v-for="item in items">
          <template v-if="item.subs">
            <el-submenu :index="item.index" :key="item.index">
              <template slot="title">
                <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
              </template>
              <template v-for="subItem in item.subs">
                <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                  <template slot="title">{{ subItem.title }}</template>
                  <el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.index">
                    {{ threeItem.title }}
                  </el-menu-item>
                </el-submenu>
                <el-menu-item v-else :index="subItem.index" :key="subItem.index">
                  {{ subItem.title }}
                </el-menu-item>
              </template>
            </el-submenu>
          </template>
          <template v-else>
            <el-menu-item :index="item.index" :key="item.index">
              <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
            </el-menu-item>
          </template>
        </template>
      </el-menu>
    </div>
  </div>
</template>

<script>
import bus from './bus'
export default {
  data () {
    return {
      collapse: false,
      menusList: [],
      items: [
        {
          icon: 'el-icon-s-platform',
          index: '/dashboard',
          title: '首页'
        },
        {
          icon: 'el-icon-s-platform',
          index: '/userlist',
          title: '用户管理'
        },
        {
          icon: 'el-icon-s-platform',
          index: '/news',
          title: '新闻编辑'
        },
        {
          icon: 'el-icon-s-platform',
          index: '/transaction',
          title: '交易账单'
        },
        {
          icon: 'el-icon-s-platform',
          index: '/category',
          title: '分类菜单'
        },
        {
          icon: 'el-icon-s-platform',
          index: '/advertise',
          title: '广告栏目',
          subs: [
            {
              index: '/advertise/store',
              title: '店铺广告'
            },
            {
              index: '/advertise/day',
              title: '天天特价'
            }
          ]
        },
        {
          icon: 'el-icon-s-platform',
          index: '/business',
          title: '商家',
          subs: [
            {
              index: '/business/list',
              title: '查看商家'
            }
          ]
        }
      ]
    }
  },
  computed: {
    onRoutes () {
      return this.$route.path
    }
  },
  created () {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on('collapse', msg => {
      this.collapse = msg
    })
  },
  mounted () {

  }
}
</script>

<style scoped>
/* 兼容Firefox*/
  .sidebarBox{
    height: 100%;
    width: 177px;
    overflow: hidden;
  }
  .sidebar{
    position: absolute;
    left: 0;
    top: 48px;
    bottom: 0;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .sidebar>>>.el-submenu .el-menu-item{
    padding: 0 10px;
    padding-left: 39px!important;
    font-size: 13px;
    min-width: 174px;
  }
  .sidebar>>>.el-submenu .el-menu-item.is-active{
    padding-left: 37px!important;
    border-left: 2px solid #FF9800;
    background-color: #FF9800 !important;
  }
  .sidebar>>>.el-menu-item.is-active{
    background-color: #FF9800 !important;
  }
  .sidebar>>>.el-menu-item .el-tooltip {
    padding: 0 12px !important;
  }
  .sidebar>>>.el-submenu.is-active .el-submenu__title,
  .sidebar>>>.el-submenu.is-active .el-submenu__title i{
    color: #ffffff!important;
  }
  .sidebar::-webkit-scrollbar{
    width: 0;
  }
  .sidebar-el-menu:not(.el-menu--collapse){
    width: 192px;
  }
  .sidebar>>>.el-submenu__title,
  .sidebar>>>.el-menu-item{
    padding-left: 12px !important;
    padding-right: 10px !important;
  }
  .sidebar>>>.el-submenu__icon-arrow{
    right: 26px;
  }
  .sidebar > ul {
    height:100%;
  }
</style>
