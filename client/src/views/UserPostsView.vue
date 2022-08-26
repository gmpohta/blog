<template>
<div>
  <Nav/>
  <div v-if="initialLoadingStatus">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
  </div>
  <div v-else>
    <h2 style="margin-bottom:5%">My posts</h2>
    <hr>
    <button class="btn btn-primary" @click="createPost" :disabled="loadingStatus">Create post</button>
    <div v-if="loadingStatus" style="margin:5%">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <div ref="posts">
      <div v-if="postList.length">
        <div  v-for="item of postList">
          <Post :post="item" style="margin-bottom:0.5%" :key="item.id"/>
          <router-link tag="button" class="btn btn-warning" :to="'/edit/'+item.id">Edit</router-link>
          <button class="btn btn-danger" style="margin-left:5%" @click="deletePost(item.id)" :disabled="loadingStatus">Delete post</button>
        </div>
      </div>
      <div v-else style="margin-top:5%">
        <p>No posts yet</p>
      </div>
    </div>
    
    <hr style="margin-top:20%">
    <button class="btn btn-danger" @click="deleteUser" :disabled="loadingStatus">Delete user</button>
  </div>
</div>
</template>

<script>
import Nav from "@/components/Nav.vue"
import Post from "@/components/Post.vue"
import { mapState } from 'vuex'

export default {
  components:{
    Nav,
    Post
  },
  computed:mapState({
    postList: state => state.blog.postList,
    user: state => state.auth.user,
  }),
  methods:{
    createPost(){
      this.$router.push('/create')
    },
    editPost(postId){
      this.$router.push('/edit/:postId')
    },
    async deletePost(postId){
      this.loadingStatus=true
      let initialHeight = this.$refs.posts.scrollHeight
      await this.$store.dispatch('blog/deletePost',postId)
      .catch(err=>{
        if (err.response.status===500)
          alert("Failed to delete post")
      })
      await this.$store.dispatch('blog/userPosts')
      this.$nextTick(() => {
        this.$refs.posts.scrollTop = this.$refs.posts.scrollHeight - initialHeight
      })
      this.loadingStatus=false
    },
    async deleteUser(){
      this.loadingStatus=true
      await this.$store.dispatch('auth/deleteUser',this.user.userId)
      .catch(err=>{
        if (err.response.status===500)
          alert("Failed to delete user")
      })
      this.loadingStatus=false
    },
  },
  data(){
    return{
      loadingStatus:false,
      initialLoadingStatus:false
    }
  },

  async mounted(){
    this.initialLoadingStatus=true
    await this.$store.dispatch('blog/userPosts') 
    this.initialLoadingStatus=false
  }
}
</script>
