<template>
<div class="container">
  <div class="addRoot">
    <el-button
      type="primary"
      size="mini"
      @click="addRoot()">
      添加一级菜单
    </el-button>
  </div>
  <div class="wrap">
    <div class="custom-tree-container">
      <el-tree
        :data="data"
        node-key="id"
        :props="options"
        :default-expand-all="false"
        :expand-on-click-node="false">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span class="handle">
            <el-button
              type="text"
              v-if="node.level !== 3"
              size="mini"
              @click="append(data)">
              添加子菜单
            </el-button>
            <el-button
              type="text"
              v-if="node.level === 3"
              size="mini"
              @click="append(data)">
              编辑
            </el-button>
            <el-button
              type="text"
              v-if="node.level !== 3"
              size="mini"
              @click="editName(data)">
              重命名
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="remove(node, data)">
              删除菜单
            </el-button>
          </span>
        </span>
      </el-tree>
    </div>
  </div>
  <Dialog @hideDialog="showDialog = false" :isAdd="isAdd" @refresh="getList" v-if="showDialog" :thridItemData="thridItemData"></Dialog>
</div>
</template>

<script>
import Dialog from './dialog.vue'
export default {
  data () {
    return {
      data: [],
      options: {
        label: 'name',
        children: 'items'
      },
      thridItemData: {},
      isAdd: false,
      showDialog: false
    }
  },
  components: {
    Dialog
  },
  mounted () {
    this.getList()
  },
  methods: {
    getList () {
      const loading = this.$loading({
        lock: true,
        text: '加载中',
        target: '.content-box',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.3)'
      })
      this.$axios.get('/api/metals/catalog/tree').then(res => {
        this.data = JSON.parse(JSON.stringify(res))
        loading.close()
      }).catch(() => {
        loading.close()
      })
      this.$once('hook:beforeDestroy', () => {
        loading.close()
      })
    },
    append (data) {
      if (data.level === 1) {
        this.$prompt('请输入菜单名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          inputValue: '新建子菜单',
          inputValidator: function (value) {
            if (value.replace(/^\s+/g, '') === '') {
              return false
            } else {
              return true
            }
          },
          inputErrorMessage: '请输入菜单名称'
        }).then(({ value }) => {
          const loading = this.loading('添加中')
          let params = {
            level: 2,
            previousId: data.id,
            name: value
          }
          this.addRequest(params).then(res => {
            if (res.answer) {
              this.getList()
              loading.close()
            }
          }).catch(() => {
            loading.close()
          })
        }).catch(() => {})
      } else if (data.level === 2) {
        this.showDialog = true
        this.isAdd = true
        this.thridItemData = data
      } else {
        this.showDialog = true
        this.isAdd = false
        this.thridItemData = data
      }
    },
    addRequest (params) {
      return new Promise((resolve, reject) => {
        this.$axios.post('/api/metals/catalog/add', params).then(res => {
          resolve(res)
        }).catch(err => { reject(err) })
      })
    },
    addRoot () {
      this.$prompt('请输入菜单名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        inputValue: '新建一级菜单',
        inputValidator: function (value) {
          if (value.replace(/^\s+/g, '') === '') {
            return false
          } else {
            return true
          }
        },
        inputErrorMessage: '请输入菜单名称'
      }).then(({ value }) => {
        const loading = this.loading('添加中')
        this.$axios.post('/api/metals/catalog/add', {
          level: 1,
          name: value
        }).then(res => {
          if (res.answer) {
            this.getList()
          }
          loading.close()
        }).catch(() => { loading.close() })
      }).catch(() => {})
    },
    editName (data) {
      this.$prompt('请输入菜单名称', '重命名', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: data.name
      }).then(({ value }) => {
        const loading = this.loading('修改中')
        this.$axios.post('/api/metals/catalog/edit', {
          name: value,
          id: data.id
        }).then(res => {
          if (res.answer) {
            data.name = value
          }
          loading.close()
        }).catch(() => { loading.close() })
      }).catch(() => {})
    },
    remove (node, data) {
      this.$confirm('此操作将永久删除该菜单栏, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const loading = this.loading('删除中')
        this.$axios.delete(`/api/metals/catalog/delete/${data.id}`).then(res => {
          if (res.answer) {
            const parent = node.parent
            const items = parent.data.items || parent.data
            const index = items.findIndex(d => d.id === data.id)
            items.splice(index, 1)
          }
          loading.close()
        }).catch(() => { loading.close() })
      }).catch(() => {})
    },
    loading (text) {
      return this.$loading({
        lock: true,
        text: `${text}`,
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.3)'
      })
    }
  }
}

</script>

<style scoped lang="stylus">
.container
  .addRoot
    margin-bottom 15px
    .el-button--primary
      background-color #FF9800
      border-color #FF9800
  .wrap
    padding 20px
    background-color #ffffff
    .custom-tree-container
      .custom-tree-node
        flex 1
        display flex
        align-items center
        justify-content space-between
        font-size 14px
        padding-right 8px
        .handle
          margin-left 50px
</style>
