<template>
  <div class="wrapper">
    <v-head></v-head>
    <v-sidebar></v-sidebar>
    <div class="content-box" :class="{'content-collapse':collapse}">
      <!-- <v-tags></v-tags> -->
      <div class="content">
        <transition name="move" mode="out-in">
          <router-view></router-view>
        </transition>
      </div>
    </div>
    <el-backtop target=".content"></el-backtop>
  </div>
</template>

<script>
import vHead from './Header.vue'
import vSidebar from './Sidebar.vue'
import bus from './bus'
export default {
  data () {
    return {
      tagsList: [],
      collapse: false
    }
  },
  components: {
    vHead,
    vSidebar
  },
  created () {
    bus.$on('collapse', msg => {
      this.collapse = msg
    })
  }
}
</script>
<style scoped>
.wrapper {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
.content-box {
  position: absolute;
  left: 176px;
  right: 0;
  top: 48px;
  bottom: 0;
  -webkit-transition: left .3s ease-in-out;
  transition: left .3s ease-in-out;
  background: #F0F2F5;
}
.content-collapse {
  left: 64px;
}
.content {
  width: auto;
  height: 100%;
  padding: 30px 20px 0px 20px;
  overflow-y: auto;
  box-sizing: border-box;
}
.move-transform-leave-active,
.move-transform-enter-active {
  transition: all .5s;
}
.move-transform-enter {
  opacity: 0;
  transform: translateX(-10px);
}
.move-transform-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
</style>
