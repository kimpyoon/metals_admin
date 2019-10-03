<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: PingFangSC-Medium;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
* {
  margin: 0;
  padding: 0;
}
html,
body{
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
::-webkit-scrollbar
{
  width: 4px;
  height: 4px;
  background-color: #F5F5F5;
}
::-webkit-scrollbar-track
{
  -webkit-box-shadow: inset 0 0 4px rgba(0,0,0,0.3);
  border-radius: 4px;
  background-color: #F5F5F5;
}
::-webkit-scrollbar-thumb
{
  border-radius: 4px;
  -webkit-box-shadow: inset 0 0 4px rgba(0,0,0,.3);
  background-color: #b5cbfe;
}
.el-table .cell {
  color: #1D3861;
}
</style>
