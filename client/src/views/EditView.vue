<template>
<div>
  <Nav/>
  <div v-if="loadingStatus">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
  </div>
  <div v-else>
    
    <h2 style="margin:5% 0 5% 0">Post editing</h2>
    <form @submit.prevent="editPost">
      <div style="margin-bottom:5%">
        <b-form-input v-model="editedPost.title" placeholder="Post title"></b-form-input>
      </div>
      <b-form-textarea
        id="textarea"
        v-model="editedPost.text"
        placeholder="Post.."
        rows="3"
        max-rows="6"
        style="margin-bottom:5%"
      ></b-form-textarea>
      <p style="color:red; text-align:center" v-show="msgErrorPost.visible">{{msgErrorPost.msg}}</p>
      <div>
        <p v-for="item of files">item</p>
      </div>
    
      <div>
        <h5>Attached files</h5>
        <p style="color:red; text-align:center" v-show="msgErrorMedia.visible">{{msgErrorMedia.msg}}</p>
        <div v-for="item of editedPost.media">
          <p>{{ userMedia.find(el=>el.id===item).URL }}</p>
          <img src="@/assets/times.png" 
            class="right" 
            style="margin: -2.5rem 0; height: 21px"
            @click="delFileFromPost(item.id)"
          />
        </div>
      </div>
      
      <div class="row justify-content-center" style="margin-bottom:2%; text-align:center">
        <div class="col-6">
          <b-button v-b-toggle.collapse-1 class="m-1" variant="outline-secondary">+Add files to post</b-button>
          <b-collapse id="collapse-1">
            <b-card >
              <div v-if="userMedia.length">
                <div v-for="item in userMedia"
                    class="hover-grey" 
                    :key="item.id" 
                >
                    <p @click="addFileToPost(item.id)">{{ item.URL }}</p>
                    <img src="@/assets/times.png" 
                      class="right" 
                      style="margin: -2.3rem 0; height: 20px"
                      @click="delFileFromDB(item.id)"
                    />
                </div> 
              </div>
              <p v-else style="color:#ccc">No files</p>
              <hr>
              <p class="hover-green">
                <b-spinner v-if="uploadingMediaStatus" variant="dark" small ></b-spinner>
                <span v-else @click="clickFileInput">Download files</span>
              </p>
            </b-card>
          </b-collapse>
        </div>
      </div>

      <button type="submit" class="btn btn-warning" style="margin-right:5%">Edit post</button>
      <button class="btn btn-danger">Cancel</button>
    </form>
    
  </div>
  <input type="file" ref="fileInput" @change="uploadFileToDB" style="display:none" accept="video/*,image/* "/>
</div>
</template>

<script>
import Nav from "@/components/Nav.vue"
import { mapState } from 'vuex'

export default {
  name: '',
  components:{
    Nav
  },
  beforeRouteLeave (to, from, next) { 
    this.$store.commit('blog/cancelUploadMedia') 
    next()
  },
  methods:{
    async uploadFileToDB(){
      this.uploadingMediaStatus=true
      this.msgErrorMedia.msg=''
      this.msgErrorMedia.visible=true
      await this.$store.dispatch('blog/uploadMedia',this.$refs.fileInput.files)
      .catch(err=>{
        this.$store.dispatch('blog/userMedia')
        this.msgErrorMedia.msg=err.response.data
        if (!Object.keys(err.response.data).length) this.msgErrorMedia.msg='Unknown error'
        setTimeout(()=>{this.msgErrorMedia.visible=false},2000)
      })
      this.uploadingMediaStatus=false
    },
    clickFileInput(){
      this.$refs.fileInput.value=null
      this.$refs.fileInput.click()
    },

    delFileFromPost(mediaId){
      const ind= this.editedPost.media.indexOf(mediaId)
      this.editedPost.media.splice(ind,1)
    },
    async delFileFromDB(mediaId){
      this.loadingStatus=true
      await this.$store.dispatch('blog/deleteMedia',mediaId)
      .catch(err=>{
        if (err.response.status===500)
          alert("Failed to delete file")
      })
      this.delFileFromPost(mediaId)

      this.loadingStatus=false
    },

    addFileToPost(mediaId){
      this.editedPost.media.push(mediaId)
    },
   
    async editPost(){
      this.loadingStatus=true
      if (this.editedPost.media.length || this.editedPost.text){
        await this.$store.dispatch('blog/editPost',{postId:this.postId,editedPost:this.editedPost})
        .then(res=>{
          this.$router.go(-1)
        })
        .catch(err=>{
          if (err.response.status===500)
            alert("Failed to update post")
        })
      }else{
        this.msgErrorPost.visible=true
        this.msgErrorPost.msg="Send file or post body"
        setTimeout(()=>{this.msgErrorPost.visible=false},3000)
      }
      this.loadingStatus=false
    },
  },
  computed:mapState({
    post: state => state.blog.post,
    userMedia: state => state.blog.userMedia,
  }),
  data(){
    return{
      msgErrorPost:{
        msg:'',
        visible:true,
      },
      msgErrorMedia:{
        msg:'',
        visible:true,
      },
      editedPost:{
        text:'',
        title:'',
        media:[],
      },
      files:null,
      loadingStatus:false,
      uploadingMediaStatus:false,
      postId:0,
    }
  },
  async mounted(){
    this.loadingStatus=true
    this.postId=this.$route.params.postId

    await this.$store.dispatch('blog/postById',this.postId)
    await this.$store.dispatch('blog/userMedia')
    this.loadingStatus=false

    this.editedPost.media=this.post.media.map(el=>el.id)
    this.editedPost.text=this.post.text
    this.editedPost.title=this.post.title
  }
}
</script>
<style>
.hover-grey:hover {
  background-color: rgba(128, 128, 128, 0.2);
  cursor: pointer;
}
.right:hover{
  cursor: pointer;
}
.hover-green:hover {
  background-color: rgba(0,80,0,0.3);
  cursor: pointer;
}
.cat-item:hover{
  background-color: rgba(128, 128, 128, 0.05);
}
.cat-item{
  display: flex;                
  justify-content: center;      
  position: relative; 
}
.right {
  position: absolute;          
  right: 2%; 
  vertical-align: middle; 
  margin: 0.5em 0;                   
}
</style>
