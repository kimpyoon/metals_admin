<template>
  <div class="modal">
    <div class="dialog animateSlideInDown">
      <div class="content">
        <el-form :status-icon="false" label-position="right" label-width="5em" :model="ruleForm" :rules="rules" :hide-required-asterisk="true" ref="ruleForm">
          <el-form-item label="新闻标题" prop="newsTitle">
            <el-input v-model="ruleForm.newsTitle" placeholder="请输入新闻标题"></el-input>
          </el-form-item>
          <el-form-item label="新闻作者" prop="newsEditor">
            <el-input v-model="ruleForm.newsEditor" placeholder="请输入新闻作者"></el-input>
          </el-form-item>
        </el-form>
        <div class="label">封面图片(最多3张)</div>
        <div class="coverImage">
          <el-upload
            :action="uploadApi"
            list-type="picture-card"
            :limit="3"
            :file-list="fileList"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :on-error="avatarError"
            :before-upload="beforeUploadCoverImage">
            <i class="el-icon-plus"></i>
          </el-upload>
        </div>
        <el-upload
          class="avatar-uploader"
          :action="uploadApi"
          :show-file-list="false"
          :on-success="uploadSuccess"
          :on-error="uploadError"
          :before-upload="beforeUpload">
        </el-upload>
        <div class="myTextEditor" v-loading="quillUpdateImg">
        <quill-editor ref="myTextEditor" class="myTextEditor" v-model="contentDocument" :options="editorOption"></quill-editor>
        </div>
      </div>
      <div class="footer">
        <el-button class="default" @click="hideDialog">取消</el-button>
        <el-button type="info" @click="preview">预览</el-button>
        <el-button class="primary" @click="submit" :loading="loading">{{saveText}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'
import 'quill/dist/quill.snow.css'
import { quillEditor } from 'vue-quill-editor'
export default {
  name: 'edit',
  props: [ 'editType', 'editForm' ],
  data () {
    return {
      ruleForm: {
        newsEditor: '',
        newsTitle: ''
      },
      quillUpdateImg: false,
      isAdd: 'add',
      loading: false,
      coverImage: [],
      fileList: [],
      saveText: '保存',
      rules: {
        newsEditor: { required: true, message: '请输入作者', trigger: [ 'blur', 'change' ] },
        newsTitle: { required: true, message: '请输入新闻标题', trigger: [ 'blur', 'change' ] }
      },
      contentDocument: '',
      editorOption: {
        placeholder: '您想说点什么？',
        modules: {
          toolbar: {
            container: [
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              [{ 'header': 1 }, { 'header': 2 }],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              [{ 'script': 'sub' }, { 'script': 'super' }],
              [{ 'indent': '-1' }, { 'indent': '+1' }],
              [{ 'direction': 'rtl' }],
              [{ 'size': ['small', false, 'large', 'huge'] }],
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              [{ 'font': [] }],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'align': [] }],
              ['clean'],
              ['link', 'image']
            ],
            handlers: {
              'image': function (value) {
                if (value) {
                  document.querySelector('.avatar-uploader input').click()
                } else {
                  this.quill.format('image', false)
                }
              }
            }
          },
          syntax: {
            highlight: text => hljs.highlightAuto(text).value
          }
        }
      },
      uploadApi: '/api/metals/common/upload?type=news'
    }
  },
  mounted () {
    if (process.env.NODE_ENV === 'development') {
      this.uploadApi = `/api/api/metals/common/upload?type=news`
    } else {
      this.uploadApi = '/api/metals/common/upload?type=news'
    }
    if (this.editType === 'edit') {
      this.isAdd = false
      this.ruleForm = {
        newsTitle: this.editForm.title,
        newsEditor: this.editForm.creator
      }
      this.contentDocument = this.editForm.content
      let images = this.editForm.image.split(',')
      if (images.length > 0) {
        images.forEach(item => {
          const obj = {
            name: item,
            url: item
          }
          this.fileList.push(obj)
        })
        this.coverImage = JSON.parse(JSON.stringify(this.fileList))
      }
    }
  },
  methods: {
    hideDialog () {
      this.$emit('hideDialog')
    },
    preview () {
      if (!this.ruleForm.newsTitle && !this.ruleForm.newsTitle.replace(/^\s+/g, '')) {
        this.$message.error(`请填写新闻标题`)
      } else if (!this.ruleForm.newsEditor && !this.ruleForm.newsEditor.replace(/^\s+/g, '')) {
        this.$message.error(`请填写作者`)
      } else if (this.contentDocument === '') {
        this.$message.error(`说点什么吧，内容不能为空`)
      } else {
        const params = {
          creator: this.ruleForm.newsEditor,
          title: this.ruleForm.newsTitle,
          content: this.contentDocument
        }
        this.$emit('preview', params)
      }
    },
    submit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.coverImage.length === 0) {
            this.$message.error(`请先上传封面图片`)
          } else if (this.contentDocument === '') {
            this.$message.error(`说点什么吧，内容不能为空`)
          } else {
            this.loading = true
            this.saveText = '保存中'
            const url = {
              add: '/api/metals/news/add',
              update: '/api/metals/news/update'
            }
            const type = this.isAdd ? 'add' : 'update'
            let imgs = []
            this.coverImage.forEach(item => {
              imgs.push(item.url)
            })
            const params = {
              creator: this.ruleForm.newsEditor,
              image: imgs.join(','),
              title: this.ruleForm.newsTitle,
              content: this.contentDocument
            }
            if (!this.isAdd) {
              Object.assign(params, { id: this.editForm.id })
            }
            this.$axios.post(url[type], params).then(() => {
              this.hideDialog()
              this.$emit('refreshTable')
              this.$message.success('保存成功')
            }).catch(err => {
              this.loading = false
              this.saveText = '保存'
              this.$message.error(`保存失败:${err.errmsg}`)
            })
          }
        }
      })
    },
    beforeUpload () {
      this.quillUpdateImg = true
    },
    uploadSuccess (res, file) {
      let quill = this.$refs.myTextEditor.quill
      let length = quill.getSelection().index
      quill.insertEmbed(length, 'image', res.path)
      quill.setSelection(length + 1)
      this.quillUpdateImg = false
    },
    uploadError () {
      this.quillUpdateImg = false
      this.$message.error('图片插入失败')
    },
    handleRemove (file, fileList) {
      this.fileList = fileList
      this.coverImage = this.coverImage.filter(n => n.name !== file.name)
    },
    handleSuccess (res, file) {
      const obj = {
        name: file.name,
        url: res.path
      }
      this.coverImage.push(obj)
    },
    avatarError () {
      this.$message.error('上传失败')
    },
    beforeUploadCoverImage (file) {
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
  },
  components: {
    quillEditor
  }
}
</script>
<style scoped lang="stylus" src="@/static/css/slideInDown.styl"></style>
<style>
.myTextEditor {
  line-height: normal !important;
  height: 280px;
}
.ql-snow .ql-tooltip[data-mode=link]::before {
  content: "请输入链接地址:";
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px;
  content: '保存';
  padding-right: 0px;
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: '14px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=small]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=small]::before {
  content: '10px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=large]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=large]::before {
  content: '18px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=huge]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {
  content: '32px';
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: '文本';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  content: '标题1';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  content: '标题2';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  content: '标题3';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
  content: '标题4';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
  content: '标题5';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
  content: '标题6';
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: '标准字体';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=serif]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {
  content: '衬线字体';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=monospace]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before {
  content: '等宽字体';
}
</style>
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
    width 800px
    top 48%
    left 50%
    transform translate(-50%, -50%)
    background #FFFFFF
    border-radius 2px
    .content
      padding 10px 40px 22px 40px
      margin 15px 0
      height 500px
      overflow-x hidden
      overflow-y auto
      .label
        padding-bottom 10px
        color #1d3861
        font-size 14px
      .coverImage
        >>>.el-upload-list--picture-card
          .el-upload-list__item
            width 110px
            height 110px
        >>>.el-upload--picture-card
          margin 0 8px 8px 0
          width 110px
          height 110px
          line-height 116px
      .avatar-uploader
        display none
      >>>.el-form-item
        .el-input__inner
        .el-form-item__content
          line-height 30px
          .el-input__inner
            padding 0 23px 0 15px
            border-radius 1px
            color #1D3861
            font-size 14px
          .el-select
            .el-input__inner
              padding 0 48px 0 15px
        .el-form-item__label
          height 30px
          overflow hidden
          color #1D3861
          text-align justify
          &:after
            display inline-block
            content ''
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
        background #FF9800
        color #ffffff
        border 1px solid #FF9800
</style>
