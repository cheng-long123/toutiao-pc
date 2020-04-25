<template>
  <div class='publish-container'>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>发布文章</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
         <el-form ref="form" :model="article" label-width="80px">
            <el-form-item label="标题" style="width:500px">
                <el-input v-model="article.title"></el-input>
            </el-form-item>
             <el-form-item label="内容" style="width:500px">
                <el-input type="textarea" v-model="article.content"></el-input>
            </el-form-item>
             <el-form-item label="封面">
                <el-radio-group v-model="article.cover.type">
                <el-radio :label="1">单图</el-radio>
                <el-radio :label="3">三图</el-radio>
                <el-radio :label="0">无图</el-radio>
                <el-radio :label="-1">自动</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="频道">
                <el-select v-model="article.channel_id" placeholder="请选择频道">
                <el-option
                :label="channel.name"
                :value="channel.id"
                v-for="(channel, index) in channels"
                :key="index">
                 </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onPublish(false)">发表</el-button>
                <el-button  @click="onPublish(true)">存入草稿</el-button>
            </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { getArticleChannels, addArticle } from '@/api/article'
export default {
  name: 'PublishIndex',
  props: {},
  components: {},
  data () {
    return {
      article: {
        title: '',
        content: '',
        cover: {
          type: 0,
          images: []
        },
        channel_id: null
      },
      channels: []
    }
  },
  computed: {},
  watch: {},
  methods: {
    onSubmit () {
      console.log('submit!')
    },
    // 获取频道
    getChannels () {
      getArticleChannels().then(res => {
        // console.log(res)
        this.channels = res.data.data.channels
      })
    },
    // 发表文章
    onPublish (draft = false) {
      addArticle(this.article, draft).then(res => {
        console.log(res)
        if (draft === false) {
          this.$message({
            message: '发布成功',
            type: 'success',
            center: true
          })
        } else {
          this.$message({
            message: '草稿发布成功',
            type: 'success',
            center: true
          })
        }
      })
    }
  },
  created () {
    this.getChannels()
  },
  mounted () {},
  beforeDestroy () {}
}
</script>
<style lang='less' scoped>
</style>