<template>
  <div class='image-list'>
      <div class="head-btn">
        <el-radio-group v-model="collect" size="mini" @change="collectChange">
      <el-radio-button :label="false">全部</el-radio-button>
      <el-radio-button :label="true">收藏</el-radio-button>
       </el-radio-group>
     <el-button
     type="success"
     size="mini"
     @click="dialogVisible=true"
     v-if="isShowAdd"
     >
     添加素材</el-button>
    </div>
    <el-dialog
        title="上传素材"
        :visible.sync="dialogVisible"
        width="30%"
        :modal-append-to-body="false"
        >
        <el-upload
        class="upload-demo"
        drag
        name="image"
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :headers="uploadHeaders"
         :on-success="uploadSuccess"
        multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
       </el-upload>
    </el-dialog>
    <el-row :gutter="20" class="fodder-bg">
        <el-col
        class="fodder-border"
        v-for="(image, index) in images"
        :key="index"
        :xs="12"
        :sm="6"
        :md="6"
        :lg="4"
        lazy
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        @click.native="selected = index"
        >
        <div  class="fodder-box" v-if=" collect===false && isShowAction">
            <span :class="{
                'el-icon-star-off': !image.is_collected,
                'el-icon-star-on': image.is_collected
                }"
                :disabled="loading"
                @click=collectImage(image)></span>
            <span class=" el-icon-delete" @click="delImage(image.id)"></span>
        </div>
       <el-image
       class="fodder-img"
        style=" height:100px;"
        :src="image.url"
        fit="cover">
      </el-image>
        <div
        class="selected"
        v-if="selected === index && isShowCheck"
        >
          <img src="./selected.png" alt="">
        </div>
        </el-col>
     </el-row>
     <el-pagination
        class="fodder-paging"
        background
        layout="prev, pager, next"
        :total="totalCount"
        :disabled="loading"
        :page-size="pageSize"
        :current-page.sync="page"
         @current-change="currentChange">
     </el-pagination>
  </div>
</template>
<script>
import { getImage, collectImage, delImage } from '@/api/image'

export default {
  name: 'ImegeList',
  props: {
    isShowAdd: {
      type: Boolean,
      default: true
    },
    isShowAction: {
      type: Boolean,
      default: false
    },
    isShowCheck: {
      type: Boolean,
      default: true
    }
  },
  components: {},
  data () {
    const user = JSON.parse(localStorage.getItem('user'))
    return {
      collect: false,
      images: [],
      dialogVisible: false,
      is_collected: [],
      uploadHeaders: {
        Authorization: `Bearer ${user.token}`
      },
      pageSize: 24,
      page: 1,
      totalCount: 0,
      loading: true,
      selected: null
    }
  },
  computed: {},
  watch: {},
  methods: {
    // 获取图片素材
    getImage () {
      this.loading = true
      getImage({
        collect: this.collect,
        page: this.page,
        per_page: this.pageSize
      }).then(res => {
        this.loading = false
        this.images = res.data.data.results
        this.totalCount = res.data.data.total_count
      })
    },
    // 分页
    currentChange (page) {
      this.page = page
      this.getImage()
    },
    collectChange (value) {
      this.collect = value
      this.page = 1
      // this.page = page
      this.getImage()
    },
    uploadSuccess () {
      this.$message({
        showClose: true,
        message: '上传成功',
        type: 'success',
        center: true
      })
      // 取消隐藏
      this.dialogVisible = false
      // 重新渲染
      this.getImage()
    },
    // 收藏图片
    collectImage (imageId) {
      collectImage(!imageId.is_collected, imageId.id).then(res => {
        if (!imageId.is_collected) {
          this.$message({
            showClose: true,
            message: '收藏成功',
            type: 'success',
            center: true
          })
        } else {
          this.$message({
            showClose: true,
            message: '取消收藏',
            type: 'success',
            center: true
          })
        }
        // this.getImage()
        imageId.is_collected = !imageId.is_collected
      })
    },
    // 删除图片
    delImage (imageId) {
      this.$confirm('你确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delImage(imageId).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!',
            center: true
          })
          // 重新渲染
          this.getImage()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
          center: true
        })
      })
    }
  },
  created () {
    this.getImage()
  },
  mounted () {},
  beforeDestroy () {}
}
</script>
<style lang='less' scoped>
.head-btn{
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}
.fodder-bg{
    .fodder-border{
        position: relative;
        // border: 1px solid #ccc;
        margin-top: 20px;
        // height: 200px;
        // padding: 0 5px;
        .fodder-box{
            display: none;
            position: absolute;
            bottom: 0;
            left:50%;
            width: 160px;
            height: 100px;
              font-size: 20px;
            // margin: 0 5px;
            // padding:0 20px;
            background-color: rgba(0, 0, 0, 0.3);
            z-index: 100;
            transform: translate(-50%);
             line-height: 30px;
             font-weight: 700;
             color: #fff;
              .el-icon-star-off,
              .el-icon-star-on{
                    float: left;
                    margin-left: 30%;
                }
                 .el-icon-star-on{
                     color: red;
                    //  background-color: #000;
                    //  border:1px solid #000
                    //  font-size: 25px;
                 }
                 .el-icon-delete{
                     float:right;
                     margin-right: 30%;
                 }
        }
    }
.fodder-border:hover .fodder-box {
        height: 30px;
        display: block;
    }
}
         .fodder-paging{
                text-align: center;
                margin-top: 40px;
            }
            .selected{
              width:89px;
              height: 100px;
              margin: 0 auto;
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(0, 0, 0, 0.3);
              img{
              width: 100%;
              height: 100%;
              }
            }
</style>
